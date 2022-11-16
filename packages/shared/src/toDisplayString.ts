import { isString } from ".";

export const toDisplayString = (value): string => {
  return isString(value) ? value : value == null ? "" : String(value);
};
