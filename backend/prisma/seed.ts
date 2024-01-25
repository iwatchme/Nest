import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      username: 'alice',
      password: '123456',
      email: 'xxx@xxx.com',
      is_admin: true,
      nick_name: 'Alice',
      phone_number: '12345678901',

      UserRoles: {
        create: {
          role: {
            create: {
              role_name: 'admin',
              RolePermissions: {
                create: {
                  perm: {
                    create: {
                      code: 'cccc',
                      description: '访问 cccc 接口',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  const user2 = await prisma.user.create({
    data: {
      username: 'jack',
      password: '3333333',
      email: 'xxx@xxx222.com',
      is_admin: true,
      nick_name: 'ssss',
      phone_number: '1234567833333',

      UserRoles: {
        create: {
          role: {
            create: {
              role_name: 'user',
              RolePermissions: {
                create: {
                  perm: {
                    create: {
                      code: 'ddddd',
                      description: '访问 ddddd 接口',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  console.log({ user, user2 });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch((e) => {
    console.log(e);
    console.error(e);
    process.exit(1);
  });
