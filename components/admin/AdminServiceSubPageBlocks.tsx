import AdminPageBlocks from "./AdminPageBlocks";
import { dedicatedDevelopersBlocks, teamAugmentationBlocks, projectBasedBlocks, managedServicesBlocks, itInfrastructureBlocks } from "@/data/serviceSubPagesData";

interface AdminServiceSubPageBlocksProps {
  pageKey: string;
  pageTitle: string;
  pageDescription: string;
  defaultBlocks: import("@/data/types").ContentBlock[];
}

const AdminServiceSubPageBlocks = ({ pageKey, pageTitle, pageDescription, defaultBlocks }: AdminServiceSubPageBlocksProps) => (
  <AdminPageBlocks pageKey={pageKey} pageTitle={pageTitle} pageDescription={pageDescription} defaultBlocks={defaultBlocks} />
);

export const AdminDedicatedDevelopersBlocks = () => (
  <AdminServiceSubPageBlocks pageKey="dedicated-developers" pageTitle="Dedicated Developers Page" pageDescription="Manage the Dedicated Developers service page content" defaultBlocks={dedicatedDevelopersBlocks} />
);

export const AdminTeamAugmentationBlocks = () => (
  <AdminServiceSubPageBlocks pageKey="team-augmentation" pageTitle="Team Augmentation Page" pageDescription="Manage the Team Augmentation service page content" defaultBlocks={teamAugmentationBlocks} />
);

export const AdminProjectBasedBlocks = () => (
  <AdminServiceSubPageBlocks pageKey="project-based-development" pageTitle="Project-Based Development Page" pageDescription="Manage the Project-Based Development service page content" defaultBlocks={projectBasedBlocks} />
);

export const AdminManagedServicesBlocks = () => (
  <AdminServiceSubPageBlocks pageKey="managed-services" pageTitle="Managed Services Page" pageDescription="Manage the Managed Services service page content" defaultBlocks={managedServicesBlocks} />
);

export const AdminITInfrastructureBlocks = () => (
  <AdminServiceSubPageBlocks pageKey="it-infrastructure-setup" pageTitle="IT Infrastructure Setup Page" pageDescription="Manage the IT Infrastructure Setup service page content" defaultBlocks={itInfrastructureBlocks} />
);
