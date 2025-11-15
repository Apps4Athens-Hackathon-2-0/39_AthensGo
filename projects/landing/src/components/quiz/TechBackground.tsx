import { motion } from 'framer-motion';

const TechBackground = () => {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-tech-bg via-pink-100 to-rose-100">
      {/* Binary Code Pattern - Optimized */}
      <div className="absolute inset-0 opacity-5 font-mono text-xs overflow-hidden select-none pointer-events-none">
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.div
            key={i}
            className="whitespace-nowrap"
            initial={{ x: '100%' }}
            animate={{ x: '-100%' }}
            transition={{
              duration: 20 + i * 3,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {Array.from({ length: 150 })
              .map(() => (Math.random() > 0.5 ? '1' : '0'))
              .join(' ')}
          </motion.div>
        ))}
      </div>

      {/* Code Symbols - Simplified */}
      <div className="absolute inset-0 opacity-10 font-mono text-4xl md:text-6xl select-none pointer-events-none">
        <motion.div
          className="absolute top-10 left-10 text-tech-pattern"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          &lt;/&gt;
        </motion.div>
        <motion.div
          className="absolute top-40 right-20 text-tech-pattern"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {'{ }'}
        </motion.div>
        <motion.div className="absolute bottom-20 left-1/4 text-tech-pattern">[ ]</motion.div>
        <motion.div className="absolute top-1/3 right-1/3 text-tech-pattern">( )</motion.div>
        <motion.div
          className="absolute bottom-40 right-10 text-tech-pattern"
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          =&gt;
        </motion.div>
      </div>

      {/* Floating Code Snippets */}
      <div className="absolute inset-0 opacity-5 font-mono text-xs md:text-sm select-none pointer-events-none">
        <motion.div
          className="absolute top-20 left-10"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          if (true) {'{'} <br />
          &nbsp;&nbsp;return "success"; <br />
          {'}'}
        </motion.div>

        <motion.div
          className="absolute top-40 right-32"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          for (let i = 0; i &lt; n; i++)
        </motion.div>

        <motion.div
          className="absolute bottom-32 left-1/3"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          function quiz() {'{'} <br />
          &nbsp;&nbsp;console.log("start"); <br />
          {'}'}
        </motion.div>
      </div>

      {/* Tech Icons */}
      <div className="absolute inset-0 opacity-8 text-6xl md:text-8xl select-none pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          ⚙️
        </motion.div>
        <motion.div
          className="absolute bottom-1/4 right-1/4"
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        >
          💻
        </motion.div>
        <motion.div
          className="absolute top-1/3 right-1/3"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          🎯
        </motion.div>
      </div>
    </div>
  );
};

export default TechBackground;
