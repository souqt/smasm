import ServiceSubPage from "./ServiceSubPage";
import { itInfrastructureBlocks } from "@/data/serviceSubPagesData";

const ITInfrastructurePage = () => (
  <ServiceSubPage pageKey="it-infrastructure-setup" defaultBlocks={itInfrastructureBlocks} />
);

export default ITInfrastructurePage;
