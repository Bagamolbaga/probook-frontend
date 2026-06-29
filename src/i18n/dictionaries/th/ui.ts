export const months = {
  Monday: "วันจันทร์ ",
  Tuesday: "วันอังคาร",
  Wednesday: "วันพุธ ",
  Thursday: "วันพฤหัสบดี ",
  Friday: "วันศุกร์ ",
  Saturday: "วันเสาร์ ",
  Sunday: "วันอาทิตย์",
};

export const labels = {
  firstName: "ชื่อ",
  lastName: "นามสกุล",
  email: "อีเมล ",
  password: "รหัสผ่าน ",
  confirmPassword: "ยืนยันรหัสผ่าน",
  storeName: "ชื่อร้าน",
  employess: "พนักงาน",
  phone: "โทรศัพท์ ",
  startTyping: "เริ่มพิมพ์",
  city: "เมือง",
  firstAddress: "ที่อยู่ร้าน",
  apartAddress: "เลขที่/อาคาร",
  zipCode: "รหัสไปรษณีย์",
};

export const errors = {
  invalidPassword: "รหัสผ่านไม่ถูกต้อง",
  invalidEmail: "อีเมลไม่ถูกต้อง",
  passwordDontMatch: "รหัสผ่านไม่ตรงกัน",
  fieldIsRequired: "ต้องการข้อมูลนี้",
  invalidCredentials: "ข้อมูลไม่ถูกต้อง",
  wentWrong: "Something went wrong",
};

export const actions = {
  cancel: "ยกเลิก",
  prev: "ก่อนหน้า",
  next: "ถัดไป",
  continue: "ดำเนินการต่อ",
  finish: "เสร็จสิ้น",
  update: "อัพเดท",
  save: "Save",
};

export const workingShifts = {
  fullday: "เต็มวัน",
  morning: "เช้า",
  afternoon: "บ่าย",
  off: "หยุด",
  custom: "Custom",// TODO add i18n
  withTime: {
    fullday: "เต็มวัน (9.00-18.00 น.)",
    morning: "เช้า (9.00-14.00 น.)",
    afternoon: "บ่าย (14.00-18.00 น.)",
    off: "หยุด",
  },
};

export const ui = {
  actions,
  months,
  labels,
  errors,
  workingShifts,
  connectViaLine: "เชื่อมต่อผ่าน LINE",
  getStarted: "เริ่มต้น",
  getStartedFree: "เริ่มต้นใช้งานฟรี",
  forCustomer: "For customer",
  signIn: "เข้าสู่ระบบ",

  dateSelectInput: {
    anyDate: "วันที่",
    today: "วันนี้",
    tomorrow: "พรุ่งนี้",
  },
  timeSelectInput: {
    anyDate: "วันที่",
    anyTime: "ได้ตลอดเวลา",
    morning: "ตอนเช้า",
    afternoon: "ช่วงบ่าย",
    evening: "ตอนเย็น",
    from: "จาก",
    to: "ถึง",
  },
};
