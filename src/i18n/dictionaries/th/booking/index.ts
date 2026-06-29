export const servicesStep = {
  selectServices: "เลือกบริการ",
  all: "ทั้งหมด",
  mins: "นาที",
};

export const professionalStep = {
  selectProfessional: "เลือกผู้เชี่ยวชาญ",
  anyProf: "ไม่ระบุผู้เชี่ยวชาญ",
  forMaxAvailability: "สำหรับความพร้อมใช้งานสูงสุด",
};

export const timeStep = {
  selectTime: "เลือกเวลา",
};

export const clientInformationStep = {
  clientInformation: "ข้อมูลลูกค้า",
  desc: "กรอกข้อมูลส่วนตัวของคุณเพื่อทำการจองให้เสร็จสมบูรณ์",
  name: {
    label: "ชื่อ",
    placeholder: "ป้อนชื่อของคุณ",
    placeholderEnterClientName: "ป้อนชื่อลูกค้า",
  },
  phoneNumber: {
    label: "เบอร์โทรศัพท์",
  },
  continueBtn: "ดำเนินการต่อ",
};

export const verifyPhoneNumberStep = {
  title: "ยืนยันหมายเลขโทรศัพท์",
  desc: "กรอกรหัส OTP ที่ส่งไปยัง <black>{phone_number}</black> เพื่อยืนยัน",
  continueBtn: "ดำเนินการต่อ",
};

export const bookedSuccessStep = {
  title: "กำหนดการนัดหมายสำเร็จ",
  desc: "เราจะส่งการยืนยันผ่านทางโทรศัพท์ของคุณ",
  btn: "หน้าการค้นหา",
};

export const booking = {
  bookAnAppointment: "จองนัด",
  steps: {
    services: "บริการ",
    staffs: "ผู้เชี่ยวชาญ",
    time: "เวลา",
    confirm: "ยืนยัน",
  },
  bookingCard: {
    services: "บริการ",
    professional: "ผู้เชี่ยวชาญ",
    price: {
      total: "ทั้งหมด",
      payAtStore: "ชำระเงินที่ร้านค้า",
    },
    continueBtn: "ดำเนินการต่อ",
  },
  servicesStep,
  professionalStep,
  timeStep,
  clientInformationStep,
  verifyPhoneNumberStep,
  bookedSuccessStep,
};
