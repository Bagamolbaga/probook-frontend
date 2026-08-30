export const servicesStep = {
  services: "Услуги",
  selectServices: "Выберите услуги",
  featured: "Рекомендуемые",
  all: "Все",
  mins: "мин.",
};

export const professionalStep = {
  professional: "Специалист",
  selectProfessional: "Выберите специалиста",
  anyProf: "Любой специалист",
  forMaxAvailability: "для максимального выбора времени",
};

export const timeStep = {
  time: "Время",
  selectTime: "Выберите время",
};

export const clientInformationStep = {
  clientInformation: "Информация о клиенте",
  desc: "Введите личные данные для завершения бронирования",
  name: {
    label: "Имя",
    placeholder: "Введите имя",
    placeholderEnterClientName: "Введите имя клиента",
  },
  phoneNumber: {
    label: "Телефона",
  },
  continueBtn: "Продолжить",
};

export const verifyPhoneNumberStep = {
  title: "Подтвердите телефон",
  desc: "Введите код из SMS, отправленного на номер <black>{phone_number}</black>.",
  resendCode: "Отправить код повторно",
  continueBtn: "Продолжить",
};

export const bookedSuccessStep = {
  title: "Запись успешно создана",
  desc: "Мы отправим подтверждение через {authType}.",
  btn: "Перейти к поиску",
};

export const booking = {
  bookAnAppointment: "Записаться",
  steps: {
    services: "Услуги",
    staffs: "Специалист",
    time: "Время",
    confirm: "Подтверждение",
  },
  bookingCard: {
    services: "Услуги",
    professional: "Специалист",
    price: {
      total: "Итого",
      payAtStore: "Оплата на месте",
    },
    continueBtn: "Продолжить",
  },
  servicesStep,
  professionalStep,
  timeStep,
  clientInformationStep,
  verifyPhoneNumberStep,
  bookedSuccessStep,
};
