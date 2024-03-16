document.addEventListener("DOMContentLoaded", (event) => {
    loadWeekTablesFromLocalStorage();
    const inputFields = Array.from(document.querySelectorAll('.week-table'))
        .flatMap(element => Array.from(element.querySelectorAll('input[type="time"]')));
        
    inputFields.forEach(calculateTime);
    inputFields.forEach(calculateWeekTime);
    const button = document.querySelector('button');
    button.classList.add('button-17')
    const weekNumberInput = document.querySelector('.week-number')
    const yearInput = document.querySelector('.year-input')
    yearInput.value = new Date().getFullYear()
    
    const latestWeekTitle = document.querySelector('.week-title');
    weekNumberInput.value = latestWeekTitle ? parseInt(latestWeekTitle.innerText.slice(6)) + 1 : getWeekNumber(new Date());

    button.addEventListener('click', () => {
        addTableToWeekTableSection(getFullWeekTable(), weekNumberInput.value++, yearInput.value);
    });
    addTableInputListeners(inputFields);

});

function getFullWeekTable() {
    const weekTable = getEmptyWeekTable();
    const gridSection = weekTable.querySelector('.grid');
    gridSection.appendChild(getDaySection('monday'));
    gridSection.appendChild(getDaySection('tuesday'));
    gridSection.appendChild(getDaySection('wednesday'));
    gridSection.appendChild(getDaySection('thursday'));
    gridSection.appendChild(getDaySection('friday'));

    return weekTable;
}

function getDaySection(dayName) {
    const dayNamesSwedish = {
        monday: 'Måndag',
        tuesday: 'Tisdag',
        wednesday: 'Onsdag',
        thursday: 'Torsdag',
        friday: 'Fredag'
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

function getEmptyWeekTable() {
    const weekTable = document.createElement('section');
    weekTable.classList.add('week-table');

    const gridSection = document.createElement('section');
    gridSection.classList.add('grid');

    const sumSection = document.createElement('section');
    sumSection.classList.add('sum-section');
    sumSection.innerHTML = `
        <p class="sum"></p>
        <p class="flex"></p>
        `;
    
    weekTable.appendChild(gridSection);
    weekTable.appendChild(sumSection);

    return weekTable;
}

function addTableToWeekTableSection(table, weekNumber, year) {
    const weekTablesSection = document.querySelector('.week-tables');

    const inputFields = table.querySelectorAll('input[type="time"]');
    addTableInputListeners(inputFields);
    const removeButton = createRemoveButton();

    const yearElement = document.createElement('span')
    yearElement.classList.add('week-year')
    yearElement.innerText = year;

    const weekHeading = document.createElement('h2');
    weekHeading.innerText = "Vecka " + weekNumber;
    weekHeading.classList.add('week-title')

    Array.from(table.querySelectorAll('.grid section h3')).forEach((day, index) => {
        const date = getDateRangeOfWeek(weekNumber, year)[index]
        const dateElement = document.createElement('span');
        dateElement.innerText = date.getDate() + "/" + date.getMonth() + 1
        day.parentNode.insertBefore(dateElement, day.nextSibling);
    })

    const headerElement = document.createElement('section');
    headerElement.classList.add('week-header')
    headerElement.appendChild(yearElement);
    headerElement.appendChild(weekHeading);
    table.prepend(removeButton);
    table.prepend(headerElement);
    weekTablesSection.prepend(table)
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
    const weekTablesSection = document.querySelector('.week-tables');
    const savedWeekTables = JSON.parse(localStorage.getItem('savedWeeks'));

    if (!savedWeekTables) return;
    
    savedWeekTables.tables.forEach(week => {
        const weekTable = getFullWeekTable();

        const weekNumber = document.createElement('h2');
        weekNumber.classList.add('week-title')
        weekNumber.innerText = "Vecka " + week.week;

        const yearElement = document.createElement('span')
        yearElement.classList.add('week-year')
        yearElement.innerText = week.year;

        const removeButton = createRemoveButton();

        Object.keys(week).forEach(day => {
            if (day === 'week') return;
            const daySection = Array.from(weekTable.querySelectorAll(`.${day} input[type="time"]`))
            daySection.forEach((inputField, index) => {
                inputField.value = week[day][index];
              });
        });

        const headerElement = document.createElement('section');
        headerElement.classList.add('week-header')
        headerElement.appendChild(yearElement);
        headerElement.appendChild(weekNumber);

        weekTable.prepend(removeButton);
        weekTable.prepend(headerElement);
        
        weekTablesSection.appendChild(weekTable);
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

        console.log(year)
        const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

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