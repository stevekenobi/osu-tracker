export function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

export function range(start: number, stop: number, step = 1) {
  return Array(Math.ceil((stop - start) / step))
    .fill(start)
    .map((x, y) => x + y * step);
}

export function createQuery(query: any): string {
  if (query)
    return `?${Object.keys(query)
      .map((x) => `${x}=${query[x]}`)
      .join('&')}`;

  return '';
}
