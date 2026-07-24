<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/public/kursanmeldung/_working-equitation.php';

$assertions = 0;

function we_assert(bool $condition, string $message): void
{
    global $assertions;
    $assertions++;
    if (!$condition) {
        throw new RuntimeException('Fehlgeschlagen: ' . $message);
    }
}

function we_remove_tree(string $path): void
{
    if (!is_dir($path)) {
        @unlink($path);
        return;
    }
    foreach (scandir($path) ?: [] as $entry) {
        if ($entry === '.' || $entry === '..') {
            continue;
        }
        we_remove_tree($path . DIRECTORY_SEPARATOR . $entry);
    }
    rmdir($path);
}

/** @return array<string, mixed> */
function we_valid_test_payload(int $now): array
{
    return [
        'eventId' => WE_EVENT_ID,
        'idempotencyKey' => '11111111-1111-4111-8111-111111111111',
        'formStartedAt' => ($now - 300) * 1000,
        'website' => '',
        'participant' => [
            'fullName' => 'Clara Beispiel',
            'street' => 'Hafenstraße 20',
            'postalCode' => '04442',
            'city' => 'Zwenkau',
            'phone' => '+49 177 1234567',
            'email' => 'clara@example.de',
        ],
        'horse' => [
            'name' => 'Luna',
            'breed' => 'Haflinger',
            'sex' => 'Stute',
            'age' => '11',
            'specialRequirements' => 'Benötigt Heu am Abend.',
        ],
        'booking' => [
            'fridayAccommodation' => 'outdoor_box',
            'saturdayAccommodation' => 'panel_box',
            'saturdayCatering' => true,
            'saturdayBemer' => false,
            'sundayAccommodation' => 'self_fenced_pasture',
            'sundayCatering' => false,
            'sundayBemer' => true,
        ],
        'acknowledgements' => [
            'ownRisk' => true,
            'helmetDuty' => true,
            'liabilityLimitation' => true,
            'horseLiabilityInsurance' => true,
            'horseHealthy' => true,
            'participationTerms' => true,
            'cancellationTerms' => true,
            'dataProcessing' => true,
        ],
        'photoChoice' => 'decline',
        'typedParticipantName' => 'Clara Beispiel',
        'totalCents' => 1,
        'items' => [['amountCents' => 1]],
    ];
}

$temporaryDirectory = sys_get_temp_dir()
    . '/see-pferde-working-equitation-test-'
    . bin2hex(random_bytes(6));
mkdir($temporaryDirectory, 0700, true);

try {
    $now = (new DateTimeImmutable('2026-07-24T12:00:00Z'))->getTimestamp();
    $payload = we_valid_test_payload($now);

    $validation = we_validate_payload($payload, $now);
    we_assert($validation['valid'], 'Ein vollständiger Payload wird akzeptiert.');
    we_assert(
        $validation['data']['participant']['fullName'] === 'Clara Beispiel',
        'Teilnehmerdaten werden normalisiert übernommen.',
    );
    we_assert(
        !array_key_exists('totalCents', $validation['data']),
        'Ein manipulierter Client-Gesamtbetrag wird verworfen.',
    );

    $calculation = we_calculate_booking($validation['data']['booking']);
    we_assert($calculation['totalCents'] === 52500, 'Der repräsentative Gesamtbetrag wird serverseitig berechnet.');
    we_assert(count($calculation['items']) === 6, 'Die Preisaufstellung enthält Basispreis und fünf Zusatzleistungen.');

    $invalid = $payload;
    $invalid['participant']['postalCode'] = '123';
    $invalid['participant']['email'] = "test@example.de\r\nBcc: bad@example.de";
    $invalid['horse']['age'] = 0;
    $invalid['booking']['fridayAccommodation'] = 'two_boxes';
    $invalid['acknowledgements']['helmetDuty'] = false;
    $invalid['acknowledgements']['dataProcessing'] = false;
    $invalid['photoChoice'] = '';
    $invalid['typedParticipantName'] = 'Andere Person';
    $invalidResult = we_validate_payload($invalid, $now);
    we_assert(!$invalidResult['valid'], 'Ungültige Pflichtangaben werden abgelehnt.');
    foreach ([
        'participant.postalCode',
        'participant.email',
        'horse.age',
        'booking.fridayAccommodation',
        'acknowledgements.helmetDuty',
        'acknowledgements.dataProcessing',
        'photoChoice',
        'typedParticipantName',
    ] as $field) {
        we_assert(isset($invalidResult['errors'][$field]), 'Validierungsfehler für ' . $field . ' ist vorhanden.');
    }

    $capturedMessages = [];
    $mailer = static function (array $message) use (&$capturedMessages): bool {
        $capturedMessages[] = $message;
        return true;
    };
    $context = [
        'now' => $now,
        'storageDirectory' => $temporaryDirectory . '/records',
        'documentRoot' => dirname(__DIR__) . '/public',
        'requestIp' => '192.0.2.44',
        'userAgent' => 'Registration test',
        'mailer' => $mailer,
    ];

    $result = we_process_submission($payload, $context);
    we_assert($result['status'] === 201, 'Eine gültige Anmeldung wird neu angelegt.');
    we_assert($result['body']['success'] === true, 'Die neue Anmeldung wird bestätigt.');
    we_assert($result['body']['totalCents'] === 52500, 'Die Antwort enthält ausschließlich den Server-Gesamtbetrag.');
    we_assert(count($capturedMessages) === 2, 'Admin- und Teilnehmer-E-Mail werden genau einmal versendet.');

    $index = we_read_json_file($temporaryDirectory . '/records/index.json');
    $summary = $index['idempotency'][$payload['idempotencyKey']];
    $record = we_read_json_file($temporaryDirectory . '/records/' . $summary['file']);
    we_assert($record['event']['id'] === WE_EVENT_ID, 'Der Datensatz enthält die kanonische Event-ID.');
    we_assert($record['event']['location'] === WE_EVENT_LOCATION, 'Der Datensatz enthält den Veranstaltungsort.');
    we_assert($record['participant']['phone'] === '+49 177 1234567', 'Der Datensatz enthält die vollständigen Teilnehmerdaten.');
    we_assert($record['horse']['specialRequirements'] === 'Benötigt Heu am Abend.', 'Der Datensatz enthält Pferdebesonderheiten.');
    we_assert($record['totalCents'] === 52500, 'Der Datensatz enthält den Server-Gesamtbetrag.');
    we_assert($record['acknowledgements']['cancellationTerms'] === true, 'Der Datensatz enthält die Stornobestätigung.');
    we_assert($record['photoChoice'] === 'decline', 'Der Datensatz enthält die ausdrückliche Fotoauswahl.');
    we_assert($record['typedParticipantName'] === 'Clara Beispiel', 'Der Datensatz enthält die digitale Namensbestätigung.');
    we_assert($record['acknowledgedAt'] !== '', 'Der Datensatz enthält den Server-Zeitpunkt.');
    we_assert($record['notification']['admin'] === 'sent', 'Die Admin-Benachrichtigung wird protokolliert.');
    we_assert($record['notification']['participant'] === 'sent', 'Die Teilnehmerbestätigung wird protokolliert.');

    $adminBody = $capturedMessages[0]['body'];
    foreach ([
        'Event-ID: ' . WE_EVENT_ID,
        'Vor- und Nachname: Clara Beispiel',
        'Besonderheiten: Benötigt Heu am Abend.',
        'Gesamtbetrag (serverseitig berechnet): 525,00 €',
        'Helmpflicht: Ja',
        'Stornierungsbedingungen akzeptiert: Ja',
        'Datenverarbeitung eingewilligt: Ja',
        'Foto- und Videoauswahl: Keine Einwilligung',
        'Digital bestätigter Name: Clara Beispiel',
        'ZAHLUNG INNERHALB VON SIEBEN TAGEN',
        'IBAN: DE03 8605 5592 1090 2121 58',
    ] as $expectedText) {
        we_assert(str_contains($adminBody, $expectedText), 'Die E-Mail enthält: ' . $expectedText);
    }

    $duplicate = we_process_submission($payload, $context);
    we_assert($duplicate['status'] === 200, 'Ein wiederholter Idempotenzschlüssel wird sicher beantwortet.');
    we_assert($duplicate['body']['duplicate'] === true, 'Eine Wiederholung wird als Duplikat markiert.');
    we_assert($duplicate['body']['reference'] === $result['body']['reference'], 'Das Duplikat verweist auf die ursprüngliche Anmeldung.');
    we_assert(count($capturedMessages) === 2, 'Ein Duplikat versendet keine weiteren E-Mails.');

    $samePerson = $payload;
    $samePerson['idempotencyKey'] = '22222222-2222-4222-8222-222222222222';
    $fingerprintDuplicate = we_process_submission($samePerson, $context);
    we_assert($fingerprintDuplicate['body']['duplicate'] === true, 'Dieselbe Person und Veranstaltung erzeugen keinen zweiten Datensatz.');
    we_assert(count($capturedMessages) === 2, 'Auch ein Fingerprint-Duplikat versendet keine E-Mail.');

    echo sprintf("Working-Equitation-Anmeldung: %d Prüfungen erfolgreich.\n", $assertions);
} finally {
    we_remove_tree($temporaryDirectory);
}
