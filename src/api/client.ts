"use client";

import { ApiClientBookings } from "./entities/booking";
import { ApiClientCompany } from "./entities/company";
import { ApiClientCompanyShifts } from "./entities/company/shift";
import { ApiClientCompanySubscription } from "./entities/company/subscription";
import { ApiClientPayments } from "./entities/payments";
import { ApiClientServices } from "./entities/services";
import { ApiClientBusinessUser } from "./entities/user/business";
import { ApiClientCustomerUser } from "./entities/user/customer";
import { ApiClientInvitations } from "./entities/invitation";
import { ApiClientCustomer } from "./entities/customer";

export class ApiClient {
  businessUser: ApiClientBusinessUser;
  customerUser: ApiClientCustomerUser;
  bookings: ApiClientBookings;
  services: ApiClientServices;
  company: ApiClientCompany;
  payments: ApiClientPayments;
  shifts: ApiClientCompanyShifts;
  companySubscription: ApiClientCompanySubscription;
  invitations: ApiClientInvitations;
  customer: ApiClientCustomer;

  constructor(token: string, currentUserId: number, locale: "en" | "ru") {
    this.businessUser = new ApiClientBusinessUser(token, currentUserId, locale);
    this.customerUser = new ApiClientCustomerUser(token, currentUserId, locale);
    this.bookings = new ApiClientBookings(token, currentUserId, locale);
    this.services = new ApiClientServices(token, currentUserId, locale);
    this.company = new ApiClientCompany(token, currentUserId, locale);
    this.payments = new ApiClientPayments(token, currentUserId, locale);
    this.shifts = new ApiClientCompanyShifts(token, currentUserId, locale);
    this.companySubscription = new ApiClientCompanySubscription(
      token,
      currentUserId,
      locale
    );
    this.invitations = new ApiClientInvitations(token, currentUserId, locale);
    this.customer = new ApiClientCustomer(token, currentUserId, locale);
  }
}
