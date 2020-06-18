export class LocalStorageCache {

    localStorageEnabled = false;

    constructor() {
        this.localStorageEnabled = this.isLocalStorageEnabled()
        if (this.localStorageEnabled) {
            this.clearOldCache()
        }
    }

    setCache(propertyName, data, path, life) {
        if (!this.localStorageEnabled) {
            return;
        }

        if (typeof life == 'undefined') {
            life = 1;
        }

        const expireDate = new Date(Date.now() + life * 24 * 60 * 60 * 1000).toUTCString();

        const cacheEndPoint = {
            path: path,
            data: data,
            expireDate: expireDate
        };

        let cachedData = JSON.stringify(cacheEndPoint);

        window.localStorage.setItem('cache-' + propertyName, cachedData);
    }

    getCache(propertyName) {
        if (!this.localStorageEnabled) {
            return;
        }

        let cache;
        try {
            cache = JSON.parse(window.localStorage.getItem('cache-' + propertyName));
        } catch (e) {
            return undefined;
        }

        return cache;
    }

    isLocalStorageEnabled() {
        let localStorageEnable = false;
        try {
            localStorage.setItem('test-local-storage', 'test-data');
            localStorage.removeItem('test-local-storage');
            localStorageEnable = true;
        } catch (e) {
            localStorageEnable = false;
        }

        return localStorageEnable;
    }

    isCacheExpired(cache) {
        const expireDate = new Date(cache.expireDate);

        if (new Date() > expireDate) {
            return true;
        }
        return false;
    }

    clearOldCache() {
        try {
            const localStorageEntries = Object.entries(window.localStorage);

            localStorageEntries.forEach(el => {
                const key = el[0];

                if (key.includes('cache-')) {

                    const cache = this.getCache(key);

                    if (this.isCacheExpired(cache)) {
                        window.localStorage.removeItem(key);
                    }
                }
            });

            return true;
        } catch (error) {
            return false;
        }
    }

}


export const localCacheService = new LocalStorageCache();  