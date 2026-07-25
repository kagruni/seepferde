(() => {
  const repositoryPath = "/cms-auth/repository/";
  const originalFetch = window.fetch.bind(window);
  let requestSequence = 0;

  function freshRepositoryUrl(value) {
    const url = new URL(value, window.location.href);
    if (
      url.origin !== window.location.origin ||
      !url.pathname.startsWith(repositoryPath)
    ) {
      return null;
    }

    requestSequence += 1;
    url.searchParams.set(
      "_cms_nc",
      `${Date.now().toString(36)}-${requestSequence.toString(36)}`,
    );
    return url;
  }

  window.fetch = (input, init) => {
    const method = String(
      init?.method ?? (input instanceof Request ? input.method : "GET"),
    ).toUpperCase();
    if (method !== "GET") return originalFetch(input, init);

    const inputUrl =
      input instanceof Request
        ? input.url
        : input instanceof URL
          ? input.href
          : String(input);
    const freshUrl = freshRepositoryUrl(inputUrl);
    if (!freshUrl) return originalFetch(input, init);

    const freshInput =
      input instanceof Request
        ? new Request(freshUrl, input)
        : input instanceof URL
          ? freshUrl
          : freshUrl.href;
    return originalFetch(freshInput, init);
  };
})();
