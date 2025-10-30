import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { UserPr } from '@/types/user';
import { getUserPr } from '@/lib/api/user';

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await getUserPr(user!.id);
  if (error) {
    return NextResponse.json(
      { message: 'Failed to fetch pr' },
      { status: 500 },
    );
  }

  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const params = (await request.json()) as UserPr;

  const { data: userPr } = await supabase
    .from('user_prs')
    .select('id')
    .eq('user_id', user?.id)
    .maybeSingle<UserPr>();

  if (userPr?.id) {
    const { data, error } = await supabase
      .from('user_prs')
      .update({ pr_text: params.pr_text })
      .eq('id', userPr.id)
      .select('id,pr_text')
      .single();

    if (error) {
      console.error(error);
      return NextResponse.json(
        { message: 'Failed to update pr' },
        { status: 500 },
      );
    }
    return NextResponse.json(data);
  } else {
    const { data, error } = await supabase
      .from('user_prs')
      .insert({ pr_text: params.pr_text, user_id: user?.id })
      .select('id,pr_text')
      .single();
    if (error) {
      console.error(error);
      return NextResponse.json(
        { message: 'Failed to insert pr' },
        { status: 500 },
      );
    }
    return NextResponse.json(data);
  }
}
