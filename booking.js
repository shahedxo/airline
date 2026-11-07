let bookingData = null;

const summaryCard = document.getElementById('bookingSummaryCard');
const summaryTripTitle = document.getElementById('summaryTripTitle');
const summaryTripDetails = document.getElementById('summaryTripDetails');
const summaryTotal = document.getElementById('summaryTotal');

const bookingForm = document.getElementById('bookingForm');
const formWrapper = document.getElementById('formWrapper');
const confirmationCard = document.getElementById('confirmationCard');

const fullName = document.getElementById('fullName');
const emailAddress = document.getElementById('emailAddress');
const phoneNumber = document.getElementById('phoneNumber');
const nationality = document.getElementById('nationality');
const bookingNotes = document.getElementById('bookingNotes');

const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const phoneError = document.getElementById('phoneError');

function loadBookingSummary() {
  const stored = sessionStorage.getItem('currentBooking');
  if (stored) {
    bookingData = JSON.parse(stored);
    summaryTripTitle.textContent = bookingData.tripName;
    summaryTripDetails.textContent = `📍 ${bookingData.destination} | 📅 Departure: ${bookingData.departureDate} | 👥 ${bookingData.adults} Adults, ${bookingData.children} Children`;
    summaryTotal.textContent = `Total: $${bookingData.totalPrice.toFixed(2)}`;
    summaryCard.style.display = 'block';
  }
}

function validateName() {
  const val = fullName.value.trim();
  const isValid = val.length >= 3;
  fullName.classList.toggle('invalid', !isValid);
  nameError.classList.toggle('visible', !isValid);
  return isValid;
}

function validateEmail() {
  const val = emailAddress.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailRegex.test(val);
  emailAddress.classList.toggle('invalid', !isValid);
  emailError.classList.toggle('visible', !isValid);
  return isValid;
}

function validatePhone() {
  const val = phoneNumber.value.trim();
  const phoneRegex = /^[0-9]{7,15}$/;
  const isValid = phoneRegex.test(val);
  phoneNumber.classList.toggle('invalid', !isValid);
  phoneError.classList.toggle('visible', !isValid);
  return isValid;
}

fullName.addEventListener('input', () => {
  if (nameError.classList.contains('visible')) validateName();
});

emailAddress.addEventListener('input', () => {
  if (emailError.classList.contains('visible')) validateEmail();
});

phoneNumber.addEventListener('input', () => {
  if (phoneError.classList.contains('visible')) validatePhone();
});

bookingForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const isNameOk = validateName();
  const isEmailOk = validateEmail();
  const isPhoneOk = validatePhone();

  if (!isNameOk || !isEmailOk || !isPhoneOk) {
    return;
  }

  const randomRef = 'WNDR-' + Math.floor(100000 + Math.random() * 900000);

  document.getElementById('confRef').textContent = randomRef;
  document.getElementById('confName').textContent = fullName.value.trim();
  document.getElementById('confTrip').textContent = bookingData ? bookingData.tripName : 'Custom Trip';
  document.getElementById('confDate').textContent = bookingData ? bookingData.departureDate : 'As arranged';
  document.getElementById('confTravellers').textContent = bookingData ? `${bookingData.adults} Adults, ${bookingData.children} Children` : '1 Adult';
  document.getElementById('confTotal').textContent = bookingData ? `$${bookingData.totalPrice.toFixed(2)}` : '$0.00';

  formWrapper.style.display = 'none';
  if (summaryCard) summaryCard.style.display = 'none';
  confirmationCard.style.display = 'block';
  sessionStorage.removeItem('currentBooking');
});

document.addEventListener('DOMContentLoaded', loadBookingSummary);
