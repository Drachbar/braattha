document.addEventListener("DOMContentLoaded", () => {
    initializePage();
});

function initializePage() {
    const weekNumberInput = document.querySelector('.week-number');
    const yearInput = document.querySelector('.year-input');
    const weekTablesSection = document.querySelector('.week-tables');
    const button = document.querySelector('button');
    
    initializeListeners(button, weekTablesSection, weekNumberInput, yearInput);
    
    renderPage(weekTablesSection);
    initializeYearInput(yearInput);
    const latestWeekTitle = document.querySelector('.week-title');
    initializeWeekNumberInput(latestWeekTitle, weekNumberInput);
    changeWeekInterval();
}

function initializeListeners(button, weekTablesSection, weekNumberInput, yearInput) {
    button.addEventListener('click', () => {
        weekTablesSection.prepend(getWeekTable(weekNumberInput.value++, yearInput.value));
        changeWeekInterval();
    });
    onInputChange([weekNumberInput, yearInput], changeWeekInterval);
}

function changeWeekInterval() {
    mySpan = document.querySelector('.vecko-intervall')
    const weekNumberInput = document.querySelector('.week-number');
    const yearInput = document.querySelector('.year-input');
    const dateRange = getDateRangeOfWeek(weekNumberInput.value, yearInput.value)
    mySpan.innerText = dateRange[0].toLocaleDateString() + " - " + dateRange[6].toLocaleDateString()
}

function initializeYearInput(yearInput) {
    yearInput.value = new Date().getFullYear();
}

function initializeWeekNumberInput(latestWeekTitle, weekNumberInput) {
    weekNumberInput.value = latestWeekTitle ?
        parseInt(latestWeekTitle.innerText.slice(6)) + 1 : getWeekNumber(new Date());
}

function renderPage(weekTablesSection) {
    const weekTables = loadWeekTablesFromLocalStorage();
    weekTables.forEach(weekTable => {
        weekTablesSection.appendChild(weekTable);
        const inputFields = Array.from(weekTable.querySelectorAll('input[type="time"]'));
        inputFields.forEach(inputField => {
            calculateTime(inputField);
            calculateWeekTime(inputField);
        });
    });
}

function getWeekTable(weekNumber, year) {
    const weekTable = document.createElement('section');
    weekTable.classList.add('week-table');

    weekTable.appendChild(getHeaderElement(year, weekNumber))
    weekTable.appendChild(createRemoveButton())
    weekTable.appendChild(getGridSection(weekNumber, year));
    weekTable.appendChild(getSumSection());

    return weekTable;
}

function getSumSection() {
    const sumSection = document.createElement('section');
    sumSection.classList.add('sum-section');
    sumSection.innerHTML = `
        <p class="sum"></p>
        <p class="flex"></p>
        `;
    return sumSection;
}

function getGridSection(weekNumber, year) {
    const gridSection = document.createElement('section');
    gridSection.classList.add('grid');

    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    days.forEach(day => gridSection.appendChild(getDaySection(day)));

    Array.from(gridSection.querySelectorAll('h3')).forEach((day, index) => {
        const date = getDateRangeOfWeek(weekNumber, year)[index]
        const dateElement = document.createElement('span');
        dateElement.innerText = date.getDate() + "/" + (date.getMonth() + 1)
        day.parentNode.insertBefore(dateElement, day.nextSibling);
    })

    const inputFields = Array.from(gridSection.querySelectorAll('input[type="time"]'));
    addTableInputListeners(inputFields);
    return gridSection;
}

function getHeaderElement(year, weekNumber) {
    const yearElement = document.createElement('span');
    yearElement.classList.add('week-year');
    yearElement.innerText = year;

    const weekHeading = document.createElement('h2');
    weekHeading.classList.add('week-title');
    weekHeading.innerText = "Vecka " + weekNumber;

    const headerElement = document.createElement('section');
    headerElement.classList.add('week-header');

    headerElement.appendChild(yearElement);
    headerElement.appendChild(weekHeading);
    return headerElement;
}

function getDaySection(dayName) {
    const dayNamesSwedish = {
        monday: 'Måndag',
        tuesday: 'Tisdag',
        wednesday: 'Onsdag',
        thursday: 'Torsdag',
        friday: 'Fredag',
        saturday: 'Lördag',
        sunday: 'Söndag'
    };

    const dayNameSwedish = dayNamesSwedish[dayName];

    const daySection = document.createElement('section');
    daySection.classList.add(dayName);
    daySection.innerHTML = `
        <h3>${dayNameSwedish}</h3>
        <input type="time"  />
        <input type="time"  />
        <input type="time"  />
        <input type="time"  />
        <p class="sum"></p>
        <p class="sum-number"></p>
    `
    return daySection;
}

function loadWeekTablesFromLocalStorage() {
    const savedWeekTables = JSON.parse(localStorage.getItem('savedWeeks'));

    if (!savedWeekTables) return;

    const weekTables = [];

    savedWeekTables.tables.forEach(week => {
        const weekTable = getWeekTable(week.week, week.year);

        populateWithData(week, weekTable);
        weekTables.push(weekTable)
    })

    return weekTables;
}

function populateWithData(week, weekTable) {
    Object.keys(week).forEach(day => {
        if (day === 'week') return;
        const daySection = Array.from(weekTable.querySelectorAll(`.${day} input[type="time"]`));
        daySection.forEach((inputField, index) => {
            inputField.value = week[day][index];
        });
    });
}

function createRemoveButton() {
    const removeButton = document.createElement('button');
    removeButton.innerText = "Ta bort vecka"
    removeButton.classList.add('remove-week-btn')
    removeButton.classList.add('button-17')
    removeButton.addEventListener('click', removeParentDiv);

    return removeButton;
}

function saveWeekTablesToLocalStorage() {
    const tables = document.querySelectorAll('.week-table');

    const savedTables = Array.from(tables).map(table => {
        const weekNumber = table.querySelector('.week-title').textContent.slice(6);
        const year = table.querySelector('.week-year').textContent

        const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

        const savedDays = daysOfWeek.reduce((saved, day) => {
            const inputs = table.querySelectorAll(`.${day} input[type="time"]`);
            const times = Array.from(inputs).map(input => input.value);
            return {...saved, [day]: times};
        }, {});

        return { week: weekNumber, year: year, ...savedDays };
    });

    localStorage.setItem('savedWeeks', JSON.stringify({tables: savedTables}));
}

function addTableInputListeners(inputFields) {
    onInputChange(inputFields, calculateTime);
    onInputChange(inputFields, calculateWeekTime);
    onInputChange(inputFields, saveWeekTablesToLocalStorage);
    setEnterAsTab(inputFields);
}