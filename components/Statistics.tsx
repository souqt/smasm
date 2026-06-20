import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";
import { useData } from "@/context/DataContext";

const Statistics = () => {
  const { data } = useData();
  const stats = data.stats || [];

  if (stats.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-24 bg-primary/5 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 pointer-events-none" />
      
      <div className="container-custom relative z-10">
        <AnimatedSection className="text-center mb-12">
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Our <span className="text-gradient">Impact</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Numbers that speak for our commitment to excellence
          </p>
        </AnimatedSection>

        <div className={`grid gap-8 ${
          stats.length === 1 ? 'grid-cols-1 max-w-xs mx-auto' :
          stats.length === 2 ? 'grid-cols-2 max-w-lg mx-auto' :
          stats.length === 3 ? 'grid-cols-1 md:grid-cols-3 max-w-4xl mx-auto' :
          'grid-cols-2 lg:grid-cols-4'
        }`}>
          {stats.map((stat, index) => (
            <AnimatedSection key={stat.id} delay={index * 0.1}>
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg border border-border/50 hover:border-primary/30 transition-colors"
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
                  className="text-4xl md:text-5xl lg:text-6xl font-bold text-gradient mb-3"
                >
                  {stat.value}
                </motion.div>
                <p className="text-muted-foreground text-sm md:text-base font-medium">
                  {stat.label}
                </p>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Statistics;
