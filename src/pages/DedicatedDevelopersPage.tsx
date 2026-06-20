import ServiceSubPage from "./ServiceSubPage";
import { dedicatedDevelopersBlocks } from "@/data/serviceSubPagesData";

const DedicatedDevelopersPage = () => (
  <ServiceSubPage pageKey="dedicated-developers" defaultBlocks={dedicatedDevelopersBlocks} />
);

export default DedicatedDevelopersPage;
