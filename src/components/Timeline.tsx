import { z } from 'zod';

// 1. Schema Definition
const ExperienceItemSchema = z.object({
  id: z.string().optional(),
  role: z.string(),
  company: z.string(),
  date: z.string(),
  desc: z.string(),
});

const TimelinePropsSchema = z.object({
  data: z.array(ExperienceItemSchema),
});

// 2. Type Definitions
type ExperienceItem = z.infer<typeof ExperienceItemSchema>;

interface TimelineProps {
  data: ExperienceItem[];
}

// 3. Component
export default function ExperienceTimeline({ data }: TimelineProps) {
  const validatedResult = TimelinePropsSchema.safeParse({ data });
  
  if (!validatedResult.success) {
    return null;
  }

  const items = validatedResult.data.data;

  return (
    <section aria-label="Professional Experience">
      <ol className="relative border-l border-gray-800 ml-3 space-y-12">
        {items.map((item, index) => (
          <li 
            key={`${item.company}-${index}`} 
            id={item.id || `exp-${index}`} 
            className="ml-8 relative group"
          >
            
            {/* Dot */}
            <div 
              className="absolute w-4 h-4 bg-gray-800 rounded-full mt-1.5 -left-[3.25rem] border-2 border-gray-600 group-hover:border-[#0070F3] group-hover:bg-[#0070F3] transition-colors" 
              aria-hidden="true"
            />

            {/* Date */}
            <time className="block mb-2 text-xs font-mono text-gray-500 leading-none tracking-wider uppercase">
              {item.date}
            </time>

            {/* Role */}
            <h3 className="text-xl font-bold font-sans text-white group-hover:text-[#0070F3] transition-colors">
              {item.role}
            </h3>

            {/* Company */}
            <div className="text-sm font-mono text-[#00FF94] mb-3">
              {item.company}
            </div>

            {/* Description */}
            <p className="text-base font-sans text-gray-400 max-w-2xl leading-relaxed">
              {item.desc}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}