import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import TestAssignment from '@/models/TestAssignment';
import Tester from '@/models/Tester';
import Report from '@/models/Report';

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const environment = searchParams.get('environment');
    
    const assignments = await TestAssignment.find()
      .populate('testerId', 'name email')
      .populate('reportId', 'name environment')
      .sort({ assignedDate: -1 });
    
    const filteredAssignments = environment 
      ? assignments.filter(a => a.reportId?.environment === environment)
      : assignments;
    
    return NextResponse.json({ data: filteredAssignments });
  } catch (error) {
    console.error('Error fetching test assignments:', error);
    return NextResponse.json({ error: 'Failed to fetch assignments' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const { reportIds, environment } = await request.json();
    
    // Get active testers for this environment
    const testers = await Tester.find({ 
      isActive: true,
      $or: [
        { environment: environment },
        { environment: 'both' }
      ]
    });
    
    if (testers.length === 0) {
      return NextResponse.json({ error: 'No active testers found' }, { status: 400 });
    }
    
    const assignments = [];
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 14); // 2 weeks from now
    
    // Round-robin assignment
    for (let i = 0; i < reportIds.length; i++) {
      const tester = testers[i % testers.length];
      
      const assignment = await TestAssignment.create({
        reportId: reportIds[i],
        testerId: tester._id,
        deadline,
        testCycle: Math.ceil(Date.now() / (14 * 24 * 60 * 60 * 1000)) // Bi-weekly cycle number
      });
      
      assignments.push(assignment);
    }
    
    return NextResponse.json({ data: assignments }, { status: 201 });
  } catch (error) {
    console.error('Error creating test assignments:', error);
    return NextResponse.json({ error: 'Failed to create assignments' }, { status: 500 });
  }
}