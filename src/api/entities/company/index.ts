import { ApiClientCore } from "@/api/core";
import { format } from "date-fns";
import { AxiosResponse } from "axios";
import { removeEmptyFields } from "@/utils/removeEmptyFields";
import { BackendShift, toFrontendShift } from "@/api/entities/company/shift";

export type TGetCompaniesArgs = {
  queryParams?: {
    offset?: string;
    limit?: string;
    order_by?: "bookings_count" | "most_recent_booking";
    ordering?: OrderingFields<TCompany>;
    date_from?: string;
    date_to?: string;
  };
};

export type TGetCompanySpecialistsArgs = {
  companyId: string;
  queryParams?: {
    limit?: string;
    offset?: string;
  };
};

export type TGetCompanySpecialistByIdArgs = {
  specialistId: number;
};

type BackendSpecialist = Omit<TSpecialist, "defaultShift"> & {
  defaultShift?: string | BackendShift | null;
};

export type TGetCompanyShiftsForDateRangeArgs = {
  companyId: string;
  start: Date;
  end: Date;
};
export type TCreateCustomShiftForDateArgs = {
  companyId: string;
  specialistId: string;
  data: {
    name: TDefaultShiftsNameId;
    description?: string;
    date: Date | null;
    workingSlots: number[];
    breakSlots?: number[];
  };
};

export type TUpdateCustomShiftForDateArgs = {
  companyId: string;
  shiftId: TShift["id"];
  data: {
    name?: TDefaultShiftsNameId;
    description?: string;
    workingSlots?: number[];
    breakSlots?: number[];
  };
};

export type TGetCompanyShiftsForDateRangeRes = TSpecialist & {
  specialist: TSpecialist;
  shifts: TShift[];
  defaultShift: TShift | null;
  default_shift: TShift | null;
};

export type TCreateCompanySpecialistsArgs = {
  companyId: string;
  data: {
    email: string;
    firstName: string;
    lastName: string;
    specialties?: string[];
    bio?: string;
    rating?: number;
    defaultShift?: string | null;
    services?: string[];
  };
};

export type TUpdateCompanySpecialistsArgs = {
  companyId: string;
  specialistId: string;
  data: Partial<TCreateCompanySpecialistsArgs["data"]>;
};

export type TDeleteCompanySpecialistsArgs = {
  companyId: string;
  specialistId: string;
};

export type TGetCompanyDetailsArgs = {
  companyId: string;
};

export type TUpdateCompanyDetailsArgs = {
  companyId: string;
  data: Partial<TCompany>;
};

export type TGetCompanyServicesArgs = {
  companyId: string;
  queryParams?: {
    offset?: string;
    limit?: string;
    ordering?: OrderingFields<TService>;
    search?: string;
  };
};

export type TGetCompanyServiceCategoriesArgs = {
  companyId: string;
};

export type TCreateCompanyServiceCategoryArgs = {
  companyId: string;
  data: {
    name: string;
  };
};

export type TUpdateCompanyServiceCategoryArgs = TCreateCompanyServiceCategoryArgs & {
  categoryId: string;
};

export type TDeleteCompanyServiceCategoryArgs = {
  companyId: string;
  categoryId: string;
};

export type TSearchCompanysArgs = {
  query: {
    search?: string;
    type?: string[];
    date?: string;
    start_time?: string;
    end_time?: string;
    limit?: number;
    offset?: number;
  };
};

export type TSearchCompanysRes = (TCompany & { price_from: string; price_to: string })[];

export type TCreateCompanyServiceArgs = {
  data: {
    companyId: string;
    categoryId: string;
    name?: string;
    description?: string;
    image?: string;
    options?: {
      name: string;
      description?: string;
      price: number;
      duration: number;
    }[];
    specialistIds?: string[];
  };
};

export type TUpdateCompanyServiceArgs = {
  serviceId: string;
  data: Partial<Omit<TCreateCompanyServiceArgs["data"], "companyId">> & {
    companyId: string;
  };
};

export type TDeleteCompanyServiceArgs = {
  companyId: string;
  serviceId: string;
};

export type TUploadServiceImageArgs = {
  serviceId: number;
  data: {
    file: File;
  };
};

export type TGetCompanyImagesRes = IUploadImage[];

export type TGetCompanyImagesArgs = {
  companyId: string;
};

export type TUploadCompanyImagesArgs = {
  companyId: string;
  data: {
    files: File[];
  };
};

export type TDeleteCompanyImagesArgs = {
  companyId: string;
  data: {
    imageIds: number[];
  };
};

export type TUploadCompanyLogoArgs = {
  companyId: string;
  data: {
    logo: File;
  };
};

export type TGetCompanySalesAndCustomerStat = {
  companyId: number;
  startDate: Date;
  endDate: Date;
};

export type TGetCompanySalesAndCustomerStatRes = {
  sales_report: {
    sales: number;
    customers: number;
    first_time_customers: number;
  };
};

export class ApiClientCompany extends ApiClientCore {
  constructor(token: string, currentUserId: number) {
    super(token, currentUserId);
  }

  async getCompanyDetails({ companyId }: TGetCompanyDetailsArgs) {
    return this.instanceWithoutAuth.get<TCompany>(`/companies/${companyId}`);
  }

  async updateCompanyDetails({
    companyId,
    data,
  }: TUpdateCompanyDetailsArgs): Promise<AxiosResponse<TCompany>> {
    return this.instance.put<TCompany>(`/companies/${companyId}`, data);
  }

  async getCompanies({ queryParams }: TGetCompaniesArgs) {
    const formattedQueryParams = {
      ...queryParams,
    };

    const params = new URLSearchParams(formattedQueryParams);

    return this.instanceWithoutAuth.get<TGetResponse<TCompany[]>>(
      `/companies/list?${params.toString()}`
    );
  }

  async getCompanySpecialists({ companyId, queryParams }: TGetCompanySpecialistsArgs) {
    const formattedQueryParams = {
      ...queryParams,
    };

    const params = new URLSearchParams(formattedQueryParams);

    const response = await this.instanceWithoutAuth.get<
      TGetResponse<BackendSpecialist[]>
    >(`/companies/${companyId}/specialists?${params.toString()}`);

    return {
      ...response,
      data: {
        ...response.data,
        results: response.data.results.map((specialist) => ({
          ...specialist,
          defaultShift:
            specialist.defaultShift && typeof specialist.defaultShift === "object"
              ? toFrontendShift(specialist.defaultShift)
              : specialist.defaultShift,
        })),
      } satisfies TGetResponse<TSpecialist[]>,
    };
  }

  async getCompanySpecialistById({ specialistId }: TGetCompanySpecialistByIdArgs) {
    return this.instanceWithoutAuth.get<TSpecialist>(
      `/users/company/specialist/${specialistId}/`
    );
  }

  async createCompanySpecialist({ companyId, data }: TCreateCompanySpecialistsArgs) {
    return this.instance.post<TSpecialist>(`/companies/${companyId}/specialists`, data);
  }

  async updateCompanySpecialist({
    companyId,
    specialistId,
    data,
  }: TUpdateCompanySpecialistsArgs) {
    return this.instance.put<TSpecialist>(
      `/companies/${companyId}/specialists/${specialistId}`,
      data
    );
  }

  async deleteCompanySpecialist({
    companyId,
    specialistId,
  }: TDeleteCompanySpecialistsArgs) {
    return this.instance.delete<TSpecialist>(
      `/companies/${companyId}/specialists/${specialistId}`
    );
  }

  async getCompanyServices({ companyId, queryParams }: TGetCompanyServicesArgs) {
    const formattedQueryParams = {
      ...queryParams,
    };

    const params = new URLSearchParams(formattedQueryParams);

    return this.instanceWithoutAuth.get<TGetResponse<TService[]>>(
      `/companies/${companyId}/services?${params.toString()}`
    );
  }

  async getCompanyServiceCategories({ companyId }: TGetCompanyServiceCategoriesArgs) {
    return this.instanceWithoutAuth.get<TGetResponse<TServiceCategory[]>>(
      `/companies/${companyId}/service-categories`
    );
  }

  async createCompanyServiceCategory({
    companyId,
    data,
  }: TCreateCompanyServiceCategoryArgs) {
    return this.instance.post<TServiceCategory>(
      `/companies/${companyId}/service-categories`,
      data
    );
  }

  async updateCompanyServiceCategory({
    companyId,
    categoryId,
    data,
  }: TUpdateCompanyServiceCategoryArgs) {
    return this.instance.put<TServiceCategory>(
      `/companies/${companyId}/service-categories/${categoryId}`,
      data
    );
  }

  async deleteCompanyServiceCategory({
    companyId,
    categoryId,
  }: TDeleteCompanyServiceCategoryArgs) {
    return this.instance.delete<TServiceCategory>(
      `/companies/${companyId}/service-categories/${categoryId}`
    );
  }

  async searchCompanyServices({ query }: TSearchCompanysArgs) {
    const params = new URLSearchParams();

    const safeQuery = removeEmptyFields<Record<string, string>>(query);

    Object.entries(safeQuery).forEach(([key, value]) => params.set(key, value));

    return this.instanceWithoutAuth.get<TGetResponse<TSearchCompanysRes>>(
      `/companies/services/search?${params.toString()}`
    );
  }

  async createCompanyService({ data }: TCreateCompanyServiceArgs) {
    const { companyId, ...body } = data;

    return this.instance.post<TService>(`/companies/${companyId}/services`, body);
  }

  async updateCompanyService({ serviceId, data }: TUpdateCompanyServiceArgs) {
    const { companyId, ...body } = data;

    return this.instance.put<TService>(
      `/companies/${companyId}/services/${serviceId}`,
      body
    );
  }

  async deleteCompanyService({ companyId, serviceId }: TDeleteCompanyServiceArgs) {
    return this.instance.delete<TService>(
      `/companies/${companyId}/services/${serviceId}`
    );
  }

  async getCompanyShiftsForDateRange({
    companyId,
    start,
    end,
  }: TGetCompanyShiftsForDateRangeArgs) {
    const params = new URLSearchParams({
      start: format(start, "yyyy-MM-dd"),
      end: format(end, "yyyy-MM-dd"),
    });
    const response = await this.instanceWithoutAuth.get<
      TGetResponse<
        {
          specialist: TSpecialist;
          shifts: BackendShift[];
          defaultShift: BackendShift | null;
        }[]
      >
    >(`/companies/${companyId}/specialists/shifts?${params.toString()}`);

    return {
      ...response,
      data: {
        ...response.data,
        results: response.data.results.map(({ specialist, shifts, defaultShift }) => {
          const frontendDefaultShift = defaultShift
            ? toFrontendShift(defaultShift)
            : null;
          return {
            ...specialist,
            specialist,
            shifts: shifts.map(toFrontendShift),
            defaultShift: frontendDefaultShift,
            default_shift: frontendDefaultShift,
          };
        }),
      },
    };
  }

  async createCustomShiftForDate({
    companyId,
    specialistId,
    data,
  }: TCreateCustomShiftForDateArgs) {
    const response = await this.instance.post<BackendShift>(
      `/companies/${companyId}/shifts`,
      {
        ...data,
        specialistId,
        date: data.date ? format(data.date, "yyyy-MM-dd") : null,
        breakSlots: data.breakSlots || [],
      }
    );

    return { ...response, data: toFrontendShift(response.data) };
  }

  async updateCustomShiftForDate({
    companyId,
    shiftId,
    data,
  }: TUpdateCustomShiftForDateArgs) {
    const response = await this.instance.put<BackendShift>(
      `/companies/${companyId}/shifts/${shiftId}`,
      data
    );

    return { ...response, data: toFrontendShift(response.data) };
  }

  async uploadServiceImage(inputDto: TUploadServiceImageArgs) {
    const formData = new FormData();
    formData.append("image", inputDto.data.file);

    const res = await this.instance.patch<TService>(
      `/companies/service/${inputDto.serviceId}/update/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return res;
  }

  async getCompanyImages({ companyId }: TGetCompanyImagesArgs) {
    return this.instance.get<TGetCompanyImagesRes>(`/companies/${companyId}/images/`);
  }

  async uploadCompanyImages(inputDto: TUploadCompanyImagesArgs) {
    const formData = new FormData();
    inputDto.data.files.forEach((f) => {
      formData.append("image", f);
    });

    const res = await this.instance.post<TGetCompanyImagesRes>(
      `/companies/${inputDto.companyId}/images/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return res;
  }

  async deleteCompanyImages({ companyId, data }: TDeleteCompanyImagesArgs) {
    const formattedData = {
      ids: data.imageIds,
    };

    return this.instance.delete<TGetCompanyImagesRes>(`/companies/${companyId}/images/`, {
      data: formattedData,
    });
  }

  async uploadCompanyLogo(inputDto: TUploadCompanyLogoArgs) {
    const formData = new FormData();
    formData.append("logo", inputDto.data.logo);

    const res = await this.instance.patch(
      `/companies/${inputDto.companyId}/update/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return res;
  }

  async getCompanySalesAndCustomerStat({
    companyId,
    startDate,
    endDate,
  }: TGetCompanySalesAndCustomerStat) {
    const formattedQueryParams = {
      start_date: format(startDate, "yyyy-MM-dd"),
      end_date: format(endDate, "yyyy-MM-dd"),
    };

    const params = new URLSearchParams(formattedQueryParams);
    return await this.instance.get<TGetCompanySalesAndCustomerStatRes>(
      `/companies/${companyId}/sales-report?${params.toString()}`
    );
  }
}
