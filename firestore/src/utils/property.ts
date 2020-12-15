import { FirestorePropertyType } from './schema';
import { PropertyType } from '@tirrilee/admin-bro';
import { isAdminProperty } from './type-guards';

export const convertToAdminProperty = (
  property: FirestorePropertyType
): PropertyType => {
  if (isAdminProperty(property)) {
    return property;
  }
  return 'mixed';
};
