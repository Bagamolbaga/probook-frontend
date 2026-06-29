import { format } from "date-fns";

const Row = ({ label, value }: { label: string; value: string }) => {
  return (
    <div>
      <p className="text-sm text-greyLight">{label}</p>
      <p className="mt-1 text-base leading-5 text-white">{value}</p>
    </div>
  );
};

const CustomerDetailsWidget = ({
  customer,
  bowersUsage
}: {
  customer?: TCustomer & { first_name: string | null; last_name: string | null };
  bowersUsage?: Date
}) => {
  const getName = () => {
    if (customer?.name) return customer.name;
    if (customer?.first_name || customer?.last_name)
      return `${customer?.first_name} ${customer?.last_name}`;

    return "Customer name"
  };

  return (
    <div className="w-full p-5 rounded-xl bg-darkPrimary">
      <div className="w-full pb-6 flex items-start justify-between border-b border-greyOutlineSecondary">
        <h3 className="text-xl font-bold text-white">
          {getName()}
        </h3>
      </div>
      <div className="pt-6 flex flex-col gap-2">
        <Row label="Email" value={customer?.email || "Email not entered"} />
        <Row label="Phone" value={customer?.phone || "Phone not entered"} />
        <Row label="Bowers Usage" value={bowersUsage ? format(bowersUsage, "dd MMM yyyy") : ""} />
      </div>
    </div>
  );
};

export default CustomerDetailsWidget;
