// Global variables
let map;
let mapDrag = true;
let currentTeamColor = '#ff0000'; 

document.addEventListener('keydown', (event) => {
  if (event.key >= '1' && event.key <= '9' || event.key === '0') {
    const teamColors = [
      '#ff0000', // 1
      '#00ff00', // 2
      '#0000ff', // 3
      '#ffff00', // 4
      '#ff00ff', // 5
      '#00ffff', // 6
      '#ff8000', // 7
      '#8000ff', // 8
      '#0080ff', // 9
      '#80ff00', // 0
    ];
    currentTeamColor = teamColors[parseInt(event.key) - 1];
    const heroIcons = document.querySelectorAll('.hero-icon');
    heroIcons.forEach((icon) => {
      icon.style.border = `3px solid ${currentTeamColor}`;
    });
  }
});



function initMap(largeMapUrl, width, height) {
    map = L.map('map', {
      center: [height / 2, width / 2],
      zoom: 1,
      minZoom: -1,
      maxZoom: 3,
      zoomSnap: 0.5,
      zoomDelta: 0.5,
      dragging: mapDrag,
      crs: L.CRS.Simple,
    });
  
    // Define the image bounds
    const bounds = [
      [0, 0],
      [height, width],
    ];
  
    L.imageOverlay(largeMapUrl, bounds).addTo(map);
  
    // Set the map bounds
    map.fitBounds(bounds);
  }
  
  
  function showMap(largeMapUrl, width, height) {
    // Hide the main screen
    document.getElementById('main-screen').style.display = 'none';
  
    // Show the map container and the sidebar
    document.getElementById('map').style.display = 'block';
    document.getElementById('sidebar').style.display = 'block';
  
    initMap(largeMapUrl, width, height);
  }
  
 
function createHeroesIcons() {
  const heroesContainer = document.getElementById('heroes-container');

  heroes.forEach((heroName) => {
    const heroIcon = document.createElement('img');
    heroIcon.src = `heroes/storm_ui_ingame_heroselect_btn_${heroName}.png`; 
    heroIcon.alt = heroName;
    heroIcon.title = heroName;
    heroIcon.classList.add('hero-icon');
    heroIcon.setAttribute('data-hero-name', heroName.toLowerCase());

    // Add click event to create a draggable hero marker on the map
    heroIcon.addEventListener('click', () => {
      createHeroMarker(heroName);
    });

    heroesContainer.appendChild(heroIcon);
  });
}

  // Function to filter heroes based on the search input
  function filterHeroes() {
    const searchInput = document.getElementById('hero-search');
    const searchTerm = searchInput.value.toLowerCase();
    const heroesIcons = document.querySelectorAll('#heroes-container .hero-icon');
  
    heroesIcons.forEach((icon) => {
      const heroName = icon.getAttribute('data-hero-name');
  
      if (heroName.includes(searchTerm)) {
        icon.style.display = 'inline-block';
      } else {
        icon.style.display = 'none';
      }
    });
  }
  
  // Call the function to create the heroes' icons
  createHeroesIcons();

  // Function to create draggable hero markers
  function createHeroMarker(heroName) {
    const heroIcon = L.icon({
      iconUrl: `heroes/storm_ui_ingame_heroselect_btn_${heroName}.png`, 
      iconSize: [50, 50],
      className: 'hero-marker-icon',
    });

    const marker = L.marker([map.getCenter().lat, map.getCenter().lng], {
      draggable: true,
      icon: heroIcon,
    }).addTo(map);

    // Add a border around the hero marker
    const iconContainer = marker.getElement();
    iconContainer.style.border = `4px solid ${currentTeamColor}`;
    iconContainer.style.borderRadius = '50%';

    // Handle the dragend event to check if the marker should be removed
    marker.on('dragend', (e) => {
      const { lat, lng } = e.target.getLatLng();
      const point = map.latLngToContainerPoint([lat, lng]);

      if (isPointInSidebar(point.x, point.y)) {
        map.removeLayer(marker);
      }
    });
  }


// Function to check if a point is within the sidebar area
function isPointInSidebar(x, y) {
  const sidebar = document.getElementById('sidebar');
  const sidebarRect = sidebar.getBoundingClientRect();

  return (
    x >= sidebarRect.left &&
    x <= sidebarRect.right &&
    y >= sidebarRect.top &&
    y <= sidebarRect.bottom
  );
}
