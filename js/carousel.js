const carousel = document.getElementById("eventsCarousel");
const nextBtn = document.querySelector(".next-btn");
const prevBtn = document.querySelector(".prev-btn");

if (carousel && nextBtn && prevBtn) {
    nextBtn.addEventListener("click", () => {
        carousel.scrollBy({
            left: 380,
            behavior: "smooth"
        });
    });
    prevBtn.addEventListener("click", () => {
        carousel.scrollBy({
            left: -380,
            behavior: "smooth"
        });
    });
}