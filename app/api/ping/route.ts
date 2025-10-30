import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// supabaseを眠らせないためのcron
export async function GET() {
  const supabase = await createClient();
  const { error } = await supabase.rpc('ping');

  if (error) {
    console.error('Supabase ping failed:', error);
    return NextResponse.json({ ok: false, error }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
