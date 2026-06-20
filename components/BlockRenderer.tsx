import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Sparkles, ArrowRight, Check, Star, LucideIcon,
  Target, RefreshCw, MessageSquare, Settings, Handshake, Globe,
  Landmark, Award, Search, Users, Gem, TrendingUp,
  Code2, Smartphone, BrainCircuit, Users2, Cloud, ShieldCheck,
  GraduationCap, Building2, Clock, Euro, Briefcase, Lightbulb,
  Rocket, BarChart3, Heart, Zap, Shield, Lock,
  FileCheck, Layers, MonitorSmartphone, Cpu, Database, GitBranch,
  Puzzle, CheckCircle2, CircleDot, ArrowUpRight, BookOpen, Headphones,
  Mail, Phone, MapPin, Calendar, Star as StarIcon, ThumbsUp,
  ClipboardCheck, HeartHandshake, FileSearch
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import AnimatedSection from "@/components/AnimatedSection";
import { ContentBlock, IconGridItem, CardItem, FaqItem, StatItem, GalleryItem, PricingItem, TeamMember, TimelineItem, LogoItem } from "@/data/types";
import heroDefaultImage from "@/assets/hero-ai.jpg";

// Lucide icon mapping - use icon name strings in block data
const lucideIconMap: Record<string, LucideIcon> = {
  Target, RefreshCw, MessageSquare, Settings, Handshake, Globe,
  Landmark, Award, Search, Users, Gem, TrendingUp,
  Code2, Smartphone, BrainCircuit, Users2, Cloud, ShieldCheck,
  GraduationCap, Building2, Clock, Euro, Briefcase, Lightbulb,
  Rocket, BarChart3, Heart, Zap, Shield, Lock,
  FileCheck, Layers, MonitorSmartphone, Cpu, Database, GitBranch,
  Puzzle, CheckCircle2, CircleDot, ArrowUpRight, BookOpen, Headphones,
  Mail, Phone, MapPin, Calendar, Star: StarIcon, ThumbsUp, Sparkles, Check,
  ClipboardCheck, HeartHandshake, FileSearch,
};

// Render icon - supports both Lucide icon names and emoji fallback
const RenderIcon = ({ icon, size = 24, className }: { icon?: string; size?: number; className?: string }) => {
  if (!icon) return null;
  const LucideComp = lucideIconMap[icon];
  if (LucideComp) return <LucideComp size={size} strokeWidth={1.5} className={className} />;
  return <span className={className} style={{ fontSize: size * 0.8 }}>{icon}</span>;
};

interface BlockRendererProps {
  blocks: ContentBlock[];
}

// Helper to render HTML content safely
const HtmlContent = ({ html, className }: { html?: string; className?: string }) => {
  if (!html) return null;
  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
};

// Background class helper
const getBackgroundClass = (bg?: string) => {
  switch (bg) {
    case 'muted': return 'bg-muted/30';
    case 'dark': return 'bg-secondary text-secondary-foreground';
    case 'primary': return 'bg-primary text-primary-foreground';
    default: return 'bg-background';
  }
};

const HeroImageBlock = ({ block }: { block: ContentBlock }) => (
  <section className="pt-32 pb-20 bg-gradient-hero relative overflow-hidden">
    <div className="absolute inset-0">
      <img src={block.image || heroDefaultImage} alt="" className="w-full h-full object-cover opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/90 to-secondary/70" />
    </div>
    <div className="container-custom relative z-10">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
        {block.subtitle && (
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-medium mb-4">
            {block.subtitle}
          </span>
        )}
        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-secondary-foreground mb-6">
          {block.title?.split(' ').slice(0, -1).join(' ')}{' '}
          <span className="text-gradient">{block.title?.split(' ').slice(-1)[0]}</span>
        </h1>
        <HtmlContent html={block.description} className="text-secondary-foreground/70 text-lg leading-relaxed prose prose-invert max-w-none" />
        {block.buttonText && (
          <div className="mt-8">
            <Button variant="hero" size="lg" asChild>
              <Link to={block.buttonLink || '#'}><Sparkles size={18} />{block.buttonText}</Link>
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  </section>
);

const HeroVideoBlock = ({ block }: { block: ContentBlock }) => (
  <section className="relative min-h-[70vh] flex items-center overflow-hidden">
    {block.video && (
      <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
        <source src={block.video} type="video/mp4" />
      </video>
    )}
    <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/80 to-secondary/50" />
    <div className="container-custom relative z-10">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl space-y-6">
        {block.subtitle && (
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-medium">
            {block.subtitle}
          </span>
        )}
        <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-secondary-foreground">{block.title}</h2>
        <HtmlContent html={block.description} className="text-lg text-secondary-foreground/70 leading-relaxed prose prose-invert max-w-none" />
        {block.buttonText && (
          <Button variant="hero" size="lg" asChild>
            <Link to={block.buttonLink || '#'}>{block.buttonText}</Link>
          </Button>
        )}
      </motion.div>
    </div>
  </section>
);

const IconGridBlock = ({ block }: { block: ContentBlock }) => {
  const items = (block.items || []) as IconGridItem[];
  const cols = block.columns || 3;
  const gridClass = cols === 2 ? 'md:grid-cols-2' : cols === 4 ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-2 lg:grid-cols-3';
  const isDark = block.backgroundColor === 'dark';
  
  return (
    <section className={`section-padding ${getBackgroundClass(block.backgroundColor)}`}>
      <div className="container-custom">
        {block.title && (
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-6">
              {block.title?.split(' ').slice(0, -1).join(' ')}{' '}
              <span className="text-gradient">{block.title?.split(' ').slice(-1)[0]}</span>
            </h2>
            <HtmlContent html={block.subtitle} className={`text-lg ${isDark ? 'text-secondary-foreground/70' : 'text-muted-foreground'}`} />
          </AnimatedSection>
        )}
        <div className={`grid gap-8 ${gridClass}`}>
          {items.map((item, index) => (
            <AnimatedSection key={item.id} delay={index * 0.1}>
              <div className="text-center">
                <motion.div whileHover={{ scale: 1.1 }} className="w-20 h-20 rounded-2xl bg-gradient-primary mx-auto mb-6 flex items-center justify-center">
                  <RenderIcon icon={item.icon} size={32} className="text-primary-foreground" />
                </motion.div>
                <h3 className="font-heading text-xl font-semibold mb-3">{item.title}</h3>
                <HtmlContent html={item.description} className={`text-sm ${isDark ? 'text-secondary-foreground/70' : 'text-muted-foreground'}`} />
                {item.linkText && item.linkUrl && (
                  <Link to={item.linkUrl} className="inline-flex items-center text-primary text-sm font-medium mt-3 hover:underline gap-1">
                    {item.linkText} <ArrowRight size={14} />
                  </Link>
                )}
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

const FeaturesListBlock = ({ block }: { block: ContentBlock }) => {
  const items = (block.items || []) as IconGridItem[];
  const isDark = block.backgroundColor === 'dark';
  
  return (
    <section className={`section-padding ${getBackgroundClass(block.backgroundColor)}`}>
      <div className="container-custom">
        {block.title && (
          <AnimatedSection className="mb-12">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">{block.title}</h2>
            <HtmlContent html={block.subtitle} className={`text-lg ${isDark ? 'text-secondary-foreground/70' : 'text-muted-foreground'}`} />
          </AnimatedSection>
        )}
        <div className="space-y-6">
          {items.map((item, index) => (
            <AnimatedSection key={item.id} delay={index * 0.05}>
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center text-primary-foreground shrink-0">
                  <RenderIcon icon={item.icon} size={22} className="text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold mb-1">{item.title}</h3>
                  <HtmlContent html={item.description} className={`text-sm ${isDark ? 'text-secondary-foreground/70' : 'text-muted-foreground'}`} />
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

const ImageTextBlock = ({ block, reversed = false }: { block: ContentBlock; reversed?: boolean }) => {
  const isDark = block.backgroundColor === 'dark';
  
  return (
    <section className={`section-padding ${getBackgroundClass(block.backgroundColor)}`}>
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <AnimatedSection direction={reversed ? "right" : "left"} className={reversed ? 'lg:order-2' : ''}>
            {block.image ? (
              <div className="relative rounded-2xl overflow-hidden shadow-elevated">
                <img src={block.image} alt={block.title || ''} className="w-full h-auto object-cover aspect-[4/3]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden shadow-elevated bg-muted aspect-[4/3] flex items-center justify-center">
                <span className="text-muted-foreground">No image</span>
              </div>
            )}
            {block.image && <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-transparent rounded-3xl blur-3xl -z-10" />}
          </AnimatedSection>
          
          <AnimatedSection direction={reversed ? "left" : "right"} className={reversed ? 'lg:order-1' : ''}>
            <div className="space-y-6">
              {block.subtitle && (
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  {block.subtitle}
                </span>
              )}
              <h2 className="font-heading text-3xl sm:text-4xl font-bold">
                {block.title?.split(' ').slice(0, -1).join(' ')}{' '}
                <span className="text-gradient">{block.title?.split(' ').slice(-1)[0]}</span>
              </h2>
              <HtmlContent html={block.description} className={`text-lg leading-relaxed prose max-w-none ${isDark ? 'text-secondary-foreground/70 prose-invert' : 'text-muted-foreground'}`} />
              {block.buttonText && (
                <Button asChild>
                  <Link to={block.buttonLink || '#'}>{block.buttonText}<ArrowRight size={16} /></Link>
                </Button>
              )}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

const CardsGridBlock = ({ block }: { block: ContentBlock }) => {
  const items = (block.items || []) as CardItem[];
  const cols = block.columns || 3;
  const gridClass = cols === 2 ? 'md:grid-cols-2' : cols === 4 ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-2 lg:grid-cols-3';
  const isDark = block.backgroundColor === 'dark';
  
  return (
    <section className={`section-padding ${getBackgroundClass(block.backgroundColor)}`}>
      <div className="container-custom">
        {block.title && (
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
              {block.title?.split(' ').slice(0, -1).join(' ')}{' '}
              <span className="text-gradient">{block.title?.split(' ').slice(-1)[0]}</span>
            </h2>
            <HtmlContent html={block.subtitle} className={`text-lg ${isDark ? 'text-secondary-foreground/70' : 'text-muted-foreground'}`} />
          </AnimatedSection>
        )}
        <div className={`grid gap-8 ${gridClass}`}>
          {items.map((item, index) => (
            <AnimatedSection key={item.id} delay={index * 0.1}>
              <motion.div whileHover={{ y: -8 }} transition={{ duration: 0.3 }} className={`h-full p-8 rounded-2xl border shadow-card hover:shadow-elevated hover:border-primary/30 transition-all duration-500 group ${isDark ? 'bg-secondary-foreground/5 border-secondary-foreground/10' : 'bg-card border-border/50'}`}>
                {item.image && (
                  <div className="aspect-[16/10] overflow-hidden rounded-xl mb-6">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                )}
                {item.icon && !item.image && (
                  <div className="relative mb-6">
                    <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center text-primary-foreground shadow-lg">
                      <RenderIcon icon={item.icon} size={28} />
                    </motion.div>
                    <div className="absolute inset-0 w-16 h-16 rounded-2xl bg-primary blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
                  </div>
                )}
                <h3 className="font-heading text-xl font-semibold mb-3">{item.title}</h3>
                <HtmlContent html={item.description} className={`leading-relaxed ${isDark ? 'text-secondary-foreground/70' : 'text-muted-foreground'}`} />
                {item.linkText && item.linkUrl && (
                  <Link to={item.linkUrl} className="inline-flex items-center gap-2 text-primary font-medium mt-4 group-hover:gap-3 transition-all">
                    {item.linkText} <ArrowRight size={16} />
                  </Link>
                )}
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

const StatsBarBlock = ({ block }: { block: ContentBlock }) => {
  const items = (block.items || []) as StatItem[];
  const isDark = block.backgroundColor === 'dark';
  
  return (
    <section className={`section-padding ${getBackgroundClass(block.backgroundColor)}`}>
      <div className="container-custom">
        {block.title && (
          <AnimatedSection className="text-center mb-12">
            <h2 className="font-heading text-2xl font-bold">{block.title}</h2>
          </AnimatedSection>
        )}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item, index) => (
            <AnimatedSection key={item.id} delay={index * 0.1}>
              <motion.div whileHover={{ scale: 1.05 }} className={`text-center p-6 rounded-2xl ${isDark ? 'bg-secondary-foreground/5 border border-secondary-foreground/10' : 'bg-card border border-border/50 shadow-card'}`}>
                <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ type: "spring", delay: 0.2 + index * 0.1 }} className="text-4xl sm:text-5xl font-heading font-bold text-primary mb-2">
                  {item.value}
                </motion.div>
                <div className={isDark ? 'text-secondary-foreground/70' : 'text-muted-foreground'}>{item.label}</div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

const TestimonialBlock = ({ block }: { block: ContentBlock }) => (
  <section className={`section-padding ${getBackgroundClass(block.backgroundColor)}`}>
    <div className="container-custom">
      <AnimatedSection>
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-5xl mb-6">❝</div>
          <HtmlContent html={block.description} className="text-xl sm:text-2xl font-medium leading-relaxed mb-8 prose max-w-none mx-auto" />
          <div className="flex items-center justify-center gap-4">
            {block.image && <img src={block.image} alt={block.title || 'Author'} className="w-14 h-14 rounded-full object-cover" />}
            <div className="text-left">
              <div className="font-semibold">{block.title}</div>
              {block.subtitle && <div className="text-muted-foreground text-sm">{block.subtitle}</div>}
            </div>
          </div>
        </div>
      </AnimatedSection>
    </div>
  </section>
);

const CtaBannerBlock = ({ block }: { block: ContentBlock }) => {
  const isDark = block.backgroundColor === 'dark';
  
  return (
    <section className={`section-padding ${isDark ? 'bg-secondary text-secondary-foreground' : getBackgroundClass(block.backgroundColor)}`}>
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <AnimatedSection direction="left">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-6">
              {block.title?.split(' ').slice(0, -1).join(' ')}{' '}
              <span className="text-gradient">{block.title?.split(' ').slice(-1)[0]}</span>
            </h2>
            <HtmlContent html={block.description} className={`text-lg mb-8 prose max-w-none ${isDark ? 'text-secondary-foreground/70 prose-invert' : 'text-muted-foreground'}`} />
            <div className="flex flex-col sm:flex-row gap-4">
              {block.buttonText && (
                <Button variant="hero" size="lg" asChild>
                  <Link to={block.buttonLink || '#'}><Sparkles size={18} />{block.buttonText}</Link>
                </Button>
              )}
              {block.secondaryButtonText && (
                <Button variant="heroOutline" size="lg" asChild>
                  <Link to={block.secondaryButtonLink || '#'}>{block.secondaryButtonText}</Link>
                </Button>
              )}
            </div>
          </AnimatedSection>
          <AnimatedSection direction="right">
            {block.image && (
              <div className="relative rounded-2xl overflow-hidden shadow-elevated">
                <img src={block.image} alt="" className="w-full h-auto object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/50 to-transparent" />
              </div>
            )}
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

const AccordionFaqBlock = ({ block }: { block: ContentBlock }) => {
  const items = (block.items || []) as FaqItem[];
  
  return (
    <section className={`section-padding ${getBackgroundClass(block.backgroundColor)}`}>
      <div className="container-custom">
        {block.title && (
          <AnimatedSection className="text-center mb-12">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">{block.title}</h2>
            <HtmlContent html={block.subtitle} className="text-muted-foreground text-lg" />
          </AnimatedSection>
        )}
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {items.map((item, index) => (
              <AnimatedSection key={item.id} delay={index * 0.05}>
                <AccordionItem value={item.id} className="border border-border rounded-xl px-6">
                  <AccordionTrigger className="text-left font-medium hover:no-underline">{item.question}</AccordionTrigger>
                  <AccordionContent>
                    <HtmlContent html={item.answer} className="text-muted-foreground prose max-w-none" />
                  </AccordionContent>
                </AccordionItem>
              </AnimatedSection>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

const GalleryBlock = ({ block }: { block: ContentBlock }) => {
  const items = (block.items || []) as GalleryItem[];
  const cols = block.columns || 3;
  const gridClass = cols === 2 ? 'md:grid-cols-2' : cols === 4 ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-2 lg:grid-cols-3';
  
  return (
    <section className={`section-padding ${getBackgroundClass(block.backgroundColor)}`}>
      <div className="container-custom">
        {block.title && (
          <AnimatedSection className="text-center mb-12">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">{block.title}</h2>
            <HtmlContent html={block.subtitle} className="text-muted-foreground text-lg" />
          </AnimatedSection>
        )}
        <div className={`grid gap-4 ${gridClass}`}>
          {items.map((item, index) => (
            <AnimatedSection key={item.id} delay={index * 0.1}>
              <motion.div whileHover={{ scale: 1.02 }} className="rounded-xl overflow-hidden shadow-card group">
                <img src={item.image} alt={item.caption || 'Gallery image'} className="w-full h-auto object-cover aspect-square group-hover:scale-105 transition-transform duration-500" />
                {item.caption && (
                  <div className="p-3 bg-card text-center"><p className="text-sm text-muted-foreground">{item.caption}</p></div>
                )}
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

const VideoEmbedBlock = ({ block }: { block: ContentBlock }) => {
  const getEmbedUrl = () => {
    if (!block.video) return '';
    if (block.videoType === 'upload') return block.video;
    if (block.videoType === 'youtube') {
      const match = block.video.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
      return match ? `https://www.youtube.com/embed/${match[1]}` : block.video;
    }
    if (block.videoType === 'vimeo') {
      const match = block.video.match(/vimeo\.com\/(\d+)/);
      return match ? `https://player.vimeo.com/video/${match[1]}` : block.video;
    }
    return block.video;
  };
  
  return (
    <section className={`section-padding ${getBackgroundClass(block.backgroundColor)}`}>
      <div className="container-custom">
        {block.title && (
          <AnimatedSection className="text-center mb-8">
            <h2 className="font-heading text-3xl font-bold mb-4">{block.title}</h2>
            <HtmlContent html={block.subtitle} className="text-muted-foreground text-lg" />
          </AnimatedSection>
        )}
        <AnimatedSection>
          <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-elevated">
            {block.videoType === 'upload' ? (
              <video controls className="w-full aspect-video"><source src={block.video} type="video/mp4" /></video>
            ) : (
              <iframe src={getEmbedUrl()} className="w-full aspect-video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            )}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

const RichTextBlock = ({ block }: { block: ContentBlock }) => (
  <section className={`section-padding ${getBackgroundClass(block.backgroundColor)}`}>
    <div className="container-custom">
      {block.title && (
        <AnimatedSection className="mb-8"><h2 className="font-heading text-3xl font-bold">{block.title}</h2></AnimatedSection>
      )}
      <AnimatedSection>
        <article 
          className="prose prose-lg max-w-4xl mx-auto prose-headings:font-heading prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-primary hover:prose-a:underline prose-strong:text-foreground prose-img:rounded-xl prose-img:shadow-lg"
          dangerouslySetInnerHTML={{ __html: block.content || '' }}
        />
      </AnimatedSection>
    </div>
  </section>
);

const HtmlBlock = ({ block }: { block: ContentBlock }) => (
  <section className={`section-padding ${getBackgroundClass(block.backgroundColor)}`}>
    <div className="container-custom">
      {block.title && (
        <AnimatedSection className="mb-8"><h2 className="font-heading text-3xl font-bold">{block.title}</h2></AnimatedSection>
      )}
      <AnimatedSection>
        <div dangerouslySetInnerHTML={{ __html: block.content || '' }} />
      </AnimatedSection>
    </div>
  </section>
);

const TwoColumnsBlock = ({ block }: { block: ContentBlock }) => (
  <section className={`section-padding ${getBackgroundClass(block.backgroundColor)}`}>
    <div className="container-custom">
      {block.title && (
        <AnimatedSection className="mb-12"><h2 className="font-heading text-3xl font-bold">{block.title}</h2></AnimatedSection>
      )}
      <div className="grid md:grid-cols-2 gap-12">
        <AnimatedSection>
          <div className="prose prose-lg prose-headings:font-heading prose-headings:text-foreground prose-p:text-muted-foreground" dangerouslySetInnerHTML={{ __html: block.content || '' }} />
        </AnimatedSection>
        <AnimatedSection delay={0.1}>
          <HtmlContent html={block.description} className="text-muted-foreground text-lg leading-relaxed prose max-w-none" />
        </AnimatedSection>
      </div>
    </div>
  </section>
);

// ========== NEW PROFESSIONAL BLOCKS ==========

const PricingTableBlock = ({ block }: { block: ContentBlock }) => {
  const items = (block.items || []) as PricingItem[];
  const isDark = block.backgroundColor === 'dark';
  
  return (
    <section className={`section-padding ${getBackgroundClass(block.backgroundColor)}`}>
      <div className="container-custom">
        {block.title && (
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
              {block.title?.split(' ').slice(0, -1).join(' ')}{' '}
              <span className="text-gradient">{block.title?.split(' ').slice(-1)[0]}</span>
            </h2>
            <HtmlContent html={block.subtitle} className={`text-lg ${isDark ? 'text-secondary-foreground/70' : 'text-muted-foreground'}`} />
          </AnimatedSection>
        )}
        <div className={`grid gap-8 ${items.length === 2 ? 'md:grid-cols-2 max-w-4xl mx-auto' : items.length >= 4 ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-3'}`}>
          {items.map((item, index) => (
            <AnimatedSection key={item.id} delay={index * 0.1}>
              <motion.div
                whileHover={{ y: -8 }}
                className={`relative h-full p-8 rounded-2xl border transition-all duration-500 ${
                  item.isPopular 
                    ? 'bg-gradient-to-b from-primary/10 to-primary/5 border-primary/50 shadow-elevated scale-105' 
                    : 'bg-card border-border/50 shadow-card hover:shadow-elevated hover:border-primary/30'
                }`}
              >
                {item.isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                      <Star size={12} fill="currentColor" /> Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className="font-heading text-xl font-semibold mb-2">{item.title}</h3>
                  {item.description && <p className={`text-sm mb-4 ${isDark ? 'text-secondary-foreground/60' : 'text-muted-foreground'}`}>{item.description}</p>}
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl sm:text-5xl font-heading font-bold text-primary">{item.price}</span>
                    {item.period && <span className={`text-sm ${isDark ? 'text-secondary-foreground/60' : 'text-muted-foreground'}`}>/{item.period}</span>}
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  {item.features.map((feature, fi) => (
                    <li key={fi} className="flex items-start gap-3 text-sm">
                      <Check size={16} className="text-primary shrink-0 mt-0.5" />
                      <span className={isDark ? 'text-secondary-foreground/80' : ''}>{feature}</span>
                    </li>
                  ))}
                </ul>
                {item.buttonText && (
                  <Button className="w-full" variant={item.isPopular ? "default" : "outline"} asChild>
                    <Link to={item.buttonLink || '#'}>{item.buttonText}</Link>
                  </Button>
                )}
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

const TeamGridBlock = ({ block }: { block: ContentBlock }) => {
  const items = (block.items || []) as TeamMember[];
  const cols = block.columns || 3;
  const gridClass = cols === 2 ? 'md:grid-cols-2' : cols === 4 ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-2 lg:grid-cols-3';
  const isDark = block.backgroundColor === 'dark';
  
  return (
    <section className={`section-padding ${getBackgroundClass(block.backgroundColor)}`}>
      <div className="container-custom">
        {block.title && (
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
              {block.title?.split(' ').slice(0, -1).join(' ')}{' '}
              <span className="text-gradient">{block.title?.split(' ').slice(-1)[0]}</span>
            </h2>
            <HtmlContent html={block.subtitle} className={`text-lg ${isDark ? 'text-secondary-foreground/70' : 'text-muted-foreground'}`} />
          </AnimatedSection>
        )}
        <div className={`grid gap-8 ${gridClass}`}>
          {items.map((item, index) => (
            <AnimatedSection key={item.id} delay={index * 0.1}>
              <motion.div whileHover={{ y: -5 }} className="text-center group">
                <div className="relative w-40 h-40 mx-auto mb-6 rounded-full overflow-hidden border-4 border-primary/20 group-hover:border-primary/50 transition-colors duration-500">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-primary flex items-center justify-center text-4xl text-primary-foreground font-bold">
                      {item.name.charAt(0)}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-500" />
                </div>
                <h3 className="font-heading text-lg font-semibold mb-1">{item.name}</h3>
                <p className={`text-sm mb-2 ${isDark ? 'text-primary' : 'text-primary'}`}>{item.role}</p>
                {item.bio && <HtmlContent html={item.bio} className={`text-sm ${isDark ? 'text-secondary-foreground/60' : 'text-muted-foreground'}`} />}
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

const TimelineBlock = ({ block }: { block: ContentBlock }) => {
  const items = (block.items || []) as TimelineItem[];
  const isDark = block.backgroundColor === 'dark';
  
  return (
    <section className={`section-padding ${getBackgroundClass(block.backgroundColor)}`}>
      <div className="container-custom">
        {block.title && (
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
              {block.title?.split(' ').slice(0, -1).join(' ')}{' '}
              <span className="text-gradient">{block.title?.split(' ').slice(-1)[0]}</span>
            </h2>
            <HtmlContent html={block.subtitle} className={`text-lg ${isDark ? 'text-secondary-foreground/70' : 'text-muted-foreground'}`} />
          </AnimatedSection>
        )}
        <div className="max-w-3xl mx-auto relative">
          {/* Center line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-primary/10" />
          <div className="space-y-12">
            {items.map((item, index) => (
              <AnimatedSection key={item.id} delay={index * 0.1}>
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="flex gap-6 relative"
                >
                  <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center text-primary-foreground text-xl font-bold shrink-0 shadow-lg">
                    <RenderIcon icon={item.icon} size={24} className="text-primary-foreground" />
                  </div>
                  <div className="flex-1 pb-2">
                    {item.date && <span className="text-xs text-primary font-medium uppercase tracking-wider">{item.date}</span>}
                    <h3 className="font-heading text-xl font-semibold mt-1 mb-2">{item.title}</h3>
                    <HtmlContent html={item.description} className={`text-sm leading-relaxed ${isDark ? 'text-secondary-foreground/70' : 'text-muted-foreground'}`} />
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const LogoCloudBlock = ({ block }: { block: ContentBlock }) => {
  const items = (block.items || []) as LogoItem[];
  const isDark = block.backgroundColor === 'dark';
  
  return (
    <section className={`section-padding ${getBackgroundClass(block.backgroundColor)}`}>
      <div className="container-custom">
        {block.title && (
          <AnimatedSection className="text-center mb-12">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-4">{block.title}</h2>
            <HtmlContent html={block.subtitle} className={`text-lg ${isDark ? 'text-secondary-foreground/70' : 'text-muted-foreground'}`} />
          </AnimatedSection>
        )}
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {items.map((item, index) => (
            <AnimatedSection key={item.id} delay={index * 0.05}>
              <motion.div
                whileHover={{ scale: 1.1 }}
                className={`p-4 rounded-xl transition-all duration-300 ${isDark ? 'grayscale hover:grayscale-0 opacity-60 hover:opacity-100' : 'grayscale hover:grayscale-0 opacity-50 hover:opacity-100'}`}
              >
                {item.url ? (
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    <img src={item.image} alt={item.name} className="h-12 md:h-16 w-auto object-contain" />
                  </a>
                ) : (
                  <img src={item.image} alt={item.name} className="h-12 md:h-16 w-auto object-contain" />
                )}
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

const NumberedStepsBlock = ({ block }: { block: ContentBlock }) => {
  const items = (block.items || []) as IconGridItem[];
  const isDark = block.backgroundColor === 'dark';
  
  return (
    <section className={`section-padding ${getBackgroundClass(block.backgroundColor)}`}>
      <div className="container-custom">
        {block.title && (
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
              {block.title?.split(' ').slice(0, -1).join(' ')}{' '}
              <span className="text-gradient">{block.title?.split(' ').slice(-1)[0]}</span>
            </h2>
            <HtmlContent html={block.subtitle} className={`text-lg ${isDark ? 'text-secondary-foreground/70' : 'text-muted-foreground'}`} />
          </AnimatedSection>
        )}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <AnimatedSection key={item.id} delay={index * 0.1}>
              <motion.div whileHover={{ y: -5 }} className="relative p-8 rounded-2xl bg-card border border-border/50 shadow-card hover:shadow-elevated hover:border-primary/30 transition-all duration-500 group">
                <div className="absolute -top-5 -left-2">
                  <span className="text-7xl font-heading font-bold text-primary/10 group-hover:text-primary/20 transition-colors duration-500">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <div className="relative pt-6">
                  {item.icon && (
                    <motion.div whileHover={{ scale: 1.1 }} className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center text-primary-foreground mb-4 shadow-lg">
                      <RenderIcon icon={item.icon} size={24} />
                    </motion.div>
                  )}
                  <h3 className="font-heading text-lg font-semibold mb-3">{item.title}</h3>
                  <HtmlContent html={item.description} className={`text-sm leading-relaxed ${isDark ? 'text-secondary-foreground/70' : 'text-muted-foreground'}`} />
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

const ChecklistGridBlock = ({ block }: { block: ContentBlock }) => {
  const items = (block.items || []) as IconGridItem[];
  const cols = block.columns || 2;
  const gridClass = cols === 3 ? 'md:grid-cols-3' : cols === 4 ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-2';
  const isDark = block.backgroundColor === 'dark';
  
  return (
    <section className={`section-padding ${getBackgroundClass(block.backgroundColor)}`}>
      <div className="container-custom">
        {block.title && (
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
              {block.title?.split(' ').slice(0, -1).join(' ')}{' '}
              <span className="text-gradient">{block.title?.split(' ').slice(-1)[0]}</span>
            </h2>
            <HtmlContent html={block.subtitle} className={`text-lg ${isDark ? 'text-secondary-foreground/70' : 'text-muted-foreground'}`} />
          </AnimatedSection>
        )}
        <HtmlContent html={block.description} className={`text-lg leading-relaxed mb-8 max-w-3xl mx-auto text-center prose max-w-none ${isDark ? 'text-secondary-foreground/70 prose-invert' : 'text-muted-foreground'}`} />
        <div className={`grid gap-4 ${gridClass} max-w-4xl mx-auto`}>
          {items.map((item, index) => (
            <AnimatedSection key={item.id} delay={index * 0.05}>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-start gap-3 p-4 rounded-xl ${isDark ? 'bg-secondary-foreground/5 border border-secondary-foreground/10' : 'bg-card border border-border/50 shadow-card'} hover:border-primary/30 transition-all duration-300`}
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center text-primary-foreground shrink-0 mt-0.5">
                  <Check size={16} />
                </div>
                <div>
                  <h4 className="font-medium text-sm">{item.title}</h4>
                  {item.description && <HtmlContent html={item.description} className={`text-xs mt-1 ${isDark ? 'text-secondary-foreground/60' : 'text-muted-foreground'}`} />}
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

// Main BlockRenderer component
const BlockRenderer = ({ blocks }: BlockRendererProps) => {
  const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order);
  
  return (
    <>
      {sortedBlocks.map(block => {
        switch (block.type) {
          case 'hero-image': return <HeroImageBlock key={block.id} block={block} />;
          case 'hero-video': return <HeroVideoBlock key={block.id} block={block} />;
          case 'icon-grid': return <IconGridBlock key={block.id} block={block} />;
          case 'features-list': return <FeaturesListBlock key={block.id} block={block} />;
          case 'image-text': return <ImageTextBlock key={block.id} block={block} />;
          case 'text-image': return <ImageTextBlock key={block.id} block={block} reversed />;
          case 'cards-grid': return <CardsGridBlock key={block.id} block={block} />;
          case 'stats-bar': return <StatsBarBlock key={block.id} block={block} />;
          case 'testimonial': return <TestimonialBlock key={block.id} block={block} />;
          case 'cta-banner': return <CtaBannerBlock key={block.id} block={block} />;
          case 'accordion-faq': return <AccordionFaqBlock key={block.id} block={block} />;
          case 'gallery': return <GalleryBlock key={block.id} block={block} />;
          case 'video-embed': return <VideoEmbedBlock key={block.id} block={block} />;
          case 'rich-text': return <RichTextBlock key={block.id} block={block} />;
          case 'html-block': return <HtmlBlock key={block.id} block={block} />;
          case 'two-columns': return <TwoColumnsBlock key={block.id} block={block} />;
          case 'pricing-table': return <PricingTableBlock key={block.id} block={block} />;
          case 'team-grid': return <TeamGridBlock key={block.id} block={block} />;
          case 'timeline': return <TimelineBlock key={block.id} block={block} />;
          case 'logo-cloud': return <LogoCloudBlock key={block.id} block={block} />;
          case 'numbered-steps': return <NumberedStepsBlock key={block.id} block={block} />;
          case 'checklist': return <ChecklistGridBlock key={block.id} block={block} />;
          default: return null;
        }
      })}
    </>
  );
};

export default BlockRenderer;
