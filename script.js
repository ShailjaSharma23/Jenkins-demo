const form = document.getElementById("studentForm");
const message = document.getElementById("message");

form.addEventListener("submit", async function(event) {
    event.preventDefault();

    const phone = document.getElementById("phone").value;

    if (phone.length !== 10 || isNaN(phone)) {
        message.textContent = "Please enter a valid 10-digit phone number.";
        message.style.color = "red";
        return;
    }

    // Get form data
    const student = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phone: phone,
        dob: document.getElementById("dob").value,
        course: document.getElementById("course").value,
        address: document.getElementById("address").value
    };

    try {
        // Send data to Node.js server
        const response = await fetch("/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(student)
        });

        const result = await response.json();

        if (result.success) {
            message.textContent = "Student registered successfully!";
            message.style.color = "green";
            form.reset();
        } else {
            message.textContent = "Registration failed!";
            message.style.color = "red";
        }

    } catch (error) {
        console.error(error);
        message.textContent = "Server is not running!";
        message.style.color = "red";
    }
});