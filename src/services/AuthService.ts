import { signIn, signOut, getSession } from "next-auth/react";
import { Session } from "next-auth";

// Auth servisinin interface'i - Interface Segregation prensibi
export interface IAuthService {
  login(): Promise<void>;
  logout(): Promise<void>;
  getCurrentSession(): Promise<Session | null>;
  validateToken(): boolean;
}

// Concrete auth service implementation - Dependency Inversion prensibi
export class AuthService implements IAuthService {
  
  // Single Responsibility: Sadece giriş işlemi
  async login(): Promise<void> {
    try {
      await signIn("auth0");
    } catch (error) {
      console.error("Giriş hatası:", error);
      throw new Error("Giriş işlemi başarısız");
    }
  }

  // Single Responsibility: Sadece çıkış işlemi
  async logout(): Promise<void> {
    try {
      await signOut({ redirect: false });
    } catch (error) {
      console.error("Çıkış hatası:", error);
      throw new Error("Çıkış işlemi başarısız");
    }
  }

  // Session bilgisini getir
  async getCurrentSession(): Promise<Session | null> {
    try {
      const session = await getSession();
      return session;
    } catch (error) {
      console.error("Session hatası:", error);
      return null;
    }
  }

  // Token doğrulama - basit kontrol
  validateToken(): boolean {
    // Burada JWT token'ın geçerliliği kontrol edilebilir
    return true;
  }
}

// Factory pattern - Open/Closed prensibi
export class AuthServiceFactory {
  static create(): IAuthService {
    return new AuthService();
  }
} 