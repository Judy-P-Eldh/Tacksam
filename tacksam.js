const carousel = document.getElementById('carouselExampleFade');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

carousel.addEventListener('slid.bs.carousel', function () {
  const items = document.querySelectorAll('#carouselExampleFade .carousel-item');
  const activeIndex = [...items].findIndex(item => item.classList.contains('active'));

  // Visa eller dölja vänster
  if (activeIndex === 0) {
    prevBtn.style.display = 'none';
  } else {
    prevBtn.style.display = '';
  }

  // Visa eller dölja höger
  if (activeIndex === items.length - 1) {
    nextBtn.style.display = 'none';
  } else {
    nextBtn.style.display = '';
  }
});

// Initialt körs detta för att dölja rätt knapp
const event = new Event('slid.bs.carousel');
carousel.dispatchEvent(event);