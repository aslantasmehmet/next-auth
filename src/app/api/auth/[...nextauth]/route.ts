import NextAuth from "next-auth";
import { AuthOptions } from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";
// 12Factor App integration
import { config } from "@/lib/config";
import { logger } from "@/lib/logger";
// Role-based authorization
import { RoleServiceFactory } from "@/services/RoleService";
import { UserRole, ExtendedUser } from "@/types/auth";

/**
 * NextAuth yapılandırması
 * Auth0 sağlayıcısı ile kimlik doğrulama sağlanıyor.
 * Oturum yönetimi JWT (JSON Web Token) ile yapılıyor.
 * Rol tabanlı yetkilendirme sistemi entegre edildi.
 */
const authOptions: AuthOptions = {
  providers: [
    Auth0Provider({
      clientId: config.auth0.clientId,
      clientSecret: config.auth0.clientSecret,
      issuer: config.auth0.issuer,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account, profile, user }) {
      if (account && user?.email) {
        // Role service ile kullanıcı rolünü belirle
        const roleService = RoleServiceFactory.getInstance();
        const userRole = await roleService.getUserRole(user.email);
        const permissions = roleService.getPermissions(userRole);

        // Log successful authentication with role
        logger.authSuccess(
          profile?.sub || user.email,
          account.provider,
          { role: userRole }
        );
        
        // JWT token'a rol bilgilerini ekle
        token.accessToken = account.access_token;
        token.role = userRole;
        token.permissions = permissions;
        token.isActive = true;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.role) {
        // Session'a rol bilgilerini ekle
        const extendedUser: ExtendedUser = {
          ...session.user,
          role: token.role,
          permissions: token.permissions,
          isActive: token.isActive,
          lastLogin: new Date(),
        };
        
        session.user = extendedUser;
        session.accessToken = token.accessToken;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      try {
        const roleService = RoleServiceFactory.getInstance();
        const userRole = user.email ? await roleService.getUserRole(user.email) : 'user';
        
        logger.info('Sign-in attempt with role', {
          provider: account?.provider,
          email: user.email,
          role: userRole,
          event: 'signin_attempt'
        });
        return true;
      } catch (error) {
        logger.authFailed(
          error instanceof Error ? error.message : 'Unknown error',
          account?.provider || 'unknown'
        );
        return false;
      }
    },
  },
  pages: {
    signIn: "/login",
  },
  // 12Factor App - logging and monitoring
  logger: {
    error(code, metadata) {
      logger.error('NextAuth Error', { code, metadata });
    },
    warn(code) {
      logger.warn('NextAuth Warning', { code });
    },
    debug(code, metadata) {
      logger.debug('NextAuth Debug', { code, metadata });
    },
  },
};

const handler = NextAuth(authOptions);

// Next.js 14 App Router için GET ve POST isteklerini yönlendiriyoruz
export { handler as GET, handler as POST };
