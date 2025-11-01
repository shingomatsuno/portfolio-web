'use client';

import { MypageContainer } from '@/components/MypageContainer';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useFetch } from '@/lib/fetch.client';
import { UserFreeText } from '@/types/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import * as z from 'zod';
import { Editor } from '@/components/Editor';
const ftSchema = z.object({
  free_text: z.string().max(5000, '5000文字以内で入力してください').optional(),
});
type FtFormData = z.infer<typeof ftSchema>;

export default function PrEditPage() {
  const { data: userFreeText, isLoading } = useFetch<UserFreeText>(
    '/api/admin/userFreeText',
  );
  const initialized = useRef(false);
  const {
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FtFormData>({
    resolver: zodResolver(ftSchema),
  });

  const value = watch('free_text');

  useEffect(() => {
    if (userFreeText && !initialized.current) {
      reset({ free_text: userFreeText.free_text });
      initialized.current = true;
    }
  }, [reset, userFreeText]);

  const onSubmit: SubmitHandler<FtFormData> = async (data) => {
    try {
      const response = await fetch('/api/admin/userFreeText', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to save');
      alert('保存しました');
    } catch (error) {
      console.error(error);
      alert('保存に失敗しました');
    }
  };

  return (
    <MypageContainer loading={isLoading} title="フリーテキスト編集">
      <div>
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
          <div className="space-y-2">
            <Label htmlFor="free_text">フリーテキスト</Label>
            <Editor
              defaultValue={userFreeText?.free_text}
              onChange={(val) => setValue('free_text', val)}
            />
            {errors.free_text && (
              <p className="text-xs text-red-500">{errors.free_text.message}</p>
            )}
          </div>
          <div className="text-right">
            <Button type="submit">更新</Button>
          </div>
        </form>
      </div>
    </MypageContainer>
  );
}
