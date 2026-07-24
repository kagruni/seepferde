<?php

declare(strict_types=1);

const WE_EVENT_ID = 'working-equitation-manuel-heindl-september-2026';
const WE_EVENT_TITLE = 'Working-Equitation-Kurs mit Manuel Heindl';
const WE_EVENT_DATES = '19.-20. September 2026';
const WE_EVENT_LOCATION = 'Hafenstraße 20, 04442 Zwenkau';
const WE_ADMIN_EMAIL = 'kajik@leadboom.de';
const WE_DEFAULT_FROM_EMAIL = 'website@mandykolatka.kajik.dev';
const WE_MAX_REQUEST_BYTES = 65536;
const WE_RATE_LIMIT_WINDOW = 900;
const WE_RATE_LIMIT_ATTEMPTS = 5;

/** @return array<string, array{label: string, amount_cents: int}> */
function we_accommodation_options(): array
{
    return [
        'none' => ['label' => 'Keine Unterbringung', 'amount_cents' => 0],
        'outdoor_box' => ['label' => 'Außenbox', 'amount_cents' => 2500],
        'panel_box' => ['label' => 'Panelbox', 'amount_cents' => 2000],
        'self_fenced_pasture' => [
            'label' => 'Weidefläche zur Selbsteinzäunung',
            'amount_cents' => 1500,
        ],
    ];
}

function we_normalize_name(string $value): string
{
    $normalized = preg_replace('/\s+/u', ' ', trim($value)) ?? trim($value);
    return function_exists('mb_strtolower')
        ? mb_strtolower($normalized, 'UTF-8')
        : strtolower($normalized);
}

/**
 * @param array<string, string> $errors
 */
function we_required_string(
    mixed $value,
    string $field,
    string $message,
    array &$errors,
    int $maximum = 200,
): string {
    if (!is_string($value)) {
        $errors[$field] = $message;
        return '';
    }

    $trimmed = trim($value);
    if ($trimmed === '' || strlen($trimmed) > $maximum) {
        $errors[$field] = $message;
        return '';
    }

    return $trimmed;
}

/**
 * @param array<string, string> $errors
 */
function we_optional_string(
    mixed $value,
    string $field,
    array &$errors,
    int $maximum,
): string {
    if ($value === null || $value === '') {
        return '';
    }
    if (!is_string($value) || strlen(trim($value)) > $maximum) {
        $errors[$field] = 'Die Eingabe ist zu lang oder ungültig.';
        return '';
    }
    return trim($value);
}

/**
 * @param array<string, string> $errors
 */
function we_required_boolean(
    mixed $value,
    string $field,
    string $message,
    array &$errors,
): bool {
    if ($value !== true) {
        $errors[$field] = $message;
        return false;
    }
    return true;
}

/**
 * @param array<string, mixed> $payload
 * @return array{valid: bool, errors: array<string, string>, data: array<string, mixed>}
 */
function we_validate_payload(array $payload, ?int $now = null): array
{
    $errors = [];
    $currentTime = $now ?? time();

    if (($payload['eventId'] ?? null) !== WE_EVENT_ID) {
        $errors['eventId'] = 'Die Veranstaltung konnte nicht zugeordnet werden.';
    }

    $idempotencyKey = is_string($payload['idempotencyKey'] ?? null)
        ? strtolower(trim($payload['idempotencyKey']))
        : '';
    if (!preg_match('/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/', $idempotencyKey)) {
        $errors['idempotencyKey'] = 'Die Anmeldung konnte nicht eindeutig zugeordnet werden.';
    }

    $formStartedAt = $payload['formStartedAt'] ?? null;
    if (!is_int($formStartedAt) && !is_float($formStartedAt)) {
        $errors['formStartedAt'] = 'Bitte laden Sie die Seite neu und versuchen Sie es erneut.';
        $formStartedAt = 0;
    }
    $startedAtSeconds = (int) floor(((float) $formStartedAt) / 1000);
    if (
        $startedAtSeconds > $currentTime + 300
        || $startedAtSeconds < $currentTime - 86400
        || $startedAtSeconds > $currentTime - 2
    ) {
        $errors['formStartedAt'] = 'Bitte laden Sie die Seite neu und füllen Sie das Formular erneut aus.';
    }

    if (($payload['website'] ?? '') !== '') {
        $errors['website'] = 'Die Anmeldung konnte nicht verarbeitet werden.';
    }

    $participantInput = is_array($payload['participant'] ?? null)
        ? $payload['participant']
        : [];
    $fullName = we_required_string(
        $participantInput['fullName'] ?? null,
        'participant.fullName',
        'Bitte geben Sie Ihren vollständigen Namen ein.',
        $errors,
    );
    $street = we_required_string(
        $participantInput['street'] ?? null,
        'participant.street',
        'Bitte geben Sie Straße und Hausnummer ein.',
        $errors,
    );
    $postalCode = we_required_string(
        $participantInput['postalCode'] ?? null,
        'participant.postalCode',
        'Bitte geben Sie eine fünfstellige Postleitzahl ein.',
        $errors,
        5,
    );
    if ($postalCode !== '' && !preg_match('/^\d{5}$/', $postalCode)) {
        $errors['participant.postalCode'] = 'Bitte geben Sie eine fünfstellige Postleitzahl ein.';
    }
    $city = we_required_string(
        $participantInput['city'] ?? null,
        'participant.city',
        'Bitte geben Sie Ihren Ort ein.',
        $errors,
    );
    $phone = we_required_string(
        $participantInput['phone'] ?? null,
        'participant.phone',
        'Bitte geben Sie eine gültige Telefonnummer ein.',
        $errors,
        40,
    );
    if ($phone !== '' && !preg_match('/^\+?[0-9][0-9 ()\/.\-]{5,}$/', $phone)) {
        $errors['participant.phone'] = 'Bitte geben Sie eine gültige Telefonnummer ein.';
    }
    $email = we_required_string(
        $participantInput['email'] ?? null,
        'participant.email',
        'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
        $errors,
        254,
    );
    if (
        $email !== ''
        && (
            filter_var($email, FILTER_VALIDATE_EMAIL) === false
            || str_contains($email, "\r")
            || str_contains($email, "\n")
        )
    ) {
        $errors['participant.email'] = 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
    }

    $horseInput = is_array($payload['horse'] ?? null) ? $payload['horse'] : [];
    $horseName = we_required_string(
        $horseInput['name'] ?? null,
        'horse.name',
        'Bitte geben Sie den Namen des Pferdes ein.',
        $errors,
    );
    $horseBreed = we_required_string(
        $horseInput['breed'] ?? null,
        'horse.breed',
        'Bitte geben Sie die Rasse ein.',
        $errors,
    );
    $horseSex = we_required_string(
        $horseInput['sex'] ?? null,
        'horse.sex',
        'Bitte geben Sie das Geschlecht ein.',
        $errors,
        80,
    );
    $horseAgeInput = $horseInput['age'] ?? null;
    $horseAge = filter_var($horseAgeInput, FILTER_VALIDATE_INT, [
        'options' => ['min_range' => 1, 'max_range' => 40],
    ]);
    if ($horseAge === false) {
        $errors['horse.age'] = 'Bitte geben Sie ein Alter zwischen 1 und 40 Jahren ein.';
        $horseAge = 0;
    }
    $horseSpecialRequirements = we_optional_string(
        $horseInput['specialRequirements'] ?? '',
        'horse.specialRequirements',
        $errors,
        2000,
    );

    $bookingInput = is_array($payload['booking'] ?? null) ? $payload['booking'] : [];
    $accommodationOptions = we_accommodation_options();
    $booking = [];
    foreach ([
        'fridayAccommodation',
        'saturdayAccommodation',
        'sundayAccommodation',
    ] as $field) {
        $value = $bookingInput[$field] ?? null;
        if (!is_string($value) || !isset($accommodationOptions[$value])) {
            $errors['booking.' . $field] = 'Bitte wählen Sie eine gültige Unterbringung aus.';
            $booking[$field] = 'none';
        } else {
            $booking[$field] = $value;
        }
    }
    foreach ([
        'saturdayCatering',
        'saturdayBemer',
        'sundayCatering',
        'sundayBemer',
    ] as $field) {
        $value = $bookingInput[$field] ?? null;
        if (!is_bool($value)) {
            $errors['booking.' . $field] = 'Die Zusatzleistung ist ungültig.';
            $booking[$field] = false;
        } else {
            $booking[$field] = $value;
        }
    }

    $acknowledgementInput = is_array($payload['acknowledgements'] ?? null)
        ? $payload['acknowledgements']
        : [];
    $acknowledgements = [
        'ownRisk' => we_required_boolean(
            $acknowledgementInput['ownRisk'] ?? null,
            'acknowledgements.ownRisk',
            'Bitte bestätigen Sie die Teilnahme auf eigene Gefahr.',
            $errors,
        ),
        'helmetDuty' => we_required_boolean(
            $acknowledgementInput['helmetDuty'] ?? null,
            'acknowledgements.helmetDuty',
            'Bitte bestätigen Sie die Helmpflicht.',
            $errors,
        ),
        'liabilityLimitation' => we_required_boolean(
            $acknowledgementInput['liabilityLimitation'] ?? null,
            'acknowledgements.liabilityLimitation',
            'Bitte bestätigen Sie die Haftungsbeschränkung.',
            $errors,
        ),
        'horseLiabilityInsurance' => we_required_boolean(
            $acknowledgementInput['horseLiabilityInsurance'] ?? null,
            'acknowledgements.horseLiabilityInsurance',
            'Bitte bestätigen Sie die Pferdehaftpflichtversicherung.',
            $errors,
        ),
        'horseHealthy' => we_required_boolean(
            $acknowledgementInput['horseHealthy'] ?? null,
            'acknowledgements.horseHealthy',
            'Bitte bestätigen Sie den Gesundheitszustand des Pferdes.',
            $errors,
        ),
        'participationTerms' => we_required_boolean(
            $acknowledgementInput['participationTerms'] ?? null,
            'acknowledgements.participationTerms',
            'Bitte erkennen Sie die Teilnahmebedingungen an.',
            $errors,
        ),
        'cancellationTerms' => we_required_boolean(
            $acknowledgementInput['cancellationTerms'] ?? null,
            'acknowledgements.cancellationTerms',
            'Bitte akzeptieren Sie die Stornierungsbedingungen.',
            $errors,
        ),
        'dataProcessing' => we_required_boolean(
            $acknowledgementInput['dataProcessing'] ?? null,
            'acknowledgements.dataProcessing',
            'Die Einwilligung zur Datenverarbeitung ist erforderlich.',
            $errors,
        ),
    ];

    $photoChoice = $payload['photoChoice'] ?? null;
    if (!in_array($photoChoice, ['consent', 'decline'], true)) {
        $errors['photoChoice'] = 'Bitte treffen Sie eine ausdrückliche Foto- und Videoauswahl.';
        $photoChoice = '';
    }

    $typedParticipantName = we_required_string(
        $payload['typedParticipantName'] ?? null,
        'typedParticipantName',
        'Bitte bestätigen Sie die Anmeldung mit Ihrem vollständigen Namen.',
        $errors,
    );
    if (
        $typedParticipantName !== ''
        && $fullName !== ''
        && we_normalize_name($typedParticipantName) !== we_normalize_name($fullName)
    ) {
        $errors['typedParticipantName'] = 'Der eingegebene Name muss mit dem Teilnehmernamen übereinstimmen.';
    }

    return [
        'valid' => $errors === [],
        'errors' => $errors,
        'data' => [
            'eventId' => WE_EVENT_ID,
            'idempotencyKey' => $idempotencyKey,
            'formStartedAt' => (int) $formStartedAt,
            'participant' => [
                'fullName' => $fullName,
                'street' => $street,
                'postalCode' => $postalCode,
                'city' => $city,
                'phone' => $phone,
                'email' => $email,
            ],
            'horse' => [
                'name' => $horseName,
                'breed' => $horseBreed,
                'sex' => $horseSex,
                'age' => $horseAge,
                'specialRequirements' => $horseSpecialRequirements,
            ],
            'booking' => $booking,
            'acknowledgements' => $acknowledgements,
            'photoChoice' => $photoChoice,
            'typedParticipantName' => $typedParticipantName,
        ],
    ];
}

/**
 * @param array<string, mixed> $booking
 * @return array{items: list<array{code: string, label: string, amountCents: int}>, totalCents: int}
 */
function we_calculate_booking(array $booking): array
{
    $items = [[
        'code' => 'base_course',
        'label' => '2-tägiger Kurs mit eigenem Pferd',
        'amountCents' => 42000,
    ]];
    $options = we_accommodation_options();

    $addAccommodation = static function (
        string $code,
        string $date,
        string $selection,
    ) use (&$items, $options): void {
        if ($selection === 'none') {
            return;
        }
        $option = $options[$selection];
        $items[] = [
            'code' => $code,
            'label' => $date . ': ' . $option['label'],
            'amountCents' => $option['amount_cents'],
        ];
    };

    $addAccommodation(
        'friday_accommodation',
        'Freitag, 18. September',
        (string) $booking['fridayAccommodation'],
    );
    $addAccommodation(
        'saturday_accommodation',
        'Samstag, 19. September',
        (string) $booking['saturdayAccommodation'],
    );
    if ($booking['saturdayCatering'] === true) {
        $items[] = [
            'code' => 'saturday_catering',
            'label' => 'Samstag, 19. September: Verpflegung',
            'amountCents' => 2000,
        ];
    }
    if ($booking['saturdayBemer'] === true) {
        $items[] = [
            'code' => 'saturday_bemer',
            'label' => 'Samstag, 19. September: 15 Minuten BEMER',
            'amountCents' => 2500,
        ];
    }

    $addAccommodation(
        'sunday_accommodation',
        'Sonntag, 20. September',
        (string) $booking['sundayAccommodation'],
    );
    if ($booking['sundayCatering'] === true) {
        $items[] = [
            'code' => 'sunday_catering',
            'label' => 'Sonntag, 20. September: Verpflegung',
            'amountCents' => 2000,
        ];
    }
    if ($booking['sundayBemer'] === true) {
        $items[] = [
            'code' => 'sunday_bemer',
            'label' => 'Sonntag, 20. September: 15 Minuten BEMER',
            'amountCents' => 2500,
        ];
    }

    return [
        'items' => $items,
        'totalCents' => array_sum(array_column($items, 'amountCents')),
    ];
}

function we_storage_directory(): string
{
    $configured = trim((string) getenv('WORKING_EQUITATION_STORAGE_DIR'));
    if ($configured !== '') {
        return $configured;
    }

    $home = trim((string) (getenv('HOME') ?: ($_SERVER['HOME'] ?? '')));
    if ($home === '' && function_exists('posix_getpwuid') && function_exists('posix_geteuid')) {
        $user = posix_getpwuid(posix_geteuid());
        $home = is_array($user) ? (string) ($user['dir'] ?? '') : '';
    }
    if ($home === '') {
        throw new RuntimeException('Das private Speicherverzeichnis konnte nicht ermittelt werden.');
    }

    return rtrim($home, DIRECTORY_SEPARATOR)
        . '/.local/share/see-pferde/working-equitation-2026';
}

function we_path_is_inside(string $path, string $directory): bool
{
    $normalizedPath = rtrim(str_replace('\\', '/', $path), '/');
    $normalizedDirectory = rtrim(str_replace('\\', '/', $directory), '/');
    return $normalizedPath === $normalizedDirectory
        || str_starts_with($normalizedPath, $normalizedDirectory . '/');
}

function we_prepare_storage(string $storageDirectory, string $documentRoot = ''): string
{
    if (!str_starts_with($storageDirectory, DIRECTORY_SEPARATOR)) {
        throw new RuntimeException('Das private Speicherverzeichnis muss absolut sein.');
    }
    $realDocumentRoot = $documentRoot !== '' ? realpath($documentRoot) : false;
    if (
        $realDocumentRoot !== false
        && we_path_is_inside($storageDirectory, $realDocumentRoot)
    ) {
        throw new RuntimeException('Anmeldungen dürfen nicht im öffentlichen Webverzeichnis gespeichert werden.');
    }
    if (!is_dir($storageDirectory) && !mkdir($storageDirectory, 0700, true) && !is_dir($storageDirectory)) {
        throw new RuntimeException('Das private Speicherverzeichnis konnte nicht angelegt werden.');
    }

    $realStorage = realpath($storageDirectory);
    if ($realStorage === false || !is_writable($realStorage)) {
        throw new RuntimeException('Das private Speicherverzeichnis ist nicht beschreibbar.');
    }
    @chmod($realStorage, 0700);

    if ($realDocumentRoot !== false && we_path_is_inside($realStorage, $realDocumentRoot)) {
        throw new RuntimeException('Anmeldungen dürfen nicht im öffentlichen Webverzeichnis gespeichert werden.');
    }

    return $realStorage;
}

/** @return array<string, mixed> */
function we_read_json_file(string $path): array
{
    if (!is_file($path)) {
        return [];
    }
    $json = file_get_contents($path);
    if (!is_string($json) || $json === '') {
        return [];
    }
    try {
        $decoded = json_decode($json, true, 64, JSON_THROW_ON_ERROR);
    } catch (JsonException $error) {
        throw new RuntimeException('Eine gespeicherte Anmeldung ist beschädigt.', 0, $error);
    }
    if (!is_array($decoded)) {
        throw new RuntimeException('Eine gespeicherte Anmeldung ist beschädigt.');
    }
    return $decoded;
}

/** @param array<string, mixed> $value */
function we_write_json_atomic(string $path, array $value): void
{
    $temporaryPath = $path . '.tmp-' . bin2hex(random_bytes(6));
    $encoded = json_encode(
        $value,
        JSON_THROW_ON_ERROR
        | JSON_UNESCAPED_SLASHES
        | JSON_UNESCAPED_UNICODE
        | JSON_PRETTY_PRINT,
    );
    if (file_put_contents($temporaryPath, $encoded . "\n", LOCK_EX) === false) {
        throw new RuntimeException('Die Anmeldung konnte nicht gespeichert werden.');
    }
    @chmod($temporaryPath, 0600);
    if (!rename($temporaryPath, $path)) {
        @unlink($temporaryPath);
        throw new RuntimeException('Die Anmeldung konnte nicht abgeschlossen werden.');
    }
    @chmod($path, 0600);
}

function we_format_euro(int $amountCents): string
{
    return number_format($amountCents / 100, 2, ',', '.') . ' €';
}

/**
 * @param array<string, mixed> $record
 */
function we_format_mail_body(array $record, bool $forParticipant): string
{
    $participant = $record['participant'];
    $horse = $record['horse'];
    $booking = $record['booking'];
    $acknowledgements = $record['acknowledgements'];
    $photoLabel = $record['photoChoice'] === 'consent'
        ? 'Einwilligung erteilt'
        : 'Keine Einwilligung';
    $yes = static fn (mixed $value): string => $value === true ? 'Ja' : 'Nein';
    $accommodations = we_accommodation_options();

    $lines = [
        $forParticipant
            ? 'Vielen Dank. Ihre verbindliche Kursanmeldung wurde gespeichert.'
            : 'Eine neue verbindliche Kursanmeldung wurde gespeichert.',
        '',
        'Referenz: ' . $record['reference'],
        'Veranstaltung: ' . WE_EVENT_TITLE,
        'Event-ID: ' . WE_EVENT_ID,
        'Termin: ' . WE_EVENT_DATES,
        'Ort: ' . WE_EVENT_LOCATION,
        'Serverzeit der Bestätigung: ' . $record['acknowledgedAt'],
        '',
        'TEILNEHMER',
        'Vor- und Nachname: ' . $participant['fullName'],
        'Straße und Hausnummer: ' . $participant['street'],
        'PLZ / Ort: ' . $participant['postalCode'] . ' ' . $participant['city'],
        'Telefon: ' . $participant['phone'],
        'E-Mail: ' . $participant['email'],
        '',
        'PFERD',
        'Name: ' . $horse['name'],
        'Rasse: ' . $horse['breed'],
        'Geschlecht: ' . $horse['sex'],
        'Alter: ' . $horse['age'] . ' Jahre',
        'Besonderheiten: ' . ($horse['specialRequirements'] ?: 'Keine angegeben'),
        '',
        'BUCHUNG',
        'Freitag, 18. September: '
            . $accommodations[$booking['fridayAccommodation']]['label'],
        'Samstag, 19. September: '
            . $accommodations[$booking['saturdayAccommodation']]['label']
            . '; Verpflegung: ' . $yes($booking['saturdayCatering'])
            . '; BEMER: ' . $yes($booking['saturdayBemer']),
        'Sonntag, 20. September: '
            . $accommodations[$booking['sundayAccommodation']]['label']
            . '; Verpflegung: ' . $yes($booking['sundayCatering'])
            . '; BEMER: ' . $yes($booking['sundayBemer']),
        'Hinweis: Futter sowie Ausmisten sind nicht enthalten und erfolgen durch den Teilnehmer.',
        '',
        'PREISAUFSTELLUNG',
    ];
    foreach ($record['items'] as $item) {
        $lines[] = $item['label'] . ': ' . we_format_euro($item['amountCents']);
    }
    $lines[] = 'Gesamtbetrag (serverseitig berechnet): ' . we_format_euro($record['totalCents']);

    array_push(
        $lines,
        '',
        'BESTÄTIGUNGEN',
        'Teilnahme auf eigene Gefahr: ' . $yes($acknowledgements['ownRisk']),
        'Helmpflicht: ' . $yes($acknowledgements['helmetDuty']),
        'Haftungsbeschränkung, soweit gesetzlich zulässig: '
            . $yes($acknowledgements['liabilityLimitation']),
        'Gültige Pferdehaftpflicht: ' . $yes($acknowledgements['horseLiabilityInsurance']),
        'Pferd gesund und frei von ansteckenden Krankheiten: '
            . $yes($acknowledgements['horseHealthy']),
        'Teilnahmebedingungen anerkannt: ' . $yes($acknowledgements['participationTerms']),
        'Stornierungsbedingungen akzeptiert: ' . $yes($acknowledgements['cancellationTerms']),
        'Datenverarbeitung eingewilligt: ' . $yes($acknowledgements['dataProcessing']),
        'Foto- und Videoauswahl: ' . $photoLabel,
        'Digital bestätigter Name: ' . $record['typedParticipantName'],
        'Digital bestätigt am: ' . $record['acknowledgedAt'],
        '',
        'STORNIERUNGSBEDINGUNGEN',
        'Eine Stornierung ist schriftlich mitzuteilen.',
        'Bis einen Monat vor Kursbeginn: 70 % Rückerstattung.',
        'Weniger als 21 Tage vor Kursbeginn: 10 % Rückerstattung; 90 % Stornogebühr.',
        'Weniger als 8 Tage vor Kursbeginn: keine Rückerstattung.',
        'Bei kurzfristig gefundenem Ersatz: Rückzahlung abzüglich 50,00 € Bearbeitungsgebühr.',
        'Ohne Ersatz gelten die genannten Stornierungsbedingungen.',
        'Keine Erstattung bei verspäteter Anreise, vorzeitiger Abreise oder Nichtteilnahme.',
        '',
        'ZAHLUNG INNERHALB VON SIEBEN TAGEN',
        'Kontoinhaber: K & P Hausmanagement OHG',
        'Bank: Stadt- und Kreissparkasse Leipzig',
        'IBAN: DE03 8605 5592 1090 2121 58',
        'BIC: WELADE8LXXX',
        'Verwendungszweck: Working Equitation + '
            . $participant['fullName']
            . ' + 19.-20.09.2026',
    );

    return implode("\r\n", $lines);
}

/**
 * @param array{to: string, subject: string, body: string, headers: list<string>} $message
 */
function we_default_mailer(array $message): bool
{
    $encodedSubject = '=?UTF-8?B?' . base64_encode($message['subject']) . '?=';
    return mail(
        $message['to'],
        $encodedSubject,
        $message['body'],
        implode("\r\n", $message['headers']),
    );
}

/**
 * @param array<string, mixed> $record
 * @param callable(array{to: string, subject: string, body: string, headers: list<string>}): bool $mailer
 * @return array{admin: bool, participant: bool}
 */
function we_send_notifications(array $record, callable $mailer): array
{
    $adminEmail = trim((string) getenv('WORKING_EQUITATION_ADMIN_EMAIL')) ?: WE_ADMIN_EMAIL;
    $fromEmail = trim((string) getenv('WORKING_EQUITATION_FROM_EMAIL')) ?: WE_DEFAULT_FROM_EMAIL;
    if (
        filter_var($adminEmail, FILTER_VALIDATE_EMAIL) === false
        || filter_var($fromEmail, FILTER_VALIDATE_EMAIL) === false
    ) {
        throw new RuntimeException('Die E-Mail-Konfiguration ist ungültig.');
    }

    $participantEmail = $record['participant']['email'];
    $commonHeaders = [
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
        'From: See-Pferde Zwenkau <' . $fromEmail . '>',
    ];

    $adminSent = $mailer([
        'to' => $adminEmail,
        'subject' => 'Neue Kursanmeldung: ' . $record['participant']['fullName']
            . ' (' . $record['reference'] . ')',
        'body' => we_format_mail_body($record, false),
        'headers' => [
            ...$commonHeaders,
            'Reply-To: ' . $participantEmail,
        ],
    ]);

    $participantSent = $mailer([
        'to' => $participantEmail,
        'subject' => 'Ihre Anmeldung zum Working-Equitation-Kurs',
        'body' => we_format_mail_body($record, true),
        'headers' => [
            ...$commonHeaders,
            'Reply-To: ' . $adminEmail,
        ],
    ]);

    return ['admin' => $adminSent, 'participant' => $participantSent];
}

/**
 * @param array<string, mixed> $payload
 * @param array{
 *   now?: int,
 *   storageDirectory?: string,
 *   documentRoot?: string,
 *   requestIp?: string,
 *   userAgent?: string,
 *   mailer?: callable(array{to: string, subject: string, body: string, headers: list<string>}): bool
 * } $context
 * @return array{status: int, body: array<string, mixed>}
 */
function we_process_submission(array $payload, array $context = []): array
{
    $now = $context['now'] ?? time();
    $courseStart = (new DateTimeImmutable(
        '2026-09-19 00:00:00',
        new DateTimeZone('Europe/Berlin'),
    ))->getTimestamp();
    if ($now >= $courseStart) {
        return [
            'status' => 410,
            'body' => [
                'success' => false,
                'message' => 'Die Online-Anmeldung für diesen Kurs ist geschlossen.',
            ],
        ];
    }

    $validation = we_validate_payload($payload, $now);
    if (!$validation['valid']) {
        return [
            'status' => 422,
            'body' => [
                'success' => false,
                'message' => 'Bitte prüfen Sie die markierten Angaben.',
                'fieldErrors' => $validation['errors'],
            ],
        ];
    }

    $data = $validation['data'];
    $calculation = we_calculate_booking($data['booking']);
    $storageDirectory = we_prepare_storage(
        $context['storageDirectory'] ?? we_storage_directory(),
        $context['documentRoot'] ?? (string) ($_SERVER['DOCUMENT_ROOT'] ?? ''),
    );
    $lockPath = $storageDirectory . '/index.lock';
    $lock = fopen($lockPath, 'c+');
    if ($lock === false) {
        throw new RuntimeException('Die Anmeldungssperre konnte nicht geöffnet werden.');
    }
    @chmod($lockPath, 0600);

    $record = null;
    $recordPath = '';
    try {
        if (!flock($lock, LOCK_EX)) {
            throw new RuntimeException('Die Anmeldungssperre konnte nicht gesetzt werden.');
        }

        $indexPath = $storageDirectory . '/index.json';
        $index = we_read_json_file($indexPath);
        $index['idempotency'] = is_array($index['idempotency'] ?? null)
            ? $index['idempotency']
            : [];
        $index['fingerprints'] = is_array($index['fingerprints'] ?? null)
            ? $index['fingerprints']
            : [];
        $index['rate'] = is_array($index['rate'] ?? null) ? $index['rate'] : [];

        $fingerprint = hash(
            'sha256',
            WE_EVENT_ID . '|'
            . we_normalize_name($data['participant']['fullName']) . '|'
            . strtolower($data['participant']['email']),
        );
        $idempotencyKey = $data['idempotencyKey'];

        if (isset($index['idempotency'][$idempotencyKey])) {
            $existing = $index['idempotency'][$idempotencyKey];
            if (($existing['fingerprint'] ?? '') !== $fingerprint) {
                return [
                    'status' => 409,
                    'body' => [
                        'success' => false,
                        'message' => 'Die Formularsitzung ist nicht mehr gültig. Bitte laden Sie die Seite neu.',
                    ],
                ];
            }
            $existingRecord = we_read_json_file(
                $storageDirectory . '/' . (string) ($existing['file'] ?? ''),
            );
            return [
                'status' => 200,
                'body' => [
                    'success' => true,
                    'duplicate' => true,
                    'reference' => $existing['reference'],
                    'totalCents' => $existing['totalCents'],
                    'acknowledgedAt' => $existing['acknowledgedAt'],
                    'confirmationEmailSent' =>
                        ($existingRecord['notification']['participant'] ?? '') === 'sent',
                ],
            ];
        }

        if (isset($index['fingerprints'][$fingerprint])) {
            $existing = $index['fingerprints'][$fingerprint];
            $existingRecord = we_read_json_file(
                $storageDirectory . '/' . (string) ($existing['file'] ?? ''),
            );
            return [
                'status' => 200,
                'body' => [
                    'success' => true,
                    'duplicate' => true,
                    'reference' => $existing['reference'],
                    'totalCents' => $existing['totalCents'],
                    'acknowledgedAt' => $existing['acknowledgedAt'],
                    'confirmationEmailSent' =>
                        ($existingRecord['notification']['participant'] ?? '') === 'sent',
                ],
            ];
        }

        $requestIp = (string) ($context['requestIp'] ?? ($_SERVER['REMOTE_ADDR'] ?? 'unknown'));
        $rateKey = hash('sha256', WE_EVENT_ID . '|' . $requestIp);
        $windowStart = $now - WE_RATE_LIMIT_WINDOW;
        $recentAttempts = array_values(array_filter(
            is_array($index['rate'][$rateKey] ?? null) ? $index['rate'][$rateKey] : [],
            static fn (mixed $timestamp): bool => is_int($timestamp) && $timestamp >= $windowStart,
        ));
        if (count($recentAttempts) >= WE_RATE_LIMIT_ATTEMPTS) {
            return [
                'status' => 429,
                'body' => [
                    'success' => false,
                    'message' => 'Zu viele Anmeldungen in kurzer Zeit. Bitte versuchen Sie es später erneut.',
                ],
            ];
        }

        $acknowledgedAt = gmdate('c', $now);
        $reference = 'WE-20260919-' . strtoupper(bin2hex(random_bytes(4)));
        $recordFile = $reference . '.json';
        $recordPath = $storageDirectory . '/' . $recordFile;
        $record = [
            'version' => 1,
            'reference' => $reference,
            'submittedAt' => $acknowledgedAt,
            'acknowledgedAt' => $acknowledgedAt,
            'event' => [
                'id' => WE_EVENT_ID,
                'title' => WE_EVENT_TITLE,
                'dates' => WE_EVENT_DATES,
                'location' => WE_EVENT_LOCATION,
            ],
            'participant' => $data['participant'],
            'horse' => $data['horse'],
            'booking' => $data['booking'],
            'items' => $calculation['items'],
            'totalCents' => $calculation['totalCents'],
            'acknowledgements' => $data['acknowledgements'],
            'photoChoice' => $data['photoChoice'],
            'typedParticipantName' => $data['typedParticipantName'],
            'notification' => [
                'admin' => 'pending',
                'participant' => 'pending',
            ],
            'source' => [
                'ipHash' => $rateKey,
                'userAgent' => substr(
                    (string) ($context['userAgent'] ?? ($_SERVER['HTTP_USER_AGENT'] ?? '')),
                    0,
                    500,
                ),
            ],
        ];

        we_write_json_atomic($recordPath, $record);

        $summary = [
            'reference' => $reference,
            'file' => $recordFile,
            'fingerprint' => $fingerprint,
            'totalCents' => $calculation['totalCents'],
            'acknowledgedAt' => $acknowledgedAt,
            'confirmationEmailSent' => false,
        ];
        $index['idempotency'][$idempotencyKey] = $summary;
        $index['fingerprints'][$fingerprint] = $summary;
        $recentAttempts[] = $now;
        $index['rate'][$rateKey] = $recentAttempts;
        we_write_json_atomic($indexPath, $index);
    } finally {
        flock($lock, LOCK_UN);
        fclose($lock);
    }

    if (!is_array($record) || $recordPath === '') {
        throw new RuntimeException('Die Anmeldung konnte nicht abgeschlossen werden.');
    }

    $mailer = $context['mailer'] ?? 'we_default_mailer';
    $notification = we_send_notifications($record, $mailer);
    $record['notification'] = [
        'admin' => $notification['admin'] ? 'sent' : 'failed',
        'participant' => $notification['participant'] ? 'sent' : 'failed',
    ];
    we_write_json_atomic($recordPath, $record);

    if (!$notification['admin'] || !$notification['participant']) {
        error_log(
            'Working Equitation registration email failure for '
            . $record['reference']
            . ' (admin=' . ($notification['admin'] ? 'sent' : 'failed')
            . ', participant=' . ($notification['participant'] ? 'sent' : 'failed') . ')',
        );
    }

    return [
        'status' => 201,
        'body' => [
            'success' => true,
            'duplicate' => false,
            'reference' => $record['reference'],
            'totalCents' => $record['totalCents'],
            'acknowledgedAt' => $record['acknowledgedAt'],
            'confirmationEmailSent' => $notification['participant'],
        ],
    ];
}

function we_request_origin_is_allowed(): bool
{
    $fetchSite = strtolower(trim((string) ($_SERVER['HTTP_SEC_FETCH_SITE'] ?? '')));
    if ($fetchSite === 'cross-site') {
        return false;
    }

    $origin = trim((string) ($_SERVER['HTTP_ORIGIN'] ?? ''));
    if ($origin === '') {
        return true;
    }
    $parsed = parse_url($origin);
    if (!is_array($parsed) || empty($parsed['host'])) {
        return false;
    }

    $originAuthority = strtolower((string) $parsed['host']);
    if (isset($parsed['port'])) {
        $originAuthority .= ':' . $parsed['port'];
    }
    $requestAuthority = strtolower(trim((string) ($_SERVER['HTTP_HOST'] ?? '')));
    return $requestAuthority !== '' && hash_equals($requestAuthority, $originAuthority);
}

/** @param array<string, mixed> $payload */
function we_json_response(int $status, array $payload): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function we_submission_main(): never
{
    header('Cache-Control: no-store, max-age=0');
    header('Referrer-Policy: same-origin');
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: DENY');
    header('X-Robots-Tag: noindex, nofollow, noarchive');

    try {
        $method = strtoupper((string) ($_SERVER['REQUEST_METHOD'] ?? 'GET'));
        if ($method === 'OPTIONS') {
            http_response_code(204);
            exit;
        }
        if ($method !== 'POST') {
            header('Allow: POST, OPTIONS');
            we_json_response(405, [
                'success' => false,
                'message' => 'Diese Adresse akzeptiert ausschließlich Kursanmeldungen.',
            ]);
        }
        if (!we_request_origin_is_allowed()) {
            we_json_response(403, [
                'success' => false,
                'message' => 'Die Anmeldung konnte nicht verarbeitet werden.',
            ]);
        }

        $contentType = strtolower(trim(explode(';', (string) ($_SERVER['CONTENT_TYPE'] ?? ''))[0]));
        if ($contentType !== 'application/json') {
            we_json_response(415, [
                'success' => false,
                'message' => 'Die Anmeldung hat ein ungültiges Format.',
            ]);
        }

        $contentLength = (int) ($_SERVER['CONTENT_LENGTH'] ?? 0);
        if ($contentLength > WE_MAX_REQUEST_BYTES) {
            we_json_response(413, [
                'success' => false,
                'message' => 'Die Anmeldung ist zu groß.',
            ]);
        }
        $rawBody = file_get_contents('php://input');
        if (!is_string($rawBody) || $rawBody === '' || strlen($rawBody) > WE_MAX_REQUEST_BYTES) {
            we_json_response(400, [
                'success' => false,
                'message' => 'Die Anmeldung konnte nicht gelesen werden.',
            ]);
        }

        $payload = json_decode($rawBody, true, 32, JSON_THROW_ON_ERROR);
        if (!is_array($payload)) {
            we_json_response(400, [
                'success' => false,
                'message' => 'Die Anmeldung hat ein ungültiges Format.',
            ]);
        }

        $result = we_process_submission($payload);
        we_json_response($result['status'], $result['body']);
    } catch (JsonException) {
        we_json_response(400, [
            'success' => false,
            'message' => 'Die Anmeldung hat ein ungültiges Format.',
        ]);
    } catch (Throwable $error) {
        error_log('Working Equitation registration error: ' . $error->getMessage());
        we_json_response(500, [
            'success' => false,
            'message' => 'Die Anmeldung konnte gerade nicht gespeichert werden. Bitte versuchen Sie es später erneut.',
        ]);
    }
}
