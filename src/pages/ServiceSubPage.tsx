import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlockRenderer from "@/components/BlockRenderer";
import { useData } from "@/context/DataContext";
import { ContentBlock } from "@/data/types";

interface ServiceSubPageProps {
  pageKey: string;
  defaultBlocks: ContentBlock[];
}

const ServiceSubPage = ({ pageKey, defaultBlocks }: ServiceSubPageProps) => {
  const { getPageBlocks } = useData();
  const blocks = getPageBlocks(pageKey);
  const displayBlocks = blocks.length > 0 ? blocks : defaultBlocks;

  return (
    <div className="min-h-screen">
      <Navbar />
      <BlockRenderer blocks={displayBlocks} />
      <Footer />
    </div>
  );
};

export default ServiceSubPage;
