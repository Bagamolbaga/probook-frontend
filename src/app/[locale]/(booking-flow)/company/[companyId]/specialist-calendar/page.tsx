import { toSlug } from "@/utils/toSlug";
import { redirect } from "next/navigation";

const Page = ({ params }: { params: { locale: string; companyId: string } }) => {
  redirect(`/company/${toSlug(params.companyId)}`);
};

export default Page;
