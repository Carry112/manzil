import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FAQCategoryMap {
  [key: string]: string;
}

export interface FAQItemData {
  question: string;
  answer: string;
}

export interface FAQDataMap {
  [key: string]: FAQItemData[];
}

interface FAQProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  subtitle?: string;
  categories: FAQCategoryMap;
  faqData: FAQDataMap;
}

export const FAQ = ({
  title = 'FAQs',
  subtitle = 'Frequently Asked Questions',
  categories,
  faqData,
  className,
  ...props
}: FAQProps) => {
  const categoryKeys = useMemo(() => Object.keys(categories), [categories]);
  const [selectedCategory, setSelectedCategory] = useState(categoryKeys[0] || '');

  if (!categoryKeys.length) {
    return null;
  }

  return (
    <section
      className={cn(
        'relative overflow-hidden bg-background px-4 py-12 text-foreground',
        className
      )}
      {...props}
    >
      <FAQHeader title={title} subtitle={subtitle} />
      <FAQTabs
        categories={categories}
        selected={selectedCategory}
        setSelected={setSelectedCategory}
      />
      <FAQList faqData={faqData} selected={selectedCategory} />
    </section>
  );
};

interface FAQHeaderProps {
  title: string;
  subtitle: string;
}

const FAQHeader = ({ title, subtitle }: FAQHeaderProps) => (
  <div className="relative z-10 flex flex-col items-center justify-center">
    <span className="mb-8 bg-gradient-to-r from-primary to-primary/60 bg-clip-text font-medium text-transparent">
      {subtitle}
    </span>
    <h2 className="mb-8 text-center text-4xl font-bold md:text-5xl">{title}</h2>
    <span className="absolute -top-[350px] left-1/2 z-0 h-[500px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 blur-3xl" />
  </div>
);

interface FAQTabsProps {
  categories: FAQCategoryMap;
  selected: string;
  setSelected: (key: string) => void;
}

const FAQTabs = ({ categories, selected, setSelected }: FAQTabsProps) => (
  <div className="relative z-10 flex flex-wrap items-center justify-center gap-4">
    {Object.entries(categories).map(([key, label]) => (
      <button
        key={key}
        onClick={() => setSelected(key)}
        className={cn(
          'relative overflow-hidden whitespace-nowrap rounded-md border px-3 py-1.5 text-sm font-medium transition-colors duration-500',
          selected === key
            ? 'border-primary text-background'
            : 'border-border bg-transparent text-muted-foreground hover:text-foreground'
        )}
      >
        <span className="relative z-10">{label}</span>
        <AnimatePresence>
          {selected === key && (
            <motion.span
              initial={{ y: '100%' }}
              animate={{ y: '0%' }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="absolute inset-0 z-0 bg-gradient-to-r from-primary to-primary/80"
            />
          )}
        </AnimatePresence>
      </button>
    ))}
  </div>
);

interface FAQListProps {
  faqData: FAQDataMap;
  selected: string;
}

const FAQList = ({ faqData, selected }: FAQListProps) => (
  <div className="mx-auto mt-12 max-w-3xl">
    <AnimatePresence mode="wait">
      {Object.entries(faqData).map(([category, questions]) => {
        if (selected === category) {
          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="space-y-4"
            >
              {questions.map((faq, index) => (
                <FAQItem key={index} question={faq.question} answer={faq.answer} />
              ))}
            </motion.div>
          );
        }
        return null;
      })}
    </AnimatePresence>
  </div>
);

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem = ({ question, answer }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      animate={isOpen ? 'open' : 'closed'}
      className={cn(
        'rounded-xl border transition-colors',
        isOpen ? 'bg-muted/50' : 'bg-card'
      )}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-4 p-4 text-left"
      >
        <span
          className={cn(
            'text-lg font-medium transition-colors',
            isOpen ? 'text-foreground' : 'text-muted-foreground'
          )}
        >
          {question}
        </span>
        <motion.span
          variants={{
            open: { rotate: '45deg' },
            closed: { rotate: '0deg' },
          }}
          transition={{ duration: 0.2 }}
        >
          <Plus
            className={cn(
              'h-5 w-5 transition-colors',
              isOpen ? 'text-foreground' : 'text-muted-foreground'
            )}
          />
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{
          height: isOpen ? 'auto' : '0px',
          marginBottom: isOpen ? '16px' : '0px',
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="overflow-hidden px-4"
      >
        <p className="text-muted-foreground">{answer}</p>
      </motion.div>
    </motion.div>
  );
};
