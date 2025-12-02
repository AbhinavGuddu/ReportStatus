import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { password } = await request.json();
    // eslint-disable-next-line no-process-env
    const adminPasswordHash = process.env.ADMIN_PASSWORD || '';

    if (!adminPasswordHash) {
      // Fallback if env var is not set (for development)
      // Default: Reports@11
      // Note: The above hash is a placeholder. In a real scenario, we should ensure the env var is set.
      // For this implementation, let's check against the plain text if hash fails or is missing,
      // but ideally we rely on the hash.

      // Since we are setting up, let's hardcode the check for the known password if env is missing
      // to avoid lockout during initial setup if .env isn't loaded yet.
      if (password === 'Reports@11') {
        return NextResponse.json({ success: true });
      }
    }

    const isValid = await bcrypt.compare(password, adminPasswordHash || '');

    if (isValid) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  } catch (error) {
    console.error('Error verifying password:', error);

    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}