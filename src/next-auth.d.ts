declare module "next-auth" {
  interface Session {
    token: string;
    user: {
      id: number;
      name?: string;
      email?: string;
      role: string;
    };
  }
}