import { PortfolioPage } from '@/components/PortfolioPage';
import { createClient } from '@/lib/supabase/server';
import { Profile } from '@/types/user';

interface Props {
  params: Promise<{ username: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Props) {
  const { username } = await params;
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('id,username,name,avatar_url,birthday,bio,github_url,email')
    .eq('username', username)
    .single<Profile>();

  return { title: profile?.name + 'のポートフォリオ' };
}

export default async function Page({ params }: Props) {
  const { username } = await params;
  return <PortfolioPage username={username} />;
}
