import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const environment = searchParams.get('environment');

    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('*')
      .eq('environment', environment)
      .order('order', { ascending: true });

    if (catError) throw catError;

    const categoriesWithReports = await Promise.all(
      categories.map(async (category) => {
        const { data: reports, error: repError } = await supabase
          .from('reports')
          .select('*')
          .eq('category_id', category.id)
          .order('order', { ascending: true });

        if (repError) throw repError;

        return {
          _id: category.id,
          name: category.name,
          environment: category.environment,
          order: category.order,
          reports: reports.map(r => ({
            _id: r.id,
            name: r.name,
            status: r.status,
            environment: r.environment,
            order: r.order,
            updatedAt: r.updated_at,
            updatedBy: r.updated_by
          }))
        };
      })
    );

    return NextResponse.json({ data: categoriesWithReports });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('reports')
      .insert({
        name: body.name,
        category_id: body.category,
        status: body.status || 'not-started',
        environment: body.environment,
        order: body.order || 99
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('Error creating report:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
