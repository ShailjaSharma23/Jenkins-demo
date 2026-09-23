const form = document.getElementById("studentForm");
const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");
const registerPanel = document.getElementById("registerPanel");
const loginPanel = document.getElementById("loginPanel");
const registerTab = document.getElementById("registerTab");
const loginTab = document.getElementById("loginTab");
const tabList = document.getElementById("tabList");

// Alert box elements
const alertBox = document.getElementById("alertBox");
const alertIcon = document.getElementById("alertIcon");
const alertMessage = document.getElementById("alertMessage");
const alertCloseBtn = document.getElementById("alertCloseBtn");

// Dashboard / Logged-in elements
const dashboardPanel = document.getElementById("dashboardPanel");
const welcomeUser = document.getElementById("welcomeUser");
const profileAvatar = document.getElementById("profileAvatar");
const dashName = document.getElementById("dashName");
const dashEmail = document.getElementById("dashEmail");
const dashPhone = document.getElementById("dashPhone");
const dashCourse = document.getElementById("dashCourse");
const dashDob = document.getElementById("dashDob");
const dashAddress = document.getElementById("dashAddress");
const logoutBtn = document.getElementById("logoutBtn");

let alertTimeout = null;

function showAlert(text, type = "success") {
    if (!alertBox) return;
    alertMessage.textContent = text;
    alertBox.className = `alert-box ${type}`;
    alertIcon.textContent = type === "success" ? "✓" : "!";
    alertBox.hidden = false;

    if (alertTimeout) {
        clearTimeout(alertTimeout);
    }
    alertTimeout = setTimeout(() => {
        alertBox.hidden = true;
    }, 6000);
}

if (alertCloseBtn) {
    alertCloseBtn.addEventListener("click", () => {
        alertBox.hidden = true;
        if (alertTimeout) clearTimeout(alertTimeout);
    });
}

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
    if (panel === "dashboard") {
        registerPanel.hidden = true;
        loginPanel.hidden = true;
        if (tabList) tabList.hidden = true;
        if (dashboardPanel) dashboardPanel.hidden = false;
        return;
    }

    if (dashboardPanel) dashboardPanel.hidden = true;
    if (tabList) tabList.hidden = false;

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

if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        showPanel("login");
        showAlert("You have been logged out successfully.", "success");
    });
}

form.addEventListener("submit", async function(event) {
    event.preventDefault();

    const phone = document.getElementById("phone").value;

    if (phone.length !== 10 || isNaN(phone)) {
        const errorText = "Please enter a valid 10-digit phone number.";
        showMessage(errorText, "red");
        showAlert(errorText, "error");
        return;
    }

    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
        const errorText = "Passwords do not match.";
        showMessage(errorText, "red");
        showAlert(errorText, "error");
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
            const successMsg = "Registration successful! You can now log in.";
            showMessage(successMsg, "green");
            showAlert(successMsg, "success");
            form.reset();
            showPanel("login");
        } else {
            const failMsg = result.message || "Registration failed!";
            showMessage(failMsg, "red");
            showAlert(failMsg, "error");
        }

    } catch (error) {
        console.error("Registration error:", error);
        const errNotice = window.location.protocol === "file:"
            ? "Server is not running! Run 'node server.js' and open http://localhost:3000 in your browser."
            : "Server is not running! Run 'node server.js' in terminal and make sure http://localhost:3000 is reachable.";
        showMessage(errNotice, "red");
        showAlert(errNotice, "error");
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

        if (result.success) {
            const student = result.student || {};
            const displayName = student.name || "Student";

            if (welcomeUser) welcomeUser.textContent = `Welcome, ${displayName}!`;
            if (profileAvatar) profileAvatar.textContent = displayName.charAt(0).toUpperCase();
            if (dashName) dashName.textContent = student.name || "-";
            if (dashEmail) dashEmail.textContent = student.email || "-";
            if (dashPhone) dashPhone.textContent = student.phone || "-";
            if (dashCourse) dashCourse.textContent = student.course || "-";
            if (dashDob) dashDob.textContent = student.dob || "-";
            if (dashAddress) dashAddress.textContent = student.address || "-";

            loginForm.reset();
            showPanel("dashboard");
            showAlert(`Login successful! Welcome back, ${displayName}!`, "success");
            showMessage("", "green");
        } else {
            const failMsg = result.message || "Invalid email or password.";
            showMessage(failMsg, "red");
            showAlert(failMsg, "error");
        }
    } catch (error) {
        console.error("Login error:", error);
        const errNotice = window.location.protocol === "file:"
            ? "Server is not running! Run 'node server.js' and open http://localhost:3000 in your browser."
            : "Server is not running! Run 'node server.js' in terminal and make sure http://localhost:3000 is reachable.";
        showMessage(errNotice, "red");
        showAlert(errNotice, "error");
    }
});