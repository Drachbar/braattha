document.addEventListener("DOMContentLoaded", (event) => {
    const inputFields = document.querySelectorAll('input[type="time"]');
    const button = document.querySelector('button');

    button.addEventListener('click', addTable);
    setEnterAsTab();
    onInputChange(inputFields, calculateTime);
    console.dir(getWeekNumber(new Date()));
});

function addTable() {
    const button = document.querySelector('button');
    button.insertAdjacentHTML('afterend', tabell)
    const inputFields = document.querySelectorAll('input[type="time"]');
    onInputChange(inputFields, calculateTime);
}