// =====================
// STATE
// =====================
const state = {
    firstName: false,
    lastName: false,
    contact: false,
    gender: false,
    meeting: false
};

function setValid(key, value) {
    state[key] = value;
}

// =====================
// ELEMENTS
// =====================
const form = document.getElementById("form");

const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const university = document.getElementById("university");

const contactType = document.getElementById("contactType");
const contactInput = document.getElementById("contactInput");
const contactLabel = document.getElementById("contactLabel");

const meeting = document.getElementById("meeting");
const submitBtn = document.getElementById("submitBtn");
const statusEl = document.getElementById("status");
const formLoader = document.getElementById("formLoader");

function setLoading(isLoading) {
    if (!submitBtn) return;

    submitBtn.disabled = isLoading;
    submitBtn.textContent = isLoading ? (translations.sending || "Sending...") : (translations.submit || "Submit");
    submitBtn.classList.toggle("is-loading", isLoading);

    if (formLoader) {
        formLoader.hidden = !isLoading;
        formLoader.classList.toggle("visible", isLoading);
    }

    if (statusEl) {
        statusEl.textContent = isLoading ? (translations["sending-form"] || "Sending form...") : statusEl.textContent;
        statusEl.classList.toggle("loading", isLoading);
    }
}

// =====================
// HELPERS
// =====================
function showError(input, errorEl, message) {
    errorEl.textContent = message;
    input.classList.add("input-error");
    input.classList.remove("input-valid");
}

function clearError(input, errorEl) {
    errorEl.textContent = "";
    input.classList.remove("input-error");
    input.classList.add("input-valid");
}

// =====================
// CONTACT FORMAT (PHONE)
// =====================
contactInput.addEventListener("input", function () {
    if (contactType.value !== "phone") return;

    let value = this.value.replace(/\D/g, "").substring(0, 9);

    if (value.length > 3 && value.length <= 6) {
        value = value.slice(0, 3) + "-" + value.slice(3);
    } else if (value.length > 6) {
        value =
            value.slice(0, 3) +
            "-" +
            value.slice(3, 6) +
            "-" +
            value.slice(6);
    }

    this.value = value;
});

// =====================
// CONTACT TYPE CHANGE
// =====================
contactType.addEventListener("change", function () {
    if (this.value === "phone") {
        contactLabel.textContent = "NUMER TELEFONU";
        contactInput.placeholder = "000-000-000";
        contactInput.type = "tel";
    }

    if (this.value === "email") {
        contactLabel.textContent = "E-MAIL";
        contactInput.placeholder = "email";
        contactInput.type = "email";
    }

    if (this.value === "instagram") {
        contactLabel.textContent = "INSTAGRAM";
        contactInput.placeholder = "@name";
        contactInput.type = "text";
    }
});

// =====================
// LIVE VALIDATION
// =====================

// FIRST NAME
firstName.addEventListener("blur", function () {
    const el = document.getElementById("firstNameError");

    if (!this.value.trim()) {
        showError(this, el, "Imię wymagane");
        setValid("firstName", false);
    } else {
        clearError(this, el);
        setValid("firstName", true);
    }
});

// LAST NAME
lastName.addEventListener("blur", function () {
    const el = document.getElementById("lastNameError");

    if (!this.value.trim()) {
        showError(this, el, "Nazwisko wymagane");
        setValid("lastName", false);
    } else {
        clearError(this, el);
        setValid("lastName", true);
    }
});

// CONTACT
contactInput.addEventListener("blur", function () {
    const el = document.getElementById("contactError");

    const type = contactType.value;
    const value = this.value.trim();

    let ok = true;

    if (!type || !value) ok = false;
    else if (type === "phone" && !/^\d{3}-\d{3}-\d{3}$/.test(value)) ok = false;
    else if (type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) ok = false;
    else if (type === "instagram" && !value.startsWith("@")) ok = false;

    if (!ok) {
        showError(this, el, "Błędny kontakt");
    } else {
        clearError(this, el);
    }

    setValid("contact", ok);
});

// GENDER
document.querySelectorAll('input[name="gender"]').forEach(radio => {
    radio.addEventListener("change", () => {
        document.getElementById("genderError").textContent = "";
        setValid("gender", true);
    });
});

// MEETING
meeting.addEventListener("blur", function () {
    const el = document.getElementById("meetingError");

    if (!this.value) {
        el.textContent = "Wybierz spotkanie";
        setValid("meeting", false);
    } else {
        clearError(this, el);
        setValid("meeting", true);
    }
});

// =====================
// SUBMIT
// =====================
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (submitBtn.disabled) return;

    // check state
    if (Object.values(state).includes(false)) {
        statusEl.textContent = "Uzupełnij wszystkie pola";
        return;
    }

    setLoading(true);

    const hobbies = Array.from(
        document.querySelectorAll('input[type="checkbox"]:checked')
    ).map(el => el.value);

    const data = {
        firstName: firstName.value.trim(),
        lastName: lastName.value.trim(),
        contactType: contactType.value,
        contactValue: contactInput.value.trim(),
        selectedGender: document.querySelector('input[name="gender"]:checked')?.value,
        university: university.value.trim(),
        meeting: meeting.value,
        hobbys: hobbies,
        comments: document.getElementById("comments").value.trim(),
        userAgent: navigator.userAgent,
        website: document.getElementById("website").value.trim()
    };

    try {
        const response = await fetch(
            "https://script.google.com/macros/s/AKfycbxI4pqWfTePZQj-MK1f75WiHNWWRNZdepMKlqtZij5WkfJOik-WqYA20-6P8EBLYH19-w/exec",
            {
                method: "POST",
                body: JSON.stringify(data)
            }
        );

        const result = await response.json();

        if (result.success) {
            document.getElementById("status").textContent = translations.sent || "Sent";
            form.reset();
        } else {
            document.getElementById("status").textContent = result.message;
        }

    } catch (err) {
        document.getElementById("status").textContent = "Błąd połączenia";
    } finally {
        setLoading(false);
    }
});