import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Users, GraduationCap, Euro, Clock, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedSection from "./AnimatedSection";
import { useData } from "@/context/DataContext";
import { ContentBlock, StatItem } from "@/data/types";
import whyEgyptMapImg from "@/assets/why-egypt-map.jpg";

// Default blocks for the section
const defaultWhyEgyptBlocks: ContentBlock[] = [
  {
    id: 'we-main',
    type: 'image-text',
    order: 1,
    title: 'A proven engineering hub for global companies',
    subtitle: 'WHY EGYPT?',
    description: '<p>Egypt has emerged as one of the strongest offshore engineering markets supporting European tech teams. With a deep talent pool, competitive costs, and strong cultural alignment, Egypt offers an unmatched nearshore advantage.</p>',
    buttonText: 'Explore Talent',
    buttonLink: '/contact',
    secondaryButtonText: 'Schedule a Call',
    secondaryButtonLink: '/contact',
    image: '',
    backgroundColor: 'dark',
  },
  {
    id: 'we-stats',
    type: 'stats-bar',
    order: 2,
    title: '',
    items: [
      { id: 'ws1', value: '500,000+', label: 'Software & IT Pros' },
      { id: 'ws2', value: '240,000+', label: 'STEM Grads per Year' },
      { id: 'ws3', value: '40-60%', label: 'Cost Advantage' },
      { id: 'ws4', value: '±1-2 hrs', label: 'Time-Zone Overlap' },
      { id: 'ws5', value: 'English', label: '-first Tech Ed' },
    ],
    backgroundColor: 'dark',
  },
  {
    id: 'we-quote',
    type: 'testimonial',
    order: 3,
    title: '',
    description: '<p>"Global technology companies have built large-scale engineering and R&D hubs in Egypt, validating the market at scale and long term."</p>',
    backgroundColor: 'dark',
  },
  {
    id: 'we-cta',
    type: 'cta-banner',
    order: 4,
    title: 'Hire Developers',
    buttonText: 'Hire Developers',
    buttonLink: '/contact',
    backgroundColor: 'dark',
  },
];

const statIcons = [Users, GraduationCap, Euro, Clock, BookOpen];

const WhyEgypt = () => {
  const { getPageBlocks } = useData();
  const savedBlocks = getPageBlocks('why-egypt-home');
  const blocks = savedBlocks.length > 0 ? savedBlocks : defaultWhyEgyptBlocks;

  // Extract data from blocks
  const mainBlock = blocks.find(b => b.type === 'image-text') || defaultWhyEgyptBlocks[0];
  const statsBlock = blocks.find(b => b.type === 'stats-bar') || defaultWhyEgyptBlocks[1];
  const quoteBlock = blocks.find(b => b.type === 'testimonial') || defaultWhyEgyptBlocks[2];
  const ctaBlock = blocks.find(b => b.type === 'cta-banner') || defaultWhyEgyptBlocks[3];

  const stats = (statsBlock.items || []) as StatItem[];

  return (
    <section className="py-16 lg:py-24 bg-gradient-hero relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_hsl(22_80%_53%/0.06)_0%,_transparent_50%)]" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative z-10">
        {/* Section Label */}
        <AnimatedSection className="mb-10">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-semibold tracking-wider uppercase">
            {mainBlock.subtitle || 'WHY EGYPT?'}
          </span>
        </AnimatedSection>

        {/* Main Content: Text + Image */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16">
          {/* Left: Text Content */}
          <AnimatedSection direction="left">
            <div className="space-y-6">
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                {mainBlock.title}
              </h2>
              <div
                className="text-gray-400 text-base lg:text-lg leading-relaxed prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: mainBlock.description || '' }}
              />
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                {mainBlock.buttonText && (
                  <Button variant="hero" size="lg" asChild>
                    <Link to={mainBlock.buttonLink || '/contact'} className="gap-2">
                      {mainBlock.buttonText}
                      <ArrowRight size={18} />
                    </Link>
                  </Button>
                )}
                {mainBlock.secondaryButtonText && (
                  <Button variant="heroOutline" size="lg" asChild>
                    <Link to={mainBlock.secondaryButtonLink || '/contact'}>
                      {mainBlock.secondaryButtonText}
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </AnimatedSection>

          {/* Right: Map Image */}
          <AnimatedSection direction="right">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <img
                  src={mainBlock.image || whyEgyptMapImg}
                  alt="Europe to Egypt Connection"
                  className="w-full h-auto object-cover aspect-[4/3]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/40 to-transparent" />
              </div>
              {/* Floating pulse dots */}
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute top-1/3 right-1/4 w-3 h-3 bg-primary rounded-full shadow-glow"
              />
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
                className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-primary rounded-full shadow-glow"
              />
            </motion.div>
          </AnimatedSection>
        </div>

        {/* Stats Bar */}
        {stats.length > 0 && (
          <AnimatedSection delay={0.2} className="mb-16">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
              {stats.map((stat, index) => {
                const Icon = statIcons[index % statIcons.length];
                return (
                  <motion.div
                    key={stat.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/30 transition-all duration-300"
                  >
                    <Icon size={24} className="text-primary mx-auto mb-3" />
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", delay: 0.2 + index * 0.1 }}
                      className="text-2xl sm:text-3xl font-heading font-bold text-primary mb-1"
                    >
                      {stat.value}
                    </motion.div>
                    <p className="text-gray-400 text-xs sm:text-sm">{stat.label}</p>
                  </motion.div>
                );
              })}
            </div>
          </AnimatedSection>
        )}

        {/* Quote */}
        {quoteBlock.description && (
          <AnimatedSection delay={0.3} className="mb-16">
            <div className="max-w-4xl mx-auto text-center px-6 py-8 rounded-2xl bg-white/5 border border-white/10 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-primary text-5xl font-serif leading-none">"</div>
              <div
                className="text-gray-300 text-lg sm:text-xl font-medium leading-relaxed italic prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: quoteBlock.description || '' }}
              />
            </div>
          </AnimatedSection>
        )}

        {/* Bottom CTA */}
        {ctaBlock.buttonText && (
          <AnimatedSection delay={0.4} className="text-center">
            <Button variant="hero" size="xl" asChild>
              <Link to={ctaBlock.buttonLink || '/contact'} className="gap-3">
                <ArrowRight size={20} />
                {ctaBlock.buttonText}
              </Link>
            </Button>
          </AnimatedSection>
        )}
      </div>
    </section>
  );
};

export { defaultWhyEgyptBlocks };
export default WhyEgypt;
