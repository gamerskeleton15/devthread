'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { randomUUID } from 'node:crypto';
import {
  createSession,
  destroySession,
  hashPassword,
  verifyPassword,
} from '@/lib/auth';
import { insertUser, selectUserByEmail } from '@/db/queries';

export interface AuthState {
  error?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function authenticate(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');

  if (!EMAIL_RE.test(email)) {
    return { error: 'Please enter a valid email address.' };
  }
  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters.' };
  }

  const existingUser = await selectUserByEmail(email);

  let userId: string;
  if (!existingUser) {
    const { salt, hash } = await hashPassword(password);
    const id = randomUUID();
    const { ok } = await insertUser({
      id,
      email,
      name: email.split('@')[0],
      salt,
      hash,
      createdAt: new Date().toISOString(),
    });
    if (!ok) {
      return { error: 'Could not sign you in right now. Please try again.' };
    }
    userId = id;
  } else {
    const ok = await verifyPassword(password, existingUser.salt, existingUser.hash);
    if (!ok) {
      return { error: 'Invalid email or password.' };
    }
    userId = existingUser.id;
  }

  await createSession(userId);
  revalidatePath('/', 'layout');
  redirect('/');
}

export async function logout(): Promise<void> {
  await destroySession();
  revalidatePath('/', 'layout');
  redirect('/');
}