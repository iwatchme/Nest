import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';
const prisma = new PrismaClient();

export function md5(str) {
  const hash = crypto.createHash('md5');
  hash.update(str);
  return hash.digest('hex');
}

async function main() {
  const user1 = await prisma.user.create({
    data: {
      username: 'alice',
      password: md5('123456'),
      email: 'yangxiao82739671@gmail.com',
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
      password: md5('3333333'),
      email: 'yangxiao621@126.com',
      is_admin: false,
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

  const room1 = await prisma.meetingRoom.create({
    data: {
      name: '木星',
      location: 'location1',
      capacity: 10,
      equipment: '白板',
      description: '木星会议室',
    },
  });

  const room2 = await prisma.meetingRoom.create({
    data: {
      name: '金星',
      location: 'location2',
      capacity: 5,
      equipment: '投影仪',
      description: '金星会议室',
    },
  });

  const room3 = await prisma.meetingRoom.create({
    data: {
      name: '水星',
      location: 'location3',
      capacity: 15,
      equipment: '',
      description: '水星会议室',
    },
  });

  const booking1 = await prisma.booking.create({
    data: {
      room_id: room1.id,
      user_id: user1.id,
      start_time: new Date('2021-09-01T08:00:00'),
      end_time: new Date('2021-09-02T08:00:00'),
      note: '预定 1',
      status: 'approved',
    },
  });

  const booking2 = await prisma.booking.create({
    data: {
      room_id: room2.id,
      user_id: user2.id,
      start_time: new Date('2021-09-02T08:00:00'),
      end_time: new Date('2021-09-03T08:00:00'),
      note: '预定 2',
      status: 'approved',
    },
  });

  console.log({ room1, room2, room3 });
  console.log({ user1, user2 });
  console.log({ booking1, booking2 });
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
