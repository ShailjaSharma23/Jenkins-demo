const fs = require("fs");

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

// Final result
console.log("\n================================");

if (passed) {
    console.log("ALL 10 TEST CASES PASSED");
    console.log("BUILD SUCCESS");
    process.exit(0);
} else {
    console.log("SOME TEST CASES FAILED");
    console.log("BUILD FAILED");
    process.exit(1);
}