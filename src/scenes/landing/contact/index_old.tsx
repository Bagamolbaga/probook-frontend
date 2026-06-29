/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";

import Button from "@/components/ui/button";
import TextField from "@/components/ui/inputs/TextField";
import ChatIcon from "@/components/ui/icons/Chat";
import PhoneIcon from "@/components/ui/icons/Phone";
import StoreIcon from "@/components/ui/icons/Store";
import EmailIcon from "@/components/ui/icons/Email";
import PersonIcon from "@/components/ui/icons/Person";
import ImageBg from "@/assets/contact_page_section_1.png";
import { EMAIL_REGEXP } from "@/utils/regexps";

type ContactForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  message: string;
};

const ContactScene = () => {
  const { handleSubmit, register, reset, clearErrors, formState } = useForm<ContactForm>({
    mode: "onChange",
  });

  const resetFormHandler = () => {
    reset({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      message: "",
    });
    clearErrors();
  };

  const handleSignup = async (_data: ContactForm) => {};

  return (
    <div className="relative w-full min-h-screenExHeaderAndFooter">
      <div className="fixed top-[78px] bottom-0 right-0 z-10 w-full h-screenExHeader flex justify-end overflow-hidden sm:hidden">
        <Image
          className="h-full translate-x-[20%] object-cover"
          src={ImageBg}
          alt="Bowers"
        />
      </div>
      <section className="relative z-[12] w-full min-h-screenExHeaderAndFooter">
        <div className="max-w-content mx-auto px-layoutLeftRight md:px-layoutLeftRight_md sm:px-layoutLeftRight_sm">
          <div className="min-h-screenExHeaderAndFooter w-2/3 py-20 pr-[100px] rounded-r-[20px] bg-white sm:w-full sm:pr-0">
            <h3>Let’s get in touch</h3>
            <p className="mt-6 text-greyPrimary">Choose from our affordable 3 packages</p>
            <div className="mt-16">
              <div className="flex gap-5 sm:flex-col sm:gap-2">
                <TextField
                  id="firstName"
                  label="First name"
                  placeholder="Type text..."
                  type="text"
                  register={register}
                  rules={{
                    required: "Field is required",
                  }}
                  error={formState.errors.firstName}
                  iconLeft={<PersonIcon className="" />}
                />
                <TextField
                  id="lastName"
                  label="Last name"
                  placeholder="Type text..."
                  type="text"
                  register={register}
                  required
                  rules={{
                    required: "Field is required",
                  }}
                  error={formState.errors.lastName}
                  iconLeft={<PersonIcon className="" />}
                />
              </div>
              <div className="mt-2">
                <TextField
                  id="email"
                  label="Email"
                  placeholder="Type text..."
                  type="email"
                  register={register}
                  rules={{
                    required: "Field is required",
                    pattern: EMAIL_REGEXP,
                  }}
                  error={formState.errors.email}
                  iconLeft={<EmailIcon className="" />}
                />
              </div>
              <div className="mt-2">
                <TextField
                  id="phone"
                  label="Phone number"
                  placeholder="Essential cut"
                  type="tel"
                  register={register}
                  rules={{
                    required: "Field is required",
                    // pattern: PHONE_NUMBER_REGEXP,
                  }}
                  error={formState.errors.phone}
                  iconLeft={<PhoneIcon className="" />}
                />
              </div>
              <div className="mt-2">
                <TextField
                  id="company"
                  label="Company name"
                  placeholder="Essential cut"
                  type="text"
                  register={register}
                  rules={{
                    required: "Field is required",
                  }}
                  error={formState.errors.company}
                  iconLeft={<StoreIcon className="" />}
                />
              </div>
              <div className="mt-2">
                <TextField
                  id="message"
                  label="Message"
                  placeholder="Leave us a message"
                  type="text"
                  register={register}
                  rules={{
                    max: 1000,
                  }}
                  error={formState.errors.message}
                  iconLeft={<ChatIcon className="" />}
                />
              </div>
              <div className="py-12 flex justify-between">
                <Button variant="resting" onClick={resetFormHandler}>
                  Reset
                </Button>
                <Button variant="dark" onClick={handleSubmit(handleSignup)}>
                  Submit
                </Button>
              </div>
              <div className="flex items-center gap-[14px]">
                <p className="text-sm text-greyPrimary">
                  Or connect with us via Line app
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactScene;
