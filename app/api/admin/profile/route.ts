import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Profile } from '@/types/user';
import { getProfile } from '@/lib/api/user';

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await getProfile({ userId: user?.id });
  if (error) {
    return NextResponse.json(
      { message: 'Failed to fetch profile' },
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

  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', user?.id)
      .single<Profile>();
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const birthday = formData.get('birthday') as string;
    const bio = formData.get('bio') as string;
    const githubUrl = formData.get('github_url') as string;
    const email = formData.get('email') as string;
    const avatarFile = formData.get('avatar') as File | null;

    let avatarUrl = null;

    // https://supabase.com/docs/guides/storage/security/access-control
    if (avatarFile) {
      const { data, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(profile?.username!, avatarFile, {
          contentType: avatarFile.type,
          upsert: true,
        });

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw new Error('Failed to upload avatar');
      }

      avatarUrl = data.fullPath;
    }

    const profileDataToUpdate: {
      name: string;
      birthday: string;
      bio: string;
      avatar_url?: string;
      github_url: string;
      email: string;
    } = {
      name,
      bio,
      birthday,
      github_url: githubUrl,
      email,
    };

    if (avatarUrl) profileDataToUpdate.avatar_url = avatarUrl;

    const { error } = await supabase
      .from('profiles')
      .update(profileDataToUpdate)
      .eq('id', user?.id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to update profile', details: errorMessage },
      { status: 500 },
    );
  }
}
