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

    // 8 timmar varje dag minus alla helgdagar
    const normaltimmar = 8 * 7 - gridSection.querySelectorAll('.holiday').length * 8;

    if (sum !== 0) sumElement.innerText = "Summa: " + sum;
    flexElement.innerText = "Flex: " + (sum - normaltimmar)
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

function incrementWeek(weekNoElement, yearElement) {
    weekNoElement.value++;
    const nextWeek = getDateRangeOfWeek(weekNoElement.value, yearElement.value);

    if (nextWeek[3].getFullYear() > parseInt(yearElement.value)) {
        weekNoElement.value = 1;
        yearElement.value++;
    }
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

function getDateRangeOfWeek(weekNo, year) {
    const janFirst = new Date(year, 0, 1);
    const days = (weekNo - 1) * 7; // Dagar att lägga till baserat på veckonummer
    const dayOfWeek = janFirst.getDay(); // Veckodagen för 1 jan (0-6, där 0 är söndag)
    let startDay;

    // Om 1 jan är torsdag eller tidigare, börjar veckan denna vecka
    if(dayOfWeek <= 4) {
        startDay = janFirst.getDate() - janFirst.getDay() + 1;
    } else {
        // Om 1 jan är fredag eller senare, börjar nästa vecka räknas som första veckan
        startDay = janFirst.getDate() - janFirst.getDay() + 8;
    }
    const weekStart = new Date(year, 0, startDay + days);
    const dates = [];
    for (var i = 0; i < 7; i++) {
        dates.push(new Date(weekStart.getTime() + (i * 86400000)));
    }
    return dates;
}

function isHoliday(dateToCheck) {
    if (dateToCheck.getUTCDay() >= 5) return true;

    const yearService = YearService.getInstance();
    const holidays = yearService.getOrCreateHolidayObject(dateToCheck.getFullYear())
    const holiday = holidays.get(dateToCheck.getTime())
    if (holiday === undefined) return false;
    return(daysOff.get(holiday));
}