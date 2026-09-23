const form = document.getElementById("studentForm");
const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");
const registerPanel = document.getElementById("registerPanel");
const loginPanel = document.getElementById("loginPanel");
const registerTab = document.getElementById("registerTab");
const loginTab = document.getElementById("loginTab");

// Auto-detect server URL: if opened directly from port 3000, use relative paths.
// If opened via Live Server (port 5500) or file://, target http://localhost:3000.
const API_BASE = (window.location.protocol === "http:" || window.location.protocol === "https:") && window.location.port === "3000"
    ? ""
    : "http://localhost:3000";

function showMessage(text, color) {
    message.textContent = text;
    message.style.color = color;
}

function showPanel(panel) {
    const isRegister = panel === "register";
    registerPanel.hidden = !isRegister;
    loginPanel.hidden = isRegister;
    registerTab.classList.toggle("active", isRegister);
    loginTab.classList.toggle("active", !isRegister);
    registerTab.setAttribute("aria-selected", isRegister);
    loginTab.setAttribute("aria-selected", !isRegister);
    message.textContent = "";
}

registerTab.addEventListener("click", () => showPanel("register"));
loginTab.addEventListener("click", () => showPanel("login"));

form.addEventListener("submit", async function(event) {
    event.preventDefault();

    const phone = document.getElementById("phone").value;

    if (phone.length !== 10 || isNaN(phone)) {
        showMessage("Please enter a valid 10-digit phone number.", "red");
        return;
    }

    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
        showMessage("Passwords do not match.", "red");
        return;
    }

    // Get form data
    const student = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phone: phone,
        password: password,
        dob: document.getElementById("dob").value,
        course: document.getElementById("course").value,
        address: document.getElementById("address").value
    };

    try {
        // Send data to Node.js server
        const response = await fetch(`${API_BASE}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(student)
        });

        const result = await response.json();

        if (result.success) {
            showMessage("Student registered successfully! You can now log in.", "green");
            form.reset();
            showPanel("login");
        } else {
            showMessage(result.message || "Registration failed!", "red");
        }

    } catch (error) {
        console.error("Registration error:", error);
        if (window.location.protocol === "file:") {
            showMessage("Server is not running! Run 'node server.js' and open http://localhost:3000 in your browser.", "red");
        } else {
            showMessage("Server is not running! Run 'node server.js' in terminal and make sure http://localhost:3000 is reachable.", "red");
        }
    }
});

loginForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    try {
        const response = await fetch(`${API_BASE}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: document.getElementById("loginEmail").value,
                password: document.getElementById("loginPassword").value
            })
        });

        const result = await response.json();
        showMessage(result.message, result.success ? "green" : "red");

        if (result.success) {
            loginForm.reset();
        }
    } catch (error) {
        console.error("Login error:", error);
        if (window.location.protocol === "file:") {
            showMessage("Server is not running! Run 'node server.js' and open http://localhost:3000 in your browser.", "red");
        } else {
            showMessage("Server is not running! Run 'node server.js' in terminal and make sure http://localhost:3000 is reachable.", "red");
        }
    }
});