import { apiConnectionService } from '../services/api-connection'

export class CitySearch {
    searchInput;
    searchSuggestions;
    searchHolder;

    #cityData = []

    constructor() {
        document.addEventListener('DOMContentLoaded', () => {
            this.getCities().then(res => {

                window.filterCity = this.filterFunction;
                window.cityData = res;
                this.#cityData = res;

                this.searchInput = document.querySelector('#city-search');
                this.searchSuggestions = document.querySelector('#city-search-suggestions');
                this.searchHolder = document.querySelector('#city-search-holder')

                if (
                    this.searchInput,
                    this.searchSuggestions,
                    this.searchHolder
                ) {
                    this.eventListeners();
                } else {
                    console.error('Missing html elements');
                }


            }).catch(err => {
                console.error(err);
            })
        })
    }

    getCities() {
        return new Promise((resolve, reject) => {
            apiConnectionService.get('city.json').then(response => {
                resolve(response.data);
            }).catch(err => {
                reject(err);
            })
        })
    }

    eventListeners() {
        this.searchInput.focus = (event) => {
            console.log(event);

        }


        this.searchInput.addEventListener('focus', event => {
            this.printSuggestions(event.autoCompleteResult);
            if (event.autoCompleteResult && Array.isArray(event.autoCompleteResult) && event.autoCompleteResult.length) {
                this.searchHolder.classList.add('open')
            } else {
                this.searchHolder.classList.remove('open');
            }
        })

        this.searchInput.addEventListener('keydown', event => {
            if (!event.key.match(/^[A-Za-z]+$/)) {
                event.preventDefault();
            }
        });

        this.searchInput.addEventListener('keyup', event => {
            this.printSuggestions(event.autoCompleteResult);
            if (event.autoCompleteResult && Array.isArray(event.autoCompleteResult) && event.autoCompleteResult.length) {
                this.searchHolder.classList.add('open');
                if (event.key === "Enter") {
                    this.selectSuggestion(event.autoCompleteResult[0])
                    this.searchHolder.classList.remove('open');
                }
            } else {
                this.searchHolder.classList.remove('open');
            }
        });

        this.searchInput.addEventListener('blur', event => {
            this.printSuggestions(event.autoCompleteResult);
            this.searchHolder.classList.remove('open');
        });

        this.searchHolder.addEventListener('mousedown', event => {
            const suggestion = event.target.getAttribute('citySuggestion')
            if (suggestion) {
                this.selectSuggestion(JSON.parse(suggestion));
            }
        })
    }

    selectSuggestion(selectedCity) {
        this.searchInput.value = selectedCity.name;
    }

    printSuggestions(citySuggestions) {
        this.searchSuggestions.innerHTML = '';
        if (citySuggestions && Array.isArray(citySuggestions)) {
            for (let index = 0; index < citySuggestions.length; index++) {
                const element = citySuggestions[index];

                const suggestionHtml = document.createElement('li');

                suggestionHtml.innerText = element.name;
                suggestionHtml.setAttribute('citySuggestion', JSON.stringify(element));

                this.searchSuggestions.appendChild(suggestionHtml);
            }
        }
    }

    filterFunction(value, cityArray) {
        return cityArray.filter(el => { return el.name.toLowerCase().includes(value.toLowerCase()) })
    }
}

