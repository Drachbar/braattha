function calculateTime(inputField) {
    const siblings = getParentsChildren(inputField);
    const inputFields = Array.from(siblings).filter(element => element.tagName === 'INPUT');        

    if (inputFields.every(element => element.value !== "")) {
        const [start, lunchIn, lunchOut, end] = inputFields.map(input => new Date(`1970-01-01T${input.value}Z`).getTime());
        const morningDuration = calculateDuration(start, lunchIn);
        const afternoonDuration = calculateDuration(lunchOut, end);

        const totalHours = morningDuration.hours + afternoonDuration.hours;
        const totalMinutes = morningDuration.minutes + afternoonDuration.minutes;
        const adjustedTime = adjustTime(totalHours, totalMinutes);
        const sumElement = siblings.find(element => element.classList.contains('sum'));
        sumElement.innerHTML = `Tidsspann: ${adjustedTime.hours} timmar och ${adjustedTime.minutes} minuter`;
    }
}

function calculateDuration(startTime, endTime) {
    const duration = endTime - startTime;
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    return { hours, minutes };
}

function onInputChange(inputFields, callback) {
    inputFields.forEach(inputField => {
        inputField.addEventListener('input', function(event) {
            if (event.target.tagName === 'INPUT') {
                callback(event.target);
            }
        });
    });
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