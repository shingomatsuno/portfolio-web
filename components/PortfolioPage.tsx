import {
  Github,
  Mail,
  ArrowRight,
  Code2,
  ExternalLink,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import { MarqueeSkills } from '@/components/MarqueeSkills';
import { notFound } from 'next/navigation';
import {
  getProfile,
  getUserFreeText,
  getUserPr,
  getUserProjects,
  getUserSkills,
} from '@/lib/api/user';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

import { dateFormat } from '@/lib/utils';
import Link from 'next/link';
import { AnimateText } from './ui/animated-text';
import Image from 'next/image';

export const PortfolioPage = async ({ username }: { username: string }) => {
  const { data: profile } = await getProfile({ username });

  if (!profile) {
    notFound();
  }

  const [
    { data: skills },
    { data: projects },
    { data: pr },
    { data: freeText },
  ] = await Promise.all([
    getUserSkills(profile.id),
    getUserProjects(profile.id),
    getUserPr(profile.id),
    getUserFreeText(profile.id),
  ]);

  return (
    <div>
      <Header profile={profile} />
      <section
        id="hero"
        className="flex min-h-screen items-center justify-center px-6 py-20"
      >
        <div className="mt-8 w-full max-w-5xl text-center">
          <Image
            className="max-w-full"
            src="/mv.png"
            height={630}
            width={1200}
            alt={profile.name + ' のポートフォリオ'}
          />
          <div className="mb-8 mt-5">
            <h1 className="mb-6 text-3xl font-bold text-slate-900 dark:text-white md:text-5xl">
              {profile.name}
              <span className="text-sm">のポートフォリオ</span>
            </h1>
            <p className="mx-auto max-w-[780px] text-center text-sm text-slate-600 dark:text-slate-400">
              {profile.name}のポートフォリオへようこそ!!
              <br />
              このサイトはNext.js、supabase、tailwindcss、vercelといったモダンなキラキラ技術をふんだんに活用してます。
              <br />
              さらには最近流行りのAIによる実装も取り入れてます。
              <br />
              このポートフォリオを見てもらうとちょっとだけ{profile.name}
              (私)のことが分かるかもしれません。
            </p>
            <div className="py-10">
              <MarqueeSkills skills={skills} />
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="group rounded-full px-8" asChild>
                <a href="#projects">
                  プロジェクトを見る
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
              {profile.email && (
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-8"
                  asChild
                >
                  <a href="#contact">お問い合わせ</a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      <section
        id="about"
        className="flex min-h-screen items-center justify-center px-6 py-20"
      >
        <div className="w-full max-w-4xl">
          <AnimateText
            className="justify-center"
            text="About Me"
            type="expand"
          />
          <p className="mb-4 text-center">かんたんに自己紹介</p>
          <Card className="border-2 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
            <CardContent className="p-4">
              <div className="flex flex-col items-center justify-center gap-2 md:flex-row md:gap-4">
                <Avatar className="h-40 w-40 self-center rounded-lg md:self-start">
                  <AvatarImage
                    src={profile.avatar_url || undefined}
                    alt="Avatar"
                  />
                  <AvatarFallback className="rounded-lg">
                    {profile?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p>{profile.name}</p>
                  {profile.birthday && <p>{dateFormat(profile.birthday)}</p>}
                  <p className="whitespace-pre-line leading-relaxed text-slate-700 dark:text-slate-300">
                    {profile.bio}
                  </p>
                </div>
              </div>
              {pr && (
                <div className="mt-4">
                  <div className="text-sm font-bold">自己PR</div>
                  <p className="whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-400">
                    {pr.pr_text}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
      <section
        id="skills"
        className="flex min-h-screen items-center justify-center px-6 py-20"
      >
        <div className="w-full max-w-6xl">
          <AnimateText className="justify-center" text="Skills" type="expand" />
          <p className="mb-4 text-center">
            仕事やプライベートでそこそこ触ったことがある技術たちです。
          </p>
          {skills && skills.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-6">
              {skills.map((skill) => (
                <Card
                  key={skill.id}
                  className="flex w-32 flex-col items-center border-2 p-4 transition-all hover:scale-105 hover:shadow-xl"
                >
                  <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                    {skill.icon_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={skill.icon_url}
                        alt={skill.name}
                        className="h-10 w-10 object-contain"
                      />
                    ) : (
                      <Code2 className="h-10 w-10 text-slate-700 dark:text-slate-300" />
                    )}
                  </div>
                  <p className="text-center text-sm font-semibold">
                    {skill.name}
                  </p>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-600 dark:text-slate-400">
              スキル情報がありません
            </p>
          )}
        </div>
      </section>

      <section
        id="projects"
        className="flex min-h-screen items-center justify-center px-6 py-20"
      >
        <div className="w-full max-w-6xl">
          <AnimateText
            className="justify-center"
            text="Projects"
            type="expand"
          />
          <div className="mb-4 flex flex-col items-center justify-center md:flex-row">
            <p className="text-center">今まで携わってきたプロジェクトです。</p>
            <Link
              href={`/user/${profile?.username}/skillsheet`}
              target="_blank"
              className="flex items-center justify-end gap-1 text-sm text-gray-500 hover:text-gray-700"
            >
              <FileText size={14} /> スキルシートで詳細を確認
            </Link>
          </div>
          {projects && projects.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <Card
                  key={project.id}
                  className="border-2 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                >
                  <CardHeader>
                    <CardTitle className="text-xl">
                      {project.project_name}
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                      {dateFormat(project.period_from, 'yyyy/MM')}
                      {project.period_to
                        ? ` 〜 ${dateFormat(project.period_to, 'yyyy/MM')}`
                        : ' 〜 現在'}
                    </CardDescription>
                    <CardDescription className="mt-2 line-clamp-2 h-[40px] break-words">
                      {project.details}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {project.skills && project.skills.length > 0 ? (
                        project.skills.map((skill) => (
                          <Badge
                            key={skill.id}
                            variant="outline"
                            className="text-xs"
                          >
                            {skill.name}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400">
                          スキル未設定
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-600 dark:text-slate-400">
              プロジェクト情報がありません
            </p>
          )}
        </div>
      </section>
      {freeText && (
        <section className="flex min-h-screen items-center justify-center px-6 py-20">
          <div className="tiptap w-full max-w-5xl text-center">
            <div dangerouslySetInnerHTML={{ __html: freeText.free_text }} />
          </div>
        </section>
      )}

      {profile.email && (
        <section
          id="contact"
          className="flex min-h-screen items-center justify-center px-6 py-20"
        >
          <div className="w-full max-w-2xl text-center">
            <h2 className="mb-8 text-5xl font-bold">Get In Touch</h2>
            <p className="mb-12 text-xl text-slate-600 dark:text-slate-400">
              プロジェクトのご相談や質問がありましたら、お気軽にご連絡ください
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {profile.github_url && (
                <Button
                  size="lg"
                  variant="outline"
                  className="group rounded-full px-8"
                  asChild
                >
                  <a
                    href={profile.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="mr-2 h-5 w-5" />
                    GitHub
                    <ExternalLink className="ml-2 h-4 w-4 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                  </a>
                </Button>
              )}

              <Button
                size="lg"
                className="group rounded-full px-12 text-lg"
                asChild
              >
                <a href={`mailto:${profile.email}`}>
                  <Mail className="mr-2 h-5 w-5" />
                  メールを送る
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
            </div>
          </div>
        </section>
      )}

      <footer className="border-t py-8 text-center text-slate-600 dark:text-slate-400">
        <p>&copy; 2025 Shingo. All rights reserved.</p>
      </footer>
    </div>
  );
};
