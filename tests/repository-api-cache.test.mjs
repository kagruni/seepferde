import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const source = await readFile(
  new URL("../public/admin/repository-api.js", import.meta.url),
  "utf8",
);

function loadRepositoryApi() {
  const requests = [];
  const window = {
    location: {
      href: "https://see-pferde-zwenkau.de/admin/",
      origin: "https://see-pferde-zwenkau.de",
    },
    fetch(input, init) {
      requests.push({ input, init });
      return Promise.resolve({ ok: true });
    },
  };

  vm.runInNewContext(source, { Request, URL, window });
  return { requests, window };
}

test("CMS repository GET requests receive unique cache nonces", async () => {
  const { requests, window } = loadRepositoryApi();
  const endpoint =
    "https://see-pferde-zwenkau.de/cms-auth/repository/repos/kagruni/seepferde/pulls?base=main";

  await window.fetch(endpoint);
  await window.fetch(endpoint);

  const first = new URL(requests[0].input);
  const second = new URL(requests[1].input);
  assert.equal(first.searchParams.get("base"), "main");
  assert.ok(first.searchParams.get("_cms_nc"));
  assert.notEqual(
    first.searchParams.get("_cms_nc"),
    second.searchParams.get("_cms_nc"),
  );
});

test("non-GET and non-repository requests are unchanged", async () => {
  const { requests, window } = loadRepositoryApi();
  const repositoryEndpoint =
    "https://see-pferde-zwenkau.de/cms-auth/repository/repos/kagruni/seepferde/git/refs";
  const publicEndpoint = "https://see-pferde-zwenkau.de/admin/config.yml";

  await window.fetch(repositoryEndpoint, { method: "POST" });
  await window.fetch(publicEndpoint);

  assert.equal(requests[0].input, repositoryEndpoint);
  assert.equal(requests[1].input, publicEndpoint);
});

test("repository Request headers survive cache busting", async () => {
  const { requests, window } = loadRepositoryApi();
  const request = new Request(
    "https://see-pferde-zwenkau.de/cms-auth/repository/repos/kagruni/seepferde",
    { headers: { Authorization: "Bearer test-session" } },
  );

  await window.fetch(request);

  assert.ok(requests[0].input instanceof Request);
  assert.equal(
    requests[0].input.headers.get("Authorization"),
    "Bearer test-session",
  );
  assert.ok(new URL(requests[0].input.url).searchParams.get("_cms_nc"));
});
