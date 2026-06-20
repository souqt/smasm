import { motion } from "framer-motion";
import { 
  Code2, Smartphone, BrainCircuit, Users2, Cloud, ShieldCheck,
  ArrowRight, Sparkles, LucideIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import AnimatedSection from "./AnimatedSection";
import { useData } from "@/context/DataContext";

const iconMap: { [key: string]: LucideIcon } = {
  Code2,
  Smartphone,
  BrainCircuit,
  Users2,
  Cloud,
  ShieldCheck,
};

const Services = () => {
  const { data } = useData();
  
  const services = data.services;

  if (services.length === 0) return null;

  return (
    <section id="services" className="section-padding bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-primary/5 to-transparent pointer-events-none" />
      
      <div className="container-custom relative z-10">
        {/* Header */}
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h2 className="font-heading heading-lg text-foreground mb-4 sm:mb-6">
            Our <span className="text-gradient">Services</span>
          </h2>
          <p className="text-body text-muted-foreground">
            End-to-end solutions for your digital transformation journey. From concept to deployment, we've got you covered.
          </p>
        </AnimatedSection>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service, index) => {
            const ServiceIcon = iconMap[service.icon] || Code2;
            return (
              <AnimatedSection
                key={service.id}
                delay={index * 0.1}
                className="group"
              >
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="h-full p-6 sm:p-8 rounded-2xl bg-card border border-border/50 shadow-card hover:shadow-elevated hover:border-primary/30 transition-all duration-500"
                >
                  {/* Icon */}
                  <div className="relative mb-6">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center text-white shadow-lg`}
                    >
                      <ServiceIcon size={28} strokeWidth={1.5} />
                    </motion.div>
                    <div className={`absolute inset-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${service.color} blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500`} />
                  </div>

                  {/* Content */}
                  <h3 className="font-heading text-lg sm:text-xl font-semibold text-foreground mb-3">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground text-sm sm:text-base mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-foreground/80">
                        <motion.span
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          viewport={{ once: true }}
                          className="w-1.5 h-1.5 rounded-full bg-primary shrink-0"
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* Explore services link */}
                  <Link to="/services">
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="flex items-center gap-1 text-primary font-medium text-sm cursor-pointer group/link"
                    >
                      Explore our services
                      <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                    </motion.div>
                  </Link>
                </motion.div>
              </AnimatedSection>
            );
          })}
        </div>

        {/* CTA */}
        <AnimatedSection delay={0.4} className="text-center mt-12 sm:mt-16">
          <Button variant="default" size="lg" asChild className="gap-2">
            <Link to="/contact">
              <Sparkles size={18} />
              Discuss Your Project
            </Link>
          </Button>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default Services;
