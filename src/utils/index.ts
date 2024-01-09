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

export function getYearsUntilToday(): string[] {
  const endDate = new Date().getFullYear();
  const years: string[] = [];

  for (let i = 2007; i <= endDate; i++) {
    years.push(i.toString());
  }
  return years;
}
