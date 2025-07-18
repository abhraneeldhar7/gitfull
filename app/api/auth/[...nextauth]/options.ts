
import type { NextAuthOptions } from "next-auth"
import { v4 as uuidv4 } from "uuid";
import GitHubProvider from "next-auth/providers/github";
import { createUser, getUserDetails } from "@/app/actions/mongodbFunctions";
import { userType } from "@/lib/types";
import { createUserBugspot } from "@/app/actions/securedFunction";


export const options: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      authorization: {
        params: {
          scope: "read:user repo user:email",
        },
      },
    }),
  ],

  callbacks: {
    async signIn({ user }) {
      const existingUser = await getUserDetails(user.email);
      if (!existingUser) {
        console.log("making user")
        const newUser: userType = {
          id: user.id as string,
          name: user.name as string,
          email: user.email as string,
          image: user.image as string,
          tokens: 50000
        }
        await createUser(newUser);
        await createUserBugspot(newUser);
      }
      return true;
    },

    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.accessToken = account.access_token;
        token.login = (profile as any).login;
        token.avatar_url = (profile as any).avatar_url;
      }

      return token;
    },

    async session({ session, token }) {
      session.user.accessToken = token.accessToken as string;
      session.user.login = token.login as string;
      session.user.avatar_url = token.avatar_url as string;
      return session;
    }
  },

  secret: process.env.NEXTAUTH_SECRET,
}

