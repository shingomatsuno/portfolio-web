'use client';

import { useState, useEffect, useRef } from 'react';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Profile } from '@/types/user';
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  type Crop,
  PixelCrop,
} from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Textarea } from '@/components/ui/textarea';
import { useFetch } from '@/lib/fetch.client';
import { MypageContainer } from '@/components/MypageContainer';

const profileSchema = z.object({
  name: z.string().min(1, '名前は必須です'),
  avatar: z
    .string()
    .url('有効なURLを入力してください')
    .optional()
    .or(z.literal('')),
  birthday: z.string().optional(),
  bio: z.string().max(1000, '1000文字以内で入力してください').optional(),
  github_url: z.string().url().optional().or(z.literal('')),
  email: z.string().email().optional().or(z.literal('')),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfileEditPage() {
  const { data: profile, isLoading } = useFetch<Profile>('/api/admin/profile');

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [croppedAvatarBlob, setCroppedAvatarBlob] = useState<Blob | null>(null);
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [isCropping, setIsCropping] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (profile) {
      setValue('name', profile.name);
      setValue('avatar', profile.avatar_url || '');
      setValue('birthday', profile.birthday || '');
      setValue('bio', profile.bio || '');
      setValue('github_url', profile.github_url || '');
      setValue('email', profile.email || '');
      if (profile.avatar_url) {
        setAvatarPreview(profile.avatar_url);
      }
    }
  }, [profile, setValue]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined); // Makes crop preview update between images.
      const reader = new FileReader();
      reader.addEventListener('load', () =>
        setImgSrc(reader.result?.toString() || ''),
      );
      reader.readAsDataURL(e.target.files[0]);
      setIsCropping(true);
    }
  };

  const getCroppedImg = (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const image = imgRef.current;
      const canvas = document.createElement('canvas');
      if (!image || !completedCrop) {
        throw new Error('Crop details not available');
      }

      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      canvas.width = completedCrop.width;
      canvas.height = completedCrop.height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('No 2d context');
      }

      const pixelRatio = window.devicePixelRatio;
      canvas.width = completedCrop.width * pixelRatio;
      canvas.height = completedCrop.height * pixelRatio;
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      ctx.imageSmoothingQuality = 'high';

      ctx.drawImage(
        image,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        completedCrop.width,
        completedCrop.height,
      );

      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg');
    });
  };

  const handleCropConfirm = async () => {
    if (completedCrop?.width && completedCrop?.height) {
      const blob = await getCroppedImg();
      if (blob) {
        setCroppedAvatarBlob(blob);
        setAvatarPreview(URL.createObjectURL(blob));
      }
    }
    setIsCropping(false);
  };

  const onSubmit: SubmitHandler<ProfileFormData> = async (data) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('birthday', data.birthday || '');
      formData.append('bio', data.bio || '');
      formData.append('github_url', data.github_url || '');
      formData.append('email', data.email || '');
      if (croppedAvatarBlob) {
        formData.append('avatar', croppedAvatarBlob, 'avatar.jpg');
      }

      const response = await fetch('/api/admin/profile', {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || 'プロフィールの更新に失敗しました',
        );
      }

      alert('プロフィールを更新しました');
    } catch (error) {
      console.error(error);
      const errorMessage =
        error instanceof Error ? error.message : '不明なエラーが発生しました';
      alert(`エラー: ${errorMessage}`);
    }
  };

  return (
    <>
      <Dialog open={isCropping} onOpenChange={setIsCropping}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>画像を切り抜く</DialogTitle>
          </DialogHeader>
          {imgSrc && (
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={1}
              className="mx-auto w-fit"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={imgRef}
                alt="Crop me"
                src={imgSrc}
                style={{
                  display: 'block',
                  maxHeight: '70vh',
                }}
                sizes="100vw"
                onLoad={(e) => {
                  const { width, height } = e.currentTarget;
                  const newCrop = centerCrop(
                    makeAspectCrop(
                      {
                        unit: '%',
                        width: 90,
                      },
                      1,
                      width,
                      height,
                    ),
                    width,
                    height,
                  );
                  setCrop(newCrop);
                }}
              />
            </ReactCrop>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCropping(false)}>
              キャンセル
            </Button>
            <Button onClick={handleCropConfirm}>決定</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <MypageContainer loading={isLoading} title="プロフィール編集">
        <div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-2xl space-y-6"
          >
            <div className="space-y-2">
              <Label htmlFor="avatar">アバター</Label>
              <div className="flex items-center gap-4">
                <Avatar className="h-24 w-24 rounded-lg">
                  <AvatarImage src={avatarPreview || undefined} alt="Avatar" />
                  <AvatarFallback className="rounded-lg">
                    {profile?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Input
                  id="avatar-upload"
                  type="file"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  onClick={() =>
                    document.getElementById('avatar-upload')?.click()
                  }
                >
                  画像をアップロード
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">名前</Label>
              <Input id="name" {...register('name')} />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthday">誕生日</Label>
              <Input id="birthday" type="date" {...register('birthday')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="github_url">Github</Label>
              <Input id="github_url" {...register('github_url')} />
              {errors.github_url && (
                <p className="text-xs text-red-500">
                  {errors.github_url.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">メールアドレス</Label>
              <Input id="email" {...register('email')} />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">自己紹介</Label>
              <Textarea id="bio" rows={5} {...register('bio')} />
            </div>
            <div className="text-right">
              <Button type="submit">更新</Button>
            </div>
          </form>
        </div>
      </MypageContainer>
    </>
  );
}
