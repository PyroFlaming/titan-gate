
// Optimize only for changed calendar
export function createCalendar(calendarHtmlElement, date, dayContentHandler) {
    const calendar = calendarHtmlElement;

    if (calendar) {
        const month = date.getMonth();
        const year = date.getFullYear();

        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0)

        const firstDayForCalendar = new Date(year, month, (firstDayOfMonth.getDate() - firstDayOfMonth.getDay() + 1));
        const lastDayForCalendar = new Date(year, month, (lastDayOfMonth.getDate() + (7 - lastDayOfMonth.getDay())))

        const daysOfCalendar = [];

        daysOfCalendar.push({
            date: new Date(firstDayForCalendar),
            isInMonth: month === firstDayForCalendar.getMonth(),
            isToday: new Date().getTime() === firstDayForCalendar.getTime()
        });

        while (firstDayForCalendar.getTime() !== lastDayForCalendar.getTime()) {
            firstDayForCalendar.setDate(
                firstDayForCalendar.getDate() + 1
            );

            daysOfCalendar.push({
                date: new Date(firstDayForCalendar),
                isInMonth: month === firstDayForCalendar.getMonth(),
                isToday: new Date().getTime() === firstDayForCalendar.getTime()
            });
        }

        calendar.innerHTML = "";
        let weekHtmlElement;
        for (let index = 0; index < daysOfCalendar.length; index++) {
            const day = document.createElement('div');
            const calendarDateObject = daysOfCalendar[index];

            if (index % 7 === 0) {
                weekHtmlElement = document.createElement('div')
                weekHtmlElement.classList.add('calendar-week');
                calendar.appendChild(weekHtmlElement);
            }

            day.classList.add('calendar-day')

            if (calendarDateObject.isToday) {
                day.classList.add('current-day');
            }

            if (!calendarDateObject.isInMonth) {
                day.classList.add('pass-month-day');
            }


            day.innerHTML = dayContentHandler(calendarDateObject, day);
            weekHtmlElement.appendChild(day)
        }
    }
}