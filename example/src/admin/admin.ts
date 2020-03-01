import AdminBroExpress from 'admin-bro-expressjs';
import AdminBroFirebase from 'admin-bro-firebase';
import AdminBro from 'admin-bro';
import { Express } from 'express';
import { createUserResource } from './resources/user/user.resource';

const setupAdmin = async (app: Express): Promise<void> => {
  AdminBro.registerAdapter(AdminBroFirebase);
  const adminBro = new AdminBro({
    branding: {
      companyName: 'Firebase example',
    },
    resources: [createUserResource()],
  });

  const router = await AdminBroExpress.buildRouter(adminBro);
  app.use(adminBro.options.rootPath, router);
};

export default setupAdmin;
