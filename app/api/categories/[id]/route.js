import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Category from '@/models/Category';
import Report from '@/models/Report';

export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();
    
    const { id } = params;
    
    // Delete all reports in this category first
    await Report.deleteMany({ category: id });
    
    // Delete the category
    await Category.findByIdAndDelete(id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    await connectToDatabase();
    
    const { id } = params;
    const { name } = await request.json();
    
    const category = await Category.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );
    
    return NextResponse.json({ data: category });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}