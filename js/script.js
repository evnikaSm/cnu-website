// =========================
// NAVBAR SCROLL EFFECT
// =========================

const mainNav = document.getElementById("mainNav");

if (mainNav) {
  let lastScrollY = window.scrollY;

  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 40) {
      mainNav.classList.add("scrolled");
    } else {
      mainNav.classList.remove("scrolled");
    }

    if (currentScrollY > lastScrollY && currentScrollY > 60) {
      mainNav.classList.add("hidden");
    } else {
      mainNav.classList.remove("hidden");
    }

    lastScrollY = currentScrollY;
  });
}

// =========================
// BURGER MENU
// =========================

const burger = document.getElementById("burgerBtn");
const navLinks = document.getElementById("navLinks");

function closeMenu() {
  if (!burger || !navLinks) return;

  burger.classList.remove("active");
  navLinks.classList.remove("active");

  const links = navLinks.querySelectorAll("a");
  links.forEach(link => {
    link.style.animation = "";
  });
}

function toggleMenu() {
  if (!burger || !navLinks) return;

  const isOpen = navLinks.classList.contains("active");

  if (isOpen) {
    closeMenu();
    return;
  }

  burger.classList.add("active");
  navLinks.classList.add("active");

  const links = navLinks.querySelectorAll("a");

  links.forEach((link, index) => {
    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.15}s`;
  });
}

if (burger && navLinks) {

  burger.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleMenu();
  });

  document.addEventListener("click", (event) => {
    const clickedInsideNav = navLinks.contains(event.target) || burger.contains(event.target);

    if (!clickedInsideNav && navLinks.classList.contains("active")) {
      closeMenu();
    }
  });

}

// =========================
// COPY EMAIL
// =========================

const copyBtn = document.getElementById("copy-email");

if (copyBtn) {

  copyBtn.addEventListener("click", function (e) {

    e.preventDefault();

    navigator.clipboard.writeText(
      "chrzescijanienauni@gmail.com"
    );

    const span = this.querySelector("span");

    const original = span.textContent;

    span.textContent = "Copied!";

    this.classList.add("copied");

    setTimeout(() => {

      span.textContent = original;

      this.classList.remove("copied");

    }, 1600);

  });

}

// =========================
// more button
// =========================
document.querySelectorAll(".more-btn").forEach(btn => {
  btn.addEventListener("click", () => {

    const text = btn.previousElementSibling;

    text.classList.toggle("collapsed");
    text.classList.toggle("expanded");

    btn.textContent =
      text.classList.contains("expanded")
        ? "Mniej"
        : "Więcej";
  });
});

function goToForm() {
  window.location.href = "formularz.html";
}

