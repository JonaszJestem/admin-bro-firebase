import { FirestorePropertyType, ReferenceSchemaItem } from './schema';
import { PropertyType } from '@tirrilee/admin-bro';

export const isString = (value): value is string =>
  typeof value === 'string' || value instanceof String;

export const isAdminProperty = (
  property: FirestorePropertyType
): property is PropertyType => !['array', 'object'].includes(property);

export const isReference = (
  property: unknown
): property is ReferenceSchemaItem => {
  const guessedReference = property as ReferenceSchemaItem;
  return guessedReference && !!guessedReference.referenceName;
};
