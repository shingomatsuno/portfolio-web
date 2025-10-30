'use client';

import { Skill } from '@/types/master';
import Image from 'next/image';

export function SkillChip({
  skill,
  deletable,
  onDelete,
}: {
  skill: Skill;
  deletable?: boolean;
  onDelete?: (id: number) => void;
}) {
  return (
    <div
      key={skill.id}
      className="flex items-center gap-2 rounded-full bg-gray-200 px-3 py-1"
    >
      {skill.icon_url && (
        <Image
          src={skill.icon_url}
          width={24}
          height={24}
          alt={skill.name}
          className="mr-1 inline-block"
        />
      )}
      <span>{skill.name}</span>
      {deletable && (
        <button
          onClick={() => onDelete?.(skill.id)}
          className="text-red-500 hover:text-red-700"
        >
          &times;
        </button>
      )}
    </div>
  );
}
