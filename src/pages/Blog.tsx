import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, User, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import { useData } from "@/context/DataContext";
import heroImage from "@/assets/hero-ai.jpg";

const Blog = () => {
  const { data } = useData();
  const publishedBlogs = data.blogs.filter(b => b.isPublished);
  const categories = [...new Set(publishedBlogs.map(b => b.category))];

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
            <span className="inline-block px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-medium mb-4">
              Insights & Resources
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-secondary-foreground mb-6">
              Our <span className="text-gradient">Blog</span>
            </h1>
            <p className="text-secondary-foreground/70 text-lg leading-relaxed">
              Stay updated with the latest trends, insights, and best practices in software development, 
              AI, and technology leadership.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-8 bg-muted/30 border-b border-border/50">
          <div className="container-custom">
            <div className="flex flex-wrap gap-3 justify-center">
              <Button variant="outline" className="rounded-full">
                All Posts
              </Button>
              {categories.map((category) => (
                <Button key={category} variant="ghost" className="rounded-full">
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Blog Grid */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          {publishedBlogs.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No blog posts yet. Check back soon!</p>
            </div>
          ) : (
            <>
              {/* Featured Post */}
              {publishedBlogs[0] && (
                <AnimatedSection className="mb-16">
                  <Link to={`/blog/${publishedBlogs[0].slug}`} className="block group">
                    <div className="grid lg:grid-cols-2 gap-8 items-center">
                      <div className="relative h-80 lg:h-96 rounded-2xl overflow-hidden">
                        <img
                          src={publishedBlogs[0].image || heroImage}
                          alt={publishedBlogs[0].title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                            Featured
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm mb-4">
                          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                            {publishedBlogs[0].category}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {new Date(publishedBlogs[0].publishedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                          {publishedBlogs[0].title}
                        </h2>
                        <p className="text-muted-foreground text-lg leading-relaxed mb-6 line-clamp-3">
                          {publishedBlogs[0].excerpt}
                        </p>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <User size={16} className="text-primary" />
                            <span className="text-foreground font-medium">{publishedBlogs[0].author}</span>
                          </div>
                          <span className="inline-flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
                            Read Article <ArrowRight size={16} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </AnimatedSection>
              )}

              {/* Other Posts Grid */}
              {publishedBlogs.length > 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {publishedBlogs.slice(1).map((blog, index) => (
                    <AnimatedSection key={blog.id} delay={index * 0.1}>
                      <Link to={`/blog/${blog.slug}`} className="block group">
                        <article className="bg-card rounded-2xl overflow-hidden border border-border/50 shadow-card hover:shadow-elevated transition-all duration-500">
                          <div className="relative h-52 overflow-hidden">
                            <img
                              src={blog.image || heroImage}
                              alt={blog.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute top-4 left-4">
                              <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                                {blog.category}
                              </span>
                            </div>
                          </div>
                          <div className="p-6">
                            <div className="flex items-center gap-4 text-muted-foreground text-sm mb-4">
                              <span className="flex items-center gap-1">
                                <User size={14} />
                                {blog.author}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar size={14} />
                                {new Date(blog.publishedAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                            <h3 className="font-heading text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                              {blog.title}
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
                              {blog.excerpt}
                            </p>
                            {blog.tags && blog.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-4">
                                {blog.tags.slice(0, 3).map((tag) => (
                                  <span 
                                    key={tag} 
                                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted text-muted-foreground text-xs"
                                  >
                                    <Tag size={10} />
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                            <span className="inline-flex items-center gap-2 text-primary font-medium text-sm group-hover:gap-3 transition-all">
                              Read More <ArrowRight size={16} />
                            </span>
                          </div>
                        </article>
                      </Link>
                    </AnimatedSection>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
