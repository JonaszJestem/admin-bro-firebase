import FirestoreResource from './firestore/src/firestore.resource';
import FirestoreDatabase from './firestore/src/firestore.database';
import { Schema, SchemaItem } from './firestore/src/utils/schema';

export * from './functions/src/parse-files';
export * from './functions/src/plugin';
export * from './functions/src/routes';

export const FirestoreAdapter = {
  Resource: FirestoreResource,
  Database: FirestoreDatabase,
};

export * from './authentication/authentication';
export { Schema, SchemaItem };
