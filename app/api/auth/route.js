import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request) {
  try {
    const { pin, name, role } = await request.json();

    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('is_active', true);

    if (error) throw error;

    let user = null;

    if (role === 'tester') {
      // Tester: only name required
      user = users.find(u => u.name.toLowerCase() === name.toLowerCase() && u.role === 'tester');
    } else if (role === 'admin' || role === 'co-admin') {
      // Admin/Co-admin: name + PIN required
      user = users.find(u => 
        u.name.toLowerCase() === name.toLowerCase() && 
        u.pin === pin && 
        u.role === role
      );
    }

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials', success: false }, { status: 401 });
    }

    await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', user.id);

    return NextResponse.json({ 
      success: true,
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
