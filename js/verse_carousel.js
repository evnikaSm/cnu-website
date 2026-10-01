
const verseKeys = [
    "verse-main-2-timothy-2-22",
    "verse-john-4-24",
    "verse-john-7-37",
    "verse-john-7-38",
    "verse-romans-10-13",
    "verse-1-corinthians-6-17",
    "verse-1-corinthians-3-16",
    "verse-2-corinthians-3-18"
];
let currentVerse = 0;

function changeVerse() {
    const verseText = document.getElementById("verseMain");
    const verseReference = document.getElementById("verseReference");
    const verseContainer = document.querySelector(".verse-text");

    if (!verseText || !verseReference || !verseContainer) return;

    // 1. Уводим текущий текст вправо
    verseContainer.classList.add("slide-out");

    setTimeout(() => {
        currentVerse = (currentVerse + 1) % verseKeys.length;

        // 2. Меняем текст, пока он невидим
        renderVerse();

        // 3. Мгновенно ставим текст слева (без анимации)
        verseContainer.classList.remove("slide-out");
        verseContainer.classList.add("slide-in-instant");

        // 4. Форсируем reflow, чтобы браузер зафиксировал позицию слева
        void verseText.offsetWidth;

        // 5. Убираем "мгновенный" класс — сработает transition и текст заедет на место
        verseContainer.classList.remove("slide-in-instant");

        // 6. Ждём, пока стих полежит на экране, потом повторяем
        setTimeout(changeVerse, 8000);

    }, 600); // должно совпадать с длительностью transition в CSS
}

function renderVerse() {
    if (typeof translations === "undefined") return;
    const key = verseKeys[currentVerse];
    const text = translations[key];
    const reference = translations[`${key}-reference`];
    if (text) document.getElementById("verseMain").innerHTML = text;
    if (reference) document.getElementById("verseReference").textContent = reference;
}
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(changeVerse, 8000);
});