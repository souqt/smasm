import { useParams } from "react-router-dom";
import { useData } from "@/context/DataContext";
import AdminPageBlocks from "./AdminPageBlocks";

const AdminDynamicPageBlocks = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data } = useData();
  
  const page = data.pages?.find(p => p.slug === slug);
  const pageTitle = page?.title || slug || "Page";

  return (
    <AdminPageBlocks
      pageKey={`page-${slug}`}
      pageTitle={`${pageTitle} - Blocks`}
      pageDescription={`Manage content blocks for "${pageTitle}" page`}
    />
  );
};

export default AdminDynamicPageBlocks;
