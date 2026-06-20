import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Loader2 } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useData } from "@/context/DataContext";
import { FaqItem } from "@/data/types";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { api } from "@/lib/api";
import { z } from "zod";

// Form validation schema
const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  company: z.string().trim().max(255, "Company name must be less than 255 characters").optional(),
  phone: z.string().trim().max(50, "Phone number must be less than 50 characters").optional(),
  subject: z.string().trim().min(3, "Subject must be at least 3 characters").max(500, "Subject must be less than 500 characters"),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(5000, "Message must be less than 5000 characters"),
});

const Contact = () => {
  const { toast } = useToast();
  const { data, getPageBlocks } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load FAQs from CMS or use defaults
  const defaultFaqs = [
    { q: "Do you work with companies of all sizes?", a: "Yes — we support startups, scale-ups, and established enterprises across Europe and the US." },
    { q: "How soon can we start working with you?", a: "Most engagements begin within 1–3 weeks depending on developer availability." },
    { q: "Do you offer short discovery calls?", a: "Yes — you can book a 15-minute exploratory call to discuss your goals." },
    { q: "Do developers work from Egypt or Europe?", a: "Most work from Egypt, but we integrate them fully into your European team structure." },
  ];

  const faqBlocks = getPageBlocks('contact-faqs');
  const cmsFaqs = faqBlocks.length > 0 && faqBlocks[0].items
    ? (faqBlocks[0].items as FaqItem[]).map(f => ({ q: f.question, a: f.answer }))
    : null;
  const faqs = cmsFaqs || defaultFaqs;
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // Validate form data
    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await api.addMessage({
        fullName: formData.name.trim(),
        email: formData.email.trim(),
        company: formData.company.trim(),
        phone: formData.phone.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      });
      
      toast({
        title: "Message Sent!",
        description: "We'll get back to you within 24 hours.",
      });
      setFormData({ name: "", email: "", company: "", phone: "", subject: "", message: "" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-hero">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-medium mb-4">
              Get In Touch
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-secondary-foreground mb-6">
              We're Here to <span className="text-gradient">Help</span>
            </h1>
            <p className="text-secondary-foreground/70 text-lg leading-relaxed">
              Whether you're exploring offshore development for the first time, looking to scale your engineering team, 
              or want to understand which model is right for you — we're ready to support you.
            </p>
            <p className="text-secondary-foreground/70 text-lg leading-relaxed mt-4">
              You can reach us through the form below or contact us directly via our offices in the Netherlands and Egypt.
            </p>
          </motion.div>
        </div>
      </section>


      {/* Contact Form Section */}
      <section className="section-padding bg-muted/30">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Get In Touch
              </h2>
              <p className="text-muted-foreground mb-8">
                Use the form below to share your request with us. Tell us a little about your company, 
                your goals, and how we can assist — and we'll get back to you with the next steps.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Full Name *
                    </label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Jan Jansen"
                      required
                      className={`h-12 ${errors.name ? 'border-destructive' : ''}`}
                    />
                    {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email Address *
                    </label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="jan.jansen@company.nl"
                      required
                      className={`h-12 ${errors.email ? 'border-destructive' : ''}`}
                    />
                    {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Company
                    </label>
                    <Input
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Your Company"
                      className="h-12"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Phone Number
                    </label>
                    <Input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+31 (0)6 1234 5678"
                      className="h-12"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Subject *
                  </label>
                  <Input
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help you?"
                    required
                    className={`h-12 ${errors.subject ? 'border-destructive' : ''}`}
                  />
                  {errors.subject && <p className="text-destructive text-xs mt-1">{errors.subject}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Message *
                  </label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your project..."
                    required
                    rows={6}
                    className={errors.message ? 'border-destructive' : ''}
                  />
                  {errors.message && <p className="text-destructive text-xs mt-1">{errors.message}</p>}
                </div>

                <Button type="submit" variant="default" size="lg" className="w-full sm:w-auto" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message <Send size={18} />
                    </>
                  )}
                </Button>
              </form>
            </motion.div>

            {/* Map / Additional Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* What to Expect */}
              <div className="p-8 rounded-2xl bg-card border border-border/50 shadow-card">
                <h3 className="font-heading text-2xl font-bold text-foreground mb-2">
                  What to Expect
                </h3>
                <p className="text-muted-foreground mb-6">
                  When you reach out to us, here's how it works:
                </p>
                <ol className="space-y-4">
                  {[
                    "We review your message and understand your goals.",
                    "We reply within 24 hours with clarifying questions or suggested next steps.",
                    "We schedule a call to discuss your needs in more detail.",
                    "We suggest the best model — Dedicated Developers, Team Augmentation, or Project-Based Development.",
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                        {i + 1}
                      </span>
                      <span className="text-muted-foreground pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
                <p className="text-foreground font-medium mt-6">
                  Clear, simple, structured.
                </p>
              </div>

              {/* FAQ */}
              <div className="p-8 rounded-2xl bg-card border border-border/50 shadow-card">
                <h3 className="font-heading text-2xl font-bold text-foreground mb-6">
                  Common Questions
                </h3>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, i) => (
                    <AccordionItem key={i} value={`faq-${i}`}>
                      <AccordionTrigger className="text-left font-medium text-foreground">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
