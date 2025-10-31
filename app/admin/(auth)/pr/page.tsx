'use client';

import { MypageContainer } from '@/components/MypageContainer';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useFetch } from '@/lib/fetch.client';
import { UserPr } from '@/types/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as z from 'zod';
const prSchema = z.object({
  pr_text: z.string().max(1000, '1000文字以内で入力してください').optional(),
});
type PrFormData = z.infer<typeof prSchema>;

export default function PrEditPage() {
  const { data: userPr, isLoading } = useFetch<UserPr>('/api/admin/userPr');
  const initialized = useRef(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PrFormData>({
    resolver: zodResolver(prSchema),
  });

  useEffect(() => {
    if (userPr && !initialized.current) {
      reset({ pr_text: userPr.pr_text });
      initialized.current = true;
    }
  }, [reset, userPr]);

  const onSubmit: SubmitHandler<PrFormData> = async (data) => {
    try {
      const response = await fetch('/api/admin/userPr', {
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
    <MypageContainer loading={isLoading} title="自己PR編集">
      <div>
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
          <div className="space-y-2">
            <Label htmlFor="pr_text">自己PR</Label>
            <Textarea id="pr_text" rows={5} {...register('pr_text')} />
            {errors.pr_text && (
              <p className="text-xs text-red-500">{errors.pr_text.message}</p>
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
