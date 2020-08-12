import { defaultAuthenticationConfig } from './authentication.config';

export const loginComponent = (
  firebaseConfig: Record<string, unknown>,
  authConfig?: Record<string, unknown>
): string => `
<script src="https://www.gstatic.com/firebasejs/7.17.1/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/7.17.1/firebase-auth.js"></script>
<script src="https://cdn.firebase.com/libs/firebaseui/3.5.2/firebaseui.js"></script>
<link type="text/css" rel="stylesheet" href="https://cdn.firebase.com/libs/firebaseui/3.5.2/firebaseui.css" />
    
<script>
    firebase.initializeApp(${JSON.stringify(firebaseConfig)});

    const ui = new firebaseui.auth.AuthUI(firebase.auth());
    ui.start('#app', ${JSON.stringify(
      authConfig ?? defaultAuthenticationConfig
    )});
</script>
`;
