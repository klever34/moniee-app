import {snakeCase} from 'snake-case';

/**
 * Convert any given object's keys to snake_case
 *
 * @param obj object whose keys you want to transform
 */
export const keysToSnakeCase = (obj: any) => {
  const objKeys = Object.keys(obj);
  const result: any = {};

  objKeys.forEach(key => {
    result[snakeCase(key)] = obj[key];
  });

  return result;
};
