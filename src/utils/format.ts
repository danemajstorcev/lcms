export function formatCurrency(value: number): string {
  return "$" + value.toLocaleString("en-US");
}

export function formatMiles(miles: number): string {
  return miles.toLocaleString("en-US") + " mi";
}

export function calcProfit(rate: number, pay: number): number {
  return rate - pay;
}

export function calcMargin(rate: number, pay: number): number {
  if (rate === 0) return 0;
  return parseFloat((((rate - pay) / rate) * 100).toFixed(1));
}

export function marginColor(margin: number): string {
  if (margin >= 20) return "var(--clr-success)";
  if (margin >= 10) return "var(--clr-warn)";
  return "var(--clr-danger)";
}

export function findById<T extends { id: number }>(
  arr: T[],
  id: number,
): T | undefined {
  return arr.find((item) => item.id === id);
}

export function nextId<T extends { id: number }>(arr: T[]): number {
  return arr.length === 0 ? 1 : Math.max(...arr.map((x) => x.id)) + 1;
}
