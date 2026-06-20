import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import BlockRenderer from "@/components/BlockRenderer";
import { useData } from "@/context/DataContext";
import NotFound from "./NotFound";

const ExpertiseSectionPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data } = useData();
  
  const section = data.expertiseSections?.find(s => s.slug === slug && s.isActive);

  if (!section) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={section.image} 
            alt={section.title} 
            className="w-full h-full object-cover opacity-20" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/95 to-secondary/80" />
        </div>
        
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Button variant="ghost" asChild className="mb-6 text-secondary-foreground/70 hover:text-secondary-foreground">
              <Link to="/expertise" className="inline-flex items-center gap-2">
                <ArrowLeft size={18} />
                Back to Services
              </Link>
            </Button>

            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-secondary-foreground mb-6 max-w-4xl">
              {section.title}
            </h1>
            
            <p className="text-secondary-foreground/70 text-lg sm:text-xl leading-relaxed max-w-3xl">
              {section.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Image */}
      {section.image && (
        <section className="py-12 bg-background">
          <div className="container-custom">
            <AnimatedSection>
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative rounded-2xl overflow-hidden shadow-elevated max-w-5xl mx-auto"
              >
                <img
                  src={section.image}
                  alt={section.title}
                  className="w-full h-auto object-cover aspect-[16/9]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </motion.div>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* Content Blocks (new block-based content) */}
      {section.contentBlocks && section.contentBlocks.length > 0 && (
        <BlockRenderer blocks={section.contentBlocks} />
      )}

      {/* Legacy Content Section (rich text) */}
      {section.content && (!section.contentBlocks || section.contentBlocks.length === 0) && (
        <section className="section-padding bg-background">
          <div className="container-custom">
            <AnimatedSection>
              <div className="max-w-4xl mx-auto">
                <article 
                  className="prose prose-lg max-w-none
                    prose-headings:font-heading prose-headings:text-foreground prose-headings:font-bold
                    prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
                    prose-p:text-muted-foreground prose-p:leading-relaxed
                    prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-foreground
                    prose-ul:text-muted-foreground prose-ol:text-muted-foreground
                    prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground prose-blockquote:italic
                    prose-code:bg-muted prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
                    prose-pre:bg-secondary prose-pre:text-secondary-foreground
                    prose-img:rounded-xl prose-img:shadow-lg"
                  dangerouslySetInnerHTML={{ __html: section.content || '' }}
                />
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* Related Sections */}
      <section className="section-padding bg-muted/30">
        <div className="container-custom">
          <AnimatedSection className="text-center mb-12">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Explore More <span className="text-gradient">Services</span>
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.expertiseSections
              ?.filter(s => s.isActive && s.id !== section.id)
              .slice(0, 3)
              .map((item, index) => (
                <AnimatedSection key={item.id} delay={index * 0.1}>
                  <Link 
                    to={`/expertise/${item.slug}`}
                    className="block group"
                  >
                    <motion.div
                      whileHover={{ y: -4 }}
                      className="bg-card rounded-xl overflow-hidden border border-border shadow-card hover:shadow-elevated transition-all duration-300"
                    >
                      <div className="aspect-[16/10] overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="font-heading font-semibold text-lg text-foreground group-hover:text-primary transition-colors mb-2">
                          {item.title}
                        </h3>
                        <p className="text-muted-foreground text-sm line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                    </motion.div>
                  </Link>
                </AnimatedSection>
              ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-secondary text-secondary-foreground">
        <div className="container-custom text-center">
          <AnimatedSection>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-secondary-foreground/70 text-lg max-w-2xl mx-auto mb-8">
              Let's discuss how we can help transform your business with our expertise.
            </p>
            <Button size="lg" asChild>
              <Link to="/contact">Contact Us Today</Link>
            </Button>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ExpertiseSectionPage;
