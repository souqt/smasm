import AdminPageBlocks from "./AdminPageBlocks";
import { defaultWhyEgyptBlocks } from "@/components/WhyEgypt";

const AdminWhyEgyptBlocks = () => {
  return (
    <AdminPageBlocks
      pageKey="why-egypt-home"
      pageTitle="Why Egypt Section"
      pageDescription="Manage the 'Why Egypt?' section on the homepage"
      defaultBlocks={defaultWhyEgyptBlocks}
    />
  );
};

export default AdminWhyEgyptBlocks;
