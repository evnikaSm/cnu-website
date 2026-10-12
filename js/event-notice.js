(() => {
    "use strict";

    // Edit the title, location and dates in events.json for this eventId.
    // Edit the remaining event-notice-* text in lang/pl.json and lang/en.json.
    // Change the storage key for a new announcement to reset earlier dismissals.
    const config = {
        eventId: "students-conference",
        detailsUrl: "events.html",
        storageKey: "cnu:event-notice:dismissed:v1"
    };

    const page = window.location.pathname.replace(/\/+$/, "").split("/").pop().toLowerCase();
    if (page === "events.html" || page === "events") return;

    function init() {
        let dismissedHere = false;
        let announcement;

        function isDismissed() {
            try {
                return dismissedHere || sessionStorage.getItem(config.storageKey) === "1";
            } catch {
                return dismissedHere;
            }
        }

        if (isDismissed()) return;

        const notice = document.createElement("aside");
        notice.className = "event-notice";
        notice.hidden = true;
        notice.setAttribute("aria-labelledby", "event-notice-title");
        notice.innerHTML = `
            <button class="event-notice__close" type="button" data-i18n-aria-label="event-notice-close">
                <span aria-hidden="true">×</span>
            </button>
            <span class="event-notice__eyebrow" data-i18n="event-notice-eyebrow"></span>
            <h2 id="event-notice-title" class="event-notice__title"></h2>
            <p class="event-notice__description"></p>
            <a class="event-notice__link">
                <span data-i18n="event-notice-button"></span>
                <span aria-hidden="true">→</span>
            </a>`;
        notice.querySelector(".event-notice__link").href = config.detailsUrl;
        document.body.append(notice);

        const nav = document.getElementById("mainNav");
        function positionBelowNav() {
            // Use its layout height, so the notice does not jump when the nav slides away.
            const navHeight = nav ? nav.offsetTop + nav.offsetHeight : 0;
            notice.style.setProperty("--event-notice-nav-height", `${navHeight}px`);
        }
        positionBelowNav();
        if (nav && typeof ResizeObserver !== "undefined") {
            new ResizeObserver(positionBelowNav).observe(nav);
        }
        window.addEventListener("resize", positionBelowNav, { passive: true });

        function showWhenTranslated() {
            // The shared translator updates the data-i18n nodes before this event.
            if (isDismissed()) {
                notice.hidden = true;
                notice.classList.remove("is-visible");
                return;
            }
            if (!announcement || !notice.querySelector("[data-i18n='event-notice-button']").textContent) return;
            const lang = document.documentElement.lang === "en" ? "en" : "pl";
            const localized = value => value?.[lang] || value?.en || "";
            notice.querySelector(".event-notice__title").textContent = localized(announcement.title);
            notice.querySelector(".event-notice__description").textContent = [
                localized(announcement.location), localized(announcement.date)
            ].filter(Boolean).join(" · ");
            notice.hidden = false;
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    if (!isDismissed()) notice.classList.add("is-visible");
                });
            });
        }

        function dismissNotice() {
            dismissedHere = true;
            try {
                sessionStorage.setItem(config.storageKey, "1");
            } catch {
                // Keep the page usable when the browser blocks storage.
            }
            notice.inert = true;
            notice.classList.remove("is-visible");
            const finishClosing = () => { notice.hidden = true; };
            notice.addEventListener("transitionend", finishClosing, { once: true });
            // Only finish a user-initiated close; the notice never expires on its own.
            setTimeout(finishClosing, 300);
        }

        notice.querySelector(".event-notice__close").addEventListener("click", dismissNotice);
        notice.querySelector(".event-notice__link").addEventListener("click", dismissNotice);

        document.addEventListener("languagechange", showWhenTranslated);
        // Recheck storage when returning to a page restored from the back/forward cache.
        window.addEventListener("pageshow", showWhenTranslated);
        if (typeof translations !== "undefined" && translations["event-notice-eyebrow"]) {
            applyTranslations();
        }

        async function loadAnnouncement() {
            try {
                const response = await fetch("events.json");
                if (!response.ok) throw new Error("Could not load events.json");
                const events = await response.json();
                announcement = events.find(event => event.id === config.eventId);
                showWhenTranslated();
            } catch (error) {
                console.warn("Event notice load error:", error);
            }
        }
        loadAnnouncement();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
        init();
    }
})();
