import NextAuth from "next-auth";
import { AuthOptions } from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";
// 12Factor App integration
import { config } from "@/lib/config";
import { logger } from "@/lib/logger";

/**
 * NextAuth yapılandırması
 * Auth0 sağlayıcısı ile kimlik doğrulama sağlanıyor.
 * Oturum yönetimi JWT (JSON Web Token) ile yapılıyor.
 * Gizli anahtar ve Auth0 bilgileri ortam değişkenlerinden okunuyor.
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
    async jwt({ token, account, profile }) {
      if (account) {
        // Log successful authentication
        logger.authSuccess(
          profile?.sub || 'unknown',
          account.provider
        );
        
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      // Pass the access token to the session for API calls
      session.accessToken = token.accessToken;
      return session;
    },
    async signIn({ user, account, profile }) {
      try {
        logger.info('Sign-in attempt', {
          provider: account?.provider,
          email: user.email,
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
