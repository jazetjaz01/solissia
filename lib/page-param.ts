// Page number of a /…/page/[page] URL: an integer ≥ 2 (page 1 is the URL without /page).
export const parsePageParam = (value: string) =>
  /^[1-9]\d*$/.test(value) && Number(value) >= 2 ? Number(value) : null;

// Params to prerender: pages 2 to N. cacheComponents requires at least one:
// with a single page, "2" is prerendered and returns a 404.
export const pageParams = (totalPages: number) =>
  totalPages > 1
    ? Array.from({ length: totalPages - 1 }, (_, i) => ({ page: String(i + 2) }))
    : [{ page: "2" }];
