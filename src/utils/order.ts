import { getSchemaPaths } from './schema';
import { first } from 'lodash';

export const getFieldToSortBy = (options, schema): string => {
  const field = options.sort?.sortBy;
  const possiblePaths = getSchemaPaths(schema);
  return !possiblePaths.includes(field) ? first(possiblePaths) : field;
};
