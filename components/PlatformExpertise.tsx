import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedSection from "./AnimatedSection";
import { useData } from "@/context/DataContext";

const PlatformExpertise = () => {
  const { data } = useData();
  const sections = data.expertiseSections?.filter(s => s.isActive).sort((a, b) => a.order - b.order) || [];
  const stats = data.stats || [];
  const [activeTab, setActiveTab] = useState(0);

  if (sections.length === 0) {
    return null;
  }

  return (
    <section id="expertise" className="py-16 lg:py-20 bg-gradient-hero relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_hsl(22_80%_53%/0.08)_0%,_transparent_50%)]" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative z-10">
        {/* Tabs - centered at top */}
        <AnimatedSection className="mb-8">
          <div className="flex flex-wrap justify-center gap-3 relative z-20">
            {sections.map((section, index) => {
              const tabLabel = section.tabName || section.title.split(' ')[0];
              return (
                <button
                  key={section.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab(index);
                  }}
                  className={`relative px-8 py-3.5 rounded-xl text-base font-semibold transition-all duration-300 cursor-pointer ${
                    activeTab === index
                      ? 'bg-primary text-white shadow-lg shadow-primary/30'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                  }`}
                >
                  {tabLabel}
                </button>
              );
            })}
          </div>
        </AnimatedSection>


        {/* Content Area */}
        <AnimatePresence mode="wait">
          {sections.map((section, index) => (
            activeTab === index && (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center"
              >
                {/* Content */}
                <div className={`${index % 2 === 1 ? 'lg:order-2' : 'lg:order-1'}`}>
                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="font-heading text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 leading-tight"
                  >
                    {section.title}
                  </motion.h3>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="text-gray-400 text-sm md:text-base leading-relaxed mb-6 prose prose-invert prose-sm max-w-none prose-li:text-gray-400 prose-p:text-gray-400 prose-strong:text-white prose-headings:text-white"
                    dangerouslySetInnerHTML={{ __html: section.description }}
                  />
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="mt-8"
                  >
                    <Button 
                      asChild 
                      className="bg-primary hover:bg-primary/90 text-white px-6 py-5 text-sm rounded-lg shadow-lg shadow-primary/30"
                    >
                      {section.buttonLink?.startsWith('http') ? (
                        <a href={section.buttonLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
                          {section.buttonText}
                          <ArrowRight size={16} />
                        </a>
                      ) : (
                        <Link to={section.buttonLink || '#'} className="inline-flex items-center gap-2">
                          {section.buttonText}
                          <ArrowRight size={16} />
                        </Link>
                      )}
                    </Button>
                  </motion.div>
                </div>

                {/* Image with Effects */}
                <div className={`relative ${index % 2 === 1 ? 'lg:order-1' : 'lg:order-2'}`}>
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="relative"
                  >
                    {/* Circular glow rings - orange effect matching site theme */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[110%] aspect-square pointer-events-none">
                      <motion.div 
                        animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 rounded-full border-2 border-primary/30"
                      />
                      <motion.div 
                        animate={{ scale: [1, 1.03, 1], opacity: [0.2, 0.4, 0.2] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                        className="absolute inset-[8%] rounded-full border border-primary/20"
                      />
                      <motion.div 
                        animate={{ scale: [1, 1.02, 1], opacity: [0.1, 0.3, 0.1] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute inset-[16%] rounded-full border border-primary/15"
                      />
                      {/* Glow effect */}
                      <div className="absolute inset-[20%] rounded-full bg-gradient-to-t from-primary/10 via-transparent to-transparent blur-xl" />
                    </div>
                    
                    {/* Main image */}
                    <img
                      src={section.image}
                      alt={section.title}
                      className="relative w-full h-auto object-cover aspect-[4/3] rounded-xl shadow-2xl z-10"
                    />

                  </motion.div>
                </div>
              </motion.div>
            )
          ))}
        </AnimatePresence>

        {/* Statistics Section */}
        {stats.length > 0 && (
          <AnimatedSection delay={0.3} className="mt-12 pt-8 border-t border-white/10">
            <div className={`grid gap-6 ${
              stats.length === 1 ? 'grid-cols-1 max-w-xs' :
              stats.length === 2 ? 'grid-cols-2 max-w-md' :
              stats.length === 3 ? 'grid-cols-3 max-w-2xl' :
              'grid-cols-2 md:grid-cols-4'
            }`}>
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-left"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ 
                      delay: index * 0.1 + 0.2, 
                      type: "spring", 
                      stiffness: 200 
                    }}
                    className="text-3xl md:text-4xl font-bold text-primary mb-1"
                  >
                    {stat.value}
                  </motion.div>
                  <p className="text-gray-400 text-xs md:text-sm">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        )}
      </div>
    </section>
  );
};

export default PlatformExpertise;
