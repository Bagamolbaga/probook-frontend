/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";

import { Link, useTranslations } from "@/i18n";
import { useForm } from "react-hook-form";

import Button from "@/components/ui/button";
import TextField from "@/components/ui/inputs/TextField";
import ChatIcon from "@/components/ui/icons/Chat";
import PhoneIcon from "@/components/ui/icons/Phone";
import EmailIcon from "@/components/ui/icons/Email";
import PersonIcon from "@/components/ui/icons/Person";
import { EMAIL_REGEXP } from "@/utils/regexps";
import ArrowRight from "@/components/ui/icons/ArrowRight";
import Line from "@/components/ui/icons/Line";
import { useMemo } from "react";
import Instagram from "@/components/ui/icons/Instagram";
import Facebook from "@/components/ui/icons/Facebook";
import TwitterBrandIcon from "@/components/ui/icons/TwitterBrand";

type ContactForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  message: string;
};

const ContactScene = () => {
  const t = useTranslations();
  const { handleSubmit, register, reset, clearErrors, formState } = useForm<ContactForm>({
    mode: "onChange",
  });

  const resetFormHandler = () => {
    reset({
      firstName: "",
      email: "",
      phone: "",
      message: "",
    });
    clearErrors();
  };

  const handleSignup = async (_data: ContactForm) => {};

  const fullNameLabel = useMemo(() => t("landingContact.form.fullName"), []);
  const emailLabel = useMemo(() => t("landingContact.form.email"), []);
  const phoneNumberLabel = useMemo(() => t("landingContact.form.phoneNumber"), []);
  const messageLabel = useMemo(() => t("landingContact.form.message"), []);

  return (
    <div className="relative w-full min-h-screenExHeader bg-greyBackgroundLight">
      <section className="w-full min-h-screenExHeader">
        <div className="max-w-content mx-auto py-20 px-layoutLeftRight md:px-layoutLeftRight_md sm:px-layoutLeftRight_sm">
          <h1 className="text-center">
            {t.rich("landingContact.title", {
              purple: (t) => <span className="text-purplePrimary">{t}</span>,
            })}
          </h1>
          <div className="w-full mt-16 flex gap-5 sm:flex-col sm:px-5">
            <div className="w-2/5 sm:w-full p-14 md:p-8 sm:p-8 flex flex-col items-center rounded-xl bg-purplePrimary">
              <p className="text-[40px] font-bold text-white">Contact Us</p>
              <div className="w-full mt-10 pb-5 border-b border-white">
                <p className="text-[24px] flex items-center justify-center gap-1 text-white">
                  <span>
                    <svg
                      width="25"
                      height="24"
                      viewBox="0 0 25 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12.5009 23.25C12.1876 23.2473 11.8784 23.1791 11.593 23.05C11.3076 22.9208 11.0522 22.7335 10.8434 22.5C8.10591 19.5 3.50091 13.7925 3.50091 10.02C3.46683 7.59775 4.3955 5.261 6.08296 3.52291C7.77042 1.78483 10.0787 0.787519 12.5009 0.75C14.9231 0.787519 17.2314 1.78483 18.9189 3.52291C20.6063 5.261 21.535 7.59775 21.5009 10.02C21.5009 13.77 16.8959 19.4625 14.1584 22.5075C13.9489 22.7397 13.6933 22.9256 13.4079 23.0534C13.1225 23.1813 12.8136 23.2482 12.5009 23.25ZM12.5009 2.25C10.4772 2.28943 8.55154 3.12931 7.14579 4.58566C5.74004 6.04201 4.96877 7.99613 5.00091 10.02C5.00091 12.375 7.60341 16.665 11.9609 21.5025C12.0309 21.5751 12.1147 21.6328 12.2075 21.6723C12.3003 21.7117 12.4001 21.732 12.5009 21.732C12.6017 21.732 12.7015 21.7117 12.7943 21.6723C12.8871 21.6328 12.9709 21.5751 13.0409 21.5025C17.3984 16.665 20.0009 12.375 20.0009 10.02C20.033 7.99613 19.2618 6.04201 17.856 4.58566C16.4503 3.12931 14.5246 2.28943 12.5009 2.25Z"
                        fill="white"
                      />
                      <path
                        d="M12.5 14.25C11.61 14.25 10.74 13.9861 9.99994 13.4916C9.25991 12.9971 8.68314 12.2943 8.34254 11.4721C8.00195 10.6498 7.91283 9.74501 8.08647 8.8721C8.2601 7.99918 8.68869 7.19736 9.31802 6.56802C9.94736 5.93869 10.7492 5.5101 11.6221 5.33647C12.495 5.16283 13.3998 5.25195 14.2221 5.59254C15.0443 5.93314 15.7471 6.50991 16.2416 7.24994C16.7361 7.98996 17 8.85999 17 9.75C17 10.9435 16.5259 12.0881 15.682 12.932C14.8381 13.7759 13.6935 14.25 12.5 14.25ZM12.5 6.75C11.9067 6.75 11.3266 6.92595 10.8333 7.25559C10.3399 7.58524 9.95543 8.05377 9.72836 8.60195C9.5013 9.15013 9.44189 9.75333 9.55765 10.3353C9.6734 10.9172 9.95912 11.4518 10.3787 11.8713C10.7982 12.2909 11.3328 12.5766 11.9147 12.6924C12.4967 12.8081 13.0999 12.7487 13.6481 12.5216C14.1962 12.2946 14.6648 11.9101 14.9944 11.4167C15.3241 10.9234 15.5 10.3433 15.5 9.75C15.5 8.95435 15.1839 8.19129 14.6213 7.62868C14.0587 7.06607 13.2957 6.75 12.5 6.75Z"
                        fill="white"
                      />
                    </svg>
                  </span>
                  Address
                </p>
                <p className="mt-5 text-base text-center text-white">
                  118/9 Rama VI Rd, Bangkok, Thailand
                </p>
              </div>
              <div className="w-full mt-10 pb-5 border-b border-white">
                <p className="text-[24px]  flex items-center justify-center gap-1 text-white">
                  <span>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clip-path="url(#clip0_164_1458)">
                        <path
                          d="M22.5 3.5H1.5C1.10218 3.5 0.720644 3.65804 0.43934 3.93934C0.158035 4.22064 0 4.60218 0 5L0 19C0 19.3978 0.158035 19.7794 0.43934 20.0607C0.720644 20.342 1.10218 20.5 1.5 20.5H22.5C22.8978 20.5 23.2794 20.342 23.5607 20.0607C23.842 19.7794 24 19.3978 24 19V5C24 4.60218 23.842 4.22064 23.5607 3.93934C23.2794 3.65804 22.8978 3.5 22.5 3.5ZM22.18 4.5L12 12.37L1.82 4.5H22.18ZM1 18.795V5.13L8.705 11.085L1 18.795ZM1.705 19.5L9.5 11.705L11.69 13.4C11.7774 13.4673 11.8847 13.5038 11.995 13.5038C12.1053 13.5038 12.2126 13.4673 12.3 13.4L14.5 11.705L22.295 19.5H1.705ZM23 18.795L15.295 11.085L23 5.13V18.795Z"
                          fill="white"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_164_1458">
                          <rect width="24" height="24" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </span>
                  Email
                </p>
                <p className="mt-5 text-base text-center text-white">
                  support@bowers.app
                </p>
              </div>
              <p className="mt-10 text-base text-center text-white">Message Our Team</p>
              <Button
                className="mt-4 !p-[14px] !border !border-darkPrimary"
                variant="dark"
                iconLeft={<Line fillColor="fill-white" className="stroke-none" />}
              >
                Connect via Line
              </Button>
              <div>
                <p className="mt-10 text-base text-center text-white">
                  Join Our Community
                </p>
                <div className="w-full mt-4 flex items-center justify-center gap-5">
                  <div>
                    <svg
                      width="17"
                      height="32"
                      viewBox="0 0 17 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10.7865 32V17.4044H15.6837L16.4184 11.7145H10.7865V8.08235C10.7865 6.43552 11.2419 5.31322 13.6062 5.31322L16.6166 5.31198V0.222768C16.096 0.155113 14.3089 0 12.2289 0C7.88557 0 4.91203 2.65114 4.91203 7.51883V11.7145H0V17.4044H4.91203V32H10.7865Z"
                        fill="white"
                      />
                    </svg>
                  </div>
                  <div>
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M18.8865 13.1264L30.1788 0H27.5029L17.6978 11.3975L9.86647 0H0.833984L12.6765 17.235L0.833984 31H3.51005L13.8645 18.9639L22.1349 31H31.1674L18.8858 13.1264H18.8865ZM15.2213 17.3868L14.0214 15.6706L4.47427 2.01449H8.58455L16.2892 13.0354L17.4891 14.7516L27.5041 29.0771H23.3939L15.2213 17.3875V17.3868Z"
                        fill="white"
                      />
                    </svg>
                  </div>
                  <div>
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clip-path="url(#clip0_164_1474)">
                        <path
                          d="M23.9994 0H7.9998C3.6003 0 0 3.6003 0 7.9998V24.0002C0 28.3985 3.6003 32 7.9998 32H23.9994C28.3989 32 31.9992 28.3985 31.9992 24.0002V7.9998C31.9992 3.6003 28.3989 0 23.9994 0ZM29.3325 24.0002C29.3325 26.9401 26.941 29.3333 23.9994 29.3333H7.9998C5.05949 29.3333 2.66673 26.9401 2.66673 24.0002V7.9998C2.66673 5.0591 5.05949 2.66673 7.9998 2.66673H23.9994C26.941 2.66673 29.3325 5.0591 29.3325 7.9998V24.0002Z"
                          fill="white"
                        />
                        <path
                          d="M24.6678 9.33291C25.7723 9.33291 26.6677 8.4375 26.6677 7.33296C26.6677 6.22842 25.7723 5.33301 24.6678 5.33301C23.5633 5.33301 22.6678 6.22842 22.6678 7.33296C22.6678 8.4375 23.5633 9.33291 24.6678 9.33291Z"
                          fill="white"
                        />
                        <path
                          d="M16 7.99976C11.5809 7.99976 8.00024 11.5808 8.00024 15.9996C8.00024 20.4166 11.5809 24.0001 16 24.0001C20.4179 24.0001 23.9999 20.4166 23.9999 15.9996C23.9999 11.5808 20.4179 7.99976 16 7.99976ZM16 21.3334C13.0549 21.3334 10.667 18.9455 10.667 15.9996C10.667 13.0536 13.0549 10.6665 16 10.6665C18.9452 10.6665 21.3331 13.0536 21.3331 15.9996C21.3331 18.9455 18.9452 21.3334 16 21.3334Z"
                          fill="white"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_164_1474">
                          <rect width="32" height="32" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  <div>
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M30.3662 8.50159C30.0205 7.21637 29.0072 6.20325 27.7222 5.85718C25.3746 5.21484 15.984 5.21484 15.984 5.21484C15.984 5.21484 6.59381 5.21484 4.24622 5.83282C2.9859 6.17853 1.94788 7.21655 1.60217 8.50159C0.984375 10.849 0.984375 15.7172 0.984375 15.7172C0.984375 15.7172 0.984375 20.61 1.60217 22.9329C1.94824 24.2179 2.96118 25.231 4.2464 25.5771C6.61853 26.2196 15.9844 26.2196 15.9844 26.2196C15.9844 26.2196 25.3746 26.2196 27.7222 25.6016C29.0074 25.2557 30.0205 24.2426 30.3666 22.9576C30.9842 20.61 30.9842 15.7419 30.9842 15.7419C30.9842 15.7419 31.0089 10.849 30.3662 8.50159ZM12.9943 20.2147V11.2198L20.803 15.7172L12.9943 20.2147Z"
                        fill="white"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-3/5 sm:w-full p-14 md:p-8 sm:p-8 flex flex-col items-center rounded-xl bg-white">
              <p className="text-[40px] font-bold text-darkPrimary">Get in touch</p>
              <div className="w-full mt-12">
                <label htmlFor="firstName" className="text-base font-medium">
                  {fullNameLabel} <span className="text-redPrimary">*</span>
                </label>
                <TextField
                  className="mt-3 !px-3 !py-3 rounded-lg border !border-darkPrimary/60"
                  id="firstName"
                  placeholder="Enter full name"
                  type="text"
                  highlightFullBorderWhenFocus
                  register={register}
                  rules={{
                    required: "Field is required",
                  }}
                  error={formState.errors.firstName}
                />
                <div className="mt-5">
                  <label htmlFor="email" className="text-base font-medium">
                    {emailLabel} <span className="text-redPrimary">*</span>
                  </label>
                  <TextField
                    className="mt-3 !px-3 !py-3 rounded-lg border !border-darkPrimary/60"
                    id="email"
                    placeholder="Enter email"
                    type="email"
                    highlightFullBorderWhenFocus
                    register={register}
                    rules={{
                      required: "Field is required",
                      pattern: EMAIL_REGEXP,
                    }}
                    error={formState.errors.email}
                  />
                </div>
                <div className="mt-5">
                  <label htmlFor="phone" className="text-base font-medium">
                    {phoneNumberLabel} <span className="text-redPrimary">*</span>
                  </label>
                  <TextField
                    className="mt-3 !px-3 !py-3 rounded-lg border !border-darkPrimary/60"
                    id="phone"
                    placeholder="Enter phone number"
                    type="tel"
                    highlightFullBorderWhenFocus
                    register={register}
                    rules={{
                      required: "Field is required",
                      // pattern: PHONE_NUMBER_REGEXP,
                    }}
                    error={formState.errors.phone}
                  />
                </div>

                <div className="mt-5">
                  <label htmlFor="message" className="text-base font-medium">
                    {messageLabel} <span className="text-redPrimary">*</span>
                  </label>
                  <TextField
                    className="mt-3 !px-3 !py-3 rounded-lg border !border-darkPrimary/60"
                    id="message"
                    placeholder="Write here"
                    type="text"
                    highlightFullBorderWhenFocus
                    register={register}
                    rules={{
                      max: 1000,
                      required: "Field is required",
                    }}
                    error={formState.errors.message}
                  />
                </div>
                <div className="pt-12 flex justify-between">
                  <Button
                    className="w-full !p-[14px] !text-sm"
                    variant="primary"
                    onClick={handleSubmit(handleSignup)}
                  >
                    {t("landingContact.form.submit")}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="w-full h-[80px] bg-darkPrimary"></div>
    </div>
  );
};

export default ContactScene;
