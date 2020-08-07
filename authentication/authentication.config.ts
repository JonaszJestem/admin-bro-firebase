import firebase from 'firebase';

export const defaultAuthenticationConfig = {
  signInSuccessUrl: '/admin',
  signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
};
