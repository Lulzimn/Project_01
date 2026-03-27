const paymentModal = document.getElementById("payment-modal");
const payButton = document.querySelector(".submit-btn");
const successModal = document.getElementById("success-modal");


window.onclick = function(event) {
    if (event.target == paymentModal) {
        paymentModal.style.display = "none";
    }
}

const paymentForm = document.getElementById("payment-form");
if (paymentForm) {
    const cardNumberInput = paymentForm.querySelector('input[name="card-number"]');
    const expiryDateInput = paymentForm.querySelector('input[name="expiration-date"]');
    const cvvInput = paymentForm.querySelector('input[name="cvv"]');

    function setFieldError(input, message) {
        if (!input) {
            return;
        }

        const errorId = `${input.name}-error`;
        let errorElement = paymentForm.querySelector(`#${errorId}`);

        if (!errorElement) {
            errorElement = document.createElement("p");
            errorElement.id = errorId;
            errorElement.style.color = "#d32f2f";
            errorElement.style.fontSize = "0.85rem";
            errorElement.style.marginTop = "6px";
            errorElement.style.marginBottom = "0";
            input.insertAdjacentElement("afterend", errorElement);
        }

        errorElement.textContent = message;
        input.style.borderColor = "#d32f2f";
    }

    function clearFieldError(input) {
        if (!input) {
            return;
        }

        const errorElement = paymentForm.querySelector(`#${input.name}-error`);
        if (errorElement) {
            errorElement.remove();
        }

        input.style.borderColor = "";
    }

    if (!cardNumberInput || !expiryDateInput || !cvvInput) {
        console.error("Payment form inputs are missing.");
    }

    if (cardNumberInput) {
        cardNumberInput.addEventListener("input", () => {
            const digitsOnly = cardNumberInput.value.replace(/\D/g, "").slice(0, 16);
            const grouped = digitsOnly.match(/.{1,4}/g);
            cardNumberInput.value = grouped ? grouped.join(" ") : "";
            clearFieldError(cardNumberInput);
        });
    }

    if (expiryDateInput) {
        expiryDateInput.addEventListener("input", () => {
            const digitsOnly = expiryDateInput.value.replace(/\D/g, "").slice(0, 4);

            if (digitsOnly.length >= 3) {
                expiryDateInput.value = `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2)}`;
            } else {
                expiryDateInput.value = digitsOnly;
            }

            clearFieldError(expiryDateInput);
        });
    }

    if (cvvInput) {
        cvvInput.addEventListener("input", () => {
            cvvInput.value = cvvInput.value.replace(/\D/g, "").slice(0, 3);
            clearFieldError(cvvInput);
        });
    }

    paymentForm.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!cardNumberInput || !expiryDateInput || !cvvInput) {
            console.error("Payment form inputs are missing.");
            return;
        }

        const cardNumber = cardNumberInput.value;
        const expiryDate = expiryDateInput.value;
        const cvv = cvvInput.value;

        const regexCardNumber = /^\d{16}$/;
        const regexExpiryDate = /^(0[1-9]|1[0-2])\/\d{2}$/;
        const regexCVV = /^\d{3}$/;

        clearFieldError(cardNumberInput);
        clearFieldError(expiryDateInput);
        clearFieldError(cvvInput);

        if (!regexCardNumber.test(cardNumber.replace(/\s+/g, ""))) {
            setFieldError(cardNumberInput, "Please enter a valid card number in the format: 1234 5678 7890 3456");
            return;
        }

        if (!regexExpiryDate.test(expiryDate)) {
            setFieldError(expiryDateInput, "Please enter a valid expiry date in the format: MM/YY");
            return;
        }

        if (!regexCVV.test(cvv)) {
            setFieldError(cvvInput, "Please enter a valid CVV (3 digits)");
            return;
        }

        if (paymentModal) {
            paymentModal.style.display = "none";
        }

        if (successModal) {
            successModal.style.display = "flex";
        }

        setTimeout(() => {
            if (successModal) {
                successModal.style.display = "none";
            }

            localStorage.removeItem("cart");

            if (typeof renderInvoice === "function") {
                renderInvoice();
            }
        }, 3000);

    });
}
