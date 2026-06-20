import { useParams } from "react-router-dom";
import { useData } from "@/context/DataContext";
import AdminPageBlocks from "./AdminPageBlocks";
import { ContentBlock } from "@/data/types";

const defaultJobApplicationBlocks: ContentBlock[] = [
  {
    id: 'job-app-about',
    type: 'rich-text',
    order: 1,
    title: 'About This Role',
    content: '<p>We are looking for talented professionals to join our growing team. This section provides an overview of the role, expectations, and what you can look forward to as part of our organization.</p><h3>What We Offer</h3><ul><li>Competitive salary and benefits</li><li>Remote-friendly work environment</li><li>Professional development opportunities</li><li>Supportive and collaborative team culture</li></ul>',
    backgroundColor: 'default'
  }
];

const AdminJobApplicationBlocks = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const { data } = useData();
  
  const job = data.jobs.find(j => j.id === jobId);
  const jobTitle = job?.title || "Job";

  return (
    <AdminPageBlocks
      pageKey={`job-application-${jobId}`}
      pageTitle={`${jobTitle} - Application Page Blocks`}
      pageDescription={`Manage the content blocks that appear above the application form for "${jobTitle}". Each job has its own unique blocks.`}
      defaultBlocks={defaultJobApplicationBlocks}
    />
  );
};

export default AdminJobApplicationBlocks;
