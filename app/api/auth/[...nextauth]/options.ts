
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
    async jwt({ token, account }) {
      // Attach access token on initial sign in
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },

    async session({ session, token }) {
      
      if (token) {
        session.user.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  
  // pages: {
  //   signIn: "/auth/signin",
  //   error: "/auth/error",
  // },

  secret: process.env.NEXTAUTH_SECRET,
}

