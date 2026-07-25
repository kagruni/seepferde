import { readFileSync } from "node:fs";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

const dialogsSource = readFileSync(
  path.resolve(process.cwd(), "public/admin/dialogs.js"),
  "utf8",
);

type CmsAuthController = {
  close: () => void;
};

type CmsAuthApi = {
  open: (url: string) => CmsAuthController;
};

beforeEach(() => {
  document.body.innerHTML = "";
  delete (window as Window & { CMSDialog?: unknown }).CMSDialog;
  delete (window as Window & { CMSAuth?: unknown }).CMSAuth;
  window.eval(dialogsSource);
});

afterEach(() => {
  document.body.innerHTML = "";
  delete (window as Window & { CMSDialog?: unknown }).CMSDialog;
  delete (window as Window & { CMSAuth?: unknown }).CMSAuth;
});

describe("CMS authentication dialog", () => {
  it("links the close control back to the public website", () => {
    const cmsAuth = (window as unknown as { CMSAuth: CmsAuthApi }).CMSAuth;
    const controller = cmsAuth.open("/cms-auth/form");
    const close = document.querySelector<HTMLAnchorElement>(".cms-auth-close");

    expect(close?.tagName).toBe("A");
    expect(close?.getAttribute("href")).toBe("/");
    expect(close?.getAttribute("aria-label")).toBe(
      "Anmeldung schließen und zur Website zurückkehren",
    );

    controller.close();
    expect(document.querySelector(".cms-auth-backdrop")).toBeNull();
  });
});
