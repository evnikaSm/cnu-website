const slides = document.querySelectorAll(".hero-bg");

const images = [
    "images/image4.webp",
    "images/image2.webp",
    "images/image3.webp"
];

let currentImage = 0;
let currentSlide = 0;

slides[0].style.backgroundImage = `url('${images[0]}')`;

setInterval(() => {
    const nextSlide = (currentSlide + 1) % 2; currentImage = (currentImage + 1) % images.length; slides[nextSlide].style.backgroundImage = `url('${images[currentImage]}')`; slides[nextSlide].classList.add("active"); // Małe opóźnienie usunięcia klasy ze starego slajdu pomaga w płynności 
    setTimeout(() => { slides[currentSlide].classList.remove("active"); currentSlide = nextSlide; }, 100);
}, 5000);
