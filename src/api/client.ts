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

  constructor(token: string, currentUserId: number) {
    this.businessUser = new ApiClientBusinessUser(token, currentUserId);
    this.customerUser = new ApiClientCustomerUser(token, currentUserId);
    this.bookings = new ApiClientBookings(token, currentUserId);
    this.services = new ApiClientServices(token, currentUserId);
    this.company = new ApiClientCompany(token, currentUserId);
    this.payments = new ApiClientPayments(token, currentUserId);
    this.shifts = new ApiClientCompanyShifts(token, currentUserId);
    this.companySubscription = new ApiClientCompanySubscription(token, currentUserId);
    this.invitations = new ApiClientInvitations(token, currentUserId);
  }
}
