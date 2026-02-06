import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { PageWrapper } from "../components/PageWrapper";
import { Mascot } from "../components/Mascot";
import { BookOpen, Calculator, Palette, Music, Globe, Star } from "lucide-react";
import { useState } from "react";

interface Skill {
  id: string;
  name: string;
  icon: React.ReactNode;
  progress: number;
  stars: number;
  color: string;
  gradient: string;
}

const skills: Skill[] = [
  {
    id: "math",
    name: "Math Adventures",
    icon: <Calculator className="w-12 h-12" />,
    progress: 65,
    stars: 4,
    color: "#FFE66D",
    gradient: "linear-gradient(135deg, #FFE66D 0%, #FFF4A3 100%)"
  },
  {
    id: "reading",
    name: "Reading Quest",
    icon: <BookOpen className="w-12 h-12" />,
    progress: 45,
    stars: 3,
    color: "#87CEEB",
    gradient: "linear-gradient(135deg, #87CEEB 0%, #B8D8F5 100%)"
  },
  {
    id: "art",
    name: "Creative Studio",
    icon: <Palette className="w-12 h-12" />,
    progress: 80,
    stars: 5,
    color: "#FFB6B9",
    gradient: "linear-gradient(135deg, #FFB6B9 0%, #FFC8CB 100%)"
  },
  {
    id: "music",
    name: "Music Magic",
    icon: <Music className="w-12 h-12" />,
    progress: 30,
    stars: 2,
    color: "#C9A9E9",
    gradient: "linear-gradient(135deg, #C9A9E9 0%, #E0CFFA 100%)"
  },
  {
    id: "science",
    name: "Science Explorer",
    icon: <Globe className="w-12 h-12" />,
    progress: 55,
    stars: 3,
    color: "#98D8C8",
    gradient: "linear-gradient(135deg, #98D8C8 0%, #B8E6D5 100%)"
  }
];

export default function SkillsPage() {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <PageWrapper background="sky">
      <div className="container mx-auto px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl font-bold text-white drop-shadow-lg mb-4">
            Choose Your Adventure! 🚀
          </h1>
          <p className="text-2xl text-white/90 drop-shadow">
            Pick a skill to start learning and having fun!
          </p>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto pb-32">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                delay: index * 0.1,
                duration: 0.5,
                type: "spring",
                bounce: 0.4
              }}
              whileHover={{ 
                scale: 1.05,
                y: -10,
                transition: { duration: 0.3 }
              }}
              onHoverStart={() => setHoveredCard(skill.id)}
              onHoverEnd={() => setHoveredCard(null)}
              onClick={() => navigate(`/skills/${skill.id}`)}
              className="relative cursor-pointer"
            >
              {/* Card */}
              <div 
                className="bg-white rounded-[2rem] p-8 shadow-xl border-4 border-white/50 relative overflow-hidden h-full"
                style={{
                  boxShadow: hoveredCard === skill.id
                    ? `0 20px 40px rgba(0, 0, 0, 0.2), 0 0 30px ${skill.color}40`
                    : "0 10px 30px rgba(0, 0, 0, 0.15)"
                }}
              >
                {/* Background gradient circle */}
                <div 
                  className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-20 blur-2xl"
                  style={{ background: skill.gradient }}
                />

                {/* Icon */}
                <motion.div
                  className="relative w-24 h-24 mx-auto mb-6 rounded-3xl flex items-center justify-center"
                  style={{ background: skill.gradient }}
                  animate={hoveredCard === skill.id ? { 
                    rotate: [0, -5, 5, 0],
                    scale: [1, 1.1, 1]
                  } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <div className="text-white drop-shadow-lg">
                    {skill.icon}
                  </div>
                </motion.div>

                {/* Skill Name */}
                <h2 className="text-3xl font-bold text-center mb-6 text-[#2C3E50]">
                  {skill.name}
                </h2>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg text-[#2C3E50]/70">Progress</span>
                    <span className="text-lg font-bold text-[#2C3E50]">{skill.progress}%</span>
                  </div>
                  <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden border-2 border-gray-300">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: skill.gradient }}
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.progress}%` }}
                      transition={{ delay: index * 0.1 + 0.3, duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>

                {/* Star Rating */}
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((starNum) => (
                    <motion.div
                      key={starNum}
                      initial={{ opacity: 0, scale: 0, rotate: 0 }}
                      animate={{ opacity: 1, scale: 1, rotate: 360 }}
                      transition={{ 
                        delay: index * 0.1 + 0.3 + starNum * 0.1,
                        type: "spring",
                        bounce: 0.6
                      }}
                    >
                      <Star
                        className={`w-8 h-8 ${
                          starNum <= skill.stars
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-gray-300 text-gray-300"
                        }`}
                        style={{
                          filter: starNum <= skill.stars ? "drop-shadow(0 0 8px rgba(255, 230, 109, 0.6))" : "none"
                        }}
                      />
                    </motion.div>
                  ))}
                </div>

                {/* Floating "Start" button on hover */}
                {hoveredCard === skill.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2"
                  >
                    <div 
                      className="px-8 py-3 rounded-full text-white font-bold text-xl shadow-lg"
                      style={{ background: skill.gradient }}
                    >
                      Let's Go! →
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Breathing animation */}
              <motion.div
                className="absolute inset-0 rounded-[2rem] pointer-events-none"
                animate={{
                  boxShadow: hoveredCard === skill.id 
                    ? []
                    : [
                        "0 0 0 0 rgba(135, 206, 235, 0)",
                        "0 0 0 8px rgba(135, 206, 235, 0.2)",
                        "0 0 0 0 rgba(135, 206, 235, 0)"
                      ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mascot */}
      <Mascot 
        position="right" 
        animation="point"
        speechBubble="Pick something fun to learn!"
        size="lg"
      />
    </PageWrapper>
  );
}