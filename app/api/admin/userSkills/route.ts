import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Profile } from '@/types/user';
import { Skill } from '@/types/master';
import { getUserSkills } from '@/lib/api/user';

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await getUserSkills(user!.id);
  if (error) {
    return NextResponse.json(
      { message: 'Failed to fetch skills' },
      { status: 500 },
    );
  }

  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  // all deleteしてcreate
  const supabase = await createClient();
  const params = (await request.json()) as { skills: Skill[] };

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error: deleteError } = await supabase
    .from('user_skills')
    .delete()
    .eq('user_id', user?.id);

  if (deleteError) {
    console.error(deleteError);
    return NextResponse.json(
      { message: 'Failed to delete old skills' },
      { status: 500 },
    );
  }

  const inserts = params.skills.map((s) => ({
    user_id: user?.id,
    skill_id: s.id,
  }));

  if (inserts.length > 0) {
    const { error: insertError } = await supabase
      .from('user_skills')
      .insert(inserts);

    if (insertError) {
      console.error(insertError);
      return NextResponse.json(
        { message: 'Failed to insert new skills' },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ message: 'User skills update successfully' });
}
