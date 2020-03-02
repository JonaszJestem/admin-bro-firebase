import { FirestorePropertyType } from './schema';
import { PropertyType } from 'admin-bro';

export const isString = (value): value is string =>
  typeof value === 'string' || value instanceof String;

export const isAdminProperty = (
  property: FirestorePropertyType
): property is PropertyType => !['array', 'object'].includes(property);
