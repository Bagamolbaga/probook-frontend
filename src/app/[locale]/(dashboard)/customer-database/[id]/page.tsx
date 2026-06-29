import { MAIN_NAVIGATION_ENUM } from "@/constants/navigations";
import CustomerDatabaseDetailsScene from "@/scenes/main/customerDatabaseDetails";
import { redirect } from "next/navigation";

const CustomerDeatilsPage = ({ params: { id } }: { params: { id: string } }) => {
  if (isNaN(Number(id))) {
    redirect(MAIN_NAVIGATION_ENUM["/customer-database"]["path"]);
  }

  return <CustomerDatabaseDetailsScene customerId={Number(id)} />;
};

export default CustomerDeatilsPage;
