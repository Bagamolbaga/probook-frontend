export const servicesStep = {
  services: "Services",
  selectServices: "Select services",
  stepLabel: "STEP 1 OF 5",
  title: "Choose a service",
  description:
    "Start with a program — then we’ll find a specialist and a convenient time.",
  allDirections: "All directions",
  featured: "Featured",
  all: "All",
  mins: "mins",
};

export const professionalStep = {
  professional: "Professional",
  selectProfessional: "Select Professional",
  stepLabel: "STEP 2 OF 5",
  title: "Who would you like to book with?",
  description:
    "Choose a specialist or let us pick one — we’ll show the nearest available time.",
  anyFree: "Any available specialist",
  anyFreeDescription: "We’ll find the right specialist with the nearest opening",
  available: "Available for booking",
  anyProf: "Any Professional",
  forMaxAvailability: "for maximum availability",
};

export const timeStep = {
  time: "Time",
  selectTime: "Select time",
  stepLabel: "STEP 3 OF 5",
  title: "Choose a date and time",
  description: "Showing available slots in the company time zone — {timezone}.",
};

export const clientInformationStep = {
  clientInformation: "Client information",
  pageStepLabel: "STEP 4 OF 5",
  pageTitle: "Let’s get acquainted",
  pageDescription:
    "We’ll send a confirmation and reminder. Registration is not required.",
  lastName: "Last name",
  email: "Email",
  comment: "Comment for the specialist",
  commentPlaceholder: "For example, anything important before the appointment",
  consent: "I agree to the booking terms and personal data processing",
  confirmBtn: "Get confirmation code",
  desc: "Enter your personal information to complete your booking",
  name: {
    label: "Name ",
    placeholder: "Enter your name",
    placeholderEnterClientName: "Enter client name",
  },
  phoneNumber: {
    label: "Phone number",
    invalid: "Enter an international phone number, for example +14155552671",
  },
  continueBtn: "Continue",
};

export const verifyPhoneNumberStep = {
  title: "Verify phone",
  desc: "Verify your phone number by entering the OTP sent to <black>{phone_number}</black>.",
  resendCode: "Resend code",
  continueBtn: "Continue",
};

export const otp = {
  requestFailed: "We couldn't send the confirmation code. Please try again.",
  invalidCode: "The code is invalid or has expired.",
  authFailed: "Authorization is not complete yet. Please confirm the code again.",
};

export const bookedSuccessStep = {
  title: "Schedule appointment successfully",
  desc: "We will send a confirmation via your {authType}.",
  bookingNumber: "Booking #{id}",
  confirmedTitle: "You're booked — see you soon!",
  confirmationSent:
    "Confirmation was sent to {email}. We'll remind you one day and two hours before your visit.",
  yourEmail: "your email",
  confirmed: "Confirmed",
  date: "Date",
  time: "Time",
  specialist: "Specialist",
  duration: "{duration} min",
  addToCalendar: "Add to calendar",
  myBookings: "My bookings",
  manageInCabinet: "You can change or cancel this booking in your account",
  btn: "Search page",
  cabinetDescription: "Sign in with your email code to manage this booking.",
  openCabinet: "Open my bookings",
  repeatUnavailable:
    "Some previously booked services are no longer available. Please choose replacements.",
};

export const booking = {
  bookAnAppointment: "Book an appointment",
  errors: {
    createFailed:
      "We couldn't create the booking. Please check the details and try again.",
  },
  steps: {
    services: "Services",
    staffs: "Professional",
    time: "Time",
    dateTime: "Date & time",
    data: "Details",
    code: "Code",
    done: "Done",
    confirm: "Confirm",
  },
  bookingCard: {
    services: "Services",
    professional: "Professional",
    price: {
      total: "Total",
      payAtStore: "Pay at Store",
    },
    continueBtn: "Continue",
  },
  servicesStep,
  professionalStep,
  timeStep,
  clientInformationStep,
  verifyPhoneNumberStep,
  otp,
  bookedSuccessStep,
};
