export * from "./toDisplayString";

export const extend = Object.assign;

export const EMPTY_OBJ = {};

export const isObject = (val: unknown): val is Record<any, any> =>
  val !== null && typeof val === "object";

export const hasChanged = (value: any, oldValue: any): boolean =>
  !Object.is(value, oldValue);

export const isString = (s) => typeof s === "string";

/**
 * 横杠转换成驼峰命名
 * @param str 转换的字符串
 * @param first 首字母是否要大写
 * @returns 转换后的驼峰命名
 */
export const camelize = (str: string, first: boolean) => {
  let result = str.replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ""));
  if (first) {
    result = result.replace(/^(\w)/g, (_, c) => (c ? c.toUpperCase() : ""));
  }
  return result;
};
