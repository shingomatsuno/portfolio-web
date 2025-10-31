'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Skill } from '@/types/master';
import { ChevronsUpDown } from 'lucide-react';
import { useFetch } from '@/lib/fetch.client';
import Image from 'next/image';

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  arrayMove,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';

interface SortableSkillChipProps {
  skill: Skill;
  onDelete: (id: number) => void;
}

const SortableSkillChip = ({ skill, onDelete }: SortableSkillChipProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: skill.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'grab',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
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
      <span className={!skill.icon_url ? 'text-xs' : ''}>{skill.name}</span>
      <button
        onClick={() => onDelete(skill.id)}
        onPointerDown={(e) => e.stopPropagation()}
        className="font-bold text-red-500"
      >
        ×
      </button>
    </div>
  );
};

export function SkillSelector({
  selectedSkills,
  onSelect,
  onDelete,
  onSort,
  className,
}: {
  selectedSkills: Skill[];
  onSelect(skill: Skill): void;
  onDelete(id: number): void;
  onSort(skills: Skill[]): void;
  className?: string;
}) {
  const { data: allSkills } = useFetch<Skill[]>('/api/skills');
  const [open, setOpen] = useState(false);

  const availableSkills =
    allSkills?.filter(
      (skill) => !selectedSkills.some((s) => s.id === skill.id),
    ) || [];

  // DnD-kit センサー
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = selectedSkills.findIndex((s) => s.id === active.id);
      const newIndex = selectedSkills.findIndex((s) => s.id === over.id);
      onSort(arrayMove(selectedSkills, oldIndex, newIndex));
    }
  };

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            スキルを選択...
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="スキルを検索..." />
            <CommandList>
              <CommandEmpty>スキルが見つかりません。</CommandEmpty>
              <CommandGroup>
                {availableSkills.map((skill) => (
                  <CommandItem
                    key={skill.id}
                    value={skill.name}
                    onSelect={() => onSelect(skill)}
                  >
                    {skill.icon_url && (
                      <Image
                        src={skill.icon_url}
                        width={24}
                        height={24}
                        alt={skill.name}
                      />
                    )}
                    {skill.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <div>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={selectedSkills.map((s) => s.id)}
            strategy={horizontalListSortingStrategy}
          >
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedSkills.map((skill) => (
                <SortableSkillChip
                  key={skill.id}
                  skill={skill}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
