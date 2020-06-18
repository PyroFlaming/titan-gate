class ApiConnection {
    #config

    constructor(config) {
        this.#config = config;
    }

    _send(type, path, data) {
        return new Promise((resolve, reject) => {
            const request = new XMLHttpRequest();

            request.addEventListener("load", () => {
                const responseText = request.responseText;
                try {
                    const response = JSON.parse(responseText);
                    resolve({
                        code: 200,
                        data: response
                    })
                } catch (e) {
                    reject({
                        code: 200,
                        message: 'JSON parse error'
                    })
                }
            });

            request.addEventListener("error", (event) => {
                reject({
                    code: 100,
                    message: 'Connection Error'
                })
            });

            request.addEventListener("timeout", (event) => {
                reject({
                    code: -1,
                    message: 'Request timeout'
                })
            })

            request.open(type, this.#config.api + path);

            if (data) {
                request.send(data);
            } else {
                request.send();

            }
        })
    }

    get(path) {
        return this._send('GET', path);
    }

    post(path, data) {
        data = JSON.stringify(data)

        return this._send('POST', path, data);
    }

    delete(path) {
        return this._send('DELETE', path)
    }
}

export const apiConnectionService = new ApiConnection({
    api: 'https://titangate-event-calendar.firebaseio.com/'
});
