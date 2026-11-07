let alltrips = [];
// انتبهي عالكتابه (فرفطت روحي وانا بزبطه)
const searchinput = document.getElementById('searchinput');
const categoryfilter = document.getElementById('categoryfilter');
const durationfilter = document.getElementById('durationfilter');
const minpriceinput = document.getElementById('minprice');
const maxpriceinput = document.getElementById('maxprice');
const sortselect = document.getElementById('sortselect');
const resetbtn = document.getElementById('resetbtn');
const emptyresetbtn = document.getElementById('emptyresetbtn');
const tripsgrid = document.getElementById('tripsgrid');
const tripscounter = document.getElementById('tripscounter');
const noresults = document.getElementById('noresults');

async function fetchtrips() {
  try {
    const response = await fetch('data/trips.json');
    if (!response.ok) {
      throw new Error(`failed to load data: ${response.status}`);
    }
    alltrips = await response.json();
    applyfilters();
  } catch (error) {
    console.error(error);
    if (tripscounter) {
      tripscounter.textContent = 'failed to load flight packages.';
    }
  }
}

function applyfilters() {
  const searchterm = searchinput ? searchinput.value.trim().toLowerCase() : '';
  const selectedcategory = categoryfilter ? categoryfilter.value : 'all';
  const selectedduration = durationfilter ? durationfilter.value : 'all';
  const minprice = parseFloat(minpriceinput ? minpriceinput.value : 0) || 0;
  const maxprice = parseFloat(maxpriceinput ? maxpriceinput.value : Infinity) || Infinity;
  const selectedsort = sortselect ? sortselect.value : 'default';

  let filtered = alltrips.filter(trip => {
    const matchessearch = trip.name.toLowerCase().includes(searchterm) ||
     trip.destination.toLowerCase().includes(searchterm);

    const matchescategory = selectedcategory === 'all' || trip.category.toLowerCase() === selectedcategory;

    const days = parseInt(trip.duration, 10) || 0;
    let matchesduration = true;
    if (selectedduration === 'short') {
      matchesduration = days <= 3;
    } else if (selectedduration === 'medium') {
      matchesduration = days >= 4 && days <= 10;
    } else if (selectedduration === 'long') {
      matchesduration = days > 10;
    }

    const matchesprice = trip.price >= minprice && trip.price <= maxprice;

    return matchessearch && matchescategory && matchesduration && matchesprice;
  });

  if (selectedsort === 'price-asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (selectedsort === 'price-desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (selectedsort === 'rating-desc') {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  rendertrips(filtered);
}

function rendertrips(trips) {
  if (!tripsgrid) return;
  tripsgrid.innerHTML = '';

  if (tripscounter) {
    tripscounter.textContent = `${trips.length} ${trips.length === 1 ? 'trip' : 'trips'} available`;
  }

  if (trips.length === 0) {
    if (noresults) noresults.style.display = 'block';
    tripsgrid.style.display = 'none';
    return;
  }

  if (noresults) noresults.style.display = 'none';
  tripsgrid.style.display = 'grid';

  trips.forEach(trip => {
  const savedTrips = JSON.parse(localStorage.getItem('nuvora_saved_trips')) || [];
    const isfav = savedTrips.includes(trip.id);

    const card = document.createElement('article');
    card.className = 'trip-card';
    card.innerHTML = `
      <div class="card-img-wrap">
        <img src="${trip.image}" alt="${trip.name}" loading="lazy">
        <button type="button" class="fav-toggle-btn ${isfav ? 'is-active' : ''}" data-id="${trip.id}" aria-label="save to favorites">
          ${isfav ? '❤️' : '🤍'}
        </button>
      </div>
      <div class="card-body">
        <div>
          <span class="category-badge">${trip.category}</span>
          <h2 class="card-title">${trip.name}</h2>
          <p class="card-dest">📍 ${trip.destination}</p>
          <p class="card-desc">${trip.shortDescription}</p>
        </div>
        <div>
          <div class="card-meta">
            <span>⏱️ ${trip.duration}</span>
            <span>⭐ ${trip.rating} / 5</span>
          </div>
          <div class="card-price-row" style="margin-top: 14px;">
            <span class="price-tag">${trip.price} JD <small>/ adult</small></span>
            <a href="trip.html?id=${trip.id}" class="btn">view flight</a>
          </div>
        </div>
      </div>
    `;

    // click handler,updates storage & badge instantly
    const favbtn = card.querySelector('.fav-toggle-btn');
    if (favbtn) {
      favbtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        let currentSaved = JSON.parse(localStorage.getItem('nuvora_saved_trips')) || [];
        
        if (currentSaved.includes(trip.id)) {
          currentSaved = currentSaved.filter(id => id !== trip.id);
          favbtn.classList.remove('is-active');
          favbtn.textContent = '🤍';
        } else {
          currentSaved.push(trip.id);
          favbtn.classList.add('is-active');
          favbtn.textContent = '❤️';
        }

        localStorage.setItem('nuvora_saved_trips', JSON.stringify(currentSaved));

        // Update header 
        const badges = document.querySelectorAll('.fav-counter-badge');
        badges.forEach(badge => badge.textContent = currentSaved.length);
      });
    }

    tripsgrid.appendChild(card);
  });
}

function resetall() {
  if (searchinput) searchinput.value = '';
  if (categoryfilter) categoryfilter.value = 'all';
  if (durationfilter) durationfilter.value = 'all';
  if (minpriceinput) minpriceinput.value = '';
  if (maxpriceinput) maxpriceinput.value = '';
  if (sortselect) sortselect.value = 'default';
  applyfilters();
}

if (searchinput) searchinput.addEventListener('input', applyfilters);
if (categoryfilter) categoryfilter.addEventListener('change', applyfilters);
if (durationfilter) durationfilter.addEventListener('change', applyfilters);
if (minpriceinput) minpriceinput.addEventListener('input', applyfilters);
if (maxpriceinput) maxpriceinput.addEventListener('input', applyfilters);
if (sortselect) sortselect.addEventListener('change', applyfilters);
if (resetbtn) resetbtn.addEventListener('click', resetall);
if (emptyresetbtn) emptyresetbtn.addEventListener('click', resetall);

document.addEventListener('DOMContentLoaded', fetchtrips);
