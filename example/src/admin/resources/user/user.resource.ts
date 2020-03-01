import { userSchema } from './user.schema';
import firebase from 'firebase';

export const createUserResource = (): unknown => ({
  collection: firebase.firestore().collection('Users'),
  schema: userSchema,
});
