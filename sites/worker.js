const worker = {
  async fetch(request, env) {
    const url = new URL(request.url);
    let response = await env.ASSETS.fetch(request);

    if (response.status !== 404 || url.pathname.includes(".")) {
      return response;
    }

    const fallbackUrl = new URL(
      url.pathname.endsWith("/")
        ? `${url.pathname}index.html`
        : `${url.pathname}/index.html`,
      url,
    );

    response = await env.ASSETS.fetch(new Request(fallbackUrl, request));
    return response;
  },
};

export default worker;
