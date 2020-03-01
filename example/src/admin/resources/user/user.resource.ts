import { userSchema } from './user.schema';
import firebase from 'firebase';

export const userResource = {
  resource: firebase.firestore().collection('Users'),
  schema: userSchema,
};
