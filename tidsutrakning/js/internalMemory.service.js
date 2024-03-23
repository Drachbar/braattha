class YearService {
    constructor() {
        if (!YearService.instance) {
            this.yearMap = new Map();
            YearService.instance = this;
        }
        return YearService.instance;
    }

    getOrCreateHolidayObject(year) {
        if (this.yearMap.has(year)) {
            return this.yearMap.get(year);
        }
        const newYearMap = getAllHolidays(year);
        this.yearMap.set(year, newYearMap);

        return newYearMap;
    }

    // Static metoden för att skapa eller få den singleton instansen.
    static getInstance() {
        if (!YearService.instance) {
            YearService.instance = new YearService();
        }
        return YearService.instance;
    }

    getYearMap() {
        return this.yearMap
    }
}