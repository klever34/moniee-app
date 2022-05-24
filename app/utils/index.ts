export * from './scalers';
export * from './validation';
export * from './transformCase';

export const flattenObject = (
  object: {[key: string]: any},
  prefix = '',
  seperator = '-',
) => {
  let result: {[key: string]: string} = {};
  Object.keys(object).forEach(name => {
    const key = `${prefix}${prefix ? seperator : ''}${name}`;
    let value = object[name];
    if (typeof value === 'string') {
      result[key] = value;
    } else if (typeof value === 'object') {
      result = {
        ...result,
        ...flattenObject(value, key),
      };
    }
  });
  return result;
};
