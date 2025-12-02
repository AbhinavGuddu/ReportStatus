import { NextResponse } from 'next/server';
import Report from '@/models/Report';
import dbConnect from '@/lib/mongodb';

export async function PATCH(request, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const body = await request.json();

    const report = await Report.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true
    });

    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    return NextResponse.json({ data: report });
  } catch (error) {
    console.error('Error updating report:', error);

    return NextResponse.json(
      { error: 'Failed to update report' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = params;

    const report = await Report.findByIdAndDelete(id);

    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting report:', error);

    return NextResponse.json(
      { error: 'Failed to delete report' },
      { status: 500 }
    );
  }
}