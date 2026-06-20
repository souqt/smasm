import ServiceSubPage from "./ServiceSubPage";
import { teamAugmentationBlocks } from "@/data/serviceSubPagesData";

const TeamAugmentationPage = () => (
  <ServiceSubPage pageKey="team-augmentation" defaultBlocks={teamAugmentationBlocks} />
);

export default TeamAugmentationPage;
