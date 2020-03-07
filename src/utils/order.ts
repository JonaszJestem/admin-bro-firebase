import { getSchemaPaths, Schema } from './schema';
import { first } from 'lodash';
import firebase from 'firebase';
import Query = firebase.firestore.Query;

export const getFieldToSortBy = (options, schema): string => {
  const field = options.sort.sortBy;
  const possiblePaths = getSchemaPaths(schema);
  return !possiblePaths.includes(field) ? first(possiblePaths) : field;
};

export const orderDecorator = (
  options: {
    limit?: number;
    offset?: number;
    sort?: { sortBy?: string; direction?: 'asc' | 'desc' };
  } = {
    offset: 0,
  },
  schema: Schema
): Function => {
  return (query: Query<DocumentType>): Query<DocumentType> => {
    const fieldToSortBy = getFieldToSortBy(options, schema);
    return query;
  };
};
