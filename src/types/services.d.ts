type TService = {
  id: string
  name: string;
  description?: string;
  image?: string;
  company: Company;
  options: ServiceOption[];
  specialists: Specialist[];
  createdAt: Date;
  updatedAt: Date;
};

type TServiceOption = {
  id: number;
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
