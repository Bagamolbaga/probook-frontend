"use client";

import { ApiClientBookings } from "./entities/booking";
import { ApiClientCompany } from "./entities/company";
import { ApiClientCompanyShifts } from "./entities/company/shift";
import { ApiClientCompanySubscription } from "./entities/company/subscription";
import { ApiClientPayments } from "./entities/payments";
import { ApiClientServices } from "./entities/services";
import { ApiClientBusinessUser } from "./entities/user/business";
import { ApiClientCustomerUser } from "./entities/user/customer";

import { ApiClientAdminCompany } from "./entities/admin/company";
import { ApiClientAdminBookings } from "./entities/admin/booking";
import { ApiClientAdminServices } from "./entities/admin/services";
import { ApiClientAdminCompanyShifts } from "./entities/admin/shifts";
import { ApiClientAdminSpecialists } from "./entities/admin/specialists";
import { ApiClientAdminBusinessUser } from "./entities/admin/users/business";
import { ApiClientAdminCustomer } from "./entities/admin/users/customers";
import { ApiClientCompanySubscription as ApiClientAdminCompanySubscription } from "./entities/admin/company/subscription";

export class ApiClient {
  businessUser: ApiClientBusinessUser;
  customerUser: ApiClientCustomerUser;
  bookings: ApiClientBookings;
  services: ApiClientServices;
  company: ApiClientCompany;
  payments: ApiClientPayments;
  shifts: ApiClientCompanyShifts;
  companySubscription: ApiClientCompanySubscription;
  admin: {
    company: ApiClientAdminCompany;
    booking: ApiClientAdminBookings
    customers: ApiClientAdminCustomer;
    business: ApiClientAdminBusinessUser;
    services: ApiClientAdminServices;
    specialists: ApiClientAdminSpecialists;
    shifts: ApiClientAdminCompanyShifts;
    companySubscription: ApiClientCompanySubscription;
  };

  constructor(token: string, currentUserId: number) {
    this.businessUser = new ApiClientBusinessUser(token, currentUserId);
    this.customerUser = new ApiClientCustomerUser(token, currentUserId);
    this.bookings = new ApiClientBookings(token, currentUserId);
    this.services = new ApiClientServices(token, currentUserId);
    this.company = new ApiClientCompany(token, currentUserId);
    this.payments = new ApiClientPayments(token, currentUserId);
    this.shifts = new ApiClientCompanyShifts(token, currentUserId);
    this.companySubscription = new ApiClientCompanySubscription(token, currentUserId);
    this.admin = {
      company: new ApiClientAdminCompany(token, currentUserId),
      booking: new ApiClientAdminBookings(token, currentUserId),
      customers: new ApiClientAdminCustomer(token, currentUserId),
      business: new ApiClientAdminBusinessUser(token, currentUserId),
      services: new ApiClientAdminServices(token, currentUserId),
      specialists: new ApiClientAdminSpecialists(token, currentUserId),
      shifts: new ApiClientAdminCompanyShifts(token, currentUserId),
      companySubscription: new ApiClientAdminCompanySubscription(token, currentUserId),
    };
  }
}
