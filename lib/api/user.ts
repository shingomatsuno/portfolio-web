import { createClient } from '@/lib/supabase/server';
import { Profile, UserProject } from '@/types/user';
import { Skill } from '@/types/master';
import isd from 'isomorphic-dompurify';

export async function getProfile({
  userId,
  username,
}: {
  userId?: string;
  username?: string;
}) {
  if (!userId && !username) {
    return { data: null };
  }
  const supabase = await createClient();

  const keyColumn = userId ? 'id' : 'username';
  const keyValue = userId || username;

  const { data: profile, error: profError } = await supabase
    .from('profiles')
    .select('id,username,name,avatar_url,birthday,bio,github_url,email')
    .eq(keyColumn, keyValue)
    .single<Profile>();

  if (!profile || profError) {
    return { data: null, error: profError };
  }

  let avatar: string | null = null;

  if (profile.avatar_url) {
    const { data: exists } = await supabase.storage
      .from('avatars')
      .exists(profile.username);

    if (exists) {
      const { data } = await supabase.storage
        .from('avatars')
        .createSignedUrl(profile.username, 3600);

      avatar = data?.signedUrl || null;
    }
  }

  return {
    data: {
      ...profile,
      avatar_url: avatar,
    },
    error: profError,
  };
}

export async function getUserPr(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('user_prs')
    .select('id,pr_text')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error(error);
    return { data: null, error };
  }

  return { data, error };
}

export async function getUserFreeText(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('user_free_texts')
    .select('id,free_text')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error(error);
    return { data: null, error };
  }

  if (!data) {
    return { data: null, error };
  }

  return {
    data: {
      ...data,
      free_text: isd.sanitize(data.free_text),
    },
    error,
  };
}

export async function getUserProjects(userId: string) {
  const supabase = await createClient();

  const { data: projects, error } = await supabase
    .from('user_projects')
    .select(
      `id,
      period_from,
      period_to,
      project_name,
      details,
      skills`,
    )
    .eq('user_id', userId)
    .order('period_from', { ascending: false })
    .order('period_to', { ascending: false })
    .overrideTypes<UserProject[], { merge: false }>();

  if (error) {
    console.error(error);
    return { data: null, error };
  }

  // 全プロジェクトのスキルIDをまとめて取得
  const skillIds = [...new Set(projects.flatMap((p) => p.skills || []))];

  if (skillIds.length === 0) {
    // スキルが存在しない場合
    return {
      data: projects.map((p) => ({
        ...p,
        skills: [],
      })),
    };
  }

  // 3️⃣ skills テーブルから一括取得
  const { data: allSkills, error: skillError } = await supabase
    .from('skills')
    .select('*')
    .in('id', skillIds);

  if (skillError || !allSkills) {
    console.error(skillError);
    return { data: null, error: skillError };
  }

  // 4️⃣ 各プロジェクトに対応するスキルをマッピング
  const data = projects.map((p) => ({
    ...p,
    skills: (p.skills || [])
      .map((id) => allSkills.find((s) => s.id === id))
      .filter(Boolean) as Skill[],
  }));

  return { data, error };
}

export async function getUserSkills(userId: string) {
  const supabase = await createClient();
  const { data: skills, error } = await supabase
    .from('user_skills')
    .select(
      `
    skill_id,
    skills (
      id,
      name,
      icon_url
    )
  `,
    )
    .eq('user_id', userId)
    .overrideTypes<{ skill_id: string; skills: Skill }[], { merge: false }>();

  return { data: skills?.map((s) => ({ ...s.skills })) || [], error };
}
