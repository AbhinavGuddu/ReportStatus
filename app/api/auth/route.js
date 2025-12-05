import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request) {
  try {
    await connectDB();
    const { name, pin, role } = await request.json();
    
    let user;
    
    if (role === 'admin' || role === 'co-admin') {
      // Admin/Co-admin login with PIN
      user = await User.findOne({ name, pin, role, isActive: true });
      if (!user) {
        return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
      }
    } else {
      // Tester login (name only)
      user = await User.findOne({ name, role: 'tester', isActive: true });
      if (!user) {
        return NextResponse.json({ success: false, error: 'Tester not found' }, { status: 401 });
      }
    }
    
    // Update last login
    await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });
    
    return NextResponse.json({ 
      success: true, 
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}