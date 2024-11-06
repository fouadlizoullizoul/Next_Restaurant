import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { getServerSession, NextAuthOptions, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google"
import prisma from "./connect";
import GithubProvider from "next-auth/providers/github"

declare module "next-auth"{
    interface Session{
        user:User &{
            isAdmin: boolean
        }
    }
}
declare module "next-auth/jwt"{
    interface JWT{
            isAdmin: boolean
        
    }
}

export const authOptions:NextAuthOptions={
    session:{
        strategy:"jwt"
    },
    providers:[
        GoogleProvider({
            clientId:process.env.GOOGLE_CLIENT_ID !,
            clientSecret:process.env.GOOGLE_CLIENT_SECRET !,
            httpOptions:{
                timeout:15000,
            }
        }),
        GithubProvider({
            clientId:process.env.AUTH_GITHUB_ID!,
            clientSecret:process.env.AUTH_GITHUB_SECRET!,
            httpOptions:{
                timeout:15000,
            }
        })
    ],
    adapter: PrismaAdapter(prisma),
    callbacks:{
        async session({session,token}) {
            if(token){
                session.user.isAdmin=token.isAdmin
            }
            return session
        },
        async jwt({token}) {
            const userInDb=await prisma.user.findUnique({
                where:{
                    email:token.email!
                }
            });
            token.isAdmin=userInDb?.isAdmin!;
            return token;
        }
    }
}
export const getAuthSession = ()=>getServerSession(authOptions)