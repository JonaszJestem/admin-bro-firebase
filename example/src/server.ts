import express from 'express';
import setupAdmin from './admin/admin';
import firebase from 'firebase';
import { firebaseConfig } from './firebase.config';

const app = express();
const port = 3000;

const run = async (): Promise<void> => {
  firebase.initializeApp(firebaseConfig);

  await setupAdmin(app);
  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
};

run();
