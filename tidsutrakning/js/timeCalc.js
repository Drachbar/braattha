function calculateTime(inputField) {
    const siblings = getParentsChildren(inputField);
    const inputFields = Array.from(siblings).filter(element => element.tagName === 'INPUT');        
    const sumElement = siblings.find(element => element.classList.contains('sum'));
    const sumNumberElement = siblings.find(element => element.classList.contains('sum-number'));

    if (elementsHasEmptyValue(inputFields)) return;

    const [start, lunchIn, lunchOut, end] = inputFields.map(input => new Date(`1970-01-01T${input.value}Z`).getTime());
    const morningDuration = calculateDuration(start, lunchIn);
    const afternoonDuration = calculateDuration(lunchOut, end);

    const totalHours = morningDuration.hours + afternoonDuration.hours;
    const totalMinutes = morningDuration.minutes + afternoonDuration.minutes;
    const adjustedTime = adjustTime(totalHours, totalMinutes);
    sumElement.innerHTML = `${adjustedTime.hours}h ${adjustedTime.minutes}m`;
    sumNumberElement.innerHTML = round(adjustedTime.hours + adjustedTime.minutes/60);
}

function calculateWeekTime(inputField) {
    const gridSection = inputField.parentElement.parentElement;
    const daySumElements = gridSection.querySelectorAll('.sum-number');
    const sumSection = gridSection.parentElement.querySelector('.sum-section')
    const sumElement = sumSection.querySelector('.sum');
    const flexElement = sumSection.querySelector('.flex');

    const sum = Array.from(daySumElements).reduce((acc, myElement) => {
        const value = parseFloat(myElement.innerText);
        return !isNaN(value) ? acc + value : acc;
    }, 0)

    if (sum !== 0) sumElement.innerText = "Summa: " + sum;
    flexElement.innerText = "Flex: " + (sum - 40)
}

function calculateFlex() {

}

function elementsHasEmptyValue(elements) {
    return elements.some(element => element.value === "")
}

function round(number) {
    return Math.round((number + Number.EPSILON) * 100) / 100
}

function calculateDuration(startTime, endTime) {
    const duration = endTime - startTime;
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    return { hours, minutes };
}

function adjustTime(hours, minutes) {
    const extraHours = Math.floor(minutes / 60);
    const adjustedMinutes = minutes % 60;
    const adjustedHours = hours + extraHours;

    return { hours: adjustedHours, minutes: adjustedMinutes };
}

function getWeekNumber(d) {
    // Kopierar datumet för att undvika att ändra på originaldatumet
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    // Sätter datumet till närmaste torsdag: nuvarande datum + 4 - veckodagnummer
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
    // Årets första dag
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    // Beräknar veckonumret
    var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
    return weekNo;
}