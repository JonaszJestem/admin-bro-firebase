# AdminBro Firebase Adapter

Adapter for AdminBro which allows to add your own Firebase resources

### Prerequisites

You will need AdminBro panel configured for your project.
See [AdminBro Repository](https://github.com/SoftwareBrothers/admin-bro/) for instructions

You have to initialize your Firebase app before connecting resources to AdminBro.
That means you have to write something like:

```javascript
// Your firebase config see https://firebase.google.com/docs/web/setup
export const firebaseConfig = {
  // [...]
};

firebase.initializeApp(firebaseConfig);
```

### Installing

To connect adapter to your AdminBro instance all you need is to:

1. Register this adapter into AdminBro instance
2. Write resource with schema
3. Pass resource to AdminBro config object

Check `example` folder for full example application!
```javascript
import * as firebase from "firebase";
import AdminBroExpress from 'admin-bro-expressjs';
import AdminBroFirebase from 'admin-bro-firebase';
import AdminBro from 'admin-bro'; 

const setupAdmin = async expressApp => {
  AdminBro.registerAdapter(AdminBroFirebase);
  const adminBro = new AdminBro({
    branding: {
      companyName: 'Firebase example',
    },
    resources: [
      {
        collection: firebase.firestore().collection('Users'),
        schema: {
          name: 'string',
          isAdmin: 'boolean',
          location: 'mixed',
          attributes: {
            type: 'mixed',
            schema: {
              birthdate: 'date',
              height: 'number',
              eyeColors: 'mixed',
            },
          },
        },
      },
    ],
  });

  const router = await AdminBroExpress.buildRouter(adminBro);
  app.use(adminBro.options.rootPath, router);
};
```

## Authors

- **Jonasz Wiącek** - _Initial work_ - [JonaszJestem](https://github.com/JonaszJestem)

## Known Issues

- Arrays and nested object don't work properly
- Cannot pass whole firestore as `database` to `AdminBro`
- Works only for Firestore. Didn't check the Firebase Database yet.

Feel free to contribute.

## License

This project is licensed under the MIT License
