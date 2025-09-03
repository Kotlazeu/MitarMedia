
'use server'

import { cookies } from 'next/headers'
 
export async function login(password: string) {
  const storedPassword = process.env.ADMIN_PASSWORD;

  if (!storedPassword) {
    console.error("ADMIN_PASSWORD environment variable is not set.");
    return { success: false, error: "Server configuration error." };
  }

  if (password === storedPassword) {
    cookies().set('admin-auth', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
    })
    return { success: true };
  } else {
    return { success: false, error: 'Invalid password.' };
  }
}
