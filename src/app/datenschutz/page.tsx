import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description: "Datenschutzerklärung des Reiterhof Mandy Kolatka — Informationen zum Umgang mit Ihren personenbezogenen Daten.",
};

export default function Datenschutz() {
  return (
    <section className="bg-white pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-heading font-bold mb-10">Datenschutzerklärung</h1>

        <div className="prose prose-lg max-w-none text-text-secondary space-y-8">
          <div>
            <h2 className="text-xl font-heading font-semibold text-text mb-2">1. Verantwortlicher</h2>
            <p>
              Mandy Kolatka<br />
              Reiterhof Mandy Kolatka<br />
              Hafenstraße 20<br />
              04442 Zwenkau<br />
              E-Mail: [wird ergänzt]<br />
              Telefon: [wird ergänzt]
            </p>
          </div>

          <div>
            <h2 className="text-xl font-heading font-semibold text-text mb-2">2. Allgemeine Hinweise</h2>
            <p>
              Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-heading font-semibold text-text mb-2">3. Datenerfassung auf dieser Website</h2>
            <h3 className="text-lg font-heading font-semibold text-text mb-1">Hosting</h3>
            <p>
              Diese Website wird extern gehostet. Die personenbezogenen Daten, die auf dieser Website erfasst werden, werden auf den Servern des Hosters gespeichert. Hierbei kann es sich v. a. um IP-Adressen, Kontaktanfragen, Meta- und Kommunikationsdaten, Vertragsdaten, Kontaktdaten, Namen, Websitezugriffe und sonstige Daten, die über eine Website generiert werden, handeln.
            </p>
            <p>
              Hosting-Anbieter: [wird ergänzt]
            </p>

            <h3 className="text-lg font-heading font-semibold text-text mb-1 mt-4">Kontaktformular</h3>
            <p>
              Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.
            </p>
            <p>
              Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO, sofern Ihre Anfrage mit der Erfüllung eines Vertrags zusammenhängt oder zur Durchführung vorvertraglicher Maßnahmen erforderlich ist. In allen übrigen Fällen beruht die Verarbeitung auf unserem berechtigten Interesse an der effektiven Bearbeitung der an uns gerichteten Anfragen (Art. 6 Abs. 1 lit. f DSGVO) oder auf Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO).
            </p>
          </div>

          <div>
            <h2 className="text-xl font-heading font-semibold text-text mb-2">4. Eingebettete Inhalte</h2>
            <h3 className="text-lg font-heading font-semibold text-text mb-1">OpenStreetMap</h3>
            <p>
              Wir nutzen den Kartendienst von OpenStreetMap (OSM). Anbieter ist die OpenStreetMap Foundation. Beim Aufruf der Kontaktseite wird eine Verbindung zu den Servern von OpenStreetMap hergestellt. Dabei kann Ihre IP-Adresse und weitere technische Daten an OpenStreetMap übermittelt werden.
            </p>
            <p>
              Die Nutzung von OpenStreetMap erfolgt im Interesse einer ansprechenden Darstellung unserer Online-Angebote und einer leichten Auffindbarkeit der von uns auf der Website angegebenen Orte. Dies stellt ein berechtigtes Interesse im Sinne von Art. 6 Abs. 1 lit. f DSGVO dar.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-heading font-semibold text-text mb-2">5. Cookies</h2>
            <p>
              Diese Website verwendet keine Cookies zu Tracking- oder Analysezwecken. Es werden lediglich technisch notwendige Cookies verwendet, die für den Betrieb der Website erforderlich sind.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-heading font-semibold text-text mb-2">6. Ihre Rechte</h2>
            <p>Sie haben jederzeit das Recht:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Auskunft über Ihre bei uns gespeicherten Daten zu erhalten (Art. 15 DSGVO)</li>
              <li>Die Berichtigung unrichtiger Daten zu verlangen (Art. 16 DSGVO)</li>
              <li>Die Löschung Ihrer Daten zu verlangen (Art. 17 DSGVO)</li>
              <li>Die Einschränkung der Verarbeitung zu verlangen (Art. 18 DSGVO)</li>
              <li>Datenübertragbarkeit zu verlangen (Art. 20 DSGVO)</li>
              <li>Widerspruch gegen die Verarbeitung einzulegen (Art. 21 DSGVO)</li>
              <li>Sich bei einer Aufsichtsbehörde zu beschweren (Art. 77 DSGVO)</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-heading font-semibold text-text mb-2">7. Änderungen</h2>
            <p>
              Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie stets den aktuellen rechtlichen Anforderungen entspricht oder um Änderungen unserer Leistungen in der Datenschutzerklärung umzusetzen.
            </p>
            <p className="text-sm text-text-light mt-4">Stand: Februar 2026</p>
          </div>
        </div>
      </div>
    </section>
  );
}
