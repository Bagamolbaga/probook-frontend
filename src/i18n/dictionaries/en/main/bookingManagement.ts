export const bookingManagement = {
  title: "Booking Management",
  tabs: {
    calendar: "Calendar",
    "new_booking": "New booking"
  },
  today: "Today",
  addCustomer: "Add Customer",
  emptyBooking: {
    title: "No employees found?",
    subTitle: "Try uploading more files to your storage or create new <br></br> employee information from your desktop"
  },
  status: {
    PENDING: "Awaiting Confirmation",
    COMPLETED: "Customer Confirmed",
    WALK_IN: "Customer Walk-In",
  },
  form: {
    customerInformation: {
      title: "Customer information",
      name: "Name",
      email: "Email",
      phone: "Phone",
    },
    bookingInformation: {
      title: "Booking information",
      employess: "Employess",
      email: "Email",
      time: "Time",
      date: "Date",
      location: "Location",
      services: "Services",
    },
    commets: {
      title: "Comments",
      emptyText: "It’s empty here",
      form: {
        placeholder: "Add your comment",
        sendBtn: "Send",
      },
    }
  },
  actions: {
    save: "Save",
    delete: "Delete",
  },
  deleteModal: {
    title: "Are you sure you want to delete this booking?",
    subTitle: "This booking will be permanently deleted"
  }
}