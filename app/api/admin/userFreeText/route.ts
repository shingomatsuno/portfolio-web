import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { UserFreeText } from '@/types/user';
import { getUserFreeText } from '@/lib/api/user';
import isd from 'isomorphic-dompurify';

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await getUserFreeText(user!.id);
  if (error) {
    return NextResponse.json(
      { message: 'Failed to fetch free text' },
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

  const params = (await request.json()) as UserFreeText;

  const { data: userPr } = await supabase
    .from('user_free_texts')
    .select('id')
    .eq('user_id', user?.id)
    .maybeSingle<UserFreeText>();

  if (userPr?.id) {
    const { data, error } = await supabase
      .from('user_free_texts')
      .update({ free_text: isd.sanitize(params.free_text) })
      .eq('id', userPr.id)
      .select('id,free_text')
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
      .from('user_free_texts')
      .insert({ free_text: isd.sanitize(params.free_text), user_id: user?.id })
      .select('id,free_text')
      .single();
    if (error) {
      console.error(error);
      return NextResponse.json(
        { message: 'Failed to insert user_free_texts' },
        { status: 500 },
      );
    }
    return NextResponse.json(data);
  }
}
