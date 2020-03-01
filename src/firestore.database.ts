import { BaseDatabase, BaseResource } from 'admin-bro';
import firebase from 'admin-bro-firebase/node_modules/firebase';
import Firestore = firebase.firestore.Firestore;

class FirestoreDatabase extends BaseDatabase {
  database: Firestore;

  constructor(database) {
    super(database);
    this.database = database;
  }

  static isAdapterFor(database): boolean {
    return database._firebaseApp;
  }

  //TODO: Implement mapping database to resources
  resources(): Array<BaseResource> {
    return [] as BaseResource[];
  }
}

export default FirestoreDatabase;
