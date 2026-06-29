import { TIME_SLOTS } from "@/constants/timeSlots";
import { ApiClientCore } from "@/api/core";
import { format } from "date-fns";
import { AxiosResponse } from "axios";
import { removeEmptyFields } from "@/utils/removeEmptyFields";

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

export type TGetCompanyShiftsForDateRangeArgs = {
  companyId: number;
  start: Date;
  end: Date;
};
export type TCreateCustomShiftForDateArgs = {
  specialistId: TSpecialist["specialist_details"]["id"];
  data: {
    name: TDefaultShiftsNameId;
    description: string;
    description_thai: string;
    date: Date | null;
    slots: number[];
    daily_break: number[];
  };
};

export type TUpdateCustomShiftForDateArgs = {
  shiftId: TShift["id"];
  data: {
    name?: TDefaultShiftsNameId;
    description?: string;
    description_thai?: string;
    date?: Date;
    slots?: number[];
    daily_break?: number[];
  };
};

export type TGetCompanyShiftsForDateRangeRes = Omit<TSpecialist, "specialist_details"> & {
  specialist: TSpecialist["specialist_details"];
  shifts: TShift[];
};

export type TCreateCompanySpecialistsArgs = {
  // companyId: number;
  data:
    | {
        user_data: {
          email?: string;
          phone?: string;
        };
        full_name: string;
        default_shift: number;
        services: number[];
      }
    | {
        user_data: {
          email?: string;
          phone?: string;
        };
        full_name: string;
        services: number[];
        slots: number[];
        daily_break: number[];
      };
};

export type TCreateCompanySpecialistsRes = {
  message: string;
  specialist: TSpecialist["specialist_details"];
  profile: TSpecialist;
};

export type TUpdateCompanySpecialistsArgs = {
  specialistId: number;
  data:
    | {
        user_data: {
          email?: string;
          phone?: string;
        };
        full_name: string;
        default_shift: number;
      }
    | {
        user_data: {
          email?: string;
          phone?: string;
        };
        full_name: string;
        slots: number[];
        daily_break: number[];
      };
};

export type TDeleteCompanySpecialistsArgs = {
  specialistId: number;
};

export type TGetCompanyDetailsArgs = {
  companyId: string;
};

export type TUpdateCompanyDetailsArgs = {
  companyId: number;
  data: Partial<TCompany>;
  accessToken?: string;
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
  data: { companyId: string } & Pick<
    TService,
    "name" | "description" | "specialists" | "options"
  >;
};

export type TUpdateCompanyServiceArgs = {
  serviceId: string;
  data: {
    companyId: string;
  } & Pick<TService, "name" | "description" | "options" | "specialists">;
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
  companyId: number;
};

export type TUploadCompanyImagesArgs = {
  companyId: number;
  data: {
    files: File[];
  };
};

export type TDeleteCompanyImagesArgs = {
  companyId: number;
  data: {
    imageIds: number[];
  };
};

export type TUploadCompanyLogoArgs = {
  companyId: number;
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
    accessToken,
  }: TUpdateCompanyDetailsArgs): Promise<AxiosResponse<TCompany, any>> {
    if (accessToken) {
      return this.instance.patch<TCompany>(`/companies/${companyId}/update/`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }

    return this.instance.patch<TCompany>(`/companies/${companyId}/update/`, data);
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

    return this.instanceWithoutAuth.get<TGetResponse<TSpecialist[]>>(
      `/companies/${companyId}/specialists?${params.toString()}`
    );
  }

  async getCompanySpecialistById({ specialistId }: TGetCompanySpecialistByIdArgs) {
    return this.instanceWithoutAuth.get<TSpecialist>(
      `/users/company/specialist/${specialistId}/`
    );
  }

  async createCompanySpecialist({ data }: TCreateCompanySpecialistsArgs) {
    return this.instance.post<TCreateCompanySpecialistsRes>(
      `/users/company/create-specialist/`,
      data
    );
  }

  async updateCompanySpecialist({ specialistId, data }: TUpdateCompanySpecialistsArgs) {
    return this.instance.patch<TSpecialist>(
      `/users/company/specialist/${specialistId}/`,
      data
    );
  }

  async deleteCompanySpecialist({ specialistId }: TDeleteCompanySpecialistsArgs) {
    return this.instance.delete<TSpecialist>(
      `/users/company/specialist/${specialistId}/`
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

  async searchCompanyServices({ query }: TSearchCompanysArgs) {
    const params = new URLSearchParams();

    const safeQuery = removeEmptyFields<Record<string, string>>(query);

    Object.entries(safeQuery).forEach(([key, value]) => params.set(key, value));

    return this.instanceWithoutAuth.get<TGetResponse<TSearchCompanysRes>>(
      `/companies/services/search?${params.toString()}`
    );
  }

  async createCompanyService({ data }: TCreateCompanyServiceArgs) {
    return this.instanceWithoutAuth.post<TService>(
      `/companies/${data.companyId}/services`,
      data
    );
  }

  async updateCompanyService({ serviceId, data }: TUpdateCompanyServiceArgs) {
    return this.instanceWithoutAuth.put<TService>(
      `/companies/${data.companyId}/services/${serviceId}`,
      data
    );
  }

  async deleteCompanyService({ companyId, serviceId }: TDeleteCompanyServiceArgs) {
    return this.instanceWithoutAuth.delete<TService>(
      `/companies/${companyId}/services/${serviceId}`
    );
  }

  async getCompanyShiftsForDateRange({
    companyId,
    start,
    end,
  }: TGetCompanyShiftsForDateRangeArgs) {
    const s = format(start, "yyyy-MM-dd");
    const e = format(end, "yyyy-MM-dd");
    return this.instanceWithoutAuth.get<TGetResponse<TGetCompanyShiftsForDateRangeRes[]>>(
      `/companies/${companyId}/specialists/shifts`
    );
  }

  async createCustomShiftForDate({ specialistId, data }: TCreateCustomShiftForDateArgs) {
    const formattedData = {
      ...data,
      date: data.date ? format(data.date, "yyyy-MM-dd") : null,
    };

    return this.instance.post<TShift>(
      `/companies/specialists/shifts/${specialistId}/`,
      formattedData
    );
  }

  async updateCustomShiftForDate({ shiftId, data }: TUpdateCustomShiftForDateArgs) {
    const formattedData = {
      ...data,
      ...(data.date && { date: format(data.date, "yyyy-MM-dd") }),
    };

    return this.instance.patch<TShift>(
      `/companies/specialists/shift/${shiftId}/`,
      formattedData
    );
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
