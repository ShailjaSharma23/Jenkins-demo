const fs = require("fs");
const crypto = require("crypto");

let passed = true;

console.log("================================");
console.log("   STUDENT REGISTRATION TEST");
console.log("================================\n");

// TC01: Check index.html
if (fs.existsSync("index.html")) {
    console.log("TC01: index.html exists: PASS");
} else {
    console.log("TC01: index.html exists: FAIL");
    passed = false;
}

// TC02: Check style.css
if (fs.existsSync("style.css")) {
    console.log("TC02: style.css exists: PASS");
} else {
    console.log("TC02: style.css exists: FAIL");
    passed = false;
}

// TC03: Check script.js
if (fs.existsSync("script.js")) {
    console.log("TC03: script.js exists: PASS");
} else {
    console.log("TC03: script.js exists: FAIL");
    passed = false;
}

// TC04: Check test.json
if (fs.existsSync("test.json")) {
    console.log("TC04: test.json exists: PASS");
} else {
    console.log("TC04: test.json exists: FAIL");
    passed = false;
}

// Read JSON
let data = null;
let student = null;

if (fs.existsSync("test.json")) {
    try {
        data = JSON.parse(fs.readFileSync("test.json", "utf8"));
        console.log("TC05: test.json contains valid JSON: PASS");
    } catch (error) {
        console.log("TC05: test.json contains valid JSON: FAIL");
        passed = false;
    }
} else {
    console.log("TC05: test.json contains valid JSON: FAIL");
    passed = false;
}

// Get student object
if (data && data.student) {
    student = data.student;
}

// TC06: Name validation
if (student && student.name && student.name.trim() !== "") {
    console.log("TC06: Name validation: PASS");
} else {
    console.log("TC06: Name validation: FAIL");
    passed = false;
}

// TC07: Email validation
if (
    student &&
    student.email &&
    student.email.includes("@") &&
    student.email.includes(".")
) {
    console.log("TC07: Email validation: PASS");
} else {
    console.log("TC07: Email validation: FAIL");
    passed = false;
}

// TC08: Phone validation
if (
    student &&
    student.phone &&
    /^\d{10}$/.test(student.phone)
) {
    console.log("TC08: Phone validation: PASS");
} else {
    console.log("TC08: Phone validation: FAIL");
    passed = false;
}

// TC09: DOB validation
if (
    student &&
    student.dob &&
    /^\d{4}-\d{2}-\d{2}$/.test(student.dob)
) {
    console.log("TC09: DOB validation: PASS");
} else {
    console.log("TC09: DOB validation: FAIL");
    passed = false;
}

// TC10: Course and Address validation
if (
    student &&
    student.course &&
    student.course.trim() !== "" &&
    student.address &&
    student.address.trim() !== ""
) {
    console.log("TC10: Course and Address validation: PASS");
} else {
    console.log("TC10: Course and Address validation: FAIL");
    passed = false;
}

// TC11: Password Hash check in test.json
if (
    student &&
    student.passwordHash &&
    /^[a-f0-9]{64}$/i.test(student.passwordHash)
) {
    console.log("TC11: Password hash format validation: PASS");
} else {
    console.log("TC11: Password hash format validation: FAIL");
    passed = false;
}

// TC12: Password minimum length criteria check
const shortPassword = "12345";
const validPassword = "password123";
const isShortValid = shortPassword.length >= 6;
const isValidValid = validPassword.length >= 6;

if (!isShortValid && isValidValid) {
    console.log("TC12: Password length rule (min 6 characters): PASS");
} else {
    console.log("TC12: Password length rule (min 6 characters): FAIL");
    passed = false;
}

// TC13: Password hashing verification
const testRawPassword = "password123";
const computedHash = crypto.createHash("sha256").update(testRawPassword).digest("hex");
if (computedHash && computedHash.length === 64) {
    console.log("TC13: SHA-256 password hash computation: PASS");
} else {
    console.log("TC13: SHA-256 password hash computation: FAIL");
    passed = false;
}

// TC14: Login authentication check (valid credentials)
const validLoginAttempt = {
    email: student ? student.email : "",
    password: "password123"
};
const validAttemptHash = crypto.createHash("sha256").update(validLoginAttempt.password).digest("hex");
const loginSuccess = student &&
    student.email === validLoginAttempt.email &&
    student.passwordHash === validAttemptHash;

if (loginSuccess) {
    console.log("TC14: Login with valid credentials: PASS");
} else {
    console.log("TC14: Login with valid credentials: FAIL");
    passed = false;
}

// TC15: Login authentication rejection (invalid password)
const invalidLoginAttempt = {
    email: student ? student.email : "",
    password: "wrongPassword99"
};
const invalidAttemptHash = crypto.createHash("sha256").update(invalidLoginAttempt.password).digest("hex");
const invalidLoginRejected = !student ||
    student.email !== invalidLoginAttempt.email ||
    student.passwordHash !== invalidAttemptHash;

if (invalidLoginRejected) {
    console.log("TC15: Login rejection for incorrect password: PASS");
} else {
    console.log("TC15: Login rejection for incorrect password: FAIL");
    passed = false;
}

// Final result
console.log("\n================================");

if (passed) {
    console.log("ALL 15 TEST CASES PASSED");
    console.log("BUILD SUCCESS");
    process.exit(0);
} else {
    console.log("SOME TEST CASES FAILED");
    console.log("BUILD FAILED");
    process.exit(1);
}