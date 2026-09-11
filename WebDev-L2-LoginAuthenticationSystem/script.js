async function hashPassword(password) {

    const data = new TextEncoder().encode(password);

    const hashBuffer = await crypto.subtle.digest(
        "SHA-256",
        data
    );

    const hashArray = Array.from(
        new Uint8Array(hashBuffer)
    );

    return hashArray
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");
}

const registerForm =
    document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        const username =
            document.getElementById("registerUsername")
            .value
            .trim();

        const password =
            document.getElementById("registerPassword")
            .value;

        const message =
            document.getElementById("registerMessage");

        if (username === "" || password === "") {

            message.textContent =
                "Please fill in all fields.";

            message.className = "error";

            return;
        }

        if (password.length < 8 ||
            !/\d/.test(password)) {

            message.textContent =
                "Password must contain at least 8 characters and 1 number.";

            message.className = "error";

            return;
        }

        const users =
            JSON.parse(localStorage.getItem("users")) || [];

        const existingUser = users.find(
            user =>
                user.username.toLowerCase() ===
                username.toLowerCase()
        );
        if (existingUser) {

            message.textContent =
                "Username or email already exists.";

            message.className = "error";

            return;
        }
        const passwordHash =
            await hashPassword(password);
        const newUser = {

            username: username,

            passwordHash: passwordHash
        };


        users.push(newUser);

         localStorage.setItem(
            "users",
            JSON.stringify(users)
        );


        message.textContent =
            "Registration successful! Redirecting to login...";

        message.className = "success";


        setTimeout(function() {

            window.location.href = "login.html";

        }, 1500);

    });
}
const loginForm =
    document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        const username =
            document.getElementById("loginUsername")
            .value
            .trim();

        const password =
            document.getElementById("loginPassword")
            .value;

        const message =
            document.getElementById("loginMessage");
        if (username === "" || password === "") {

            message.textContent =
                "Please fill in all fields.";

            message.className = "error";

            return;
        }
        const users =
            JSON.parse(localStorage.getItem("users")) || [];

        const user = users.find(
            user =>
                user.username.toLowerCase() ===
                username.toLowerCase()
        );
        const passwordHash =
            await hashPassword(password);
        if (!user ||
            user.passwordHash !== passwordHash) {

            message.textContent =
                "Invalid username/email or password.";

            message.className = "error";

            return;
        }
        localStorage.setItem(
            "loggedInUser",
            user.username
        );


        message.textContent =
            "Login successful! Redirecting...";

        message.className = "success";


        setTimeout(function() {

            window.location.href = "dashboard.html";

        }, 800);

    });
}
if (window.location.pathname.endsWith("dashboard.html")) {

    const loggedInUser =
        localStorage.getItem("loggedInUser");

    if (!loggedInUser) {

        window.location.href = "login.html";

    } else {

        const welcomeMessage =
            document.getElementById("welcomeMessage");

        if (welcomeMessage) {

            welcomeMessage.textContent =
                "Welcome, " + loggedInUser + "!";
        }
    }
}

const logoutButton =
    document.getElementById("logoutButton");

if (logoutButton) {

    logoutButton.addEventListener("click", function() {

        localStorage.removeItem("loggedInUser");

        window.location.href = "login.html";

    });
}
