
import type { NextAuthOptions } from "next-auth"
import { v4 as uuidv4 } from "uuid";
import GitHubProvider from "next-auth/providers/github";


export const options: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      authorization: {
        params: {
          scope: "read:user repo", // gives access to public + private repos
        },
      },
    }),
  ],

  callbacks: {
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

