const registerTab = document.getElementById("registerTab");
const loginTab = document.getElementById("loginTab");

const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");

const registerPassword =
    document.getElementById("registerPassword");

const loginPassword =
    document.getElementById("loginPassword");

const dashboard =
    document.getElementById("dashboard");

const container =
    document.querySelector(".container");


registerTab.addEventListener("click", () => {

    registerTab.classList.add("active");
    loginTab.classList.remove("active");

    registerForm.classList.remove("hidden");
    loginForm.classList.add("hidden");

});


loginTab.addEventListener("click", () => {

    loginTab.classList.add("active");
    registerTab.classList.remove("active");

    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");

});


registerPassword.addEventListener("input", () => {

    const password = registerPassword.value;

    const lengthCheck =
        document.getElementById("lengthCheck");

    const numberCheck =
        document.getElementById("numberCheck");


    if (password.length >= 8) {

        lengthCheck.textContent =
            "✓ At least 8 characters";

        lengthCheck.classList.add("valid");

    } else {

        lengthCheck.textContent =
            "○ At least 8 characters";

        lengthCheck.classList.remove("valid");
    }


    if (/\d/.test(password)) {

        numberCheck.textContent =
            "✓ Contains at least 1 number";

        numberCheck.classList.add("valid");

    } else {

        numberCheck.textContent =
            "○ Contains at least 1 number";

        numberCheck.classList.remove("valid");
    }

});

document.getElementById("showRegisterPassword")
    .addEventListener("click", () => {

        if (registerPassword.type === "password") {

            registerPassword.type = "text";

            document.getElementById(
                "showRegisterPassword"
            ).textContent = "Hide";

        } else {

            registerPassword.type = "password";

            document.getElementById(
                "showRegisterPassword"
            ).textContent = "Show";
        }

    });


document.getElementById("showLoginPassword")
    .addEventListener("click", () => {

        if (loginPassword.type === "password") {

            loginPassword.type = "text";

            document.getElementById(
                "showLoginPassword"
            ).textContent = "Hide";

        } else {

            loginPassword.type = "password";

            document.getElementById(
                "showLoginPassword"
            ).textContent = "Show";
        }

    });

async function hashPassword(password) {

    const encoder = new TextEncoder();

    const data = encoder.encode(password);

    const hashBuffer =
        await crypto.subtle.digest("SHA-256", data);

    const hashArray =
        Array.from(new Uint8Array(hashBuffer));

    return hashArray
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");
}

registerForm.addEventListener("submit", async (event) => {

    event.preventDefault();


    const username =
        document.getElementById("username").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const password =
        registerPassword.value;


    const message =
        document.getElementById("registerMessage");


    
    if (password.length < 8 || !/\d/.test(password)) {

        message.textContent =
            "Password must contain at least 8 characters and 1 number.";

        message.style.color = "#d63b3b";

        return;
    }


   
    const existingUser =
        JSON.parse(localStorage.getItem("secureAccount"));


    if (
        existingUser &&
        (
            existingUser.username.toLowerCase() ===
            username.toLowerCase()
            ||
            existingUser.email.toLowerCase() ===
            email.toLowerCase()
        )
    ) {

        message.textContent =
            "An account with these details already exists.";

        message.style.color = "#d63b3b";

        return;
    }


   
    const passwordHash =
        await hashPassword(password);


    const account = {

        username: username,

        email: email,

        passwordHash: passwordHash
    };


    localStorage.setItem(
        "secureAccount",
        JSON.stringify(account)
    );


    message.textContent =
        "Account created successfully! Please login.";

    message.style.color = "#159669";


    registerForm.reset();


    setTimeout(() => {

        loginTab.click();

    }, 1200);

});


loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();


    const userInput =
        document.getElementById("loginUser").value.trim();

    const password =
        loginPassword.value;


    const message =
        document.getElementById("loginMessage");


    const account =
        JSON.parse(localStorage.getItem("secureAccount"));


    if (!account) {

        message.textContent =
            "Incorrect username/email or password.";

        message.style.color = "#d63b3b";

        return;
    }


    const passwordHash =
        await hashPassword(password);


    const validUser =
        userInput.toLowerCase() ===
            account.username.toLowerCase()
        ||
        userInput.toLowerCase() ===
            account.email.toLowerCase();


    const validPassword =
        passwordHash === account.passwordHash;


    if (!validUser || !validPassword) {

        message.textContent =
            "Incorrect username/email or password.";

        message.style.color = "#d63b3b";

        return;
    }

    sessionStorage.setItem(
        "loggedIn",
        "true"
    );


    sessionStorage.setItem(
        "currentUser",
        account.username
    );


    showDashboard(account);

});

function showDashboard(account) {

    container.classList.add("hidden");

    dashboard.classList.remove("hidden");


    document.getElementById(
        "dashboardUser"
    ).textContent = account.username;


    document.getElementById(
        "accountUsername"
    ).textContent = account.username;


    document.getElementById(
        "accountEmail"
    ).textContent = account.email;
}

document.getElementById("logoutBtn")
    .addEventListener("click", () => {

        sessionStorage.removeItem("loggedIn");

        sessionStorage.removeItem("currentUser");

        dashboard.classList.add("hidden");

        container.classList.remove("hidden");

        loginForm.reset();

        loginTab.click();

    });

window.addEventListener("load", () => {

    const loggedIn =
        sessionStorage.getItem("loggedIn");


    const account =
        JSON.parse(localStorage.getItem("secureAccount"));


    if (loggedIn === "true" && account) {

        showDashboard(account);

    }

});
