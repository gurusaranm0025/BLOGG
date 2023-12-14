"use client";
import { AnimatePresence, motion } from "framer-motion";

function AnimationWrapper({
  keyValue,
  children,
  initial = { opacity: 0 },
  animate = { opacity: 1 },
  transition = { duration: 0.75 },
  className,
}) {
  return (
    <motion.div
      key={keyValue}
      className={className}
      initial={initial}
      animate={animate}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}

export default AnimationWrapper;
