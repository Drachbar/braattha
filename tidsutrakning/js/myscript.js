document.addEventListener("DOMContentLoaded", (event) => {
    const inputFields = Array.from(document.querySelectorAll('.week-table'))
        .flatMap(element => Array.from(element.querySelectorAll('input[type="time"]')));
    const button = document.querySelector('button');
    const weekNumberInput = document.querySelector('.week-number')

    button.addEventListener('click', addTable);
    setEnterAsTab();
    onInputChange(inputFields, calculateTime);

    weekNumberInput.value = getWeekNumber(new Date());
});

function addTable() {
    const weekNumberInput = document.querySelector('.week-number')
    weekNumberInput.insertAdjacentHTML('afterend', tabellTemplate)
    const tabell = document.querySelector('.ny-tabell-ta-bort')
    tabell.classList.remove('ny-tabell-ta-bort')
    const inputFields = tabell.querySelectorAll('input[type="time"]');
    onInputChange(inputFields, calculateTime);

    const weekHeading = document.createElement('h2');
    weekHeading.innerText = "Vecka " + weekNumberInput.value;
    weekHeading.classList.add('week-title')
    tabell.insertBefore(weekHeading, tabell.firstChild);
}