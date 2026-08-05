const fs = require('fs');
const path = require('path');

const readText = (fileName) => fs.readFileSync(path.join(__dirname, fileName), 'utf8');

describe('student form page', () => {
	test('contains a student registration form with key fields', () => {
		const html = readText('index.html');

		expect(html).toContain('Student Registration Form');
		expect(html).toContain('name="fullName"');
		expect(html).toContain('name="rollNumber"');
		expect(html).toContain('name="email"');
		expect(html).toContain('name="course"');
		expect(html).toContain('name="address"');
	});

	test('includes the script and stylesheet assets', () => {
		const html = readText('index.html');

		expect(html).toContain('style.css');
		expect(html).toContain('script.js');
	});
});

describe('student data json', () => {
	test('contains a non-empty array of student records', () => {
		const studentData = JSON.parse(readText('student-data.json'));

		expect(Array.isArray(studentData)).toBe(true);
		expect(studentData.length).toBeGreaterThan(0);
	});

	test('each student record has the expected basic fields', () => {
		const studentData = JSON.parse(readText('student-data.json'));
		const requiredFields = ['fullName', 'rollNumber', 'email', 'phone', 'course', 'gender', 'dob', 'year', 'address'];

		studentData.forEach((student) => {
			requiredFields.forEach((field) => {
				expect(student).toHaveProperty(field);
				expect(student[field]).toBeTruthy();
			});
		});
	});
});
