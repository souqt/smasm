import ServiceSubPage from "./ServiceSubPage";
import { projectBasedBlocks } from "@/data/serviceSubPagesData";

const ProjectBasedPage = () => (
  <ServiceSubPage pageKey="project-based-development" defaultBlocks={projectBasedBlocks} />
);

export default ProjectBasedPage;
