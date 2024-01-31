import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialProvider from "next-auth/providers/credentials";
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      authorization:
        "https://accounts.google.com/o/oauth2/auth?response_type=code&hd=vela.partners", // hosted domain is domain.com
    }),
    CredentialProvider({
      credentials: {
        email: {
          label: "email",
          type: "email",
          placeholder: "example@gmail.com",
        },
        password: {
          label: "email",
          type: "email",
          placeholder: "example@gmail.com",
        },
      },
      async authorize(credentials, req) {
        const user = { id: "1", name: "John", email: credentials?.email };
        if (user) {
          // Any object returned will be saved in `user` property of the JWT
          return user;
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null;

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      },
    }),
  ],
  pages: {
    signIn: "/", //sigin page
  },
  // callbacks: {
  //   async signIn({ account, profile }) {
  //     if(account && profile){
  //       if (account.provider === "google") {
  //         return profile.email && profile.email.endsWith("@webery.com")
  //       }else{
  //         return false
  //       }
  //     }
  //     return false

  //   },
  // }
};
