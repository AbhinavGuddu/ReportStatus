import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Tester from '@/models/Tester';

export async function GET() {
  try {
    await dbConnect();
    const testers = await Tester.find({ isActive: true }).sort({ name: 1 });
    return NextResponse.json({ data: testers });
  } catch (error) {
    console.error('Error fetching testers:', error);
    return NextResponse.json({ error: 'Failed to fetch testers' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const tester = await Tester.create(body);
    return NextResponse.json({ data: tester }, { status: 201 });
  } catch (error) {
    console.error('Error creating tester:', error);
    return NextResponse.json({ error: 'Failed to create tester' }, { status: 500 });
  }
}