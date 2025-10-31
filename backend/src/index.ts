import { Post } from "./../node_modules/.prisma/client/index.d";
import { createYoga, createSchema } from "graphql-yoga";
import { createServer } from "http";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();
const prisma = new PrismaClient();

const typeDefs = /* GraphQL */ `
  type User {
    id: ID!
    email: String!
    name: String
    createdAt: String
    posts: [Post!]!
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    published: Boolean!
    createdAt: String!
    author: User!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    hello: String!
    posts: [Post!]!
    myPosts: [Post!]!
  }

  type Mutation {
    register(name: String, email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    createPost(title: String!, content: String!): Post!
    updatePost(id: Int!, title: String!, content: String!): Post!
    deletePost(id: Int!): Post!
    publishPost(id: Int!, published: Boolean!): Post!
  }
`;

const resolvers = {
  Query: {
    hello: () => "Hello DevConnect 🚀",
    // همه پست‌ها
    posts: async () => {
      return await prisma.post.findMany({
        where: { published: true },
        include: { author: true },
        orderBy: { createdAt: "desc" },
      });
    },
    // فقط پست‌های کاربر لاگین‌شده
    myPosts: async (_: any, __: any, context: any) => {
      const authHeader = context.request.headers.get("authorization");
      if (!authHeader) throw new Error("Unauthorized");

      const token = authHeader.replace("Bearer ", "");
      const decoded: any = jwt.verify(token, "MY_SECRET_KEY");

      const posts = await prisma.post.findMany({
        where: { authorId: decoded.userId },
        include: { author: true },
        orderBy: { createdAt: "desc" },
      });

      return posts;
    },
  },
  Mutation: {
    register: async (_: any, args: any) => {
      const { name, email, password } = args;
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) throw new Error("Email already registered!");
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { name, email, password: hashedPassword },
      });
      const token = jwt.sign({ userId: user.id }, "MY_SECRET_KEY", {
        expiresIn: "7d",
      });
      return { token, user };
    },

    login: async (_: any, args: any) => {
      const { email, password } = args;
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) throw new Error("User not found");
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error("Invalid password");
      const token = jwt.sign({ userId: user.id }, "MY_SECRET_KEY", {
        expiresIn: "7d",
      });
      return { token, user };
    },
    createPost: async (_: any, args: any, context: any) => {
      const { title, content } = args;

      // بررسی توکن JWT
      const authHeader = context.request.headers.get("authorization");
      if (!authHeader) throw new Error("Unauthorized");

      const token = authHeader.replace("Bearer ", "");
      const decoded: any = jwt.verify(token, "MY_SECRET_KEY");
      const userId = decoded.userId;

      // ساخت پست جدید
      const post = await prisma.post.create({
        data: {
          title,
          content,
          authorId: userId,
        },
        include: { author: true },
      });

      return post;
    },
    updatePost: async (_: any, args: any, context: any) => {
  const { id, title, content } = args;
  const authHeader = context.request.headers.get("authorization");
  if (!authHeader) throw new Error("Unauthorized");

  const token = authHeader.replace("Bearer ", "");
  const decoded: any = jwt.verify(token, "MY_SECRET_KEY");
  const userId = decoded.userId;

  const post = await prisma.post.findUnique({ where: { id } });
  if (!post || post.authorId !== userId)
    throw new Error("You can only edit your own posts!");

  return await prisma.post.update({
    where: { id },
    data: { title, content },
    include: { author: true },
  });
},

deletePost: async (_: any, args: any, context: any) => {
  const { id } = args;
  const authHeader = context.request.headers.get("authorization");
  if (!authHeader) throw new Error("Unauthorized");

  const token = authHeader.replace("Bearer ", "");
  const decoded: any = jwt.verify(token, "MY_SECRET_KEY");
  const userId = decoded.userId;

  const post = await prisma.post.findUnique({ where: { id } });
  if (!post || post.authorId !== userId)
    throw new Error("You can only delete your own posts!");

  await prisma.post.delete({ where: { id } });
  return post;
},

publishPost: async (_: any, args: any, context: any) => {
  const { id, published } = args;
  const authHeader = context.request.headers.get("authorization");
  if (!authHeader) throw new Error("Unauthorized");

  const token = authHeader.replace("Bearer ", "");
  const decoded: any = jwt.verify(token, "MY_SECRET_KEY");
  const userId = decoded.userId;

  const post = await prisma.post.findUnique({ where: { id } });
  if (!post || post.authorId !== userId)
    throw new Error("You can only publish your own posts!");

  return await prisma.post.update({
    where: { id },
    data: { published },
    include: { author: true },
  });
},
  },
};

const yoga = createYoga({
  schema: createSchema({
    typeDefs,
    resolvers,
  }),
  context: ({ request }) => ({ request }),
});

const server = createServer(yoga);
server.listen(4000, () => {
  console.log("✅ Server running at http://localhost:4000/graphql");
});
