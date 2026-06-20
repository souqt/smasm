import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useData } from "@/context/DataContext";
import hostingImage from "@/assets/service-infra-hero.jpg";
import appImage from "@/assets/app-dev.jpg";

const Portfolio = () => {
  const { data } = useData();
  const projects = (data.portfolioProjects || []).sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      <main className="pt-24">
        <section className="bg-gradient-hero py-12 text-secondary-foreground">
          <div className="container-custom">
            <p className="mb-2 text-sm font-bold text-primary">أعمالنا</p>
            <h1 className="heading-lg">منتجات ومشاريع تم تنفيذها</h1>
            <p className="mt-3 max-w-2xl text-secondary-foreground/70">استعرض نماذج من أعمال تلجاوي، وابدأ مشروعاً مماثلاً مباشرة من المنتج المرتبط أو من تذكرة دعم.</p>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-custom grid gap-6 md:grid-cols-2">
            {projects.map((project, index) => (
              <article key={project.id} className="overflow-hidden rounded-lg border border-border bg-card shadow-card">
                <img src={project.image || (index % 2 ? appImage : hostingImage)} alt={project.title} className="aspect-[16/9] w-full object-cover" />
                <div className="p-6">
                  <p className="text-sm font-bold text-primary">{project.category}</p>
                  <h2 className="mt-2 font-heading text-2xl font-bold">{project.title}</h2>
                  <p className="mt-3 leading-7 text-muted-foreground">{project.description}</p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <Button asChild>
                      <Link to={project.relatedProductId ? `/checkout/${project.relatedProductId}` : "/support"}>عمل مشروع مماثل</Link>
                    </Button>
                    {project.projectUrl && (
                      <Button variant="outline" asChild>
                        <a href={project.projectUrl} target="_blank" rel="noreferrer">
                          معاينة
                          <ExternalLink size={15} />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Portfolio;
