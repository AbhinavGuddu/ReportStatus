import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    
    // Only allow deletion by admin (not co-admin)
    const { adminId } = await request.json();
    const admin = await User.findById(adminId);
    
    if (!admin || admin.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Only admin can remove users' }, { status: 403 });
    }
    
    // Don't allow admin to delete themselves
    if (id === adminId) {
      return NextResponse.json({ success: false, error: 'Cannot delete yourself' }, { status: 400 });
    }
    
    await User.findByIdAndUpdate(id, { isActive: false });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}