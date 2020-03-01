import { BaseProperty, PropertyType } from 'admin-bro';
import { isString } from 'admin-bro-firebase/src/utils/type-guards';
import { FirestoreProperty } from '../firestore.property';

export type SchemaItem = {
  type?: PropertyType;
  isSortable?: boolean;
  position?: number;
  schema?: Schema;
};

const defaultSchemaItemOptions: SchemaItem = {
  type: 'string',
  isSortable: true,
};

export type Schema = { [path: string]: SchemaItem | PropertyType } | string[];

const convertToProperties = (schema: Schema): BaseProperty[] => {
  if (Array.isArray(schema)) {
    return schema.map(
      path => new FirestoreProperty({ path, ...defaultSchemaItemOptions })
    );
  }

  return Object.entries(schema).map(([path, schemaItem]) => {
    if (isString(schemaItem)) {
      return new FirestoreProperty({
        path,
        ...defaultSchemaItemOptions,
        type: schemaItem,
      });
    }
    return new FirestoreProperty({
      path,
      ...defaultSchemaItemOptions,
      ...schemaItem,
    });
  });
};

const withIdProperty = (properties: BaseProperty[]): BaseProperty[] => {
  return [
    ...properties,
    new FirestoreProperty({
      type: 'string',
      isId: true,
      path: 'id',
    }),
  ];
};

export const toProperties = (schema: Schema): BaseProperty[] => {
  return withIdProperty(convertToProperties(schema));
};

export const getSchemaPaths = (schema: Schema): string[] => {
  return Array.isArray(schema) ? schema : Object.keys(schema);
};
