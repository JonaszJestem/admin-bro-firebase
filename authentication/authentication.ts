import { loginPage } from './login.page';
import { loginComponent } from './login.component';
import firebaseInstance from 'firebase';
let firebaseApp;

const getUserData = async (): Promise<Record<string, unknown>> =>
  new Promise((resolve, reject) => {
    const rejectLogin = setTimeout(reject, 5000);
    firebaseApp.auth().onAuthStateChanged(function (user) {
      clearTimeout(rejectLogin);
      resolve(user);
    });
  });

export const authenticateWithFirebase = async (
  email: string,
  password: string
): Promise<Record<string, unknown> | null> => {
  try {
    await firebaseApp.auth().signInWithEmailAndPassword(email, password);
    const user = await getUserData();
    return user;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const setupLogin = (
  app,
  {
    firebase,
    firebaseConfig,
    authenticationConfig,
    withRegisterPage,
  }: {
    firebase: typeof firebaseInstance;
    firebaseConfig: Record<string, unknown>;
    authenticationConfig?: Record<string, unknown>;
    withRegisterPage?: boolean;
  }
) => {
  firebaseApp = firebase;

  if (withRegisterPage) {
    app.get('/register', (req, res) => {
      res.send(loginPage(loginComponent(firebaseConfig, authenticationConfig)));
    });
  }
};
