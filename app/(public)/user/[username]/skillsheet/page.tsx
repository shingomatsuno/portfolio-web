import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { getUserPr, getUserProjects, getUserSkills } from '@/lib/api/user';
import { Profile } from '@/types/user';
import { SkillSheet } from '@/components/SkillSheet';

interface Props {
  params: Promise<{ username: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Props) {
  const { username } = await params;
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('id,username,name,avatar_url,birthday,bio,github_url')
    .eq('username', username)
    .single<Profile>();

  return { title: profile?.name + 'のスキルシート' };
}

export default async function Page({ params }: Props) {
  const { username } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('id,username,name,avatar_url,birthday,bio,github_url')
    .eq('username', username)
    .single<Profile>();

  if (!profile) {
    notFound();
  }

  const [{ data: skills }, { data: projects }, { data: pr }] =
    await Promise.all([
      getUserSkills(profile.id),
      getUserProjects(profile.id),
      getUserPr(profile.id),
    ]);

  return (
    <SkillSheet
      profile={profile}
      projects={projects || []}
      skills={skills}
      pr={pr}
    />
  );
}
