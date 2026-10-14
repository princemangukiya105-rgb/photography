/**
 * Moments Production — Gallery & Lightbox Engine
 * High-resolution visual archives with category filtering and modal preview
 */

const GALLERY_DATA = [
  {
    id: 1,
    title: "Royal Heritage Wedding at Laxmi Vilas",
    category: "weddings",
    categoryLabel: "Royal Weddings",
    client: "Rohan & Ananya · Vadodara",
    img: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85",
    aspect: "portrait"
  },
  {
    id: 2,
    title: "High-Key Minimalist Studio Portrait",
    category: "studio",
    categoryLabel: "Studio Sessions",
    client: "Editorial Portfolio · Alkapuri Facility",
    img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=85",
    aspect: "landscape"
  },
  {
    id: 3,
    title: "Architectural Lines of Vasna Villa",
    category: "architecture",
    categoryLabel: "Architecture & Interiors",
    client: "Moda Living Architecture",
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85",
    aspect: "landscape"
  },
  {
    id: 4,
    title: "Champaner Sunset Pre-Wedding Silhouette",
    category: "weddings",
    categoryLabel: "Royal Weddings",
    client: "Karan & Meera · Champaner Heritage",
    img: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=85",
    aspect: "portrait"
  },
  {
    id: 5,
    title: "Haute Horlogerie Luxury Product Focus",
    category: "commercial",
    categoryLabel: "Commercial & Products",
    client: "Aethel Timepieces Studio Packshot",
    img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=85",
    aspect: "portrait"
  },
  {
    id: 6,
    title: "Executive Leadership & Board Series",
    category: "portraits",
    categoryLabel: "Portraits & Headshots",
    client: "Finovate Capital · Alkapuri Studio",
    img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1200&q=85",
    aspect: "portrait"
  },
  {
    id: 7,
    title: "Ethereal Golden Hour Maternity",
    category: "family",
    categoryLabel: "Maternity & Family",
    client: "Priya & Dev · Private Estate Gardens",
    img: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=1200&q=85",
    aspect: "portrait"
  },
  {
    id: 8,
    title: "Rotary Annual Centennial Gala Night",
    category: "events",
    categoryLabel: "Events & Galas",
    client: "Baroda Rotary Club Gala",
    img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=85",
    aspect: "landscape"
  },
  {
    id: 9,
    title: "Modern Chiaroscuro Studio Look",
    category: "studio",
    categoryLabel: "Studio Sessions",
    client: "Personal Branding Commission",
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85",
    aspect: "portrait"
  },
  {
    id: 10,
    title: "Traditional Sangeet Celebration Night",
    category: "weddings",
    categoryLabel: "Royal Weddings",
    client: "Shah Family Heritage Celebration",
    img: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85",
    aspect: "landscape"
  },
  {
    id: 11,
    title: "Contemporary Minimalist Villa Living",
    category: "architecture",
    categoryLabel: "Architecture & Interiors",
    client: "Sevasi Luxury Villas",
    img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85",
    aspect: "portrait"
  },
  {
    id: 12,
    title: "Organic Skincare Botanical Packshot",
    category: "commercial",
    categoryLabel: "Commercial & Products",
    client: "Vana Botanicals",
    img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=85",
    aspect: "portrait"
  }
];

let currentActiveFilter = 'all';
let currentLightboxIndex = 0;
let filteredItems = [...GALLERY_DATA];

function renderGallery(containerId = 'gallery-grid-container') {
  const container = document.getElementById(containerId);
  if (!container) return;

  filteredItems = currentActiveFilter === 'all'
    ? GALLERY_DATA
    : GALLERY_DATA.filter(item => item.category === currentActiveFilter);

  container.innerHTML = filteredItems.map((item, index) => `
    <div class="gallery-card ${item.aspect}" onclick="openLightbox(${index})">
      <img src="${item.img}" alt="${item.title}" class="gallery-img" loading="lazy" />
      <div class="gallery-info">
        <span class="gallery-cat">${item.categoryLabel}</span>
        <h3 class="gallery-title">${item.title}</h3>
        <p class="gallery-client">${item.client}</p>
      </div>
    </div>
  `).join('');
}

function setGalleryFilter(category, btnElement) {
  currentActiveFilter = category;
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  if (btnElement) {
    btnElement.classList.add('active');
  }
  renderGallery();
}

function openLightbox(index) {
  currentLightboxIndex = index;
  const item = filteredItems[currentLightboxIndex];
  if (!item) return;

  const overlay = document.getElementById('lightbox-modal');
  const imgEl = document.getElementById('lightbox-image');
  const titleEl = document.getElementById('lightbox-title');
  const catEl = document.getElementById('lightbox-category');
  const counterEl = document.getElementById('lightbox-counter');

  if (overlay && imgEl && titleEl && catEl) {
    imgEl.src = item.img;
    imgEl.alt = item.title;
    titleEl.textContent = item.title;
    catEl.textContent = `${item.categoryLabel} · ${item.client}`;
    if (counterEl) {
      counterEl.textContent = `${currentLightboxIndex + 1} / ${filteredItems.length}`;
    }
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeLightbox() {
  const overlay = document.getElementById('lightbox-modal');
  if (overlay) {
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
}

function nextLightboxImage() {
  if (filteredItems.length === 0) return;
  currentLightboxIndex = (currentLightboxIndex + 1) % filteredItems.length;
  openLightbox(currentLightboxIndex);
}

function prevLightboxImage() {
  if (filteredItems.length === 0) return;
  currentLightboxIndex = (currentLightboxIndex - 1 + filteredItems.length) % filteredItems.length;
  openLightbox(currentLightboxIndex);
}

// Global keyboard navigation
document.addEventListener('keydown', (e) => {
  const overlay = document.getElementById('lightbox-modal');
  if (overlay && overlay.classList.contains('active')) {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextLightboxImage();
    if (e.key === 'ArrowLeft') prevLightboxImage();
  }
});
