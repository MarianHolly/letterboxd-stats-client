'use client';

import { motion } from "motion/react"
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const DemoShowcase = () => {
  const stats = [
    { label: 'Watched Films', value: '1,656', profile: 'Contemporary Cinema' },
    { label: 'Favorite Directors', value: '47', profile: 'Contemporary Cinema' },
    { label: 'Decades Analyzed', value: '10', profile: 'Contemporary Cinema' },
    { label: 'Avg Rating', value: '7.2', profile: 'Contemporary Cinema' },
  ];

  const stats2 = [
    { label: 'Watched Films', value: '1,999', profile: 'Cinema Historian' },
    { label: 'Favorite Directors', value: '62', profile: 'Cinema Historian' },
    { label: 'Decades Analyzed', value: '13', profile: 'Cinema Historian' },
    { label: 'Avg Rating', value: '7.1', profile: 'Cinema Historian' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="py-24 md:py-40 border-t border-border bg-slate-50 dark:bg-slate-900/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-24"
        >
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground mb-6">
            Try Before You Upload
          </h2>
          <p className="text-lg text-foreground/65 max-w-2xl mx-auto">
            Explore with real sample data. No login required. No files to upload. See what 18+ interactive charts look like in seconds.
          </p>
        </motion.div>

        {/* Demo Data Showcase */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-12"
        >
          {/* Profile 1 */}
          <motion.div
            variants={itemVariants}
            className="p-8 border border-border rounded-sm bg-white dark:bg-slate-950/50 hover:border-border-medium transition-all duration-300"
          >
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-foreground mb-1">
                Contemporary Cinema
              </h3>
              <p className="text-sm text-foreground/50">
                Modern and classic movies with complete viewing history
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="p-4 border border-border rounded-sm bg-slate-50 dark:bg-slate-900/30"
                >
                  <p className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                    {stat.value}
                  </p>
                  <p className="text-xs text-foreground/50 uppercase tracking-wide">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Profile 2 */}
          <motion.div
            variants={itemVariants}
            className="p-8 border border-border rounded-sm bg-white dark:bg-slate-950/50 hover:border-border-medium transition-all duration-300"
          >
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-foreground mb-1">
                Cinema Historian
              </h3>
              <p className="text-sm text-foreground/50">
                Spanning silent era to contemporary cinema
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {stats2.map((stat, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="p-4 border border-border rounded-sm bg-slate-50 dark:bg-slate-900/30"
                >
                  <p className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                    {stat.value}
                  </p>
                  <p className="text-xs text-foreground/50 uppercase tracking-wide">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link href="/analytics">
            <Button
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-6 rounded-sm flex items-center gap-2 transition-all duration-200"
            >
              Explore Sample Data
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/analytics">
            <Button
              variant="outline"
              size="lg"
              className="border-border-medium hover:bg-slate-50 dark:hover:bg-slate-900/50 font-semibold px-8 py-6 rounded-sm transition-all duration-200"
            >
              Try &quot;Contemporary Cinema&quot;
            </Button>
          </Link>
        </motion.div>

        {/* Footer Text */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center text-sm text-foreground/50 mt-8"
        >
          Or upload your own data to see your personal analytics
        </motion.p>
      </div>
    </section>
  );
};

export default DemoShowcase;
