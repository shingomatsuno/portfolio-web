'use client';

import { Skill } from '@/types/master';
import { Profile, UserPr, UserProject } from '@/types/user';
import React from 'react';
import { dateFormat, getAge } from '@/lib/utils';
import { Button } from './ui/button';
import { Printer } from 'lucide-react';

export function SkillSheet({
  profile,
  projects,
  skills,
  pr,
}: {
  profile: Profile;
  skills: Skill[];
  pr: Omit<UserPr, 'user_id'> | null;
  projects: (Omit<UserProject, 'user_id' | 'skills'> & { skills: Skill[] })[];
}) {
  const generatePdf = async () => {
    window.print();
  };
  return (
    <div>
      <div className="mx-auto max-w-[980px] p-8 font-sans text-sm">
        <div className="mb-4 flex justify-end print:hidden">
          <Button onClick={generatePdf}>
            <Printer size={14} /> 印刷
          </Button>
        </div>
        <div className="w-full">
          {/* PCでは表形式、SPではカード形式 */}
          <div className="hidden sm:block">
            {/* --- PC用テーブル --- */}
            <table className="w-full border-collapse border border-black">
              <tbody>
                <tr>
                  <td
                    className="border border-black bg-gray-100 px-2 py-1 text-center font-bold"
                    colSpan={6}
                  >
                    スキルシート
                  </td>
                </tr>
                <tr>
                  <td className="w-[70px] border border-black bg-gray-100 px-2 py-1 font-bold">
                    名前
                  </td>
                  <td className="border-b border-black px-2 py-1">
                    {profile.name}
                  </td>
                  <td className="border border-black bg-gray-100 px-2 py-1 font-bold">
                    年齢
                  </td>
                  <td className="border-b border-black px-2 py-1">
                    {profile.birthday ? getAge(profile.birthday) + '歳' : ''}
                  </td>
                  <td className="border border-black bg-gray-100 px-2 py-1 font-bold">
                    Github
                  </td>
                  <td className="break-words border-b border-black px-2 py-1">
                    {profile.github_url}
                  </td>
                </tr>
                <tr>
                  <td className="border border-black bg-gray-100 px-2 py-1 font-bold">
                    スキル
                  </td>
                  <td className="border border-black px-2 py-1" colSpan={5}>
                    {skills.map(({ name }) => name).join(', ')}
                  </td>
                </tr>
                <tr>
                  <td className="border border-black bg-gray-100 px-2 py-1 font-bold">
                    自己PR
                  </td>
                  <td
                    className="whitespace-pre-wrap border border-black px-2 py-1"
                    colSpan={5}
                  >
                    {pr?.pr_text}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* --- SP用カード表示 --- */}
          <div className="block overflow-hidden border border-black sm:hidden">
            <div className="border-b border-black bg-gray-100 py-1 text-center font-bold">
              スキルシート
            </div>
            <div className="divide-y divide-black">
              <div className="flex">
                <div className="w-24 border-r border-black bg-gray-100 px-2 py-1 font-bold">
                  名前
                </div>
                <div className="flex-1 px-2 py-1">{profile.name}</div>
              </div>
              <div className="flex">
                <div className="w-24 border-r border-black bg-gray-100 px-2 py-1 font-bold">
                  年齢
                </div>
                <div className="flex-1 px-2 py-1">
                  {profile.birthday ? getAge(profile.birthday) + '歳' : ''}
                </div>
              </div>
              <div className="flex">
                <div className="w-24 border-r border-black bg-gray-100 px-2 py-1 font-bold">
                  Github
                </div>
                <div className="flex-1 break-words px-2 py-1">
                  {profile.github_url}
                </div>
              </div>
              <div className="flex">
                <div className="w-24 border-r border-black bg-gray-100 px-2 py-1 font-bold">
                  スキル
                </div>
                <div className="flex flex-1 flex-wrap gap-1 px-2 py-1">
                  {skills.map(({ name }) => name).join(', ')}
                </div>
              </div>
              <div>
                <div className="border-b border-t border-black bg-gray-100 px-2 py-1 font-bold">
                  自己PR
                </div>
                <div className="whitespace-pre-wrap px-2 py-1">
                  {pr?.pr_text}
                </div>
              </div>
            </div>
          </div>

          {/* 職務経歴 */}
          <div className="mt-4 flex flex-col gap-2">
            {projects?.map((p, i) => (
              <div key={p.id}>
                <div>{i + 1}</div>
                <div className="border border-black">
                  <table className="w-full border-collapse border border-black text-center">
                    <tbody>
                      <tr className="bg-gray-100">
                        <th
                          colSpan={2}
                          className="w-1/2 border border-black px-2 py-1"
                        >
                          期間
                        </th>
                        <th
                          colSpan={2}
                          className="w-1/2 border border-black px-2 py-1"
                        >
                          業務内容
                        </th>
                      </tr>
                      <tr>
                        <td colSpan={2} className="border border-black">
                          {dateFormat(p.period_from, 'yyyy/MM')} ~{' '}
                          {p.period_to
                            ? dateFormat(p.period_to, 'yyyy/MM')
                            : ''}
                        </td>
                        <td colSpan={2} className="border border-black">
                          {p.project_name}
                        </td>
                      </tr>
                      <tr>
                        <th className="w-1/4 border border-black bg-gray-100 px-2 py-1 text-left">
                          言語,DB,FW,MW,ツール
                        </th>
                        <td
                          colSpan={3}
                          className="border border-black px-2 py-1"
                        >
                          <div className="flex flex-wrap gap-1">
                            {p.skills.map(({ name }) => name).join(', ')}
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <th className="w-1/4 border border-black bg-gray-100 px-2 py-1 text-left">
                          詳細
                        </th>
                        <td
                          colSpan={3}
                          className="border border-black px-2 py-1"
                        >
                          <div className="whitespace-pre-wrap text-left">
                            {p.details}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
