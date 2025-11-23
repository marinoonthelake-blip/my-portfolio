import { z } from 'zod';

// 1. Schema Definition
const ExperienceItemSchema = z.object({
  role: z.string(),
  company: z.string(),
  date: z.string(),
  desc: z.string(),
});

const TimelinePropsSchema = z.object({
  data: z.array(ExperienceItemSchema),
});

type ExperienceItem = z.infer<typeof ExperienceItemSchema>;

interface TimelineProps {
  data: ExperienceItem[];
}

// 2. React Server Component
export default function ExperienceTimeline({ data }: TimelineProps) {
  const validatedResult = TimelinePropsSchema.safeParse({ data });
  
  if (!validatedResult.success) {
    return null;
  }

  const items = validatedResult.data.data;

  return (
    <section aria-label="Professional Experience">
      <ol className="relative border-l border-gray-800 ml-3 space-y-10">
        {items.map((item, index) => (
          <li key={`${item.company}-${index}`} className="ml-6">
            
            {/* Dot */}
            <div 
              className="absolute w-3 h-3 bg-gray-700 rounded-full mt-1.5 -left-1.5 border border-gray-900" 
              aria-hidden="true"
            />

            {/* Date */}
            <time className="block mb-1 text-sm font-mono text-gray-500 leading-none">
              {item.date}
            </time>

            {/* Role */}
            <h3 className="text-lg font-bold font-sans text-white">
              {item.role}
            </h3>

            {/* Company */}
            <div className="text-base font-mono text-[#0070F3] mb-2">
              {item.company}
            </div>

            {/* Description */}
            <p className="text-base font-sans text-gray-400 max-w-prose">
              {item.desc}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}