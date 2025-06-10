export function formatDate(date: string, expressions: any) {
  if (date === "Permanent") return expressions.offerTypes.permanent;
  if (date === "Present") return expressions.months.present;
  const [year, month, day] = date.split("-").map(Number);
  return [day ? day : "", month ? expressions.months[month] : "", year]
    .join(" ")
    .trim();
}

export default function getFormatDate(date: any, expressions: any) {
  const formattedStartDate = formatDate(date.startDate, expressions);
  const formattedEndDate = formatDate(date.endDate, expressions);

  return formattedStartDate === "0"
    ? `${formattedEndDate}`
    : `${formattedStartDate} - ${formattedEndDate}`;
}

export function isExpirationDatePassed(expirationDate: string) {
  const today = new Date();
  const expiration = new Date(expirationDate);

  return expiration < today;
}
