import { useParams } from "react-router-dom";
import { useData } from "@/context/DataContext";
import DynamicPage from "./DynamicPage";
import NotFound from "./NotFound";

/**
 * Handles root-level dynamic pages (/{slug}).
 * Only renders if a published page with isRootLevel=true exists for this slug.
 * Otherwise renders NotFound.
 */
const RootDynamicPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data } = useData();
  
  // Check if a root-level page exists for this slug
  const page = data.pages?.find(p => p.slug === slug && p.isPublished && p.isRootLevel);
  
  if (!page) {
    return <NotFound />;
  }

  // Reuse DynamicPage component - it already handles blocks and content rendering
  return <DynamicPage />;
};

export default RootDynamicPage;
