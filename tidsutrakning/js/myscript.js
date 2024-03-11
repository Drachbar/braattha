document.addEventListener("DOMContentLoaded", (event) => {
    setEnterAsTab();
});

function setEnterAsTab() {
    const inputFields = document.querySelectorAll('input[type="time"]');
    inputFields.forEach(input => {
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault(); // Förhindra standardbeteendet för Enter-tangenten
                const inputs = Array.from(inputFields);
                let index = inputs.indexOf(this) + 1;
                if (index >= inputs.length) index = 0;
                inputs[index].focus(); // Flytta fokus till nästa input
            }
        });
    });
}