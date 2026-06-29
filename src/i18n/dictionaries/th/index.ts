import { booking } from "./booking";
import { auth } from "./landing/auth";
import { contact } from "./landing/contact";
import { landingHome } from "./landing/home";
import { pricingPage } from "./landing/pricing";
import { search } from "./landing/search";
import { services } from "./landing/services";
import { bookingManagement } from "./main/bookingManagement";
import { businessServices } from "./main/businessServices";
import { customerDatabase } from "./main/customerDatabase";
import { dashboard } from "./main/dashboard";
import { staffManagement } from "./main/staffManagement";
import { metadata } from "./metadata";
import { navigation } from "./navigation";
import { ui } from "./ui";

const TH = {
  metadata,
  landingHome,
  landingSearch: search,
  landingServices: services,
  landingPricing: pricingPage,
  landingContact: contact,
  booking,
  bookingManagement,
  staffManagement,
  businessServices,
  customerDatabase,
  auth,
  dashboard,
  ui,
  navigation,
};

export default TH;
