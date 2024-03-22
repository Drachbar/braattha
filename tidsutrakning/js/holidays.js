const rodaDagar = new Map([
    ['1-1', 'Nyårsdagen'],
    ['1-6', 'Trettondedag jul'],
    ['5-1', 'Första maj'],
    ['6-6', 'Sveriges nationaldag'],
    ['12-24', 'Julafton'],
    ['12-25', 'Juldagen'],
    ['12-26', 'Annandag jul'],
    ['12-31', 'Nyårsafton'],
]);

const daysOff = new Map([
    ['Nyårsdagen', true],
    ['Trettondedag jul', true],
    ['Skärtorsdag', false],
    ['Långfredagen', true],
    ['Påskafton', true],
    ['Påskdagen', true],
    ['Annandag påsk', true],
    ['Första maj', true],
    ['Kristi Himmelsfärdsdag', true],
    ['Pingstdagen', false],
    ['Annandag pingst', false],
    ['Sveriges nationaldag', true],
    ['Midsommarafton', true],
    ['Midsommardagen', true],
    ['Alla helgons dag', true],
    ['Julafton', true],
    ['Juldagen', true],
    ['Annandag jul', true],
    ['Nyårsafton', true],
])

function getAllHolidays(year) {
    const tempHolidays = [
        ...Array.from(rodaDagar.keys()).map(key => {
            const [month, day] = key.split('-').map(Number);
            return { date: new Date(year, month - 1, day), name: rodaDagar.get(key) };
        }),
        { date: getEasterDate(year), name: 'Påskdagen' },
        { date: new Date(year, getEasterDate(year).getMonth(), getEasterDate(year).getDate() - 3), name: 'Skärtorsdag' },
        { date: new Date(year, getEasterDate(year).getMonth(), getEasterDate(year).getDate() - 2), name: 'Långfredagen' },
        { date: new Date(year, getEasterDate(year).getMonth(), getEasterDate(year).getDate() - 1), name: 'Påskafton' },
        { date: new Date(year, getEasterDate(year).getMonth(), getEasterDate(year).getDate() + 1), name: 'Annandag påsk' },
        { date: new Date(year, getEasterDate(year).getMonth(), getEasterDate(year).getDate() + 39), name: 'Kristi Himmelsfärdsdag' },
        { date: new Date(year, getEasterDate(year).getMonth(), getEasterDate(year).getDate() + 49), name: 'Pingstdagen' },
        { date: new Date(year, getEasterDate(year).getMonth(), getEasterDate(year).getDate() + 50), name: 'Annandag pingst' },
        { date: new Date(year, calculateMidsummerEve(year).getMonth(), calculateMidsummerEve(year).getDate() +1), name: 'Midsommardagen' },
        { date: calculateAllSaintsDay(year), name: 'Alla helgons dag' },
        { date: calculateMidsummerEve(year), name: 'Midsommarafton' },
    ];

    tempHolidays.sort((a, b) => a.date - b.date);

    const holidaysMap = new Map(
        tempHolidays.map(({ date, name }) => [`${date.getMonth() + 1}-${date.getDate()}`, name])
    );

    return holidaysMap;
}

function calculateAllSaintsDay(year) {
    // Startar med den 31 oktober
    let date = new Date(year, 9, 31); // Oktober är månad 9 (0-baserat)
    // Om den 31 oktober är en lördag, är det Alla helgons dag
    if (date.getDay() === 6) {
        return date;
    }
    // Annars, hitta den första lördagen efter den 31 oktober
    let offset = (6 - date.getDay() + 7) % 7;
    date.setDate(date.getDate() + offset);
    return date;
}

function calculateMidsummerEve(year) {
    const dateOf19th = new Date(year, 5, 19); // Juni månad är index 5
    const offset = (5 - dateOf19th.getDay() + 7) % 7;
    return new Date(year, 5, 19 + offset);
}

function isEasterHoliday(dateToCheck) {
    // Kontrollera endast torsdag och söndag
    const UTCDay = dateToCheck.getUTCDay();
    if (UTCDay !== 4 && UTCDay !== 0) return false;

    const year = dateToCheck.getFullYear();
    const month = dateToCheck.getMonth();
    const date = dateToCheck.getDate();
    const easterDate = getEasterDate(year);

    // Om det är skärtorsdag, kontrollera om påskdagen är två dagar senare
    if (UTCDay === 4) {
        const comingSunday = new Date(year, month, date + 2);
        return easterDate.getTime() === comingSunday.getTime();
    }

    // Om det är söndag, kontrollera om det är påskdagen
    const previousDay = new Date(year, month, date - 1);
    return easterDate.getTime() === previousDay.getTime();
}

function getEasterDate(year) {
    const C = Math.floor(year / 100);
    const N = year - 19 * Math.floor(year / 19);
    const K = Math.floor((C - 17) / 25);
    let I = C - Math.floor(C / 4) - Math.floor((C - K) / 3) + 19 * N + 15;
    I = I - 30 * Math.floor((I / 30));
    I = I - Math.floor(I / 28) * (1 - Math.floor(I / 28) * Math.floor(29 / (I + 1)) * Math.floor((21 - N) / 11));
    let J = year + Math.floor(year / 4) + I + 2 - C + Math.floor(C / 4);
    J = J - 7 * Math.floor(J / 7);
    const L = I - J;
    const monthIndex = 3 + Math.floor((L + 40) / 44);
    const dayOfMonthIndex = L + 28 - 31 * Math.floor(monthIndex / 4);

    return new Date(year, monthIndex - 1, dayOfMonthIndex);
}

function isKristiHimmelsfardsDay(date) {
    const easter = getEasterDate(date.getFullYear());
    const kristiHimmelsfardsDag = new Date(easter.getTime());

    // Ascension Day is 39 days after Easter
    kristiHimmelsfardsDag.setDate(easter.getDate() + 39);

    return date.getTime() === kristiHimmelsfardsDag.getTime();
}

function isMidsummerEve(date) {
    // Kontrollerar om det är juni och en fredag.
    if (date.getMonth() !== 5 || date.getDay() !== 5) return false;

    const year = date.getFullYear();
    // Skapar ett datum för den 19:e juni för det givna året.
    const dateOf19th = new Date(year, 5, 19);
    // Beräknar datumet för den närmaste fredagen efter den 19:e juni.
    const offset = (5 - dateOf19th.getDay() + 7) % 7;
    // Bestämmer datumet för midsommarafton.
    const midsummerEveDate = 19 + offset;

    return date.getDate() === midsummerEveDate;
}
