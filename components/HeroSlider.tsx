import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Zap, Users, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useData } from "@/context/DataContext";
import heroImage from "@/assets/hero-ai.jpg";

const iconMap: { [key: string]: any } = {
  Rocket,
  Users,
  Zap,
};

const HeroSlider = () => {
  const { data } = useData();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides = data.slides.length > 0 ? data.slides : [
    {
      id: "1",
      image: heroImage,
      title: "Building Tomorrow's",
      highlight: "Digital Solutions",
      subtitle: "We connect world-class developers with innovative companies to create extraordinary digital products.",
      cta: "Start Your Project",
      ctaLink: "/contact",
      badge: "Innovation First",
    },
  ];

  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const currentSlideData = slides[currentSlide];
  const CurrentIcon = iconMap[currentSlideData?.badge?.split(' ')[0]] || Rocket;

  return (
    <section 
      className="relative min-h-screen overflow-hidden bg-gradient-hero"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Image with Parallax Effect */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <motion.div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${currentSlideData?.image || heroImage})` }}
            animate={{ scale: [1, 1.05] }}
            transition={{ duration: 10, ease: "linear" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/95 via-secondary/80 to-secondary/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Decorative Grid */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle, hsl(var(--primary)) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen container-custom flex items-center">
        <div className="w-full pt-20 pb-32 lg:pb-20">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Text Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="order-2 lg:order-1"
              >

                <h1 className="font-heading heading-xl text-secondary-foreground mb-4 sm:mb-6">
                  {currentSlideData?.title}
                  <br />
                  <span className="text-gradient">{currentSlideData?.highlight}</span>
                </h1>
                
                <p className="text-body text-secondary-foreground/70 mb-8 sm:mb-10 max-w-xl">
                  {currentSlideData?.subtitle}
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button variant="hero" size="lg" asChild className="gap-2">
                    <Link to={currentSlideData?.ctaLink || "/contact"}>
                      <Play size={18} className="fill-current" />
                      {currentSlideData?.cta || "Get Started"}
                    </Link>
                  </Button>
                  <Button variant="heroOutline" size="lg" asChild>
                    <Link to="/careers">Join Our Team</Link>
                  </Button>
                </div>

                {/* Stats from context */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="grid grid-cols-3 gap-4 sm:gap-8 mt-10 sm:mt-14 pt-8 border-t border-secondary-foreground/10"
                >
                  {data.stats.slice(0, 3).map((stat, i) => (
                    <div key={stat.id || i} className="text-center sm:text-left">
                      <div className="text-xl sm:text-2xl md:text-3xl font-heading font-bold text-primary">
                        {stat.value}
                      </div>
                      <div className="text-xs sm:text-sm text-secondary-foreground/50">{stat.label}</div>
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            </AnimatePresence>

          </div>
        </div>
      </div>

      {/* Navigation */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-0 right-0 z-20">
          <div className="container-custom">
            <div className="flex items-center justify-between">
              {/* Dots */}
              <div className="flex gap-2 sm:gap-3">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`relative h-2 rounded-full transition-all duration-500 overflow-hidden ${
                      index === currentSlide
                        ? "w-8 sm:w-12 bg-primary"
                        : "w-2 bg-secondary-foreground/30 hover:bg-secondary-foreground/50"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  >
                    {index === currentSlide && (
                      <motion.div
                        className="absolute inset-0 bg-primary-glow"
                        initial={{ x: "-100%" }}
                        animate={{ x: "0%" }}
                        transition={{ duration: 6, ease: "linear" }}
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Arrows */}
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={prevSlide}
                  className="p-2 sm:p-3 rounded-full bg-secondary-foreground/10 backdrop-blur-sm border border-secondary-foreground/20 text-secondary-foreground hover:bg-primary hover:border-primary transition-all duration-300"
                  aria-label="Previous slide"
                >
                  <ChevronLeft size={20} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={nextSlide}
                  className="p-2 sm:p-3 rounded-full bg-secondary-foreground/10 backdrop-blur-sm border border-secondary-foreground/20 text-secondary-foreground hover:bg-primary hover:border-primary transition-all duration-300"
                  aria-label="Next slide"
                >
                  <ChevronRight size={20} />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-24 sm:bottom-20 left-1/2 -translate-x-1/2 z-20 hidden sm:block"
      >
        <div className="w-6 h-10 rounded-full border-2 border-secondary-foreground/30 flex justify-center pt-2">
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5], y: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-2 rounded-full bg-primary"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSlider;
