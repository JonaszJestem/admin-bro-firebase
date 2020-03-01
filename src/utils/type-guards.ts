export const isString = (value): value is string =>
  typeof value === 'string' || value instanceof String;
