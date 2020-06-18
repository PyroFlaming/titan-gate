import { modal } from '../helpers/modal'

export class SearchEvent {
    searchHolder;
    searchInput;
    searchSuggestionsHolder;

    #eventService;

    allUserEvents;

    constructor(eventService) {
        this.#eventService = eventService;

        document.addEventListener('DOMContentLoaded', () => {
            this.selectSearchElements();
            if (this.searchInput && this.searchHolder && this.searchSuggestionsHolder) {
                this.subscriptionEventsChange();

                window.filterEvents = this.filterSuggestions;

                this.appendEventListeners();
            }
        })
    }

    subscriptionEventsChange() {
        // TODO create subscriber and listen for data change and change the window object.
        this.#eventService.events.subscribe(data => {
            this.allUserEvents = data;
            window.eventSearch = this.allUserEvents;
        });
    }

    selectSearchElements() {
        this.searchInput = document.querySelector('#calendar-search-input');
        this.searchHolder = document.querySelector('#calendar-search');
        this.searchSuggestionsHolder = document.querySelector('#calendar-search-suggestions');
    }

    appendEventListeners() {
        this.searchInput.addEventListener('focus', (event) => {
            this.printSuggestions(event.autoCompleteResult);
            if (event.autoCompleteResult && Array.isArray(event.autoCompleteResult) && event.autoCompleteResult.length) {
                this.searchHolder.classList.add('open')
            } else {
                this.searchHolder.classList.remove('open');
            }
        });

        this.searchInput.addEventListener('keyup', (event) => {
            this.printSuggestions(event.autoCompleteResult);
            if (event.autoCompleteResult && Array.isArray(event.autoCompleteResult) && event.autoCompleteResult.length) {
                this.searchHolder.classList.add('open');
                if (event.key === "Enter") {
                    this.selectSuggestion(event.autoCompleteResult[0].id)
                    this.searchHolder.classList.remove('open');
                }
            } else {
                this.searchHolder.classList.remove('open');
            }
        });

        this.searchInput.addEventListener('blur', (event) => {
            this.printSuggestions(event.autoCompleteResult);
            this.searchHolder.classList.remove('open');
        });

        this.searchSuggestionsHolder.addEventListener('mousedown', (event) => {
            const selectedEventId = event.target.getAttribute('eventId');
            if (selectedEventId) {
                this.selectSuggestion(selectedEventId);
            }
        })
    }

    selectSuggestion(selectedEventId) {
        const selectedEvent = this.allUserEvents.find(el => el.id === selectedEventId);
        if (selectedEvent) {
            this.searchInput.value = '';

            const mBody = JSON.stringify(selectedEvent);
            const mFooter = `
                <button type="button" class="btn btn-primary" data-action="close" > Close</button >
                <button type="button" class="btn btn-danger" data-action="delete"> Delete </button>
            `;

            modal.showModal(
                {
                    title: selectedEvent.title,
                    body: mBody,
                    footer: mFooter
                }
                ,
                (actionData) => {
                    if (actionData === 'close') {
                        modal.hideModal();
                    } else if (actionData === 'delete') {
                        modal.hideModal();

                        this.#eventService.deleteEvent(selectedEvent.id).then(response => {
                            // TODO just remove it from current eventsMassive 
                            this.#eventService.fetchUserEvents().then(response => {
                                // noting
                            }).catch(error => {
                                console.error(error);
                            });
                        }).catch(err => {
                            console.error(err);
                        });
                    }
                }
            )
        } else {
            throw new Error('Fail to find searchEvent');
        }


        // const selectedEvent = this.allUserEvents.find

    }

    printSuggestions(filteredSuggestionEvents) {
        this.searchSuggestionsHolder.innerHTML = '';
        if (filteredSuggestionEvents && Array.isArray(filteredSuggestionEvents)) {
            for (let index = 0; index < filteredSuggestionEvents.length; index++) {
                const element = filteredSuggestionEvents[index];
                const suggestionHtml = document.createElement('li');

                suggestionHtml.innerText = element.title;
                suggestionHtml.setAttribute('eventId', element.id);

                this.searchSuggestionsHolder.appendChild(suggestionHtml);
            }
        }
    }

    filterSuggestions(value, array) {
        // TODO upgrade to split on words and search for sentence.
        return array.filter(el => el.title.toLocaleLowerCase().replace(/\s/g, '').includes(value.toLocaleLowerCase().replace(/\s/g, '')));
    }
}