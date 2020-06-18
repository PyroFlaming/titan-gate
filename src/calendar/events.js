import { apiConnectionService } from '../services/api-connection';
import { loader } from '../helpers/loader'
import { authenticationService } from '../services/authentication'
import { SimpleSubject } from '../libs/simpleSubscriber';
import { localCacheService } from '../helpers/localstorage-cache';


export class CalendarEvents {
    #path = 'calendar-events.json'

    events = new SimpleSubject([]);

    cache;

    constructor() {
        this.cache = localCacheService;
        this.fetchUserEvents(true);
    }

    createEvent(eventData) {
        return new Promise((resolve, reject) => {
            const event = new CalendarEvent(
                eventData.title,
                authenticationService.auth.username,
                new Date(),
                eventData.forDate,
                eventData.description,
                eventData.participants
            )

            const loaderObj = loader.show()
            apiConnectionService.post(this.#path, event).then(response => {
                loader.hide(loaderObj);
                resolve(response);
            }).catch((error) => {
                loader.hide(loaderObj);
                reject('Fail to create event!');
                alert('Fail to create event!');
            })

        })
    }

    deleteEvent(eventId) {
        return new Promise((resolve, reject) => {
            const loaderObj = loader.show()

            apiConnectionService.delete(this.#path.replace('.json', '/') + eventId + '.json').then(response => {
                loader.hide(loaderObj);
                resolve(response);
            }).catch(error => {
                loader.hide(loaderObj);
                reject(error);
                alert(error);
            })
        })
    }

    // use for initial fetch for user events
    fetchUserEvents(useCache) {
        return new Promise((resolve, reject) => {
            const loaderObj = loader.show()

            if (useCache) {
                const cacheData = this.cache.getCache('calendar-events');
                if (cacheData && cacheData.data && cacheData.data.length) {

                    const eventData = cacheData.data.map(el => {
                        el.forDate = new Date(el.forDate);
                        el.createAt = new Date(el.createAt);
                        return el
                    })

                    this.events.next(eventData);
                    resolve(eventData);
                    loader.hide(loaderObj);

                    return;
                }
            }

            const userName = authenticationService.auth.username;
            apiConnectionService.get(this.#path + '?orderBy="creator"&equalTo="' + userName + '"').then(response => {
                if (response.data) {
                    const userEvents = []

                    Object.keys(response.data).forEach(key => {
                        response.data[key].forDate = new Date(response.data[key].forDate);
                        response.data[key].createAt = new Date(response.data[key].createAt);
                        userEvents.push(Object.assign(response.data[key], { id: key }))
                    })

                    this.cache.setCache('calendar-events', userEvents, this.#path + '?orderBy="creator"&equalTo="' + userName + '"')
                    this.events.next(userEvents);
                    loader.hide(loaderObj);

                    resolve(response.data);
                }
            }).catch(error => {
                loader.hide(loaderObj);

                console.error(error);
            })

        })
        // cache in localStorage
    }
}

export class CalendarEvent {
    title;
    creator;
    createAt;
    forDate;
    description;
    participants;

    constructor(title, creator, createAt, forDate, description, participants) {
        this.title = title;
        this.creator = creator;
        this.createAt = createAt;
        this.forDate = forDate;
        this.description = description;
        this.participants = participants;
    }
}



