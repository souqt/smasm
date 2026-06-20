import { motion } from "framer-motion";
import { ArrowRight, MapPin, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useData } from "@/context/DataContext";
import teamImage from "@/assets/team.jpg";

const JoinTeam = () => {
  const { data } = useData();

  const benefits = data.benefits.map(b => b.title);
  const openPositions = data.jobs.filter(j => j.isActive).slice(0, 3);

  // Hide section if no jobs available
  if (openPositions.length === 0 && benefits.length === 0) return null;

  return (
    <section className="section-padding bg-background overflow-hidden">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-elevated">
              <img
                src={teamImage}
                alt="Our amazing team"
                className="w-full h-auto object-cover"
              />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-1 lg:order-2"
          >
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
              Join Our <span className="text-gradient">Fun Team!</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Be part of a dynamic team that's shaping the future of technology. 
              We value creativity, collaboration, and continuous learning.
            </p>

            {/* Benefits */}
            <div className="grid grid-cols-2 gap-3 mb-10">
              {benefits.slice(0, 6).map((benefit, index) => (
                <motion.div
                  key={typeof benefit === 'string' ? benefit : index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="flex items-center gap-2 text-foreground/80"
                >
                  <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                  <span className="text-sm">{benefit}</span>
                </motion.div>
              ))}
            </div>

            {/* Open Positions Preview */}
            {openPositions.length > 0 && (
              <div className="space-y-3 mb-8">
                {openPositions.map((position, index) => (
                  <motion.div
                    key={position.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    className="p-4 rounded-xl bg-muted/50 border border-border/50 flex flex-wrap items-center justify-between gap-4 hover:border-primary/30 transition-colors"
                  >
                    <div>
                      <h4 className="font-semibold text-foreground">{position.title}</h4>
                      <div className="flex items-center gap-3 mt-1 text-muted-foreground text-sm">
                        <span className="flex items-center gap-1">
                          <Briefcase size={14} />
                          {position.type}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={14} />
                          {position.location}
                        </span>
                      </div>
                    </div>
                    <Link to={`/apply/${position.id}`} className="text-primary font-medium text-sm hover:underline flex items-center gap-1">
                      Apply <ArrowRight size={14} />
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}

            <Button variant="default" size="lg" asChild>
              <Link to="/careers">View All Positions</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default JoinTeam;
