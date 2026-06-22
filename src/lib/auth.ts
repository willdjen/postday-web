import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
    error: '/login',
    newUser: '/onboarding',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const user = await db.user.findUnique({
          where: { email: credentials.email },
        })
        if (!user || !user.password) return null
        const passwordMatch = await bcrypt.compare(credentials.password, user.password)
        if (!passwordMatch) return null
        return { id: user.id, name: user.name, email: user.email }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
    async session({ session, token }) {
      if (token.id) session.user.id = token.id as string
      return session
    },
  },
  events: {
    async createUser({ user }) {
      if (!user.id) return
      const workspace = await db.workspace.create({
        data: {
          name: `${user.name ?? 'My'} Workspace`,
          ownerId: user.id,
          members: {
            create: { userId: user.id, role: 'ADMIN', status: 'ACCEPTED' },
          },
          aiSettings: {
            create: { defaultLanguage: 'id', topics: [] },
          },
        },
      })
      await db.subscription.create({
        data: { workspaceId: workspace.id, plan: 'FREE', status: 'ACTIVE' },
      })
    },
  },
}

export default NextAuth(authOptions)
