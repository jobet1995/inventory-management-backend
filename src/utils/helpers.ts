/**
 * Removes undefined values from an object
 */
export const cleanObject = (obj: Record<string, unknown>) => {
  const newObj = { ...obj };
  Object.keys(newObj).forEach((key) => {
    if (newObj[key] === undefined) {
      delete newObj[key];
    }
  });
  return newObj;
};

/**
 * Capitalizes the first letter of a string
 */
export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
