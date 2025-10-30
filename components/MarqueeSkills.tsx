import { Marquee } from '@/components/ui/marquee';
import { Skill } from '@/types/master';

export const MarqueeSkills = ({ skills }: { skills: Skill[] }) => {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col overflow-hidden">
      <Marquee
        speed={30}
        direction="horizontal"
        fadeEdges={true}
        className="h-40"
      >
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="mb-3 flex h-28 w-28 items-center justify-center"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={skill.icon_url}
              alt={skill.name}
              className="h-16 w-16 object-contain"
            />
          </div>
        ))}
      </Marquee>
    </div>
  );
};
