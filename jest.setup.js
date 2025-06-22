import '@testing-library/jest-dom'

// Global Web API mocks
global.Response = class Response {
  constructor(body, init) {
    this.body = body;
    this.status = init?.status || 200;
    this.statusText = init?.statusText || 'OK';
    this.headers = new Map();
  }
  
  async json() {
    return JSON.parse(this.body);
  }
  
  async text() {
    return this.body;
  }
  
  // Static method for Response.json()
  static json(data, init) {
    return new Response(JSON.stringify(data), {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...init?.headers,
      },
    });
  }
};

global.Request = class Request {
  constructor(url, init) {
    this.url = url;
    this.method = init?.method || 'GET';
    this.headers = new Map();
  }
};

global.Headers = class Headers {
  constructor() {
    this.map = new Map();
  }
  
  get(name) {
    return this.map.get(name);
  }
  
  set(name, value) {
    this.map.set(name, value);
  }
};

// NextAuth mock setup
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({
    data: null,
    status: 'unauthenticated'
  })),
  signIn: jest.fn(),
  signOut: jest.fn(),
  SessionProvider: ({ children }) => children,
}))

// Next.js router mock
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => '/',
}))

// NextResponse mock
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data, options) => ({
      json: async () => data,
      status: options?.status || 200,
    })),
  },
}))

// Environment variables mock
process.env = {
  ...process.env,
  AUTH0_CLIENT_ID: 'test-client-id',
  AUTH0_CLIENT_SECRET: 'test-client-secret',
  AUTH0_ISSUER: 'https://test.auth0.com',
  NEXTAUTH_SECRET: 'test-secret-key-minimum-32-characters',
  NEXTAUTH_URL: 'http://localhost:3000',
  NODE_ENV: 'test',
} 