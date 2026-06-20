import { motion } from "framer-motion";
import { 
  FileText, Briefcase, Users, TrendingUp, BarChart3, 
  ArrowUpRight, ArrowDownRight, Eye, Calendar, Clock,
  Zap, Target, Award, Activity
} from "lucide-react";
import { useData } from "@/context/DataContext";

const AdminDashboard = () => {
  const { data } = useData();

  const stats = [
    { 
      label: "Active Jobs", 
      value: data.jobs.filter(j => j.isActive).length, 
      total: data.jobs.length,
      icon: Briefcase, 
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-500/10",
      textColor: "text-blue-500",
      trend: "+12%",
      trendUp: true
    },
    { 
      label: "Applications", 
      value: data.applications.length, 
      total: null,
      icon: Users, 
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-500/10",
      textColor: "text-green-500",
      trend: "+8%",
      trendUp: true
    },
    { 
      label: "Published Posts", 
      value: data.blogs.filter(b => b.isPublished).length, 
      total: data.blogs.length,
      icon: FileText, 
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-500/10",
      textColor: "text-purple-500",
      trend: "+5%",
      trendUp: true
    },
    { 
      label: "Services", 
      value: data.services.length, 
      total: null,
      icon: BarChart3, 
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-500/10",
      textColor: "text-orange-500",
      trend: "0%",
      trendUp: null
    },
  ];

  const recentApplications = data.applications.slice(-5).reverse();
  const recentBlogs = data.blogs.slice(-3).reverse();

  const quickActions = [
    { label: "Add New Job", icon: Briefcase, href: "/admin/jobs", color: "bg-blue-500" },
    { label: "Create Blog Post", icon: FileText, href: "/admin/blogs", color: "bg-purple-500" },
    { label: "Upload Media", icon: Zap, href: "/admin/media", color: "bg-green-500" },
    { label: "View Applications", icon: Users, href: "/admin/applications", color: "bg-orange-500" },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
            Welcome back! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your site today.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar size={16} />
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card rounded-2xl border border-border p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon size={24} className={stat.textColor} />
              </div>
              {stat.trendUp !== null && (
                <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                  stat.trendUp ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                }`}>
                  {stat.trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {stat.trend}
                </div>
              )}
            </div>
            <p className="text-3xl md:text-4xl font-bold text-foreground">{stat.value}</p>
            <p className="text-muted-foreground text-sm mt-1">
              {stat.label}
              {stat.total !== null && (
                <span className="text-xs ml-1">/ {stat.total} total</span>
              )}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-card rounded-2xl border border-border p-5 md:p-6 shadow-sm">
        <h2 className="font-heading text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((action, index) => (
            <motion.a
              key={action.label}
              href={action.href}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              className="group flex flex-col items-center gap-3 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                <action.icon size={22} />
              </div>
              <span className="text-sm font-medium text-foreground text-center">{action.label}</span>
            </motion.a>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-2xl border border-border p-5 md:p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg font-semibold text-foreground">Recent Applications</h2>
            <a href="/admin/applications" className="text-sm text-primary hover:underline flex items-center gap-1">
              View all <ArrowUpRight size={14} />
            </a>
          </div>
          
          {recentApplications.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No applications yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentApplications.map((app) => {
                const job = data.jobs.find(j => j.id === app.jobId);
                return (
                  <div 
                    key={app.id} 
                    className="flex items-center justify-between p-3 md:p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                        <span className="text-primary font-medium">
                          {app.fullName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground truncate">{app.fullName}</p>
                        <p className="text-muted-foreground text-sm truncate">{job?.title || 'Unknown Position'}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 ${
                      app.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                      app.status === 'reviewing' ? 'bg-blue-500/10 text-blue-500' :
                      app.status === 'interviewed' ? 'bg-purple-500/10 text-purple-500' :
                      app.status === 'accepted' ? 'bg-green-500/10 text-green-500' :
                      'bg-red-500/10 text-red-500'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Recent Blog Posts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card rounded-2xl border border-border p-5 md:p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg font-semibold text-foreground">Recent Posts</h2>
            <a href="/admin/blogs" className="text-sm text-primary hover:underline flex items-center gap-1">
              View all <ArrowUpRight size={14} />
            </a>
          </div>
          
          {recentBlogs.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No blog posts yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentBlogs.map((blog) => (
                <div 
                  key={blog.id} 
                  className="flex items-center gap-4 p-3 md:p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                >
                  {blog.image && (
                    <img 
                      src={blog.image} 
                      alt={blog.title}
                      className="w-16 h-12 rounded-lg object-cover shrink-0"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground truncate">{blog.title}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {new Date(blog.publishedAt).toLocaleDateString()}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full ${
                        blog.isPublished 
                          ? 'bg-green-500/10 text-green-500' 
                          : 'bg-yellow-500/10 text-yellow-500'
                      }`}>
                        {blog.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Site Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-card rounded-2xl border border-border p-5 md:p-6 shadow-sm"
      >
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-primary" />
          <h2 className="font-heading text-lg font-semibold text-foreground">Site Overview</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-muted/50">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">Brands</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{data.brands.length}</p>
          </div>
          <div className="p-4 rounded-xl bg-muted/50">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-muted-foreground">Technologies</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{data.technologies.length}</p>
          </div>
          <div className="p-4 rounded-xl bg-muted/50">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-green-500" />
              <span className="text-sm text-muted-foreground">Slides</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{data.slides.length}</p>
          </div>
          <div className="p-4 rounded-xl bg-muted/50">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-4 h-4 text-purple-500" />
              <span className="text-sm text-muted-foreground">Benefits</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{data.benefits.length}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
