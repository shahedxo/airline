let currentTrip = null;
let currentSlideIndex = 0;
const itineraryList = document.getElementById('itinerarylist') || document.getElementById('itineraryList');
const includesList = document.getElementById('includeslist') || document.getElementById('includesList');
const excludesList = document.getElementById('excludeslist') || document.getElementById('excludesList');
const sliderImg = document.getElementById('sliderimg') || document.getElementById('sliderImg');
const prevSlideBtn = document.getElementById('prevslide') || document.getElementById('prevSlide');
const nextSlideBtn = document.getElementById('nextslide') || document.getElementById('nextSlide');
const detailFavBtn = document.getElementById('detailfavbtn') || document.getElementById('detailFavBtn');

const departureDate = document.getElementById('departuredate') || document.getElementById('departureDate');
const adultCount = document.getElementById('adultcount') || document.getElementById('adultCount');
const childCount = document.getElementById('childcount') || document.getElementById('childCount');
const calcBasePrice = document.getElementById('calcbaseprice') || document.getElementById('calcBasePrice');
const adultSubtotal = document.getElementById('adultsubtotal') || document.getElementById('adultSubtotal');
const childSubtotal = document.getElementById('childsubtotal') || document.getElementById('childSubtotal');
const calcTotal = document.getElementById('calctotal') || document.getElementById('calcTotal');
const bookNowBtn = document.getElementById('booknowbtn') || document.getElementById('bookNowBtn');
async function initDetail() {
  const params = new URLSearchParams(window.location.search);
  const tripId = params.get('id');

  if (!tripId) {
    showNotFound();
    return;
  }

  try {
    const res = await fetch('data/trips.json');
    const trips = await res.json();
    currentTrip = trips.find(t => t.id === tripId);
    if (tripId) {
      currentTrip = trips.find(t => String(t.id).toLowerCase() === String(tripId).toLowerCase());
    }
    if (!currentTrip && trips.length > 0) {
      currentTrip = trips[0];
    }

    if (!currentTrip) {
      showNotFound();
      return;
    }
   
    renderTripDetails();
    initCalculator();
  } catch (err) {
    console.error(err);
    showNotFound();
  }
}

function showNotFound() {
  notFoundBox.style.display = 'block';
  detailContent.style.display = 'none';
}

function renderTripDetails() {
  detailContent.style.display = 'block';
  notFoundBox.style.display = 'none';

  document.title = `${currentTrip.name} | NUVORA Airlines`;
  tripName.textContent = currentTrip.name;
  tripCategory.textContent = currentTrip.category;
  tripDestination.textContent = `📍 ${currentTrip.destination} • ⏱️ ${currentTrip.duration} • ⭐ ${currentTrip.rating}/5`;
  tripLongDesc.textContent = currentTrip.longDescription;

  itineraryList.innerHTML = '';
  currentTrip.itinerary.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    itineraryList.appendChild(li);
  });

  includesList.innerHTML = '';
  currentTrip.includes.forEach(inc => {
    const li = document.createElement('li');
    li.textContent = inc;
    includesList.appendChild(li);
  });

  excludesList.innerHTML = '';
  currentTrip.excludes.forEach(exc => {
    const li = document.createElement('li');
    li.textContent = exc;
    excludesList.appendChild(li);
  });

  currentSlideIndex = 0;
  updateSlider();

  updateDetailFavBtn();
  detailFavBtn.addEventListener('click', () => {
    toggleFavorite(currentTrip.id);
    updateDetailFavBtn();
  });
}

function updateDetailFavBtn() {
  const saved = isFavorite(currentTrip.id);
  detailFavBtn.textContent = saved ? '❤️ In Favourites' : '🤍 Add to Favourites';
  detailFavBtn.classList.toggle('btn-secondary', !saved);
}

function updateSlider() {
  // Uses "album" matching your JSON keys
  const photos = currentTrip.album || [currentTrip.image];
  if (photos.length > 0) {
    sliderImg.src = photos[currentSlideIndex];
    sliderImg.alt = `${currentTrip.name} gallery image ${currentSlideIndex + 1}`;
  }
}

prevSlideBtn.addEventListener('click', () => {
  const photos = currentTrip.album || [currentTrip.image];
  currentSlideIndex = (currentSlideIndex - 1 + photos.length) % photos.length;
  updateSlider();
});

nextSlideBtn.addEventListener('click', () => {
  const photos = currentTrip.album || [currentTrip.image];
  currentSlideIndex = (currentSlideIndex + 1) % photos.length;
  updateSlider();
});

function initCalculator() {
  calcBasePrice.innerHTML = `$${currentTrip.price} <span style="font-size: 0.9rem; font-weight: normal; color: var(--text-muted);">per adult</span>`;

  const today = new Date().toISOString().split('T')[0];
  departureDate.min = today;
  departureDate.value = currentTrip.date || today;

  function calculate() {
    let adults = parseInt(adultCount.value, 10);
    let children = parseInt(childCount.value, 10);

    if (isNaN(adults) || adults < 1) adults = 1;
    if (isNaN(children) || children < 0) children = 0;

    const adultCost = adults * currentTrip.price;
    const childCost = children * (currentTrip.price * 0.5);
    const total = adultCost + childCost;

    adultSubtotal.textContent = `$${adultCost.toFixed(2)}`;
    childSubtotal.textContent = `$${childCost.toFixed(2)}`;
    calcTotal.textContent = `$${total.toFixed(2)}`;

    return { adults, children, total };
  }

  adultCount.addEventListener('input', calculate);
  childCount.addEventListener('input', calculate);
  departureDate.addEventListener('change', calculate);

  calculate();

  bookNowBtn.addEventListener('click', () => {
    if (!departureDate.value) {
      alert('Please choose a departure date.');
      return;
    }

    const { adults, children, total } = calculate();
    const bookingPayload = {
      tripId: currentTrip.id,
      tripName: currentTrip.name,
      destination: currentTrip.destination,
      departureDate: departureDate.value,
      adults: adults,
      children: children,
      totalPrice: total
    };

    sessionStorage.setItem('currentBooking', JSON.stringify(bookingPayload));
    window.location.href = 'booking.html';
  });
}

document.addEventListener('DOMContentLoaded', initDetail);
