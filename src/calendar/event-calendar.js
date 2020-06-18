import { loader } from '../helpers/loader';
import { modal } from '../helpers/modal';

import { CalendarEvents } from './events';
import { SearchEvent } from './search-event';

import { createCalendar } from '../libs/create-calendar';

export class EventCalendar {
    #searchInstance;
    #eventService;

    activeDate;

    allUserEvents = []

    constructor() {
        this.#eventService = new CalendarEvents();
        this.#searchInstance = new SearchEvent(this.#eventService);

        document.addEventListener('DOMContentLoaded', () => {

            this.calendarControls();
            this.printCalendar(
                new Date()
            );
            this.subscriptionEventsChange();
        })
    }

    subscriptionEventsChange() {
        // TODO create subscriber and listen for data change and change the window object.
        this.#eventService.events.subscribe(data => {
            this.allUserEvents = data;
            this.printCalendar(this.activeDate);
        });

    }

    dayContent(allUserEvents) {
        return (calendarDateOb, element) => {
            const currentDayEvents = allUserEvents.filter(el => {
                const eventDate = new Date(el.forDate.getFullYear(), el.forDate.getMonth(), el.forDate.getDate());
                const curetDate = new Date(calendarDateOb.date.getFullYear(), calendarDateOb.date.getMonth(), calendarDateOb.date.getDate());

                return eventDate.getTime() == curetDate.getTime();
            })

            let dayContent = '<span class="date">' +
                calendarDateOb.date.getDate() + '</span>';

            if (currentDayEvents && currentDayEvents.length) {
                element.classList.add('has-event');
                dayContent += '<ul>';
                for (let index = 0; index < currentDayEvents.length; index++) {
                    const element = currentDayEvents[index];
                    dayContent += `<li><b>${element.title}</b> ${element.description}</li>`
                }
                dayContent += '</ul>';
            }

            return dayContent;
        }
    }

    showDayEvents() {

    }

    addNewEvent() {
        const mBody = `
            <form id="create-new">
                <div class="form-group">
                    <label for="title">Title:</label>
                    <input type="text" class="form-control" id="title">
                </div>
                <div class="form-group">
                    <label for="participants">Participants:</label>
                    <input type="textarea" class="form-control" id="participants">
                </div>
                <div class="form-group">
                    <label for="description">Details:</label>
                    <input type="text" class="form-control" id="description">
                </div>
                <div class="form-group">
                    <label for="meeting-time">Event date time:</label>
                    <input type="datetime-local" id="meeting-time"
                        name="meeting-time">
                </div>
            </form>
        `
        const mFooter = `
            <button type="button" class="btn btn-success" data-action="submit">Success</button>
            <button type="button" class="btn btn-secondary" data-action="close">Close</button>
        `;

        const mInstance = modal.showModal(
            {
                title: 'Create event',
                body: mBody,
                footer: mFooter
            },
            action => {
                if (action == 'submit') {

                    const newEventForm = document.querySelector('#create-new');
                    const newEvent = {};
                    let errors = [];

                    Object.values(newEventForm.elements).forEach(el => {
                        el.classList.remove('error');

                        if (el.id === 'meeting-time') {
                            try {
                                Object.assign(newEvent, { forDate: new Date(el.value) });

                                if (!(newEvent.forDate instanceof Date && !isNaN(newEvent.forDate))) {
                                    errors.push(el.id);
                                    el.classList.add('error');
                                }

                            } catch (e) {
                                errors.push(el.id);
                                el.classList.add('error');
                            }

                        } else {
                            if (el.value && el.value.trim().length) {
                                newEvent[el.id] = el.value;
                            } else {
                                errors.push(el.id);
                                el.classList.add('error');
                            }
                        }
                    })

                    if (errors.length == 0) {
                        this.#eventService.createEvent(newEvent).then(response => {
                            // TODO implement on successfully create to append the new event to current events massive 
                            try {
                                this.#eventService.fetchUserEvents();
                            } catch (e) {
                                console.error(e);
                            }

                            modal.hideModal(mInstance);
                        }).catch(error => {

                            modal.hideModal(mInstance);
                        })
                    }
                } else {
                    modal.hideModal(mInstance);
                }
            }
        )
    }

    calendarControls() {
        const prevBtn = document.querySelector('[calendarPrev]');
        const nextBtn = document.querySelector('[calendarNext]');
        const currentBtn = document.querySelector('[currentMonth]');
        const addNewEvent = document.querySelector('#addNewEvent');
        const refreshButton = document.querySelector('#refresh-events');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.prevMonth()
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.nextMonth();
            });
        }

        if (currentBtn) {
            currentBtn.addEventListener('click', () => {
                this.currentMonth()
            });
        }

        if (addNewEvent) {
            addNewEvent.addEventListener('click', () => {
                this.addNewEvent();
            })
        }

        if (refreshButton) {
            refreshButton.addEventListener('click', () => {
                // TODO make live reload on specific time frame. 
                this.#eventService.fetchUserEvents().then(response => {
                    // noting 
                }).catch(error => {
                    console.error(error);
                })
            })
        }
    }

    nextMonth() {
        this.printCalendar(
            new Date(this.activeDate.getFullYear(), this.activeDate.getMonth() + 1, 1)
        );
    }

    prevMonth() {
        this.printCalendar(new Date(this.activeDate.getFullYear(), this.activeDate.getMonth() - 1, 1));
    }

    currentMonth() {
        this.printCalendar(
            new Date(),
            this.dayContent(this.allUserEvents)
        );
    }

    printCalendar(date) {

        const calendarHolder = document.querySelector('[calendarHolder]');
        const calendarTitle = document.querySelector('[calendarTitle]')
        if (calendarHolder) {
            this.activeDate = date;

            const month = this.activeDate.getMonth();
            const year = this.activeDate.getFullYear();

            if (calendarTitle) {
                const monthsStrings = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                calendarTitle.innerText = year + ' ' + monthsStrings[month];
            }

            createCalendar(calendarHolder, date, this.dayContent(this.allUserEvents))

        }
    }

}