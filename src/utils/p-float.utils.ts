export const pFloat = (value?: number | string) => {
  if (typeof value === "undefined") return NaN;
  if (typeof value === "number") return value;
  const parsed = parseFloat(value.replace(/,/g, "."));
  return parsed;
};
