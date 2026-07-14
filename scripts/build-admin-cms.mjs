import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import generateModule from "@babel/generator";
import { parse } from "@babel/parser";
import traverseModule from "@babel/traverse";
import * as t from "@babel/types";

const traverse = traverseModule.default ?? traverseModule;
const generate = generateModule.default ?? generateModule;
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = path.join(root, "public/admin/decap-cms.js");
const licenseOutputPath = path.join(root, "public/admin/editor-licenses.txt");
const sourceUrl = "https://unpkg.com/decap-cms@3.14.1/dist/decap-cms.js";
const sourceSha256 = "cb3946aa8a5f6750aec9b537719123715c4e1cabe45dc6d50a47c2ce24f01f77";
const licenseSources = [
  {
    url: "https://unpkg.com/decap-cms@3.14.1/LICENSE",
    sha256: "0a9da20eba6086aa19af2c1d1c3e280e762d7522afe01476f616e514656ab379",
  },
  {
    url: "https://unpkg.com/decap-cms@3.14.1/dist/decap-cms.js.LICENSE.txt",
    sha256: "aafaeea70424ffe09cb599f16c68bf8f1f15affd4b67428e975cb668573acee1",
  },
];
const expected = {
  notice: 8,
  confirm: 13,
  prompt: 5,
  beforeUnload: 2,
  authFrame: 1,
};
const checkOnly = process.argv.includes("--check");
const sourceFlag = process.argv.indexOf("--source");
const localSource = sourceFlag === -1 ? null : process.argv[sourceFlag + 1];

function occurrences(source, fragment) {
  return source.split(fragment).length - 1;
}

function assertPatchedBundle(source) {
  const failures = [];

  if (!source.includes(`source-sha256:${sourceSha256}`)) {
    failures.push("Die Prüfsumme des gepinnten Ausgangsbundles fehlt.");
  }

  for (const nativeMethod of ["alert", "confirm", "prompt"]) {
    if (new RegExp(`window\\.${nativeMethod}\\s*\\(`).test(source)) {
      failures.push(`window.${nativeMethod} ist noch enthalten.`);
    }
    if (new RegExp(`(?<![\\w$.])${nativeMethod}\\s*\\(`).test(source)) {
      failures.push(`Der globale Aufruf ${nativeMethod}(…) ist noch enthalten.`);
    }
  }

  if (/window\.(?:add|remove)EventListener\(\s*["']beforeunload["']/.test(source)) {
    failures.push("Der native beforeunload-Dialog ist noch registriert.");
  }

  for (const method of ["notice", "confirm", "prompt"]) {
    const count = occurrences(source, `window.CMSDialog.${method}`);
    if (count !== expected[method]) {
      failures.push(
        `CMSDialog.${method}: ${count} Fundstellen statt ${expected[method]}.`,
      );
    }
  }

  if (occurrences(source, "window.CMSAuth.open") !== expected.authFrame) {
    failures.push("Die Anmeldung wird nicht zuverlässig im CMS-Overlay geöffnet.");
  }

  if (failures.length) {
    throw new Error(`CMS-Bundle-Prüfung fehlgeschlagen:\n- ${failures.join("\n- ")}`);
  }
}

function isWindowMethod(node, method) {
  return (
    t.isMemberExpression(node) &&
    !node.computed &&
    t.isIdentifier(node.object, { name: "window" }) &&
    t.isIdentifier(node.property, { name: method })
  );
}

function isUnboundGlobalMethod(callPath, method) {
  return (
    t.isIdentifier(callPath.node.callee, { name: method }) &&
    !callPath.scope.hasBinding(method)
  );
}

function cmsDialogMethod(method) {
  return t.memberExpression(
    t.memberExpression(t.identifier("window"), t.identifier("CMSDialog")),
    t.identifier(method),
  );
}

function cmsAuthMethod(method) {
  return t.memberExpression(
    t.memberExpression(t.identifier("window"), t.identifier("CMSAuth")),
    t.identifier(method),
  );
}

function makeContainingFunctionAsync(callPath, method) {
  const functionPath = callPath.getFunctionParent();
  if (!functionPath) {
    throw callPath.buildCodeFrameError(
      `window.${method} steht außerhalb einer Funktion und kann nicht asynchron ersetzt werden.`,
    );
  }

  if (functionPath.isClassMethod({ kind: "constructor" })) {
    throw callPath.buildCodeFrameError(
      `window.${method} steht in einem Konstruktor und kann nicht asynchron ersetzt werden.`,
    );
  }

  functionPath.node.async = true;
}

async function readOriginalBundle() {
  if (localSource) return readFile(path.resolve(localSource), "utf8");

  const response = await fetch(sourceUrl, { redirect: "follow" });
  if (!response.ok) {
    throw new Error(`Gepinntes CMS-Bundle konnte nicht geladen werden: HTTP ${response.status}`);
  }
  return response.text();
}

async function fetchVerifiedText({ url, sha256 }) {
  const response = await fetch(url, { redirect: "follow" });
  if (!response.ok) {
    throw new Error(`Lizenzdatei konnte nicht geladen werden: HTTP ${response.status}`);
  }

  const source = await response.text();
  const actualSha256 = createHash("sha256").update(source).digest("hex");
  if (actualSha256 !== sha256) {
    throw new Error(`Lizenzdatei hat eine unerwartete Prüfsumme (${actualSha256}).`);
  }
  return source;
}

async function assertLicenseFile() {
  const source = await readFile(licenseOutputPath, "utf8");
  for (const { sha256 } of licenseSources) {
    if (!source.includes(`source-sha256:${sha256}`)) {
      throw new Error("Lizenzdatei ist nicht auf dem erwarteten Stand.");
    }
  }
}

if (checkOnly) {
  assertPatchedBundle(await readFile(outputPath, "utf8"));
  await assertLicenseFile();
  console.log("CMS-Bundle enthält keine nativen Browser-Dialoge.");
  process.exit(0);
}

const original = await readOriginalBundle();
const actualSha256 = createHash("sha256").update(original).digest("hex");
if (actualSha256 !== sourceSha256) {
  throw new Error(
    `Das CMS-Ausgangsbundle hat eine unerwartete Prüfsumme (${actualSha256}).`,
  );
}

const ast = parse(original, {
  sourceType: "script",
  allowReturnOutsideFunction: true,
});
const transformed = {
  notice: 0,
  confirm: 0,
  prompt: 0,
  beforeUnload: 0,
  authFrame: 0,
};

traverse(ast, {
  CallExpression(callPath) {
    const { node } = callPath;

    if (
      (isWindowMethod(node.callee, "addEventListener") ||
        isWindowMethod(node.callee, "removeEventListener")) &&
      t.isStringLiteral(node.arguments[0], { value: "beforeunload" })
    ) {
      transformed.beforeUnload += 1;
      callPath.replaceWith(t.unaryExpression("void", t.numericLiteral(0)));
      return;
    }

    if (
      isWindowMethod(node.callee, "open") &&
      t.isStringLiteral(node.arguments[1], { value: "Netlify Authorization" })
    ) {
      transformed.authFrame += 1;
      node.callee = cmsAuthMethod("open");
      return;
    }

    if (
      isWindowMethod(node.callee, "alert") ||
      isUnboundGlobalMethod(callPath, "alert")
    ) {
      transformed.notice += 1;
      node.callee = cmsDialogMethod("notice");
      return;
    }

    for (const method of ["confirm", "prompt"]) {
      if (
        !isWindowMethod(node.callee, method) &&
        !isUnboundGlobalMethod(callPath, method)
      ) {
        continue;
      }

      transformed[method] += 1;
      makeContainingFunctionAsync(callPath, method);
      callPath.replaceWith(
        t.awaitExpression(t.callExpression(cmsDialogMethod(method), node.arguments)),
      );
      return;
    }
  },
});

for (const [method, expectedCount] of Object.entries(expected)) {
  if (transformed[method] !== expectedCount) {
    throw new Error(
      `${method}: ${transformed[method]} Fundstellen transformiert, erwartet waren ${expectedCount}.`,
    );
  }
}

const generated = generate(ast, {
  comments: false,
  compact: true,
  minified: true,
  jsescOption: { minimal: true },
}).code;
const banner =
  `/* See-Pferde CMS bundle | Decap CMS 3.14.1 | generated, do not edit | ` +
  `source-sha256:${sourceSha256} */\n`;
const output = `${banner}${generated}\n`;
const licenseTexts = await Promise.all(licenseSources.map(fetchVerifiedText));
const licenseOutput = licenseSources
  .map(
    ({ url, sha256 }, index) =>
      `Source: ${url}\nsource-sha256:${sha256}\n\n${licenseTexts[index].trim()}\n`,
  )
  .join("\n--------------------------------------------------------------------------------\n\n");

assertPatchedBundle(output);
await writeFile(outputPath, output, "utf8");
await writeFile(licenseOutputPath, licenseOutput, "utf8");
console.log(
  `CMS-Bundle geschrieben: ${path.relative(root, outputPath)} ` +
    `(${transformed.confirm} Bestätigungen, ${transformed.prompt} Eingaben, ` +
    `${transformed.notice} Hinweise, ${transformed.beforeUnload} Unload-Hooks und ` +
    `${transformed.authFrame} Anmelde-Popup ersetzt).`,
);
