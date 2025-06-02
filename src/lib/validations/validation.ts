export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string) => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

export const validateCardNumber = (cardNumber: string) => {
  const cleanCard = cardNumber.replace(/\s+/g, "");
  return cleanCard.length === 16 && /^\d+$/.test(cleanCard);
};

export const validateExpiryDate = (expiry: string) => {
  const [month, year] = expiry.split("/");
  if (!month || !year) return false;

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100;
  const currentMonth = currentDate.getMonth() + 1;

  const expMonth = parseInt(month);
  const expYear = parseInt(year);

  if (expMonth < 1 || expMonth > 12) return false;
  if (
    expYear < currentYear ||
    (expYear === currentYear && expMonth <= currentMonth)
  )
    return false;

  return true;
};

export const validateCVV = (cvv: string) => {
  return cvv.length === 3 && /^\d+$/.test(cvv);
};

export const formatCardNumber = (value: any) => {
  const cleanValue = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
  const matches = cleanValue.match(/\d{4,16}/g);
  const match = (matches && matches[0]) || "";
  const parts = [];
  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }
  if (parts.length) {
    return parts.join(" ");
  } else {
    return cleanValue;
  }
};

export const formatExpiryDate = (value: any) => {
  const cleanValue = value.replace(/\D+/g, "");
  if (cleanValue.length >= 2) {
    return cleanValue.substring(0, 2) + "/" + cleanValue.substring(2, 4);
  }
  return cleanValue;
};
