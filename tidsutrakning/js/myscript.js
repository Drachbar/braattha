document.addEventListener("DOMContentLoaded", (event) => {
    const inputFields = document.querySelectorAll('input[type="time"]');

    setEnterAsTab();
    listenForInputChange(inputFields);
});

function calculateTime(inputField) {
    const siblings = getParentsChildren(inputField);

    const inputFields = Array.from(siblings).filter(element => element.tagName === 'INPUT');

    if (inputFields.every(element => element.value !== "")) {
        const sum = siblings.find(element => element.classList.contains('sum'));

        const startDate = new Date('1970-01-01T' + inputFields[0].value + 'Z');
        const lunchInDate = new Date('1970-01-01T' + inputFields[1].value + 'Z');
        const lunchOutDate = new Date('1970-01-01T' + inputFields[2].value + 'Z');
        const endDate = new Date('1970-01-01T' + inputFields[3].value + 'Z');

        const foreMiddag = lunchInDate - startDate;
        const afterMiddag = endDate - lunchOutDate;
        let totalTime = foreMiddag + afterMiddag;

        let hours = Math.floor(totalTime / 1000 / 60 / 60);
        totalTime -= hours * 1000 * 60 * 60;
        let minutes = Math.floor(totalTime / 1000 / 60);

        sum.innerHTML = 'Tidsspann: ' + hours + ' timmar och ' + minutes + ' minuter'
    }
}

function listenForInputChange(inputFields) {
    inputFields.forEach(inputField => {
        inputField.addEventListener('input', function(event) {
            if (event.target.tagName === 'INPUT') {
                calculateTime(event.target);
            }
        });
    })
}
    
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

function getParentsChildren(element) {
    var parent = element.parentElement;
    return Array.prototype.slice.call(parent.children);
}