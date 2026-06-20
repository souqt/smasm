import ServiceSubPage from "./ServiceSubPage";
import { managedServicesBlocks } from "@/data/serviceSubPagesData";

const ManagedServicesPage = () => (
  <ServiceSubPage pageKey="managed-services" defaultBlocks={managedServicesBlocks} />
);

export default ManagedServicesPage;
