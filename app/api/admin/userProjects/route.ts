import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { UserProject } from '@/types/user';
import { dateFormat } from '@/lib/utils';
import { getUserProjects } from '@/lib/api/user';

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await getUserProjects(user!.id);
  if (error) {
    return NextResponse.json(
      { message: 'Failed to fetch projects' },
      { status: 500 },
    );
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const params = (await request.json()) as Partial<UserProject>;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('user_projects')
    .insert([
      {
        period_from: `${params.period_from}-01`,
        period_to: params.period_to ? `${params.period_to}-01` : null,
        project_name: params.project_name,
        details: params.details,
        skills: params.skills,
        user_id: user?.id,
      },
    ])
    .select(
      `id,
      period_from,
      period_to,
      project_name,
      details,
      skills`,
    )
    .single<UserProject>();

  if (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Failed to create work experience' },
      { status: 500 },
    );
  }

  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  const supabase = await createClient();
  const params = (await request.json()) as UserProject;

  const { data, error } = await supabase
    .from('user_projects')
    .update({
      period_from: `${params.period_from}-01`,
      period_to: params.period_to ? `${params.period_to}-01` : null,
      project_name: params.project_name,
      details: params.details,
      skills: params.skills,
    })
    .eq('id', params.id)
    .select(
      `id,
      period_from,
      period_to,
      project_name,
      details,
      skills`,
    )
    .single<UserProject>();

  if (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Failed to update work experience' },
      { status: 500 },
    );
  }

  return NextResponse.json(data);
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const { id } = (await request.json()) as { id: string };
  const { error } = await supabase.from('user_projects').delete().eq('id', id);

  if (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Failed to delete work experience' },
      { status: 500 },
    );
  }

  return NextResponse.json({ message: 'Work experience deleted successfully' });
}
