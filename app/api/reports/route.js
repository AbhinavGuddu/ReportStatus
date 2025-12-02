import { NextResponse } from 'next/server';
import Category from '@/models/Category';
import Report from '@/models/Report';
import dbConnect from '@/lib/mongodb';

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const environment = searchParams.get('environment');

    if (!environment) {
      return NextResponse.json(
        { error: 'Environment parameter is required' },
        { status: 400 }
      );
    }

    // Fetch categories for the environment
    const categories = await Category.find({ environment }).sort({ order: 1 });

    // Fetch reports for the environment
    const reports = await Report.find({ environment }).sort({ order: 1 });

    // Structure the response
    const data = categories.map((category) => {
      const categoryReports = reports.filter((report) => {
        return report.category.toString() === category._id.toString();
      });

      return {
        ...category.toObject(),
        reports: categoryReports
      };
    });

    if (data) {
      return NextResponse.json({ data });
    }
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    const report = await Report.create(body);
    return NextResponse.json({ data: report }, { status: 201 });
  } catch (error) {
    console.error('Error creating report:', error);
    return NextResponse.json(
      { error: 'Failed to create report' },
      { status: 500 }
    );
  }
}
