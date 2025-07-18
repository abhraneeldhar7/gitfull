import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    email: string;
    avatar_url: string;
    login: string;
    role?: string;
  }

  interface Session {
    user: {
      id: string;
      role?: string;
      accessToken: string;
      avatar_url: string;
      login: string;
      email:string;
    };
  }

  interface JWT {
    id: string;
    role?: string;
    accessToken?: string;
  }
}
