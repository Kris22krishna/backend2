import { motion } from "motion/react";
import { useNavigate, useParams } from "react-router";
import { PageWrapper } from "../components/PageWrapper";
import { Mascot } from "../components/Mascot";
import { Home, Circle, Square, Triangle, Hash, Plus, Minus, X } from "lucide-react";
import { useState } from "react";

interface SubSkill {
  id: string;
  name: string;
  icon: React.ReactNode;
  completed: boolean;
  color: string;
}

const subSkillsData: Record<string, SubSkill[]> = {
  math: [
    { id: "counting", name: "Counting 1-20", icon: <Hash className="w-6 h-6" />, completed: true, color: "#FFE66D" },
    { id: "addition", name: "Addition Fun", icon: <Plus className="w-6 h-6" />, completed: true, color: "#98D8C8" },
    { id: "subtraction", name: "Subtraction", icon: <Minus className="w-6 h-6" />, completed: false, color: "#FFB6B9" },
    { id: "shapes", name: "Shapes & Colors", icon: <Circle className="w-6 h-6" />, completed: false, color: "#C9A9E9" },
    { id: "patterns", name: "Number Patterns", icon: <Square className="w-6 h-6" />, completed: false, color: "#87CEEB" },
    { id: "multiplication", name: "Times Tables", icon: <X className="w-6 h-6" />, completed: false, color: "#FFDAB9" }
  ],
  reading: [
    { id: "letters", name: "ABC's", icon: <Hash className="w-6 h-6" />, completed: true, color: "#87CEEB" },
    { id: "phonics", name: "Phonics Fun", icon: <Circle className="w-6 h-6" />, completed: false, color: "#FFE66D" },
    { id: "words", name: "Sight Words", icon: <Square className="w-6 h-6" />, completed: false, color: "#98D8C8" },
    { id: "stories", name: "Story Time", icon: <Triangle className="w-6 h-6" />, completed: false, color: "#C9A9E9" }
  ]
};

export default function SubSkillsPage() {
  const { skillId } = useParams();
  const navigate = useNavigate();
  const [hoveredSubSkill, setHoveredSubSkill] = useState<string | null>(null);
  
  const subSkills = subSkillsData[skillId || "math"] || subSkillsData.math;
  const completedCount = subSkills.filter(s => s.completed).length;

  return (
    <PageWrapper background="mint">
      <div className="container mx-auto px-8 py-12 min-h-screen">
        {/* Back Button */}
        <motion.button
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-lg text-[#2C3E50] font-bold text-lg mb-8 btn-3d"
        >
          <Home className="w-6 h-6" />
          Back Home
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-white drop-shadow-lg mb-4">
            Choose a Topic! 📚
          </h1>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", bounce: 0.6 }}
            className="inline-block px-8 py-4 bg-white rounded-full shadow-lg"
          >
            <p className="text-2xl font-bold text-[#2C3E50]">
              {completedCount} of {subSkills.length} completed! 🎉
            </p>
          </motion.div>
        </motion.div>

        {/* Sub-Skills Grid */}
        <div className="max-w-5xl mx-auto pb-32">
          <div className="flex flex-wrap justify-center gap-6">
            {subSkills.map((subSkill, index) => (
              <motion.button
                key={subSkill.id}
                initial={{ opacity: 0, scale: 0, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{
                  delay: index * 0.1,
                  type: "spring",
                  bounce: 0.5
                }}
                whileHover={{
                  scale: 1.1,
                  y: -8,
                  rotate: Math.random() > 0.5 ? 3 : -3
                }}
                whileTap={{
                  scale: 0.95
                }}
                onHoverStart={() => setHoveredSubSkill(subSkill.id)}
                onHoverEnd={() => setHoveredSubSkill(null)}
                onClick={() => navigate(`/practice/${subSkill.id}`)}
                className="relative group"
              >
                {/* Pill-shaped button */}
                <div
                  className="px-8 py-6 rounded-full flex items-center gap-4 shadow-xl border-4 border-white/50 min-w-[280px] relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${subSkill.color} 0%, ${subSkill.color}dd 100%)`,
                    boxShadow: hoveredSubSkill === subSkill.id
                      ? `0 12px 30px rgba(0, 0, 0, 0.25), 0 0 30px ${subSkill.color}80`
                      : "0 8px 20px rgba(0, 0, 0, 0.15)"
                  }}
                >
                  {/* Icon container */}
                  <motion.div
                    className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-md"
                    animate={hoveredSubSkill === subSkill.id ? {
                      rotate: [0, 360],
                      scale: [1, 1.2, 1]
                    } : {}}
                    transition={{ duration: 0.6 }}
                  >
                    <div style={{ color: subSkill.color }}>
                      {subSkill.icon}
                    </div>
                  </motion.div>

                  {/* Text */}
                  <div className="flex-1 text-left">
                    <h3 className="text-2xl font-bold text-white drop-shadow">
                      {subSkill.name}
                    </h3>
                  </div>

                  {/* Completed checkmark */}
                  {subSkill.completed && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: index * 0.1 + 0.3, type: "spring", bounce: 0.7 }}
                      className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
                    >
                      <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                  )}

                  {/* Pulsing glow effect */}
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    animate={{
                      boxShadow: [
                        `inset 0 0 20px ${subSkill.color}00`,
                        `inset 0 0 20px ${subSkill.color}40`,
                        `inset 0 0 20px ${subSkill.color}00`
                      ]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </div>

                {/* Floating "Start" label on hover */}
                {hoveredSubSkill === subSkill.id && !subSkill.completed && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: -5 }}
                    className="absolute -top-12 left-1/2 -translate-x-1/2 px-4 py-2 bg-white rounded-full shadow-lg whitespace-nowrap"
                  >
                    <span className="text-lg font-bold" style={{ color: subSkill.color }}>
                      Click to start! 🚀
                    </span>
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Mascot with celebration for completed items */}
      <Mascot
        position="right"
        animation={completedCount > 0 ? "celebrate" : "encourage"}
        speechBubble={
          completedCount > 0
            ? `You're doing great! ${completedCount} done!`
            : "Pick one to start learning!"
        }
        size="lg"
      />
    </PageWrapper>
  );
}
