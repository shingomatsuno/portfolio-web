'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

import { Skill } from '@/types/master';
import { useFetch } from '@/lib/fetch.client';
import { MypageContainer } from '@/components/MypageContainer';

import { SkillSelector } from '@/components/SkillSelector';

export default function SkillsEditPage() {
  const { data: userSkills, isLoading: isLoadingUserSkills } = useFetch<
    Skill[]
  >('/api/admin/userSkills');

  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);

  useEffect(() => {
    if (userSkills) {
      setSelectedSkills(userSkills);
    }
  }, [userSkills]);

  const handleSelectSkill = (skill: Skill) => {
    if (!selectedSkills.some((s) => s.id === skill.id)) {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handlDeleteSkill = (skillId: number) => {
    setSelectedSkills(selectedSkills.filter((s) => s.id !== skillId));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/admin/userSkills', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skills: selectedSkills }),
      });

      if (!response.ok) throw new Error('スキルの更新に失敗しました');
      alert('スキルを更新しました');
    } catch (error) {
      console.error(error);
      alert(
        `エラー: ${
          error instanceof Error ? error.message : '不明なエラーが発生しました'
        }`,
      );
    }
  };

  return (
    <MypageContainer loading={isLoadingUserSkills} title="スキル編集">
      <div className="max-w-2xl space-y-6">
        <SkillSelector
          selectedSkills={selectedSkills}
          onSort={setSelectedSkills}
          onSelect={handleSelectSkill}
          onDelete={handlDeleteSkill}
        />
        <div className="text-right">
          <Button onClick={handleSubmit} className="mt-6">
            更新
          </Button>
        </div>
      </div>
    </MypageContainer>
  );
}
