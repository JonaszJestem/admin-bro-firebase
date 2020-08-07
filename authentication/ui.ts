let firebaseApp;

export const authenticateWithFirebase = async (
  email: string,
  password: string
) => {
  await firebaseApp.auth().signInWithEmailAndPassword(email, password);
  return new Promise(resolve => {
    firebaseApp.auth().onAuthStateChanged(function(user) {
      resolve(user);
    });
  });
};

export const setupLogin = (app, firebase, firebaseConfig) => {
  firebaseApp = firebase;

  app.get('/register', (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Express App</title>
      <script src="https://cdn.firebase.com/libs/firebaseui/3.5.2/firebaseui.js"></script>
    <script src="https://www.gstatic.com/firebasejs/7.17.1/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/7.17.1/firebase-auth.js"></script>

    <link type="text/css" rel="stylesheet" href="https://cdn.firebase.com/libs/firebaseui/3.5.2/firebaseui.css" />
    <script>
      firebase.initializeApp(${JSON.stringify(firebaseConfig)});

      const ui = new firebaseui.auth.AuthUI(firebase.auth());
      ui.start('#app', {
        signInOptions: [
          firebase.auth.EmailAuthProvider.PROVIDER_ID, // Other providers don't need to be given as object.
        ],signInSuccessUrl: '/admin'
      });
    </script>
</head>
<body>
<div id="app"></div>
</body>
</html>
`);
  });
};
