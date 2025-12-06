import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request) {
  try {
    const { pin, name } = await request.json();

    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('is_active', true);

    if (error) throw error;

    let user = null;

    if (pin) {
      user = users.find(u => u.pin === pin && (u.role === 'admin' || u.role === 'co-admin'));
    } else if (name) {
      user = users.find(u => u.name.toLowerCase() === name.toLowerCase());
    }

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', user.id);

    return NextResponse.json({ 
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
