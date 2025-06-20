import NextAuth from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";

/**
 * NextAuth yapılandırması
 * Auth0 sağlayıcısı ile kimlik doğrulama sağlanıyor.
 * Oturum yönetimi JWT (JSON Web Token) ile yapılıyor.
 * Gizli anahtar ve Auth0 bilgileri ortam değişkenlerinden okunuyor.
 */
const handler = NextAuth({
  providers: [
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID!,
      clientSecret: process.env.AUTH0_CLIENT_SECRET!,
      issuer: process.env.AUTH0_ISSUER!
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt"
  }
});

// Next.js 14 App Router için GET ve POST isteklerini yönlendiriyoruz
export { handler as GET, handler as POST };
