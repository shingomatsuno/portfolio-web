'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skill } from '@/types/master';
import { UserProject } from '@/types/user';
import { Trash2 } from 'lucide-react';
import { useFetch } from '@/lib/fetch.client';
import { MypageContainer } from '@/components/MypageContainer';
import { SkillSelector } from '@/components/SkillSelector';
import { dateFormat } from '@/lib/utils';
import { useEffect, useRef } from 'react';
import { Label } from '@/components/ui/label';

// -----------------------------
// ✅ Zod schema
// -----------------------------
const skillSchema = z.object({
  id: z.number(),
  name: z.string(),
});

const projectSchema = z.object({
  id: z.string().optional(),
  user_id: z.string().optional(),
  period_from: z.string().min(1, '開始年月は必須です'),
  period_to: z.string().optional(),
  project_name: z.string().min(1, 'プロジェクト名は必須です'),
  details: z.string().max(2000, '詳細は2000文字以内です').optional(),
  skills: z.array(skillSchema),
});

type ProjectForm = z.infer<typeof projectSchema>;

// -----------------------------
// ✅ Skill Selector
// -----------------------------
function WorkeSkillSelector({
  selectedSkills,
  onChange,
}: {
  selectedSkills: Skill[];
  onChange: (skills: Skill[]) => void;
}) {
  const handleSelectSkill = (skill: Skill) => {
    if (!selectedSkills.some((s) => s.id === skill.id)) {
      onChange([...selectedSkills, skill]);
    }
  };

  const handleDeleteSkill = (skillId: number) => {
    onChange(selectedSkills.filter((s) => s.id !== skillId));
  };

  return (
    <SkillSelector
      className="flex-row"
      onSelect={handleSelectSkill}
      onDelete={handleDeleteSkill}
      onSort={onChange}
      selectedSkills={selectedSkills}
    />
  );
}

// -----------------------------
// ✅ ProjectFormCard: 各カード単位フォーム
// -----------------------------
function ProjectFormCard({
  project,
  onSaved,
  onDeleted,
}: {
  project: ProjectForm;
  onSaved: (values: ProjectForm) => void;
  onDeleted: () => void;
}) {
  const form = useForm<ProjectForm>({
    resolver: zodResolver(projectSchema),
    defaultValues: project,
  });

  const { register, handleSubmit, setValue, watch, reset } = form;
  const skills = watch('skills');

  // 保存（1件ずつ）
  const onSubmit = async (values: ProjectForm) => {
    const isNew = !values.id;
    const method = isNew ? 'POST' : 'PUT';
    try {
      const response = await fetch('/api/admin/userProjects', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          skills: values.skills.map((s) => s.id),
        }),
      });
      if (!response.ok) throw new Error('Failed to save');
      alert('保存しました');
      const savedProject = (await response.json()) as UserProject;
      const _project: ProjectForm = {
        ...savedProject,
        period_from: dateFormat(savedProject.period_from, 'yyyy-MM'),
        period_to: savedProject.period_to
          ? dateFormat(savedProject.period_to, 'yyyy-MM')
          : undefined,
        skills: values.skills,
      };

      onSaved(_project);
      if (isNew) {
        reset();
      }
    } catch (error) {
      console.error(error);
      alert('保存に失敗しました');
    }
  };

  // 削除
  const handleDelete = async () => {
    if (!project.id) return;
    if (!confirm('本当に削除しますか？')) return;
    try {
      const response = await fetch('/api/admin/userProjects', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: project.id }),
      });
      if (!response.ok) throw new Error('Failed to delete');
      alert('削除しました');
      onDeleted();
    } catch (error) {
      console.error(error);
      alert('削除に失敗しました');
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 rounded-lg border p-4"
    >
      <div className="flex w-1/2 items-center justify-around gap-2">
        <div className="space-y-2">
          <Input
            type="month"
            placeholder="開始年月 (YYYY-MM)"
            {...register('period_from')}
          />
          {form.formState.errors.period_from && (
            <p className="text-xs text-red-500">
              {form.formState.errors.period_from.message}
            </p>
          )}
        </div>
        <span>~</span>
        <Input
          type="month"
          placeholder="終了年月 (YYYY-MM)"
          {...register('period_to')}
        />
      </div>
      <div className="space-y-2">
        <Input placeholder="プロジェクト名" {...register('project_name')} />
        {form.formState.errors.project_name && (
          <p className="text-xs text-red-500">
            {form.formState.errors.project_name.message}
          </p>
        )}
      </div>
      <WorkeSkillSelector
        selectedSkills={skills}
        onChange={(s) =>
          setValue(
            'skills',
            s.map((_s) => ({ ..._s, icon_url: undefined })),
          )
        }
      />
      <div className="space-y-2">
        <Textarea placeholder="詳細" {...register('details')} />
        {form.formState.errors.details && (
          <p className="text-xs text-red-500">
            {form.formState.errors.details.message}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit">{project.id ? '更新' : '追加'}</Button>
        {project.id && (
          <Button type="button" variant="destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </form>
  );
}

// -----------------------------
// ✅ メインページ
// -----------------------------
export default function ProjectsEditPage() {
  const { data: userProjects, isLoading } = useFetch<
    (Omit<UserProject, 'skills'> & { skills: Skill[] })[]
  >('/api/admin/userProjects');
  const initialized = useRef(false);
  const form = useForm<{ projects: ProjectForm[] }>({
    defaultValues: {
      projects: [
        {
          period_from: '',
          period_to: '',
          project_name: '',
          details: '',
          skills: [],
        },
      ],
    },
  });
  const { replace, remove } = useFieldArray({
    control: form.control,
    name: 'projects',
  });

  // 初期ロード時にセット
  useEffect(() => {
    if (userProjects && !initialized.current) {
      replace([
        {
          period_from: '',
          period_to: '',
          project_name: '',
          details: '',
          skills: [],
        },
        ...userProjects.map((p) => ({
          ...p,
          skills: p.skills.map((s) => ({ id: s.id, name: s.name })),
          period_from: dateFormat(p.period_from, 'yyyy-MM'),
          period_to: p.period_to
            ? dateFormat(p.period_to, 'yyyy-MM')
            : undefined,
        })),
      ]);
      initialized.current = true;
    }
  }, [userProjects, replace]);

  const savedComplete = (project: ProjectForm) => {
    let projects = form.getValues('projects').filter(({ id }) => !!id) ?? [];
    const index = projects.findIndex((p) => p.id === project.id);

    // 更新 or 追加
    if (index === -1) {
      projects.push(project);
    } else {
      projects[index] = project;
    }

    // ソート（period_from → period_to の降順）
    projects = projects.sort((a, b) => {
      if (a.period_from !== b.period_from)
        return a.period_from < b.period_from ? 1 : -1;
      return (a.period_to ?? '') < (b.period_to ?? '') ? 1 : -1;
    });

    // 反映
    replace([
      {
        period_from: '',
        period_to: '',
        project_name: '',
        details: '',
        skills: [],
      },
      ...projects,
    ]);
  };

  return (
    <MypageContainer loading={isLoading} title="職務経歴編集">
      <div className="max-w-2xl">
        <Label htmlFor="projects">プロジェクト</Label>
        <div className="space-y-6">
          {form.watch('projects').map((p, i) => (
            <ProjectFormCard
              key={p.id ?? `new-${i}`}
              project={p}
              onSaved={(val) => savedComplete(val)}
              onDeleted={() => remove(i)}
            />
          ))}
        </div>
      </div>
    </MypageContainer>
  );
}
