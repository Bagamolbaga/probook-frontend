import { MAIN_NAVIGATION_ENUM } from "@/constants/navigations";
import CustomerDatabaseDetailsScene from "@/scenes/main/customerDatabaseDetails";
import { redirect } from "next/navigation";

const CustomerDeatilsPage = ({ params: { id } }: { params: { id: string } }) => {
  if (!/^[a-f\d]{24}$/i.test(id)) {
    redirect(MAIN_NAVIGATION_ENUM["/customer-database"]["path"]);
  }

  return <CustomerDatabaseDetailsScene customerId={id} />;
};

export default CustomerDeatilsPage;
