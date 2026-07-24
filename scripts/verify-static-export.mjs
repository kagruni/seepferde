import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const publicHtaccess = path.join(root, "public", ".htaccess");
const outputRoot = path.join(root, "out");

const requiredFiles = [
  "index.html",
  ".htaccess",
  "admin/index.html",
  "cms-auth/auth.php",
  "cms-auth/api.php",
  "kursanmeldung/working-equitation.php",
  "downloads/anmeldeformular-working-equitation-kurs-september-2026.pdf",
  "angebote/index.html",
  "veranstaltungen/index.html",
  "kontakt/index.html",
  "impressum/index.html",
  "datenschutz/index.html",
];

const failures = [];

async function isFile(relativePath) {
  try {
    return (await stat(path.join(outputRoot, relativePath))).isFile();
  } catch {
    return false;
  }
}

for (const relativePath of requiredFiles) {
  if (!(await isFile(relativePath))) {
    failures.push(`Missing export file: out/${relativePath}`);
  }
}

const [sourceHtaccess, exportedHtaccess] = await Promise.all([
  readFile(publicHtaccess, "utf8"),
  readFile(path.join(outputRoot, ".htaccess"), "utf8").catch(() => ""),
]);

if (sourceHtaccess !== exportedHtaccess) {
  failures.push("out/.htaccess does not match public/.htaccess");
}

for (const requiredDirective of [
  "Options -Indexes",
  "DirectoryIndex index.html",
  "RewriteRule ^admin$ /admin/ [R=301,L]",
]) {
  if (!sourceHtaccess.includes(requiredDirective)) {
    failures.push(`Missing Apache safeguard: ${requiredDirective}`);
  }
}

const sourcePdf = path.join(
  root,
  "public",
  "downloads",
  "anmeldeformular-working-equitation-kurs-september-2026.pdf",
);
const exportedPdf = path.join(
  outputRoot,
  "downloads",
  "anmeldeformular-working-equitation-kurs-september-2026.pdf",
);
const [sourcePdfBytes, exportedPdfBytes] = await Promise.all([
  readFile(sourcePdf),
  readFile(exportedPdf).catch(() => Buffer.alloc(0)),
]);
if (!sourcePdfBytes.equals(exportedPdfBytes)) {
  failures.push("Exported Working Equitation PDF differs from public source asset");
}

const workingEquitationPage = await readFile(
  path.join(
    outputRoot,
    "veranstaltungen",
    "working-equitation-manuel-heindl-september-2026",
    "index.html",
  ),
  "utf8",
).catch(() => "");
const pdfDownloadHref =
  'href="/downloads/anmeldeformular-working-equitation-kurs-september-2026.pdf"';
const pdfDownloadActionCount =
  workingEquitationPage.split(pdfDownloadHref).length - 1;
if (pdfDownloadActionCount !== 1) {
  failures.push(
    `Expected exactly one Working Equitation PDF download action, found ${pdfDownloadActionCount}`,
  );
}

for (const legacyFlatRoute of [
  "angebote.html",
  "veranstaltungen.html",
  "kontakt.html",
]) {
  if (await isFile(legacyFlatRoute)) {
    failures.push(
      `Unexpected flat route out/${legacyFlatRoute}; trailing-slash export is not active`,
    );
  }
}

async function findNonIndexHtml(directory, relativeDirectory = "") {
  const entries = await readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    const relativePath = path.join(relativeDirectory, entry.name);
    const absolutePath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      await findNonIndexHtml(absolutePath, relativePath);
      continue;
    }

    if (
      entry.name.endsWith(".html") &&
      entry.name !== "index.html" &&
      relativePath !== "404.html" &&
      relativePath !== "_not-found.html"
    ) {
      failures.push(
        `Unexpected flat HTML page: out/${relativePath}; clean routes must export as */index.html`,
      );
    }
  }
}

await findNonIndexHtml(outputRoot);

if (failures.length > 0) {
  console.error("Static export verification failed:\n");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  `Static export verified (${requiredFiles.length} required files, clean-route layout, Apache safeguards).`,
);
