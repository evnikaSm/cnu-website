let translations = {};
let currentLang = localStorage.getItem("lang") || "pl";

// --------------------
// LOAD LANGUAGE FILE
// --------------------
async function loadLanguage(lang) {
    try {
        const res = await fetch(`lang/${lang}.json`);

        if (!res.ok) throw new Error("Cannot load language file");

        translations = await res.json();
        currentLang = lang;

        localStorage.setItem("lang", lang);

        applyTranslations();

    } catch (err) {
        console.error("Language load error:", err);
    }
}

// --------------------
// APPLY TRANSLATIONS
// --------------------
function applyTranslations() {
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.dataset.i18n;

        if (translations[key] !== undefined) {
            el.innerHTML = translations[key];
        } else {
            console.warn(`Missing translation key: ${key}`);
        }
    });

    // active language button
    document.querySelectorAll("[data-lang]").forEach(btn => {
        btn.classList.toggle("active-lang", btn.dataset.lang === currentLang);
    });
}

// --------------------
// PUBLIC FUNCTION
// --------------------
function setLang(lang) {
    if (lang === currentLang) return; // avoid reload spam
    loadLanguage(lang);
}

// --------------------
// INIT
// --------------------
document.addEventListener("DOMContentLoaded", () => {
    localStorage.setItem("lang", "pl");
    currentLang = "pl";
    loadLanguage(currentLang);
});