let alltrips=[];
const searchInput = document.getelementbyid('searchinput');
const categoryfilter = document.getElementById('categoryfilter');
const durationfilter = document.getelementbyid('durationfilter');
const minpriceinput = document.getelementbyid('minprice');
const maxpriceinput = document.getelementbyid('maxprice');
const sortselect = document.getelementbyid('sortselect');
const resetbtn = document.getelementbyid('resetbtn');
const emptyresetBtn = document.getelementbyid('emptyresetBtn');
const tripsgrid = document.getelementbyid('tripsgrid');
const tripscounter = document.getelementbyid('tripscounter');
const noresults = document.getelementbyid('noresults');
async function fetchtrips(){
    try{
        const response = await fetch('data/trips.json');
        if(!response.ok){
            throw new error('failed to load data:${response.status}');
        }
        alltrips=await response.json();
        applyfilters();}
        catch (error){
            console.error(error);
            tripscounter.textcounter='failed to load trip packages';
        }
    }
    function aplyfilters(){
        const searchterm= searchInput.value.trim().tolowercase();
        const selectedcategory=categoryfilter.value;
        const selectedduration= durationfilter.value;
        const minprice=parsefloat(minpriceinput.value)||0;
        const maxprice=parsefloat(maxpriceinput.value)||Infinity;
        const selectedsort=sortselect.value;
        let filtered = alltrips.filter(trip=>{
            const matchessearch= trip.name.tolowercase().includes(searchterm)||trip.destination.tolowercase().include(searchterm);
            const matchescategory=selectedcategory==='all'|| trip.category.tolowercase()===selectedcategory;
            let matchesduration=true;
            if(selectedduration==='short'){
                matchesduration=trip.duration<=3;}
                else if (selectedduration==='medium'){
                    matchesduration=trip.duration>=3&&trip.duration<=10;
                } else if (selectedduration==='long'){
                    matchesduration=trip.duration>10;
                }
                const matchesprice =trip.price>=minprice && trip.price<=maxprice;
                return matchessearch&& matchescategory && matchesduration && matchesprice;

            
        });}
        if (selectedsort ==='price-asc'){
            filtered.sort((a,b)=>a.price-b.price);
        } else if (selectedsort === 'price-desc'){
            filterd.sort((a,b)=>b.price-a.price);
        } else if (selectedsort==='rating-desc'){
            filterd.sort((a,b)=>b.price-a.price)
        } rendertrips(filtered);
        function renderTrips(trips) {
  tripsGrid.innerHTML = '';
  tripsCounter.textContent = `${trips.length} ${trips.length === 1 ? 'trip' : 'trips'} available`;

  if (trips.length === 0) {
    noResults.style.display = 'block';
    tripsGrid.style.display = 'none';
    return;
  }

  noResults.style.display = 'none';
  tripsGrid.style.display = 'grid';

  trips.forEach(trip => {
    const isFav = isFavorite(trip.id);
    const card = document.createElement('article');
    card.className = 'trip-card';
    card.innerHTML = `
      <div class="card-img-wrap">
        <img src="${trip.mainImage}" alt="${trip.name}" loading="lazy">
        <button class="fav-toggle-btn ${isFav ? 'is-active' : ''}" data-id="${trip.id}" aria-label="Save to favorites">
          ${isFav ? '❤️' : '🤍'}
        </button>
      </div>
      <div class="card-body">
        <div>
          <span class="category-badge">${trip.category}</span>
          <h2 class="card-title" style="margin-top: 8px;">${trip.name}</h2>
          <p class="card-dest">📍 ${trip.destination}</p>
          <p class="card-desc" style="margin-top: 8px;">${trip.shortDescription}</p>
        </div>
        <div>
          <div class="card-meta">
            <span>⏱️ ${trip.duration} Days</span>
            <span>⭐ ${trip.rating} / 5</span>
          </div>
          <div class="card-price-row" style="margin-top: 12px;">
            <span class="price-tag">$${trip.price} <small style="font-size: 0.75rem; font-weight: normal;">/ adult</small></span>
            <a href="trip.html?id=${trip.id}" class="btn">View Trip</a>
          </div>
        </div>
      </div>
    `;

    const favBtn = card.querySelector('.fav-toggle-btn');
    favBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const active = toggleFavorite(trip.id);
      favBtn.classList.toggle('is-active', active);
      favBtn.innerHTML = active ? '❤️' : '🤍';
    });

    tripsGrid.appendChild(card);
  });
}

function resetAll() {
  searchInput.value = '';
  categoryFilter.value = 'all';
  durationFilter.value = 'all';
  minPriceInput.value = '';
  maxPriceInput.value = '';
  sortSelect.value = 'default';
  applyFilters();
}

searchInput.addEventListener('input', applyFilters);
categoryFilter.addEventListener('change', applyFilters);
durationFilter.addEventListener('change', applyFilters);
minPriceInput.addEventListener('input', applyFilters);
maxPriceInput.addEventListener('input', applyFilters);
sortSelect.addEventListener('change', applyFilters);
resetBtn.addEventListener('click', resetAll);
emptyResetBtn.addEventListener('click', resetAll);

document.addEventListener('DOMContentLoaded', fetchTrips);
    
