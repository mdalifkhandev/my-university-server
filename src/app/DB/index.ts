import config from '../config';
import { USER_ROLE } from '../modiuls/users/user.constant';
import { User } from '../modiuls/users/user.model';

const superUser = {
  id: '0001',
  email: 'alifr2648@gmail.com',
  password: config.SUPER_ADMIN_PASSWORD,
  needsPasswordChange: false,
  role: USER_ROLE.superAdmin,
  status: 'in-progress',
  isDeleted: false,
};

const seedSuperAdmin = async () => {
  const isSuperAdminExits = await User.findOne({ role: USER_ROLE.superAdmin });

  if (!isSuperAdminExits) {
    await User.create(superUser);
  }
};

export default seedSuperAdmin;
