const FAV_STORAGE_KEY = 'nuvora_saved_trips';

function getFavorites() {
  const data = localStorage.getItem(FAV_STORAGE_KEY);
  try {
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

function saveFavorites(favoritesList) {
  localStorage.setItem(FAV_STORAGE_KEY, JSON.stringify(favoritesList));
  updateFavoritesBadge();
}

function isFavorite(tripId) {
  return getFavorites().includes(tripId);
}

function toggleFavorite(tripId) {
  let favorites = getFavorites();
  if (favorites.includes(tripId)) {
    favorites = favorites.filter(id => id !== tripId);
  } else {
    favorites.push(tripId);
  }
  saveFavorites(favorites);
  return favorites.includes(tripId);
}

function updateFavoritesBadge() {
  const badges = document.querySelectorAll('.fav-counter-badge');
  const count = getFavorites().length;
  badges.forEach(badge => {
    badge.textContent = count;
  });
}

function setupMobileNav() {
  const toggleBtn = document.getElementById('mobilemenutoggle') || document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navmenu') || document.getElementById('navMenu');
  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });
  }
}

// all function name variations
window.getFavorites = getFavorites;
window.getfavs = getFavorites;
window.isFavorite = isFavorite;
window.isfav = isFavorite;
window.toggleFavorite = toggleFavorite;
window.togglefav = toggleFavorite;
window.updateFavoritesBadge = updateFavoritesBadge;

document.addEventListener('DOMContentLoaded', () => {
  updateFavoritesBadge();
  setupMobileNav();
});
