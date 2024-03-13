document.addEventListener("DOMContentLoaded", (event) => {
    const inputFields = Array.from(document.querySelectorAll('.week-table'))
        .flatMap(element => Array.from(element.querySelectorAll('input[type="time"]')));
    const button = document.querySelector('button');
    const weekNumberInput = document.querySelector('.week-number')

    button.addEventListener('click', addTable);
    addTableInputListeners(inputFields);

    weekNumberInput.value = getWeekNumber(new Date());
});

function addTable() {
    const weekNumberInput = document.querySelector('.week-number')
    weekNumberInput.insertAdjacentHTML('afterend', tabellTemplate)
    const tabell = document.querySelector('.ny-tabell-ta-bort')
    tabell.classList.remove('ny-tabell-ta-bort')
    const inputFields = tabell.querySelectorAll('input[type="time"]');
    addTableInputListeners(inputFields);

    const weekHeading = document.createElement('h2');
    weekHeading.innerText = "Vecka " + weekNumberInput.value++;
    weekHeading.classList.add('week-title')
    tabell.insertBefore(weekHeading, tabell.firstChild);
}

function saveWeekTablesToLocalStorage() {
    const tables = document.querySelectorAll('.week-table');

    const savedTables = Array.from(tables).map(table => {
        const weekNumber = table.querySelector('.week-title').textContent.slice(6);
        const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

        const savedDays = daysOfWeek.reduce((saved, day) => {
            const inputs = table.querySelectorAll(`.${day} input[type="time"]`);
            const times = Array.from(inputs).map(input => input.value);
            return {...saved, [day]: times};
        }, {});

        return { week: weekNumber, ...savedDays };
    });

    localStorage.setItem('savedWeeks', JSON.stringify({tables: savedTables}));
}

function addTableInputListeners(inputFields) {
    onInputChange(inputFields, calculateTime);
    onInputChange(inputFields, calculateWeekTime);
    onInputChange(inputFields, saveWeekTablesToLocalStorage);
    setEnterAsTab(inputFields);
}