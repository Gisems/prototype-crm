/** Horario del chat en vivo, en hora local: lunes a viernes, de 9 a 18 hs. Es el que se le muestra a la persona. */
const CHAT_OPENING_HOUR = 9
const CHAT_CLOSING_HOUR = 18

export function isChatOpen(now: Date) {
  const isWeekday = now.getDay() >= 1 && now.getDay() <= 5

  return isWeekday && now.getHours() >= CHAT_OPENING_HOUR && now.getHours() < CHAT_CLOSING_HOUR
}
