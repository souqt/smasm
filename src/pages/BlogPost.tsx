import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, User, Tag, Share2, Linkedin, Twitter, Facebook, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useData } from "@/context/DataContext";
import heroImage from "@/assets/hero-ai.jpg";

const BlogPost = () => {
  const { slug } = useParams();
  const { data } = useData();
  
  const blog = data.blogs.find(b => b.slug === slug);
  const relatedBlogs = data.blogs.filter(b => 
    b.id !== blog?.id && 
    b.isPublished && 
    b.category === blog?.category
  ).slice(0, 3);

  if (!blog) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-32 pb-20 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-8">The blog post you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/blog">View All Posts</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const shareUrl = window.location.href;

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={blog.image || heroImage} alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/95 to-secondary/80" />
        </div>
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <Link 
              to="/blog" 
              className="inline-flex items-center gap-2 text-secondary-foreground/70 hover:text-primary transition-colors mb-6"
            >
              <ArrowLeft size={20} />
              Back to Blog
            </Link>
            
            

            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-secondary-foreground mb-6">
              {blog.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-secondary-foreground/70">
              <span className="flex items-center gap-2">
                <Calendar size={18} className="text-primary" />
                {new Date(blog.publishedAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
              <span className="flex items-center gap-2">
                <Clock size={18} className="text-primary" />
                5 min read
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid lg:grid-cols-4 gap-12">
            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-3"
            >
              {/* Featured Image */}
              <div className="relative h-80 md:h-[500px] rounded-2xl overflow-hidden mb-10 shadow-elevated">
                <img
                  src={blog.image || heroImage}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Article Content */}
              <article className="prose prose-lg max-w-none">
                <div 
                  className="text-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />
              </article>

              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="mt-10 pt-8 border-t border-border">
                  <h3 className="font-heading font-semibold text-foreground mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {blog.tags.map((tag) => (
                      <span 
                        key={tag} 
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-muted text-muted-foreground text-sm hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                      >
                        <Tag size={12} />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Share */}
              <div className="mt-8 pt-8 border-t border-border">
                <h3 className="font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Share2 size={18} className="text-primary" />
                  Share this article
                </h3>
                <div className="flex gap-3">
                  <a
                    href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${blog.title}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-muted hover:bg-[#1DA1F2] hover:text-white transition-all"
                  >
                    <Twitter size={20} />
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-muted hover:bg-[#0A66C2] hover:text-white transition-all"
                  >
                    <Linkedin size={20} />
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-muted hover:bg-[#1877F2] hover:text-white transition-all"
                  >
                    <Facebook size={20} />
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-1"
            >
              <div className="sticky top-24 space-y-6">
                {/* Related Posts */}
                {relatedBlogs.length > 0 && (
                  <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-card">
                    <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Related Posts</h3>
                    <div className="space-y-4">
                      {relatedBlogs.map((relatedBlog) => (
                        <Link 
                          key={relatedBlog.id} 
                          to={`/blog/${relatedBlog.slug}`}
                          className="block group"
                        >
                          <div className="flex gap-3">
                            <img
                              src={relatedBlog.image || heroImage}
                              alt={relatedBlog.title}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div>
                              <h4 className="font-medium text-foreground text-sm group-hover:text-primary transition-colors line-clamp-2">
                                {relatedBlog.title}
                              </h4>
                              <p className="text-muted-foreground text-xs mt-1">
                                {new Date(relatedBlog.publishedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogPost;
