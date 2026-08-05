const form = document.getElementById('student-form');
const statusMessage = document.getElementById('status');

if (form && statusMessage) {
	form.addEventListener('submit', (event) => {
		event.preventDefault();

		const formData = new FormData(form);
		const fullName = formData.get('fullName');
		const rollNumber = formData.get('rollNumber');

		statusMessage.textContent = `Saved student record for ${fullName} (${rollNumber}).`;
		form.reset();
	});

	form.addEventListener('reset', () => {
		statusMessage.textContent = '';
	});
}
