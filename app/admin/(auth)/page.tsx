'use client';

import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Pencil,
  LogOut,
  MoveRight,
  FileText,
  ExternalLink,
} from 'lucide-react';
import { Skill } from '@/types/master';
import { MypageContainer } from '@/components/MypageContainer';
import { UserPr, UserProject, Profile, UserFreeText } from '@/types/user';
import { SkillChip } from '@/components/SkillChip';
import { dateFormat } from '@/lib/utils';
import { useFetch } from '@/lib/fetch.client';

export default function AdminPage() {
  const { data: profile, isLoading: profileLoading } =
    useFetch<Profile>('/api/admin/profile');
  const { data: skills, isLoading: skillsLoading } = useFetch<Skill[]>(
    '/api/admin/userSkills',
  );
  const { data: pr, isLoading: prLoading } =
    useFetch<UserPr>('/api/admin/userPr');
  const { data: freeText, isLoading: ftLoading } = useFetch<UserFreeText>(
    '/api/admin/userFreeText',
  );
  const { data: projects, isLoading: projectsLoading } = useFetch<
    (Omit<UserProject, 'sills'> & { skills: Skill[] })[]
  >('/api/admin/userProjects');

  const handleLogout = async () => {
    const response = await fetch('/api/admin/logout', {
      method: 'POST',
    });

    if (response.ok) {
      window.location.href = '/admin/login';
    } else {
      console.error('Logout failed');
    }
  };

  return (
    <>
      <MypageContainer
        loading={
          profileLoading ||
          skillsLoading ||
          ftLoading ||
          prLoading ||
          projectsLoading
        }
        title="マイページ"
      >
        <div className="-mt-5 flex justify-between">
          <Link
            href={`/user/${profile?.username}/skillsheet`}
            target="_blank"
            className="flex items-center justify-end gap-1 text-sm text-gray-500 hover:text-gray-700"
          >
            <FileText size={14} /> スキルシートを確認
          </Link>
          <Link
            href={`/user/${profile?.username}`}
            className="flex items-center justify-end gap-1 text-sm text-gray-500 hover:text-gray-700"
          >
            <MoveRight size={14} /> ポートフォリオを確認
          </Link>
        </div>
        <div className="flex gap-4">
          <div className="flex flex-col gap-4">
            <Card className="relative h-fit w-full max-w-[380px] border p-4">
              <Link
                href="/admin/profile"
                className="absolute right-4 top-4 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
              >
                <Pencil size={14} /> 編集
              </Link>
              <h3 className="mb-4 text-lg font-semibold">プロフィール</h3>
              <CardContent className="flex flex-col gap-2 p-0">
                <div className="flex flex-col items-center gap-4 p-0 sm:flex-row">
                  <Avatar className="h-20 w-20 self-start rounded-lg">
                    {profile?.avatar_url ? (
                      <AvatarImage src={profile.avatar_url} />
                    ) : (
                      <AvatarFallback className="rounded-lg">
                        {profile?.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1 space-y-4 self-start">
                    <div>
                      <h2 className="text-xl font-semibold">{profile?.name}</h2>
                      <p className="text-xs text-gray-500">
                        {profile?.birthday ? dateFormat(profile.birthday) : ''}
                      </p>
                      <p className="text-xs text-gray-500">{profile?.email}</p>
                      {profile?.github_url && (
                        <p className="text-xs text-gray-500">
                          <a
                            target="_blank"
                            className="flex gap-1 hover:underline"
                            href={profile.github_url}
                          >
                            {profile.github_url}
                            <ExternalLink size={14} />
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-700">{profile?.bio}</p>
                </div>
                <div className="mt-4 flex w-full justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="flex items-center gap-1 bg-white text-gray-600 hover:bg-white hover:text-gray-800"
                  >
                    <LogOut size={16} /> ログアウト
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card className="relative h-fit w-full max-w-[380px] border p-4">
              <Link
                href="/admin/freeText"
                className="absolute right-4 top-4 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
              >
                <Pencil size={14} /> 編集
              </Link>
              <h3 className="mb-4 text-lg font-semibold">フリーテキスト</h3>
              <CardContent className="flex flex-col gap-2 p-0 text-center">
                <div
                  dangerouslySetInnerHTML={{
                    __html: freeText?.free_text || '',
                  }}
                />
              </CardContent>
            </Card>
          </div>
          <div className="flex h-full w-full flex-col rounded-md border">
            <Card className="relative border-none p-4">
              <Link
                href="/admin/skills"
                className="absolute right-4 top-4 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
              >
                <Pencil size={14} /> 編集
              </Link>
              <h3 className="mb-4 text-lg font-semibold">スキル</h3>
              <CardContent className="flex flex-wrap gap-2 p-0">
                {skills?.map((skill) => (
                  <SkillChip key={skill.id} skill={skill} />
                ))}
              </CardContent>
            </Card>
            <Card className="relative border-none p-4">
              <Link
                href="/admin/pr"
                className="absolute right-4 top-4 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
              >
                <Pencil size={14} /> 編集
              </Link>
              <h3 className="mb-4 text-lg font-semibold">自己PR</h3>
              <CardContent className="p-0">
                <p className="text-sm text-gray-700">{pr?.pr_text}</p>
              </CardContent>
            </Card>
            <Card className="relative border-none p-4">
              <Link
                href="/admin/projects"
                className="absolute right-4 top-4 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
              >
                <Pencil size={14} /> 編集
              </Link>
              <h3 className="mb-4 text-lg font-semibold">プロジェクト</h3>
              <CardContent className="flex flex-col gap-2 p-0">
                {projects?.map((project) => (
                  <div key={project.id} className="px-2 py-1">
                    <div className="text-xs">
                      {dateFormat(project.period_from, 'yyyy/MM')} ~{' '}
                      {project.period_to
                        ? dateFormat(project.period_to, 'yyyy/MM')
                        : ''}
                    </div>
                    <div className="text-sm">{project.project_name}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </MypageContainer>
    </>
  );
}
