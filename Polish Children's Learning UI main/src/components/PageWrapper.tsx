import { motion } from "motion/react";
import { ReactNode } from "react";

interface PageWrapperProps {
  children: ReactNode;
  background?: "sky" | "mint" | "lavender" | "peach";
}

export function PageWrapper({ children, background = "sky" }: PageWrapperProps) {
  const backgrounds = {
    sky: "linear-gradient(135deg, #87CEEB 0%, #E0F6FF 50%, #FFE5E5 100%)",
    mint: "linear-gradient(135deg, #98D8C8 0%, #E0F6FF 50%, #FFE5E5 100%)",
    lavender: "linear-gradient(135deg, #C9A9E9 0%, #E0CFFA 50%, #FFE5E5 100%)",
    peach: "linear-gradient(135deg, #FFDAB9 0%, #FFE5E5 50%, #E0F6FF 100%)"
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen w-full relative overflow-hidden"
      style={{ background: backgrounds[background] }}
    >
      {/* Decorative floating clouds/shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-white/20 rounded-full blur-2xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-40 h-40 bg-white/15 rounded-full blur-2xl"
          animate={{
            x: [0, -40, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-40 left-1/4 w-36 h-36 bg-white/10 rounded-full blur-2xl"
          animate={{
            x: [0, 60, 0],
            y: [0, -40, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
