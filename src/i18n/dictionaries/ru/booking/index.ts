export const servicesStep = {
  services: "Услуги",
  selectServices: "Выберите услуги",
  stepLabel: "ШАГ 1 ИЗ 5",
  title: "Выберите услугу",
  description: "Начните с программы — дальше подберём специалиста и удобное время.",
  allDirections: "Все направления",
  featured: "Рекомендуемые",
  all: "Все",
  mins: "мин.",
};

export const professionalStep = {
  professional: "Специалист",
  selectProfessional: "Выберите специалиста",
  stepLabel: "ШАГ 2 ИЗ 5",
  title: "К кому хотите записаться?",
  description:
    "Выберите специалиста или оставьте подбор нам — покажем ближайшее свободное время.",
  anyFree: "Любой свободный специалист",
  anyFreeDescription: "Подберём подходящего специалиста с ближайшим окном",
  available: "Доступен для записи",
  anyProf: "Любой специалист",
  forMaxAvailability: "для максимального выбора времени",
};

export const timeStep = {
  time: "Время",
  selectTime: "Выберите время",
  stepLabel: "ШАГ 3 ИЗ 5",
  title: "Выберите дату и время",
  description: "Показываем свободные окна по часовому поясу компании — {timezone}.",
};

export const clientInformationStep = {
  clientInformation: "Информация о клиенте",
  pageStepLabel: "ШАГ 4 ИЗ 5",
  pageTitle: "Осталось представиться",
  pageDescription: "Отправим подтверждение и напоминание. Регистрация не обязательна.",
  lastName: "Фамилия",
  email: "Email",
  comment: "Комментарий для специалиста",
  commentPlaceholder: "Например, что важно учесть перед приёмом",
  consent: "Согласен(на) с условиями записи и обработкой персональных данных",
  confirmBtn: "Получить код подтверждения",
  desc: "Введите личные данные для завершения бронирования",
  name: {
    label: "Имя",
    placeholder: "Введите имя",
    placeholderEnterClientName: "Введите имя клиента",
  },
  phoneNumber: {
    label: "Телефона",
    invalid: "Введите номер в международном формате, например +79991234567",
  },
  continueBtn: "Продолжить",
};

export const verifyPhoneNumberStep = {
  title: "Подтвердите телефон",
  desc: "Введите код из SMS, отправленного на номер <black>{phone_number}</black>.",
  resendCode: "Отправить код повторно",
  continueBtn: "Продолжить",
};

export const otp = {
  requestFailed: "Не удалось отправить код подтверждения. Попробуйте ещё раз.",
  invalidCode: "Неверный код или срок его действия истёк.",
  authFailed: "Авторизация ещё не завершена. Подтвердите код ещё раз.",
};

export const bookedSuccessStep = {
  title: "Запись успешно создана",
  desc: "Мы отправим подтверждение через {authType}.",
  bookingNumber: "Запись № {id}",
  confirmedTitle: "Вы записаны — до встречи!",
  confirmationSent:
    "Подтверждение отправлено на {email}. Напомним о визите за день и за 2 часа.",
  yourEmail: "ваш email",
  confirmed: "Подтверждено",
  date: "Дата",
  time: "Время",
  specialist: "Специалист",
  duration: "{duration} минут",
  addToCalendar: "Добавить в календарь",
  myBookings: "Мои записи",
  manageInCabinet: "Изменить или отменить запись можно в личном кабинете",
  btn: "Перейти к поиску",
  cabinetDescription: "Войдите по коду из письма, чтобы управлять этой записью.",
  openCabinet: "Открыть мои записи",
  repeatUnavailable:
    "Некоторые ранее выбранные услуги больше недоступны. Выберите замену.",
};

export const booking = {
  bookAnAppointment: "Записаться",
  errors: {
    createFailed: "Не удалось создать запись. Проверьте данные и попробуйте ещё раз.",
  },
  steps: {
    services: "Услуги",
    staffs: "Специалист",
    time: "Время",
    dateTime: "Дата и время",
    data: "Данные",
    code: "Код",
    done: "Готово",
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
  otp,
  bookedSuccessStep,
};
