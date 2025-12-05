import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('includeInactive');
    
    const query = includeInactive ? {} : { isActive: true };
    const users = await User.find(query).select('-pin').sort({ createdAt: -1 });
    
    console.log('Fetched users:', users.length);
    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error('Users API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const { name, email, role, pin, addedBy } = await request.json();
    
    const user = await User.create({
      name,
      email,
      role,
      pin: (role === 'admin' || role === 'co-admin') ? pin : undefined,
      addedBy
    });
    
    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}