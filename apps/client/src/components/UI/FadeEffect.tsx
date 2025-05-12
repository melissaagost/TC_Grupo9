import { motion, useInView } from "framer-motion";
import { ReactNode, useRef } from "react";

interface FadeEffectProps {
  children: ReactNode;
  duration?: number;
  once?: boolean;
}

const FadeEffect = ({ children, duration = 0.5, once = false }: FadeEffectProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration }}
    >
      {children}
    </motion.div>
  );
};

export default FadeEffect;
