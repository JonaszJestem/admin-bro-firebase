import AdminBroExpress from 'admin-bro-expressjs';
import AdminBroFirebase from 'admin-bro-firebase';
import AdminBro from 'admin-bro';
import { Express } from 'express';
import { userResource } from './resources/user/user.resource';

AdminBro.registerAdapter(AdminBroFirebase);

const setupAdmin = async (app: Express): Promise<void> => {
  const adminBro = new AdminBro({
    branding: {
      companyName: 'Firebase example',
    },
    resources: {
      userResource,
    },
  });

  const router = await AdminBroExpress.buildRouter(adminBro);
  app.use(adminBro.options.rootPath, router);
};

export default setupAdmin;
