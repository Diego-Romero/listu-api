import { hashPassword } from '../userService';

export const seedingUserEmail = 'user@mail.com';
export const seedingUserPassword = 'password';

interface User {
  name: string;
  email: string;
  password: string;
}

async function seedUsers(): Promise<User[]> {
  const password = await hashPassword(seedingUserPassword);
  return [
    {
      name: 'Diego',
      email: seedingUserEmail,
      password,
    },
    {
      name: 'Diego',
      email: 'testing1@gmail.com',
      password,
    },
  ];
}

export default seedUsers;
