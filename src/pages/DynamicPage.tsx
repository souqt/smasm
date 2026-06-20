import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlockRenderer from "@/components/BlockRenderer";
import { useData } from "@/context/DataContext";
import NotFound from "./NotFound";

const DynamicPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data, getPageBlocks } = useData();
  
  const page = data.pages?.find(p => p.slug === slug && p.isPublished);
  
  if (!page) {
    return <NotFound />;
  }

  // Check for blocks
  const blocks = getPageBlocks(`page-${slug}`);

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

  // Fallback: render HTML content
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6">
              {page.title}
            </h1>
            {page.metaDescription && (
              <p className="text-xl text-muted-foreground">{page.metaDescription}</p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Featured Image */}
      {page.featuredImage && (
        <section className="pb-12">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="max-w-4xl mx-auto"
            >
              <img 
                src={page.featuredImage} 
                alt={page.title}
                className="w-full h-auto rounded-2xl shadow-xl"
              />
            </motion.div>
          </div>
        </section>
      )}

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <div 
              className="prose prose-lg dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DynamicPage;
