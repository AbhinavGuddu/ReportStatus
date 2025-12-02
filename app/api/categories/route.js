import Category from '@/models/Category';
import dbConnect from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const environment = searchParams.get('environment');

    const query = environment ? { environment } : {};
    const categories = await Category.find(query).sort({ order: 1 });

    if (categories) {
      return NextResponse.json({ data: categories });
    }
  } catch (error) {
    console.error('Error fetching categories:', error);

    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    const category = await Category.create(body);

    return NextResponse.json({ data: category }, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);

    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}