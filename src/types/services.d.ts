type TService = {
  id: string;
  _id?: string;
  name: string;
  description?: string;
  image?: string;
  company: string | TCompany;
  category: string | TServiceCategory;
  options: TServiceOption[];
  specialists: (string | TServiceSpecialist)[];
  createdAt?: string;
  updatedAt?: string;
};

type TServiceSpecialist = Pick<
  TSpecialist,
  "id" | "firstName" | "lastName" | "fullName" | "avatar"
>;

type TServiceCategory = {
  id: string;
  _id?: string;
  name: string;
  company: string | null;
  isGlobal: boolean;
  createdAt?: string;
  updatedAt?: string;
};

type TServiceOption = {
  id: number;
  _id?: string;
  name?: string;
  price: number;
  duration: number;
};

type TServiceType = {
  id: string;
  label: string;
  shortLabel: string;
  icon: ({ className }: { className?: string }) => JSX.Element;
};

type TServiceType_new = {
  id: number;
  name: string;
  company: number;
};

type TServiceAndSelectedOption = TService & { selectedOption: TServiceOption };

type TServiceStatic = {
  id: number;
  name: string;
  description?: string;
  description_thai?: string;
  service_type: string;
  specialists: number[];
  company: number;
  show_specialist: boolean;
  options: {
    id: number;
    name?: string;
    price: number;
    duration: number;
  }[];
};
