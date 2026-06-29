import BarberingServiceIcon from "@/components/ui/icons/serviceTypes/Barbering";
import EyebrowsServiceIcon from "@/components/ui/icons/serviceTypes/Eyebrows";
import HairServiceIcon from "@/components/ui/icons/serviceTypes/Hair";
import HairRemovalServiceIcon from "@/components/ui/icons/serviceTypes/HairRemoval";
import MassageServiceIcon from "@/components/ui/icons/serviceTypes/Massage";
import NailsServiceIcon from "@/components/ui/icons/serviceTypes/Nails";

// export const SERVICE_TYPES_ICONS = {
//   HAIR: HairServiceIcon,

//   SKIN: NailsServiceIcon,

//   NAIL: EyebrowsServiceIcon,

//   WAX: MassageServiceIcon,

//   MASSAGE: HairRemovalServiceIcon,

//   MAKEUP: BarberingServiceIcon,

//   BODY: BarberingServiceIcon,

//   BROWLASH: BarberingServiceIcon,

//   SPA: BarberingServiceIcon,

//   PMU: BarberingServiceIcon,
// };

export const SERVICE_TYPES = [
  {
    id: "HAIR",
    label: "Hair Services",
    shortLabel: "Hair",
    icon: HairServiceIcon,
  },
  {
    id: "SKIN",
    label: "Skincare Services",
    shortLabel: "Skincare",
    icon: NailsServiceIcon,
  },
  {
    id: "NAIL",
    label: "Nail Services",
    shortLabel: "Nail",
    icon: EyebrowsServiceIcon,
  },
  {
    id: "WAX",
    label: "Waxing Services",
    shortLabel: "Waxing",
    icon: MassageServiceIcon,
  },
  {
    id: "MASSAGE",
    label: "Massage Services",
    shortLabel: "Massage",
    icon: HairRemovalServiceIcon,
  },
  {
    id: "MAKEUP",
    label: "Makeup Services",
    shortLabel: "Makeup",
    icon: BarberingServiceIcon,
  },
  {
    id: "BODY",
    label: "Body Treatments",
    shortLabel: "Body Treatments",
    icon: BarberingServiceIcon,
  },
  {
    id: "BROWLASH",
    label: "Eyebrow & Eyelash Services",
    shortLabel: "Eyebrow & Eyelash",
    icon: BarberingServiceIcon,
  },
  {
    id: "SPA",
    label: "Spa Packages",
    shortLabel: "Spa Packages",
    icon: BarberingServiceIcon,
  },
  {
    id: "PMU",
    label: "Permanent Makeup",
    shortLabel: "Permanent Makeup",
    icon: BarberingServiceIcon,
  },
] as const;

export const SERVICE_TYPES_ENUM = SERVICE_TYPES.reduce(
  (acc, r) => {
    acc[r.id] = r;
    return acc;
  },
  {} as Record<(typeof SERVICE_TYPES)[number]["id"], (typeof SERVICE_TYPES)[number]>
);

export const SERVICE_TYPES_ICONS = SERVICE_TYPES.reduce(
  (acc, r) => {
    acc[r.id] = r.icon;
    return acc;
  },
  {} as Record<
    (typeof SERVICE_TYPES)[number]["id"],
    (typeof SERVICE_TYPES)[number]["icon"]
  >
);
