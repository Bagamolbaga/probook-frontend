// /* eslint-disable @typescript-eslint/no-floating-promises */
// import EditIcon from "@/components/ui/icons/Edit";
// import TextField from "@/components/ui/inputs/TextField";
// import React, { FC, useMemo, useState } from "react";
// import { motion, useScroll, Variants } from "framer-motion";
// import CalendarIcon from "@/components/ui/icons/Calendar";
// import LocationIcon from "@/components/ui/icons/Location";
// import DatePickerField from "@/components/ui/inputs/DatePickerField";
// import TimePicker from "@/components/ui/inputs/TimePicker";
// import { isBefore, isSameDay } from "date-fns";
// import Button from "@/components/ui/button";
// import { UseFormReturn } from "react-hook-form";
// import { SearchForm as SearchFormType, TLocation } from "..";
// import { cn } from "@/utils/cn";
// import useWindowWidth from "@/hooks/useWindowWidth";
// import MagnifyingGlass from "@/components/ui/icons/MagnifyingGlass";
// import ArrowSecondaryDownIcon from "@/components/ui/icons/ArrowSecondaryDown";
// import { useTranslations } from "next-intl";

// type Props = {
//   form: UseFormReturn<SearchFormType, any, undefined>;
//   handleSearch: (formData: SearchFormType) => void;
//   companies: TCompany[];
//   isSmall: boolean;
// };

// const SearchForm: FC<Props> = ({ form, companies, isSmall, handleSearch }) => {
//   const t = useTranslations();
//   const { smallerThanDesctop, deviceType } = useWindowWidth();
//   const [isCollapseOnMobile, setIsCollapseOnMobile] = useState(false);

//   const handleSelectLocation = (c: TLocation["initial"]) => {
//     form.setValue(
//       "location",
//       `${c.country?.name} ${c.city || ""} ${c.address1 || ""} ${c.address2 || ""}`.trim()
//     );
//     form.setValue("locationObj", c);
//   };

//   const filteredLocationByField = useMemo(() => {
//     const formData = form.watch();

//     let arr: TLocation[] = [];

//     const obj: Record<string, TLocation> = {};

//     companies.forEach((c) => {
//       const str = `${c.country?.name}.${c.city}.${c.address1}.${c.address2}`;

//       if (!obj[str]) {
//         const d = {
//           address1: c.address1,
//           address2: c.address2,
//           country: c.country || {
//             code: "",
//             name: "",
//           },
//           city: c.city,
//         };

//         obj[str] = {
//           ...d,
//           initial: d,
//         };
//       }
//     });

//     if (formData.location?.length) {
//       arr = Object.values(obj)
//         .filter(
//           (s) =>
//             s.address1?.toLowerCase().includes(formData.location.toLowerCase()) ||
//             s.address2?.toLowerCase().includes(formData.location.toLowerCase()) ||
//             s.city?.toLowerCase().includes(formData.location.toLowerCase()) ||
//             s.country?.name.toLowerCase().includes(formData.location.toLowerCase())
//         )
//         .map((s) => ({
//           ...s,
//           address1: s.address1?.replace(
//             new RegExp(formData.location, "gi"),
//             (match) => `<span style="color: #603fef;">${match}</span>`
//           ),
//           address2: s.address2?.replace(
//             new RegExp(formData.location, "gi"),
//             (match) => `<span style="color: #603fef;">${match}</span>`
//           ),
//           city: s.city?.replace(
//             new RegExp(formData.location, "gi"),
//             (match) => `<span style="color: #603fef;">${match}</span>`
//           ),
//           country: {
//             code: s.country?.code || "",
//             name:
//               s.country?.name.replace(
//                 new RegExp(formData.location, "gi"),
//                 (match) => `<span style="color: #603fef;">${match}</span>`
//               ) || "",
//           },
//           initial: s,
//         }));
//     } else {
//       form.setValue("locationObj", undefined);
//     }

//     return arr;
//   }, [form.watch("location")]);

//   const renderFilteredLocationByField = useMemo(() => {
//     if (!filteredLocationByField.length) {
//       return (
//         <div className="w-full py-[6px] pl-2 pr-1">
//           <p className="text-xs text-greyPrimary">Not found</p>
//         </div>
//       );
//     }

//     return filteredLocationByField.map((s, idx) => (
//       <div
//         key={idx}
//         className="w-full py-[6px] pl-2 pr-1 flex items-center gap-2 cursor-pointer transition-all hover:bg-greyBackgroundLight"
//         onClick={() => handleSelectLocation(s.initial)}
//       >
//         <div className="w-5 h-5 flex items-center justify-center">
//           <LocationIcon />
//         </div>
//         <div className="flex flex-col items-start justify-center">
//           <p
//             className="text-sm font-semibold"
//             dangerouslySetInnerHTML={{ __html: s.city || "" }}
//           ></p>
//           <p
//             className="mt-1 text-xs text-greyPrimary"
//             dangerouslySetInnerHTML={{
//               __html: [s.address1, s.address2, s.city, s.country?.name].join(" ") || "",
//             }}
//           ></p>
//         </div>
//       </div>
//     ));
//   }, [filteredLocationByField]);

//   const toggleCollapseOnMobile = () => {
//     setIsCollapseOnMobile((prev) => !prev);
//   };

//   const gradientContainerVariant: Variants = {
//     default: {
//       // position: "relative",
//       width: "fit-content",
//       top: "0%",
//       // transform: "translateY(0vh)"
//       // maxWidth: "100%"
//     },
//     animated_OLD: {
//       width: "fit-content",
//       padding: "2px",
//       top: smallerThanDesctop ? "-21%" : "-33%",
//     },
//     animated: {
//       position: "fixed",
//       top: "83px",
//       zIndex: 10,
//       width: "fit-content",
//       padding: "2px",
//     },
//     tabletAnimated: {
//       position: "fixed",
//       top: "83px",
//       zIndex: 10,
//       width: "fit-content",
//       padding: "2px",
//     },
//     tabletCollapsed: {
//       position: "fixed",
//       top: "83px",
//       zIndex: 10,
//       width: "fit-content",
//       padding: "2px",
//     },
//     mobileAnimated: {
//       position: "fixed",
//       top: "83px",
//       zIndex: 10,
//       width: "fit-content",
//       padding: "2px",
//     },
//     mobileCollapsed: {
//       position: "fixed",
//       top: "83px",
//       zIndex: 10,
//       width: "fit-content",
//       padding: "2px",
//     },
//   };

//   const containerVariant: Variants = {
//     default: {
//       padding: "16px",
//       // width: "100%",
//       width: "fit-content",
//     },
//     animated: {
//       padding: "8px",
//       width: "100%",
//     },
//   };

//   const verticalDividerVariant: Variants = {
//     default: {
//       height: "36px",
//     },
//     animated: {
//       height: "24px",
//     },
//   };

//   const buttonVariant: Variants = {
//     default: {
//       width: "100%",
//       height: "auto",
//     },
//     animated: {
//       width: smallerThanDesctop ? "100%" : "fit-content",
//       height: smallerThanDesctop ? "100%" : "fit-content",
//     },
//   };

//   const collapseOnMobileVariant: Variants = {
//     default: {
//       height: "auto",
//     },
//     collapsed: {
//       height: 0,
//       overflow: "hidden",
//     },
//   };

//   const g = () => {
//     if (isSmall) {
//       if (deviceType === "mobile") {
//         if (isCollapseOnMobile) {
//           return "mobileCollapsed";
//         }

//         return "mobileAnimated";
//       }

//       if (deviceType === "tablet") {
//         if (isCollapseOnMobile) {
//           return "tabletCollapsed";
//         }

//         return "tabletAnimated";
//       }

//       return "animated";
//     }

//     return "default";
//   };

//   const verticalDivider = (
//     <motion.div
//       variants={verticalDividerVariant}
//       animate={isSmall ? "animated" : "default"}
//       className="min-w-[1px] h-9 bg-greyLight md:hidden hidden"
//     ></motion.div>
//   );

//   return (
//     <motion.div
//       variants={gradientContainerVariant}
//       animate={g()}
//       className={cn(
//         "relative p-2 z-50 flex items-center justify-center rounded-full pointer-events-auto md:rounded-[26px] sm:rounded-[20px] transition-all bg-gradient-to-r from-[#F679EF50] to-purplePrimary/50",
//         {
//           "from-[#F679EF] to-purplePrimary": isSmall,
//         }
//       )}
//     >
//       <motion.div
//         variants={containerVariant}
//         animate={isSmall ? "animated" : "default"}
//         className={cn("rounded-full md:rounded-[24px] sm:rounded-[18px] bg-white", {
//           // "grid grid-cols-5 items-center gap-2 md:grid-cols-4 sm:grid-cols-1":
//           //   !isAbsoluteForm,
//           // "flex items-center gap-2": isAbsoluteForm,
//           "flex items-center md:!w-[calc(100vw-80px)] md:flex-col md:gap-3 sm:!w-[calc(100vw-80px)] sm:flex-col sm:gap-3":
//             true,
//           "md:gap-0 sm:gap-0": isCollapseOnMobile,
//         })}
//       >
//         <motion.div
//           variants={collapseOnMobileVariant}
//           animate={isCollapseOnMobile ? "collapsed" : "default"}
//           className="w-full flex sm:flex-col sm:gap-3"
//         >
//           <div className="ml-1 flex items-center col-span-1 md:w-1/2">
//             <TextField
//               withSelect
//               variant="no-border"
//               id="search"
//               className="pb-1 !pt-0"
//               placeholder={t("landingSearch.form.searchVenue")}
//               autoComplete="off"
//               iconLeft={<EditIcon className="stroke-darkPrimary" />}
//               register={form.register}
//               error={form.formState.errors.search}
//               // renderSelectContent={
//               //   watch("search")?.length
//               //     ? searchCompaniesServicesQuery.data?.results.map((s) => (
//               //         <div
//               //           key={s.id}
//               //           className="w-full py-[6px] pl-2 pr-1 flex gap-2 cursor-pointer transition-all hover:bg-greyBackgroundLight"
//               //         >
//               //           <div className="w-[42px] h-[42px] rounded overflow-hidden">
//               //             {s.image ? (
//               //               <Image
//               //                 width={42}
//               //                 height={42}
//               //                 src={s.image}
//               //                 alt={s.name}
//               //                 className="w-full h-full object-cover"
//               //               />
//               //             ) : (
//               //               <div className="w-full h-full bg-greyPrimary/10"></div>
//               //             )}
//               //           </div>
//               //           <div className="flex flex-col items-start justify-center gap-1">
//               //             <p
//               //               className="text-sm font-semibold"
//               //               dangerouslySetInnerHTML={{ __html: s.name }}
//               //             ></p>
//               //             <p
//               //               className="text-xs text-greyPrimary"
//               //               dangerouslySetInnerHTML={{ __html: s.description }}
//               //             ></p>
//               //           </div>
//               //         </div>
//               //       ))
//               //     : undefined
//               // }
//             />
//             {verticalDivider}
//           </div>

//           <div className="flex items-center col-span-1 md:w-1/2">
//             <TextField
//               withSelect
//               variant="no-border"
//               id="location"
//               className="pb-1 !pt-0"
//               placeholder={t("landingSearch.form.location")}
//               autoComplete="off"
//               iconLeft={<LocationIcon className="stroke-darkPrimary" />}
//               register={form.register}
//               error={form.formState.errors.location}
//               renderSelectContent={
//                 form.watch("location")?.length ? renderFilteredLocationByField : undefined
//               }
//             />
//             {verticalDivider}
//           </div>
//         </motion.div>

//         <motion.div
//           variants={collapseOnMobileVariant}
//           animate={isCollapseOnMobile ? "collapsed" : "default"}
//           className="w-full flex sm:flex-col sm:gap-3"
//         >
//           <div className="flex items-center col-span-1 md:w-1/2">
//             <DatePickerField
//               key={form.watch("date")?.toISOString()}
//               value={form.watch("date")}
//               formSetValue={form.setValue}
//               showHeaderButtons
//               textField={{
//                 variant: "no-border",
//                 id: "date",
//                 placeholder: t("ui.dateSelectInput.anyDate"),
//                 register: form.register,
//                 className: "p-0",
//                 iconLeft: <CalendarIcon className="stroke-darkPrimary" />,
//                 autoComplete: "off",
//               }}
//               datePicker={{
//                 mode: "single",
//                 selected: form.watch("date"),
//                 disabled: (d) => isBefore(d, new Date()) && !isSameDay(d, new Date()),
//               }}
//             />
//             {verticalDivider}
//           </div>

//           <div className="flex items-center col-span-1 md:w-1/2">
//             <TimePicker
//               fromId="time.from"
//               toId="time.to"
//               from={form.watch("time.from")}
//               to={form.watch("time.to")}
//               setValue={form.setValue}
//               register={form.register}
//               control={form.control}
//               textFieldProps={{
//                 variant: "no-border",
//                 className: "p-0",
//                 id: "time",
//                 register: form.register,
//               }}
//             />
//           </div>
//         </motion.div>
//         <motion.div
//           variants={buttonVariant}
//           animate={isSmall ? "animated" : "default"}
//           className="md:w-full md:col-span-5 md:flex md:gap-2 sm:flex sm:gap-2"
//         >
//           <Button
//             className={cn(
//               "w-full h-full px-[60px] !rounded-full transition-all col-span-1 md:col-span-5 sm:col-start-1 sm:-col-end-1",
//               {
//                 "p-2 md:p-1 sm:p-1": isSmall,
//               }
//             )}
//             variant="primary"
//             onClick={(e) => {
//               e.preventDefault()
//              form.handleSubmit(handleSearch)();
//             }}
//           >
//             {isSmall ? (
//               <MagnifyingGlass className="w-5 h-5" />
//             ) : (
//               t("landingSearch.form.searchBtn")
//             )}
//           </Button>
//           <Button
//             variant="resting-active"
//             className={cn("hidden min-w-[30px] h-[30px] p-1 !rounded-full", {
//               "md:flex sm:flex": isSmall,
//             })}
//             onClick={toggleCollapseOnMobile}
//           >
//             <ArrowSecondaryDownIcon className="w-5 h-5" />
//           </Button>
//         </motion.div>
//       </motion.div>
//     </motion.div>
//   );
// };

// export default SearchForm;
