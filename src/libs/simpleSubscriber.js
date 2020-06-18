export class SimpleSubject {

    value;
    subscriptions = [];

    constructor(value) {
        if (typeof value !== 'undefined') {
            this.value = value
        }
    }

    next(newValue) {
        this.value = newValue;
        this.subscriptions.forEach(el => {
            el.handler(this.value);
        })
    }

    subscribe(callback) {
        const subs = {
            id: this.subscriptions.length + 1,
            handler: callback
        }

        this.subscriptions.push(subs);
        subs.handler(this.value);
        return subs;
    }

    removeSubscriber(subs) {
        let subsIndex = this.subscriptions.indexOf(el => {
            return el.id = subs.id;
        });

        this.subscriptions.splice(subsIndex, 1);
    }
}