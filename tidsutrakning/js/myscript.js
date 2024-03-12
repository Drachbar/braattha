document.addEventListener("DOMContentLoaded", (event) => {
    const inputFields = document.querySelectorAll('input[type="time"]');

    setEnterAsTab();
    onInputChange(inputFields, calculateTime);
    console.dir(getWeekNumber(new Date()));
});