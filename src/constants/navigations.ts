import PeoplesIcon from '@/src/components/ui/icons/Peoples';
import EmailIcon from "@/src/components/ui/icons/Email";
import EmployeeIcon from "@/src/components/ui/icons/Employee";
import HotIcon from "@/src/components/ui/icons/Hot";
import InvoiceIcon from "@/src/components/ui/icons/Invoice";
import PersonIcon from "@/src/components/ui/icons/Person";
import SettingsIcon from "@/src/components/ui/icons/Settings";
import StoreIcon from "@/src/components/ui/icons/Store";
import VideoIcon from "@/src/components/ui/icons/Video";
import CalendarIcon from '@/src/components/ui/icons/Calendar';

export const LANDING_NAVIGATION = [
  {
    path: "/services",
    label: "Services",
    i18_id: "services"
  },
  // {
  //   path: "/pricing",
  //   label: "Pricing",
  //   i18_id: "pricing"
  // },
  // {
  //   path: "/about",
  //   label: "About us",
    // i18_id: "about"
    // },
  {
    path: "/contact",
    label: "Contact us",
    i18_id: "contact"
  },
];

export const MAIN_NAVIGATION = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: VideoIcon,
    i18_id: "dashboard"
  },
  {
    path: "/booking-creation",
    label: "New booking",
    icon: StoreIcon,
    i18_id: "booking-creation"
  },
  {
    path: "/booking-management",
    label: "Calendar",
    icon: CalendarIcon,
    i18_id: "calendar"
  },
  {
    path: "/staff-management",
    label: "Staff management",
    icon: PersonIcon,
    i18_id: "staff-management"
  },
  {
    path: "/business-services",
    label: "Business services",
    icon: InvoiceIcon,
    i18_id: "business-services"
  },
  {
    path: "/customer-database",
    label: "Customer database",
    icon: PersonIcon,
    i18_id: "customer-database"
  },
  // {
  //   path: "/",
  //   label: "System configuration",
  //   icon: SettingsIcon,
  //   i18_id: "services-and-pricing"//!
  // },
  // {
  //   path: "/services-and-pricing",
  //   label: "Services & Pricing",
  //   icon: HotIcon,
  //   i18_id: "services-and-pricing"
  // },
] as const;

export const MAIN_NAVIGATION_ENUM = MAIN_NAVIGATION.reduce((acc, r) => {
  acc[r.path] = r
  return acc
}, {} as Record<typeof MAIN_NAVIGATION[number]["path"], typeof MAIN_NAVIGATION[number]>)


export const PUBLIC_ROUTES = [
  "/",
  "/sign-in",
  "/sign-up",
  "/recovery-password",
  "/privacy-policy",
  "/terms-of-use",
  "/terms-of-service",
  "/search",
  "/company",
  "/company/:id",
  "/company/:id/booking-creation",
  "/company/:id/booking-cancelation",
  "/company/:id/booking-manage",
  "/company/:id/booking-confirmation",
  ...LANDING_NAVIGATION.map((r) => r.path),
];
