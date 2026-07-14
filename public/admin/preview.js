(function registerSeePferdePreviews() {
  "use strict";

  var boot = document.getElementById("admin-boot");
  var bootStatus = document.getElementById("admin-boot-status");
  var CMS = window.CMS;
  var createClass = window.createClass;
  var h = window.h;

  function showBootError(message) {
    if (!boot) return;
    boot.setAttribute("data-error", "true");
    boot.removeAttribute("role");
    if (bootStatus) bootStatus.textContent = message;
  }

  if (!CMS || !createClass || !h) {
    showBootError(
      "Das CMS konnte nicht geladen werden. Bitte prüfen Sie die Internetverbindung und laden Sie die Seite neu.",
    );
    return;
  }

  function normalize(rawValue) {
    if (rawValue && typeof rawValue.toJS === "function") return rawValue.toJS();
    return rawValue;
  }

  function field(props, name, fallback) {
    var rawValue = props.entry.getIn(["data", name]);
    var value = normalize(rawValue);
    return value === undefined || value === null || value === "" ? fallback : value;
  }

  function listValue(value) {
    var normalized = normalize(value);
    if (Array.isArray(normalized)) return normalized.filter(Boolean);
    return normalized ? [normalized] : [];
  }

  function listField(props, name) {
    return listValue(props.entry.getIn(["data", name]));
  }

  function assetUrl(props, path) {
    if (!path) return "";
    try {
      var asset = props.getAsset(path);
      return asset && typeof asset.toString === "function" ? asset.toString() : String(asset || path);
    } catch {
      return String(path);
    }
  }

  function image(props, path, alt, className, heroFallback) {
    var source = assetUrl(props, path);
    if (!source) {
      return h(
        "div",
        {
          className: heroFallback
            ? "preview-image-fallback preview-image-fallback--hero"
            : "preview-image-fallback",
          role: "status",
        },
        "Noch kein Bild ausgewählt",
      );
    }

    return h("img", {
      className: className || "preview-card__image",
      src: source,
      alt: alt || "Bildbeschreibung fehlt",
    });
  }

  function richText(props, name) {
    if (!field(props, name, "")) return null;
    try {
      return h("div", { className: "preview-richtext" }, props.widgetFor(name));
    } catch {
      return h(
        "div",
        { className: "preview-empty", role: "status" },
        "Der formatierte Inhalt kann in der Vorschau gerade nicht angezeigt werden.",
      );
    }
  }

  function note() {
    return h(
      "aside",
      { className: "preview-note", "aria-label": "Vorschau-Hinweis" },
      "Diese Vorschau zeigt Inhalt und Gestaltung annähernd. Navigation, Animationen und das vollständige responsive Verhalten sehen Sie auf der veröffentlichten Website.",
    );
  }

  function scaffold(children) {
    return h(
      "main",
      { className: "cms-preview" },
      note(),
      h("article", { className: "preview-shell" }, children),
    );
  }

  function section(children, modifier) {
    return h(
      "section",
      { className: "preview-section" + (modifier ? " " + modifier : "") },
      children,
    );
  }

  function eyebrow(value) {
    return value ? h("p", { className: "preview-eyebrow" }, value) : null;
  }

  function tags(values) {
    var items = listValue(values);
    if (!items.length) return null;
    return h(
      "div",
      { className: "preview-tags", "aria-label": "Auswahl" },
      items.map(function renderTag(item, index) {
        return h("span", { className: "preview-tag", key: String(item) + index }, String(item));
      }),
    );
  }

  function bulletList(values) {
    var items = listValue(values);
    if (!items.length) return null;
    return h(
      "ul",
      { className: "preview-list" },
      items.map(function renderItem(item, index) {
        return h("li", { key: String(item) + index }, String(item));
      }),
    );
  }

  function details(rows) {
    var filteredRows = rows.filter(function hasValue(row) {
      return row[1] !== undefined && row[1] !== null && row[1] !== "";
    });
    if (!filteredRows.length) return null;
    var children = [];
    filteredRows.forEach(function addRow(row, index) {
      children.push(h("dt", { key: "term-" + index }, row[0]));
      children.push(h("dd", { key: "value-" + index }, String(row[1])));
    });
    return h("dl", { className: "preview-details" }, children);
  }

  function formatDate(dateString) {
    if (!dateString) return "Datum fehlt";
    var parts = String(dateString).slice(0, 10).split("-").map(Number);
    if (parts.length !== 3 || parts.some(Number.isNaN)) return String(dateString);
    var date = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2], 12));
    return new Intl.DateTimeFormat("de-DE", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      timeZone: "Europe/Berlin",
    }).format(date);
  }

  function berlinToday() {
    var dateParts = new Intl.DateTimeFormat("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "Europe/Berlin",
    }).formatToParts(new Date());
    var values = {};
    dateParts.forEach(function collect(part) {
      if (part.type !== "literal") values[part.type] = part.value;
    });
    return values.year + "-" + values.month + "-" + values.day;
  }

  function eventState(props) {
    var state = field(props, "state", "scheduled");
    var effectiveDate = field(props, "endDate", field(props, "date", ""));
    if (state === "cancelled") return { label: "Abgesagt", tone: "danger", disabled: true };
    if (state === "sold_out") return { label: "Ausgebucht", tone: "warning", disabled: true };
    if (effectiveDate && String(effectiveDate).slice(0, 10) < berlinToday()) {
      return { label: "Vergangen", tone: "neutral", disabled: true };
    }
    return { label: "Anmeldung möglich", tone: "success", disabled: false };
  }

  var HomePreview = createClass({
    render: function renderHome() {
      var props = this.props;
      var featuredOffers = listField(props, "featuredOffers");
      var featuredEvent = field(props, "featuredEvent", "");
      var heroImage = field(props, "heroImage", "");
      var heroAlt = field(props, "heroImageAlt", "");

      return scaffold([
        h(
          "header",
          { className: "preview-hero", key: "hero" },
          image(props, heroImage, heroAlt, "preview-hero__image", true),
          h("div", { className: "preview-hero__content" }, [
            eyebrow("See-Pferde Zwenkau"),
            h("h1", null, field(props, "heroTitle", "Titel der Startseite")),
            h("p", { className: "preview-lead" }, field(props, "heroSubtitle", "Einleitung fehlt")),
            h("span", { className: "preview-button" }, field(props, "primaryCtaLabel", "Buttontext fehlt")),
          ]),
        ),
        section(
          h("div", { className: "preview-media-row" }, [
            h("div", { key: "copy" }, [
              eyebrow(field(props, "welcomeEyebrow", "")),
              h("h2", null, field(props, "welcomeTitle", "Willkommen")),
              richText(props, "welcomeBody"),
            ]),
            h(
              "div",
              { key: "image" },
              image(
                props,
                field(props, "welcomeImage", ""),
                field(props, "welcomeImageAlt", ""),
                "preview-media-row__image",
              ),
            ),
          ]),
          "preview-section--alt",
        ),
        section([
          eyebrow(field(props, "offersEyebrow", "")),
          h("h2", null, field(props, "offersTitle", "Ausgewählte Angebote")),
          featuredOffers.length
            ? tags(featuredOffers)
            : h("div", { className: "preview-empty", role: "status" }, "Bitte wählen Sie mindestens ein sichtbares Angebot aus."),
        ]),
        featuredEvent
          ? section([
              eyebrow(field(props, "eventEyebrow", "")),
              h("h2", null, "Hervorgehobene Veranstaltung"),
              tags([featuredEvent]),
            ], "preview-section--alt")
          : null,
        section(
          h("div", { className: "preview-media-row" }, [
            h("div", { key: "copy" }, [
              eyebrow(field(props, "contactEyebrow", "")),
              h("h2", null, field(props, "contactTitle", "Kontakt")),
              h("p", { className: "preview-lead" }, field(props, "contactBody", "")),
              tags(listField(props, "contactHighlights")),
              h("span", { className: "preview-button" }, field(props, "contactCtaLabel", "Kontakt")),
            ]),
            h(
              "div",
              { key: "image" },
              image(
                props,
                field(props, "contactImage", ""),
                field(props, "contactImageAlt", ""),
                "preview-media-row__image",
              ),
            ),
          ]),
          "preview-section--green",
        ),
      ].filter(Boolean));
    },
  });

  var AboutPreview = createClass({
    render: function renderAbout() {
      var props = this.props;
      return scaffold([
        section([
          eyebrow(field(props, "eyebrow", "")),
          h("h1", null, field(props, "title", "Über uns")),
          h("p", { className: "preview-lead" }, field(props, "intro", "")),
        ]),
        section(
          h("div", { className: "preview-media-row" }, [
            h("div", { key: "copy" }, [
              eyebrow(field(props, "philosophyEyebrow", "")),
              h("h2", null, field(props, "philosophyTitle", "Unsere Philosophie")),
              richText(props, "philosophyBody"),
            ]),
            image(
              props,
              field(props, "philosophyImage", ""),
              field(props, "philosophyImageAlt", ""),
              "preview-media-row__image",
            ),
          ]),
          "preview-section--alt",
        ),
        section([
          eyebrow(field(props, "teamEyebrow", "")),
          h("h2", null, field(props, "teamTitle", "Unser Team")),
          field(props, "teamIntro", "")
            ? h("p", { className: "preview-lead" }, field(props, "teamIntro", ""))
            : null,
          h("p", { className: "preview-muted" }, "Die sichtbaren Teamprofile werden darunter automatisch aus der Sammlung „Team“ ergänzt."),
          h("span", { className: "preview-button" }, field(props, "ctaLabel", "Kontakt aufnehmen")),
        ]),
      ]);
    },
  });

  var OfferPreview = createClass({
    render: function renderOffer() {
      var props = this.props;
      var pricing = listField(props, "pricingOptions");
      var category = field(props, "category", "workshop") === "seminar" ? "Seminar" : "Workshop";
      return scaffold([
        h(
          "header",
          { className: "preview-hero", key: "hero" },
          image(props, field(props, "imageSrc", ""), field(props, "imageAlt", ""), "preview-hero__image", true),
          h("div", { className: "preview-hero__content" }, [
            eyebrow(category),
            h("h1", null, field(props, "title", "Angebotstitel")),
            h("p", { className: "preview-lead" }, field(props, "description", field(props, "summary", ""))),
            h("span", { className: "preview-button" }, "Unverbindlich anfragen"),
          ]),
        ),
        section([
          h("p", { className: "preview-lead" }, field(props, "summary", "Kurzbeschreibung fehlt")),
          richText(props, "body"),
          bulletList(listField(props, "highlights")),
        ]),
        section([
          h("h2", null, "Auf einen Blick"),
          details([
            ["Format", field(props, "format", "")],
            ["Teilnehmerzahl", field(props, "participantCount", "")],
            ["Voraussetzungen", field(props, "prerequisites", "")],
            ["Besonderer Hinweis", field(props, "specialNote", "")],
          ]),
          tags(listField(props, "audience")),
        ], "preview-section--alt"),
        pricing.length
          ? section([
              h("h2", null, "Preise"),
              h(
                "div",
                { className: "preview-grid" },
                pricing.map(function renderPrice(price, index) {
                  return h(
                    "section",
                    {
                      className: "preview-price" + (price.highlighted ? " preview-price--highlighted" : ""),
                      key: (price.label || "price") + index,
                    },
                    [
                      h("h3", null, price.label || "Preisoption"),
                      h("p", { className: "preview-price__value" }, price.price || "Preis fehlt"),
                      price.unit ? h("p", { className: "preview-muted" }, price.unit) : null,
                      bulletList(price.features),
                    ].filter(Boolean),
                  );
                }),
              ),
            ])
          : null,
      ].filter(Boolean));
    },
  });

  var EventPreview = createClass({
    render: function renderEvent() {
      var props = this.props;
      var status = eventState(props);
      var date = formatDate(field(props, "date", ""));
      var endDate = field(props, "endDate", "");
      var dateLabel = endDate && String(endDate).slice(0, 10) !== String(field(props, "date", "")).slice(0, 10)
        ? date + " – " + formatDate(endDate)
        : date;
      var times = [field(props, "startTime", ""), field(props, "endTime", "")].filter(Boolean).join(" – ");

      return scaffold([
        h(
          "header",
          { className: "preview-hero", key: "hero" },
          image(props, field(props, "imageSrc", ""), field(props, "imageAlt", ""), "preview-hero__image", true),
          h("div", { className: "preview-hero__content" }, [
            h("span", { className: "preview-badge preview-badge--" + status.tone }, status.label),
            h("h1", null, field(props, "title", "Veranstaltungstitel")),
            h("p", { className: "preview-lead" }, field(props, "description", "")),
            h(
              "span",
              { className: "preview-button" + (status.disabled ? " preview-button--disabled" : "") },
              status.disabled ? status.label : field(props, "registrationLabel", "Jetzt anmelden"),
            ),
          ]),
        ),
        section([
          h("h2", null, "Termin im Überblick"),
          details([
            ["Datum", dateLabel],
            ["Uhrzeit", times],
            ["Ort", field(props, "location", "")],
            ["Teilnehmerzahl", field(props, "capacity", "")],
            ["Preis", field(props, "priceDisplay", "")],
            ["Zugehöriges Angebot", field(props, "relatedOffer", "")],
          ]),
        ], "preview-section--alt"),
        section([richText(props, "body"), bulletList(listField(props, "highlights"))]),
      ]);
    },
  });

  var TeamPreview = createClass({
    render: function renderTeam() {
      var props = this.props;
      return scaffold(
        section(
          h("div", { className: "preview-grid preview-grid--two" }, [
            h("article", { className: "preview-card", key: "card" }, [
              image(props, field(props, "imageSrc", ""), field(props, "imageAlt", ""), "preview-card__image preview-card__image--portrait"),
              h("div", { className: "preview-card__body" }, [
                eyebrow(field(props, "role", "")),
                h("h1", null, field(props, "name", "Name des Teammitglieds")),
                h("p", null, field(props, "shortBio", "Kurzbiografie fehlt")),
              ]),
            ]),
            h("div", { key: "bio" }, [
              h("h2", null, "Persönliche Vorstellung"),
              richText(props, "body"),
              listField(props, "qualifications").length
                ? h("div", null, [h("h3", null, "Qualifikationen"), bulletList(listField(props, "qualifications"))])
                : null,
            ]),
          ]),
        ),
      );
    },
  });

  var HorsePreview = createClass({
    render: function renderHorse() {
      var props = this.props;
      var birthYear = field(props, "birthYear", "");
      var age = birthYear ? String(new Date().getFullYear() - Number(birthYear)) + " Jahre" : field(props, "ageText", "");
      return scaffold(
        section(
          h("article", { className: "preview-card" }, [
            image(props, field(props, "imageSrc", ""), field(props, "imageAlt", ""), "preview-card__image"),
            h("div", { className: "preview-card__body" }, [
              eyebrow(field(props, "breed", "")),
              h("h1", null, field(props, "name", "Pferdename")),
              age ? h("p", { className: "preview-muted" }, age) : null,
              h("p", null, field(props, "character", "Charakterbeschreibung fehlt")),
              tags(listField(props, "roles")),
            ]),
          ]),
        ),
      );
    },
  });

  var GalleryPreview = createClass({
    render: function renderGallery() {
      var props = this.props;
      return scaffold([
        image(props, field(props, "src", ""), field(props, "alt", ""), "preview-gallery-image"),
        h("section", { className: "preview-gallery-caption" }, [
          eyebrow(field(props, "category", "Galerie")),
          h("h1", null, field(props, "title", "Bildtitel")),
          field(props, "caption", "") ? h("p", null, field(props, "caption", "")) : null,
          details([
            ["Zugehöriges Pferd", field(props, "relatedHorse", "")],
            ["Zugehörige Veranstaltung", field(props, "relatedEvent", "")],
          ]),
        ]),
      ]);
    },
  });

  var AnnouncementPreview = createClass({
    render: function renderAnnouncement() {
      var props = this.props;
      var enabled = Boolean(field(props, "enabled", false));
      var variant = field(props, "variant", "info");
      var linkLabel = field(props, "linkLabel", "");
      return scaffold(
        section(
          h(
            "aside",
            {
              className:
                "preview-announcement preview-announcement--" + variant +
                (enabled ? "" : " preview-announcement--disabled"),
              "aria-label": "Website-Hinweis",
            },
            [
              h("div", { className: "preview-announcement__topline" }, [
                h("strong", null, field(props, "title", "Hinweis")),
                h("span", { className: "preview-badge" }, enabled ? "Eingeschaltet" : "Ausgeschaltet"),
              ]),
              h("p", null, field(props, "message", "Meldung fehlt")),
              details([
                ["Start", field(props, "startDate", "") ? formatDate(field(props, "startDate", "")) : "Sofort"],
                ["Ende", field(props, "endDate", "") ? formatDate(field(props, "endDate", "")) : "Bis zum Ausschalten"],
              ]),
              linkLabel ? h("span", { className: "preview-button" }, linkLabel) : null,
            ].filter(Boolean),
          ),
        ),
      );
    },
  });

  var SimplePagePreview = createClass({
    render: function renderPage() {
      var props = this.props;
      return scaffold([
        section([
          eyebrow(field(props, "eyebrow", "")),
          h("h1", null, field(props, "title", "Seitentitel")),
          h("p", { className: "preview-lead" }, field(props, "intro", "")),
        ]),
        field(props, "ctaTitle", "")
          ? section([
              h("h2", null, field(props, "ctaTitle", "")),
              h("p", null, field(props, "ctaBody", "")),
              field(props, "ctaLabel", "")
                ? h("span", { className: "preview-button" }, field(props, "ctaLabel", ""))
                : null,
            ], "preview-section--alt")
          : null,
      ].filter(Boolean));
    },
  });

  var LegalPreview = createClass({
    render: function renderLegal() {
      var props = this.props;
      return scaffold([
        section([
          eyebrow("Rechtlicher Inhalt"),
          h("h1", null, field(props, "title", "Rechtlicher Seitentitel")),
          details([
            ["Zuletzt fachlich geprüft", field(props, "lastReviewedAt", "") ? formatDate(field(props, "lastReviewedAt", "")) : "Noch nicht eingetragen"],
            ["Geprüft durch", field(props, "reviewedBy", "Noch nicht eingetragen")],
          ]),
        ]),
        section(richText(props, "body"), "preview-section--alt"),
      ]);
    },
  });

  CMS.registerPreviewStyle("/admin/preview.css");
  CMS.registerPreviewTemplate("home", HomePreview);
  CMS.registerPreviewTemplate("about", AboutPreview);
  CMS.registerPreviewTemplate("contact", SimplePagePreview);
  CMS.registerPreviewTemplate("offers_page", SimplePagePreview);
  CMS.registerPreviewTemplate("events_page", SimplePagePreview);
  CMS.registerPreviewTemplate("horses_page", SimplePagePreview);
  CMS.registerPreviewTemplate("prices_page", SimplePagePreview);
  CMS.registerPreviewTemplate("gallery_page", SimplePagePreview);
  CMS.registerPreviewTemplate("offers", OfferPreview);
  CMS.registerPreviewTemplate("events", EventPreview);
  CMS.registerPreviewTemplate("team", TeamPreview);
  CMS.registerPreviewTemplate("horses", HorsePreview);
  CMS.registerPreviewTemplate("gallery", GalleryPreview);
  CMS.registerPreviewTemplate("announcements", AnnouncementPreview);
  CMS.registerPreviewTemplate("imprint", LegalPreview);
  CMS.registerPreviewTemplate("privacy", LegalPreview);

  var germanLocale = typeof CMS.getLocale === "function" ? CMS.getLocale("de") : null;
  if (germanLocale && germanLocale.auth) {
    germanLocale.auth.loginWithGitHub = "Mit Benutzername und Passwort anmelden";
    germanLocale.auth.loggingIn = "Anmeldung wird geprüft …";
    CMS.registerLocale("de", germanLocale);
  }

  var localLoginStarted = false;
  var isLocalCms = ["localhost", "127.0.0.1"].includes(window.location.hostname);

  function refineLoginButton() {
    var buttons = document.querySelectorAll("#nc-root button");
    buttons.forEach(function refine(button) {
      if (
        isLocalCms &&
        !localLoginStarted &&
        button.textContent &&
        button.textContent.trim() === "Login"
      ) {
        localLoginStarted = true;
        button.click();
        return;
      }

      if (!button.textContent || !button.textContent.includes("Benutzername und Passwort")) return;
      button.setAttribute("aria-label", "Mit Benutzername und Passwort anmelden");
      var providerIcon = button.querySelector("svg");
      if (providerIcon) {
        providerIcon.setAttribute("aria-hidden", "true");
        providerIcon.style.display = "none";
      }
    });
  }

  var loginObserver = new MutationObserver(refineLoginButton);
  loginObserver.observe(document.body, { childList: true, subtree: true });
  CMS.init();
  refineLoginButton();

  window.setTimeout(function revealCms() {
    if (boot) boot.remove();
  }, 250);
})();
