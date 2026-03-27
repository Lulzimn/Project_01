function subscribeUser(event) {
    event.preventDefault();

    const email = document.getElementById("subscriberEmail").value.trim();
    const isSubscribed = document.getElementById("checkbox").checked;

    if (!email  || !email.includes('@')) {
        Toastify ({
            text : "Please enter a valid email address.",
            duration: 3000,
            close: true,
            gravity: "bottom",
            position: "center",
            backgroundColor: "#f38600",
            
        }).showToast();
        return;
    }
    const subscribedUser = {
        email,
        isSubscribed
    };
    localStorage.setItem("subscribe", JSON.stringify(subscribedUser));

    Toastify ({
        text : "You have successfully subscribe!",
        duration: 3000,
        close: true,
        gravity: "bottom",
        position: "center",
        backgroundColor: "  #7aee44",
        
    }).showToast();
}

const subscribeForm = document.getElementById("subscribeForm");
if (subscribeForm) {
    subscribeForm.addEventListener("submit", subscribeUser);
}
