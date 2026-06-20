import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Code2, Smartphone, BrainCircuit, Users2, Cloud, ShieldCheck,
  ArrowRight, Sparkles, CheckCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import BlockRenderer from "@/components/BlockRenderer";
import { useData } from "@/context/DataContext";
import heroImage from "@/assets/hero-ai.jpg";
import appDevImage from "@/assets/app-dev.jpg";

const iconMap: Record<string, any> = {
  Code2, Smartphone, BrainCircuit, Users2, Cloud, ShieldCheck
};

const ServicesPage = () => {
  const { data, getPageBlocks } = useData();
  const blocks = getPageBlocks('services');

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

  // Fallback: render current hardcoded content
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="" className="w-full h-full object-cover opacity-20" />
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
              <Sparkles size={16} />
              What We Offer
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-secondary-foreground mb-6">
              Our <span className="text-gradient">Services</span>
            </h1>
            <p className="text-secondary-foreground/70 text-lg leading-relaxed">
              End-to-end solutions for your digital transformation journey. From concept to deployment, 
              we've got you covered with cutting-edge technologies and expert talent.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.services.map((service, index) => {
              const Icon = iconMap[service.icon] || Code2;
              return (
                <AnimatedSection key={service.id} delay={index * 0.1}>
                  <motion.div
                    whileHover={{ y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="h-full p-8 rounded-2xl bg-card border border-border/50 shadow-card hover:shadow-elevated hover:border-primary/30 transition-all duration-500 group"
                  >
                    <div className="relative mb-6">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center text-white shadow-lg`}
                      >
                        <Icon size={28} strokeWidth={1.5} />
                      </motion.div>
                      <div className={`absolute inset-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500`} />
                    </div>

                    <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {service.description}
                    </p>

                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-foreground/80">
                          <CheckCircle size={16} className="text-primary shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <Link 
                      to="/contact" 
                      className="inline-flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all"
                    >
                      Get Started <ArrowRight size={16} />
                    </Link>
                  </motion.div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section-padding bg-muted/30">
        <div className="container-custom">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-6">
              Our <span className="text-gradient">Process</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              We follow a proven methodology to deliver exceptional results for every project.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Discovery", description: "We understand your business goals, challenges, and requirements through in-depth consultation." },
              { step: "02", title: "Planning", description: "Our team creates a detailed roadmap with timelines, milestones, and deliverables." },
              { step: "03", title: "Development", description: "We build your solution using agile methodologies with regular updates and feedback loops." },
              { step: "04", title: "Delivery", description: "We deploy, test, and ensure your solution performs flawlessly in production." },
            ].map((item, index) => (
              <AnimatedSection key={item.step} delay={index * 0.1}>
                <div className="text-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-20 h-20 rounded-2xl bg-gradient-primary mx-auto mb-6 flex items-center justify-center"
                  >
                    <span className="text-2xl font-bold text-primary-foreground">{item.step}</span>
                  </motion.div>
                  <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {item.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-secondary text-secondary-foreground">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection direction="left">
              <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-6">
                Ready to <span className="text-gradient">Transform</span> Your Business?
              </h2>
              <p className="text-secondary-foreground/70 text-lg mb-8">
                Let's discuss your project and find the perfect solution for your needs. 
                Our team is ready to help you achieve your goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="lg" asChild>
                  <Link to="/contact">
                    <Sparkles size={18} />
                    Start Your Project
                  </Link>
                </Button>
                <Button variant="heroOutline" size="lg" asChild>
                  <Link to="/careers">Join Our Team</Link>
                </Button>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right">
              <div className="relative rounded-2xl overflow-hidden shadow-elevated">
                <img
                  src={appDevImage}
                  alt="Team working"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/50 to-transparent" />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ServicesPage;
