(function setupCmsDialogs() {
  "use strict";

  if (window.CMSDialog) return;

  var queue = [];
  var active = false;
  var sequence = 0;

  function element(tagName, className, text) {
    var node = document.createElement(tagName);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = String(text);
    return node;
  }

  function ensureToastRegion() {
    var region = document.getElementById("cms-toast-region");
    if (region) return region;

    region = element("div", "cms-toast-region");
    region.id = "cms-toast-region";
    region.setAttribute("aria-label", "Meldungen der Website-Verwaltung");
    document.body.appendChild(region);
    return region;
  }

  function notice(message) {
    var toast = element("section", "cms-toast");
    toast.setAttribute("role", "alert");
    toast.setAttribute("aria-atomic", "true");

    var copy = element("div", "cms-toast__copy");
    copy.appendChild(element("strong", "cms-toast__title", "Hinweis"));
    copy.appendChild(element("p", "cms-toast__message", message));

    var close = element("button", "cms-toast__close", "Schließen");
    close.type = "button";
    close.setAttribute("aria-label", "Hinweis schließen");
    close.addEventListener("click", function closeToast() {
      toast.remove();
    });

    toast.appendChild(copy);
    toast.appendChild(close);
    ensureToastRegion().appendChild(toast);

    window.setTimeout(function removeToast() {
      toast.remove();
    }, 9000);
  }

  function request(kind, message, defaultValue) {
    return new Promise(function enqueue(resolve) {
      queue.push({
        kind: kind,
        message: message,
        defaultValue: defaultValue,
        resolve: resolve,
      });
      showNext();
    });
  }

  function showNext() {
    if (active || queue.length === 0) return;
    active = true;

    var item = queue.shift();
    var previousFocus = document.activeElement;
    var id = String(++sequence);
    var titleId = "cms-dialog-title-" + id;
    var messageId = "cms-dialog-message-" + id;
    var isPrompt = item.kind === "prompt";
    var settled = false;

    var overlay = element("div", "cms-dialog-backdrop");
    var form = element("form", "cms-dialog");
    form.setAttribute("role", isPrompt ? "dialog" : "alertdialog");
    form.setAttribute("aria-modal", "true");
    form.setAttribute("aria-labelledby", titleId);
    form.setAttribute("aria-describedby", messageId);

    var header = element("header", "cms-dialog__header");
    var eyebrow = element(
      "span",
      "cms-dialog__eyebrow",
      isPrompt ? "Eingabe" : "Bestätigung",
    );
    var title = element(
      "h2",
      "cms-dialog__title",
      isPrompt ? "Angabe eintragen" : "Aktion bestätigen",
    );
    title.id = titleId;
    header.appendChild(eyebrow);
    header.appendChild(title);

    var message = element("p", "cms-dialog__message", item.message);
    message.id = messageId;

    var input = null;
    if (isPrompt) {
      var field = element("div", "cms-dialog__field");
      var label = element("label", "cms-dialog__label", "Ihre Eingabe");
      input = element("input", "cms-dialog__input");
      input.id = "cms-dialog-input-" + id;
      input.name = "value";
      input.type = "text";
      input.autocomplete = "off";
      input.value = item.defaultValue == null ? "" : String(item.defaultValue);
      label.htmlFor = input.id;
      field.appendChild(label);
      field.appendChild(input);
      form.appendChild(header);
      form.appendChild(message);
      form.appendChild(field);
    } else {
      form.appendChild(header);
      form.appendChild(message);
    }

    var actions = element("footer", "cms-dialog__actions");
    var cancel = element("button", "cms-dialog__button cms-dialog__button--secondary", "Abbrechen");
    cancel.type = "button";
    var accept = element(
      "button",
      "cms-dialog__button cms-dialog__button--primary",
      isPrompt ? "Übernehmen" : "Bestätigen",
    );
    accept.type = "submit";
    actions.appendChild(cancel);
    actions.appendChild(accept);
    form.appendChild(actions);
    overlay.appendChild(form);

    function focusableElements() {
      return Array.from(
        form.querySelectorAll(
          'button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
        ),
      );
    }

    function settle(value) {
      if (settled) return;
      settled = true;
      document.removeEventListener("keydown", onKeyDown, true);
      overlay.remove();
      document.body.classList.remove("cms-dialog-open");
      active = false;
      item.resolve(value);

      window.setTimeout(function restoreFocus() {
        if (previousFocus && previousFocus.isConnected && previousFocus.focus) {
          previousFocus.focus();
        }
        showNext();
      }, 0);
    }

    function cancelDialog() {
      settle(isPrompt ? null : false);
    }

    function onKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        cancelDialog();
        return;
      }

      if (event.key !== "Tab") return;
      var focusable = focusableElements();
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    cancel.addEventListener("click", cancelDialog);
    overlay.addEventListener("mousedown", function cancelFromBackdrop(event) {
      if (event.target === overlay) cancelDialog();
    });
    form.addEventListener("submit", function submitDialog(event) {
      event.preventDefault();
      settle(isPrompt ? input.value : true);
    });
    document.addEventListener("keydown", onKeyDown, true);
    document.body.classList.add("cms-dialog-open");
    document.body.appendChild(overlay);

    window.requestAnimationFrame(function focusDialog() {
      if (isPrompt) {
        input.focus();
        input.select();
      } else {
        cancel.focus();
      }
    });
  }

  window.CMSDialog = Object.freeze({
    notice: notice,
    confirm: function confirm(message) {
      return request("confirm", message);
    },
    prompt: function prompt(message, defaultValue) {
      return request("prompt", message, defaultValue);
    },
  });

  window.CMSAuth = Object.freeze({
    open: function openAuthentication(url) {
      var previousFocus = document.activeElement;
      var overlay = element("section", "cms-auth-backdrop");
      overlay.setAttribute("role", "dialog");
      overlay.setAttribute("aria-modal", "true");
      overlay.setAttribute("aria-label", "Anmeldung zur Website-Verwaltung");

      var shell = element("div", "cms-auth-shell");
      var close = element("button", "cms-auth-close", "Schließen");
      close.type = "button";
      close.setAttribute("aria-label", "Anmeldung schließen");

      var frame = element("iframe", "cms-auth-frame");
      frame.src = url;
      frame.title = "Anmeldung zur Website-Verwaltung";
      frame.setAttribute("allow", "clipboard-write");

      var closed = false;

      function closeAuthentication() {
        if (closed) return;
        closed = true;
        document.removeEventListener("keydown", onAuthKeyDown, true);
        overlay.remove();
        document.body.classList.remove("cms-dialog-open");
        if (previousFocus && previousFocus.isConnected && previousFocus.focus) {
          previousFocus.focus();
        }
      }

      function onAuthKeyDown(event) {
        if (event.key !== "Escape") return;
        event.preventDefault();
        closeAuthentication();
      }

      close.addEventListener("click", closeAuthentication);
      document.addEventListener("keydown", onAuthKeyDown, true);
      shell.appendChild(close);
      shell.appendChild(frame);
      overlay.appendChild(shell);
      document.body.classList.add("cms-dialog-open");
      document.body.appendChild(overlay);

      window.requestAnimationFrame(function focusAuthentication() {
        frame.focus();
      });

      return {
        close: closeAuthentication,
        focus: function focusAuthenticationFrame() {
          frame.focus();
        },
        postMessage: function postAuthenticationMessage(message, origin) {
          if (frame.contentWindow) frame.contentWindow.postMessage(message, origin);
        },
      };
    },
  });
})();
