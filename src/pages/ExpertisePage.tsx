import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles, Trophy, Target, Lightbulb, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import BlockRenderer from "@/components/BlockRenderer";
import { useData } from "@/context/DataContext";
import teamImage from "@/assets/team.jpg";

const ExpertisePage = () => {
  const { data, getPageBlocks } = useData();
  const blocks = getPageBlocks('expertise');
  const sections = data.expertiseSections?.filter(s => s.isActive).sort((a, b) => a.order - b.order) || [];
  const [activeTab, setActiveTab] = useState(0);

  // If blocks exist, render them via BlockRenderer
  if (blocks.length > 0) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <BlockRenderer blocks={blocks} />
        <Footer />
      </div>
    );
  }

  // Tab names derived from section titles
  const tabNames = sections.map(section => {
    return section.tabName || section.title.split(' ')[0];
  });

  // Fallback: render current hardcoded content
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={teamImage} alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/90 to-secondary/70" />
        </div>
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-medium mb-4">
              <Trophy size={16} />
              Our Expertise
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-secondary-foreground mb-6">
              Platform <span className="text-gradient">Expertise</span>
            </h1>
            <p className="text-secondary-foreground/70 text-lg leading-relaxed">
              Our team masters the latest technologies and frameworks to deliver cutting-edge solutions. 
              We stay ahead of trends to ensure your project leverages the most effective tools available.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Expertise Sections with Tabs */}
      {sections.length > 0 && (
        <section className="section-padding bg-background">
          <div className="container-custom">
            <AnimatedSection className="text-center mb-12">
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Our <span className="text-gradient">Services</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Comprehensive solutions tailored to your business needs
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.1} className="mb-12">
              <div className="flex flex-wrap justify-center gap-2 border-b border-border">
                {tabNames.map((name, index) => (
                  <button
                    key={sections[index].id}
                    onClick={() => setActiveTab(index)}
                    className={`relative px-6 py-4 text-sm sm:text-base font-medium transition-colors duration-300 ${
                      activeTab === index
                        ? 'text-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {name}
                    {activeTab === index && (
                      <motion.div
                        layoutId="expertiseActiveTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </AnimatedSection>

            <AnimatePresence mode="wait">
              {sections.map((section, index) => (
                activeTab === index && (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center"
                  >
                    <div className={`relative ${index % 2 === 1 ? 'lg:order-2' : 'lg:order-1'}`}>
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="relative rounded-2xl overflow-hidden shadow-elevated"
                      >
                        <img
                          src={section.image}
                          alt={section.title}
                          className="w-full h-auto object-cover aspect-[4/3]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </motion.div>
                      <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-transparent rounded-3xl blur-3xl -z-10" />
                    </div>

                    <div className={`${index % 2 === 1 ? 'lg:order-1' : 'lg:order-2'}`}>
                      <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight"
                      >
                        {section.title}
                      </motion.h3>
                      
                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                        className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-8"
                      >
                        {section.description}
                      </motion.p>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.4 }}
                      >
                        <Button 
                          asChild 
                          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-base rounded-lg"
                        >
                          <Link to={`/expertise/${section.slug}`} className="inline-flex items-center gap-2">
                            {section.buttonText}
                            <ArrowRight size={18} />
                          </Link>
                        </Button>
                      </motion.div>
                    </div>
                  </motion.div>
                )
              ))}
            </AnimatePresence>
          </div>
        </section>
      )}

      {/* Technologies */}
      <section className="section-padding bg-muted/30">
        <div className="container-custom">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-6">
              Technologies We <span className="text-gradient">Master</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              We work with a wide range of modern technologies to build robust and scalable solutions.
            </p>
          </AnimatedSection>

          <div className="flex flex-wrap justify-center gap-4">
            {data.technologies.map((tech, index) => (
              <motion.span
                key={tech.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
                whileHover={{ scale: 1.1, y: -4 }}
                className="px-6 py-4 rounded-2xl bg-card border border-border/50 text-foreground font-medium hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 cursor-default flex items-center gap-3 shadow-card"
              >
                <span className="text-2xl">{tech.icon}</span>
                {tech.name}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-padding bg-secondary text-secondary-foreground">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {data.stats.map((stat, index) => (
              <AnimatedSection key={stat.id} delay={index * 0.1}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-6 rounded-2xl bg-secondary-foreground/5 border border-secondary-foreground/10"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", delay: 0.2 + index * 0.1 }}
                    className="text-4xl sm:text-5xl font-heading font-bold text-primary mb-2"
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-secondary-foreground/70">{stat.label}</div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection direction="left">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <Lightbulb size={16} />
                Why Choose Us
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-6">
                What Sets Us <span className="text-gradient">Apart</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                We combine technical excellence with deep industry knowledge to deliver solutions that 
                drive real business value.
              </p>

              <div className="space-y-6">
                {[
                  { icon: Target, title: "Results-Driven Approach", description: "We focus on delivering measurable outcomes that align with your business goals." },
                  { icon: Users, title: "Expert Team", description: "Our developers are in the top 3% of global talent, rigorously vetted for excellence." },
                  { icon: Sparkles, title: "Innovation First", description: "We leverage cutting-edge technologies to build future-proof solutions." },
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center text-primary-foreground shrink-0">
                      <item.icon size={24} />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-foreground mb-1">{item.title}</h3>
                      <p className="text-muted-foreground text-sm">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right">
              <div className="relative rounded-2xl overflow-hidden shadow-elevated">
                <img
                  src={sections[0]?.image || teamImage}
                  alt="Our expertise"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/50 to-transparent" />
                
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute bottom-6 right-6 bg-card text-card-foreground p-4 rounded-2xl shadow-elevated"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center text-xl">
                      🎯
                    </div>
                    <div>
                      <p className="font-semibold">Top Talent</p>
                      <p className="text-muted-foreground text-sm">Top 3% Developers</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-muted/30">
        <div className="container-custom text-center">
          <AnimatedSection>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-6">
              Ready to Build Something <span className="text-gradient">Amazing</span>?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
              Let's discuss how we can help you leverage our expertise to achieve your goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/contact">
                  <Sparkles size={18} />
                  Start Your Project
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/services">View Our Services</Link>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ExpertisePage;
