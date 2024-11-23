import { createAuthClient } from "better-auth/react";

const client = createAuthClient();
export const { useSession, signIn, signOut, signUp } = client;

export type Session = typeof client.$Infer.Session;
