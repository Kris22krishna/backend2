import { motion } from "motion/react";
import mascotStanding from "figma:asset/0a112212701e9977806405dd46a16d44e3e7fa0d.png";
import mascotFlying from "figma:asset/30756ca85f4fc28f675b411b03a3b94194c56d13.png";
import { useEffect, useState } from "react";

interface MascotProps {
  position?: "left" | "right" | "center";
  animation?: "wave" | "point" | "celebrate" | "encourage" | "idle";
  speechBubble?: string;
  size?: "sm" | "md" | "lg";
}

export function Mascot({ 
  position = "right", 
  animation = "idle",
  speechBubble,
  size = "md" 
}: MascotProps) {
  const [showBubble, setShowBubble] = useState(false);

  useEffect(() => {
    // Show speech bubble with slight delay for effect
    if (speechBubble) {
      const timer = setTimeout(() => setShowBubble(true), 500);
      return () => clearTimeout(timer);
    }
    setShowBubble(false);
  }, [speechBubble]);

  const sizeClasses = {
    sm: "w-24 h-24",
    md: "w-32 h-32",
    lg: "w-40 h-40"
  };

  const positionClasses = {
    left: "left-8",
    right: "right-8",
    center: "left-1/2 -translate-x-1/2"
  };

  // Use flying mascot for active animations, standing for idle
  const mascotImage = animation === "point" || animation === "wave" || animation === "celebrate" 
    ? mascotFlying 
    : mascotStanding;

  const animationVariants = {
    wave: {
      rotate: [0, 20, -20, 20, 0],
      transition: { duration: 1, repeat: Infinity, repeatDelay: 2 }
    },
    point: {
      x: [0, 10, 0],
      transition: { duration: 1, repeat: Infinity, repeatDelay: 1 }
    },
    celebrate: {
      scale: [1, 1.1, 1],
      rotate: [0, 10, -10, 0],
      transition: { duration: 0.5, repeat: 3 }
    },
    encourage: {
      y: [0, -5, 0],
      transition: { duration: 0.6, repeat: Infinity }
    },
    idle: {
      y: [0, -10, 0],
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
    }
  };

  return (
    <div className={`fixed ${positionClasses[position]} bottom-8 z-50`}>
      <motion.div
        className={`${sizeClasses[size]} relative`}
        animate={animationVariants[animation]}
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
      >
        <img 
          src={mascotImage} 
          alt="Learning Buddy" 
          className="w-full h-full object-contain drop-shadow-lg"
        />
        
        {speechBubble && showBubble && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="absolute -top-20 -left-4 bg-white rounded-3xl px-6 py-4 shadow-lg border-4 border-[#87CEEB] max-w-xs animate-breathe"
            style={{
              borderRadius: "2rem 2rem 0.5rem 2rem"
            }}
          >
            <p className="text-lg font-bold text-[#2C3E50]">{speechBubble}</p>
            {/* Speech bubble tail pointing to mascot */}
            <div 
              className="absolute -bottom-2 right-8 w-0 h-0"
              style={{
                borderLeft: "15px solid transparent",
                borderRight: "15px solid transparent",
                borderTop: "15px solid white"
              }}
            />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}