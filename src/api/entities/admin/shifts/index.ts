import {
  ApiClientCompanyShifts,
  TCreateCompanyShift as CompanyCreateShift,
  TDeleteCompanyShift as CompanyDeleteShift,
  TGetCompanyShiftById as CompanyGetShiftById,
  TGetCompanyShifts as CompanyGetShifts,
  TUpdateCompanyShift as CompanyUpdateShift,
} from "@/api/entities/company/shift";
import type {
  TCreateCustomShiftForDateArgs,
  TGetCompanyShiftsForDateRangeArgs,
  TGetCompanyShiftsForDateRangeRes,
  TUpdateCustomShiftForDateArgs,
} from "@/api/entities/company";
import { ApiClientCompany } from "@/api/entities/company";

export type TGetCompanyShifts = CompanyGetShifts;
export type TGetCompanyShiftById = CompanyGetShiftById;
export type TCreateCompanyShift = CompanyCreateShift;
export type TUpdateCompanyShift = CompanyUpdateShift;
export type TDeleteCompanyShift = CompanyDeleteShift;
export type {
  TCreateCustomShiftForDateArgs,
  TGetCompanyShiftsForDateRangeArgs,
  TGetCompanyShiftsForDateRangeRes,
  TUpdateCustomShiftForDateArgs,
};

export class ApiClientAdminCompanyShifts extends ApiClientCompanyShifts {
  private readonly companyClient: ApiClientCompany;

  constructor(token: string, currentUserId: number) {
    super(token, currentUserId);
    this.companyClient = new ApiClientCompany(token, currentUserId);
  }

  getCompanyShiftsForDateRange(args: TGetCompanyShiftsForDateRangeArgs) {
    return this.companyClient.getCompanyShiftsForDateRange(args);
  }

  createCustomShiftForDate(args: TCreateCustomShiftForDateArgs) {
    return this.companyClient.createCustomShiftForDate(args);
  }

  updateCustomShiftForDate(args: TUpdateCustomShiftForDateArgs) {
    return this.companyClient.updateCustomShiftForDate(args);
  }
}
