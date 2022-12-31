import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Create One User
  const user = await prisma.user.create({
    data: {
      name: "Kyle",
      email: "kyle@test.com",
      age: 27,
      UserPreference: {
        create: {
          emailUpdates: true,
        },
      },
    },
    include: {
      UserPreference: true,
    },
  });

  // Create Many Users
  const users = await prisma.user.createMany({
    data: [
      {
        name: "Kyle",
        email: "kyle@test.com",
        age: 27,
      },
      {
        name: "Sally",
        email: "sally@test.com",
        age: 32,
      },
    ],
  });

  // Find Unique User
  const getUser = await prisma.user.findUnique({
    where: {
      age_name: {
        name: "Kyle",
        age: 27,
      },
    },
  });

  // Find First User
  const findUsers = await prisma.user.findMany({
    where: {
      name: { in: ["Sally", "Kyle"] },
      age: { lt: 20 },
      email: { contains: "@test.com" },
      // above query is same as below
      AND: [
        { name: { in: ["Sally", "Kyle"] } },
        { age: { lt: 20 } },
        { email: { contains: "@test.com" } },
      ],
      // query relation
      UserPreference: {
        emailUpdates: true,
      },
      writtenPosts: {
        // every, some, none
        some: {
          title: "Test",
        },
      },
    },
    // get only first match
    distinct: ["name"],
    // pagination
    take: 2,
    skip: 1,
    // orderBy
    orderBy: {
      age: "asc",
    },
  });

  // Find Post
  const findPosts = await prisma.post.findMany({
    where: {
      author: {
        is: {
          age: { gt: 20 },
        },
        isNot: {
          email: { startsWith: "test" },
        },
      },
    },
  });

  // update user
  const updatedUser = await prisma.user.update({
    where: {
      age_name: {
        name: "Sally",
        age: 24,
      },
    },
    data: {
      email: "sally@test2.com",
      age: {
        // increment by 1
        increment: 1,
      },
      // update user preference
      UserPreference: {
        // create: {
        //   emailUpdates: true
        // }
        connect: {
          id: "123-456-789",
        },
        disconnect: true,
      },
    },
  });

  // delete users
  const deletedUsers = await prisma.user.delete({
    where: {
      age_name: {
        name: "Kyle",
        age: 24,
      },
    },
  });
}

main()
  .catch((e) => {
    console.error(e.message);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
