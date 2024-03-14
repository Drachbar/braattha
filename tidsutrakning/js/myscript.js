document.addEventListener("DOMContentLoaded", (event) => {
    loadWeekTablesFromLocalStorage();
    const inputFields = Array.from(document.querySelectorAll('.week-table'))
        .flatMap(element => Array.from(element.querySelectorAll('input[type="time"]')));
        
    inputFields.forEach(calculateTime);
    inputFields.forEach(calculateWeekTime);
    const button = document.querySelector('button');
    const weekNumberInput = document.querySelector('.week-number')

    button.addEventListener('click', addTable);
    addTableInputListeners(inputFields);

    const latestWeekTitle = document.querySelector('.week-title');
    weekNumberInput.value = latestWeekTitle ? parseInt(latestWeekTitle.innerText.slice(6)) + 1 : getWeekNumber(new Date());
});

function addTable() {
    const weekNumberInput = document.querySelector('.week-number')
    weekNumberInput.insertAdjacentHTML('afterend', tabellTemplate)
    const tabell = document.querySelector('.ny-tabell-ta-bort')
    tabell.classList.remove('ny-tabell-ta-bort')
    const inputFields = tabell.querySelectorAll('input[type="time"]');
    addTableInputListeners(inputFields);
    const removeButton = createRemoveButton();

    const weekHeading = document.createElement('h2');
    weekHeading.innerText = "Vecka " + weekNumberInput.value++;
    weekHeading.classList.add('week-title')
    tabell.prepend(removeButton);
    tabell.insertBefore(weekHeading, tabell.firstChild);
}

function loadWeekTablesFromLocalStorage() {
    renderWeekTables();
}

function createDayHtml(dayName, times) {
    const dayNamesSwedish = {
        monday: 'Måndag',
        tuesday: 'Tisdag',
        wednesday: 'Onsdag',
        thursday: 'Torsdag',
        friday: 'Fredag'
    };

    const dayNameSwedish = dayNamesSwedish[dayName];

    const dayHtml = `<section class="${dayName}">
        <h3>${dayNameSwedish}</h3>
        ${times.map(time => `<input type="time" value="${time}" />`).join('')}
        <p class="sum"></p>
        <p class="sum-number"></p>
    </section>`;

    return dayHtml;
}

function renderWeekTables() {
    const savedWeekTables = JSON.parse(localStorage.getItem('savedWeeks'));

    if (!savedWeekTables) return;
    
    savedWeekTables.tables.forEach(week => {
        const weekContainer = document.createElement('section');
        weekContainer.className = 'week-table';

        const weekNumber = document.createElement('h2');
        weekNumber.classList.add('week-title')
        weekNumber.innerText = "Vecka " + week.week;

        const removeButton = createRemoveButton();

        const gridSection = document.createElement('section');
        gridSection.className = 'grid';
        
        Object.keys(week).forEach(day => {
            if (day === 'week') return;
            const dayHtml = createDayHtml(day, week[day]);
            gridSection.innerHTML += dayHtml;
        });

        weekContainer.appendChild(gridSection);

        const sumSection = document.createElement('section');
        sumSection.className = 'sum-section';
        sumSection.innerHTML = '<p class="sum"></p>';
        weekContainer.appendChild(sumSection);
        weekContainer.prepend(removeButton);
        weekContainer.prepend(weekNumber);
        
        document.body.appendChild(weekContainer);
    });
}

function createRemoveButton() {
    const removeButton = document.createElement('button');
    removeButton.innerText = "Ta bort vecka"
    removeButton.classList.add('remove-week-btn')
    removeButton.addEventListener('click', removeParentDiv);

    return removeButton;
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