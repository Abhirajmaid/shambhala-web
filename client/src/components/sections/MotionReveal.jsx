'use client';

import { motion } from 'motion/react';

export function MotionReveal({ children, className = '', delay = 0 }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.55, delay }}>
      {children}
    </motion.div>
  );
}
