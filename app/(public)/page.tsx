import { PortfolioPage } from '@/components/PortfolioPage';
import { createClient } from '@/lib/supabase/server';
import { Profile } from '@/types/user';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const username = process.env.DEFAULT_USERNAME;
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('id,username,name,avatar_url,birthday,bio,github_url,email')
    .eq('username', username)
    .single<Profile>();

  const name = profile?.name ?? '';
  const bio = `${profile?.name}のポートフォリオへようこそ!!
このサイトはNext.js、supabase、tailwindcss、vercelといったモダンなキラキラ技術をふんだんに活用してます。
さらには最近流行りのAIによる実装も取り入れてます。
このポートフォリオを見てもらうとちょっとだけ${profile?.name}(私)のことが分かるかもしれません。
`;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';
  const title = `${name}のポートフォリオ`;
  const description = bio;
  const image = `${siteUrl}/ogp-default.jpg`;

  return {
    title,
    description,
    keywords: [
      name,
      'ポートフォリオ',
      'Webエンジニア',
      '開発者',
      '制作実績',
      'プロフィール',
    ],
    openGraph: {
      title,
      description,
      url: siteUrl,
      siteName: `${name}のポートフォリオ`,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${name}のポートフォリオ`,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: '@hayabusa0909',
    },
    alternates: {
      canonical: siteUrl,
    },
    other: {
      'google-site-verification': process.env.GOOGLE_SITE_VERIFICATION,
    },
  };
}

export default function Page() {
  const username = process.env.DEFAULT_USERNAME!;
  return <PortfolioPage username={username} />;
}
