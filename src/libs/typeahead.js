(function () {
    function autoCompleteFilter(value, searchIn, searchFor, filterFunction) {
        let autoCompleteResult = null;

        if (!searchIn) {
            return null;
        }

        if (searchFor === '') {
            return filterFunction(value, searchIn);
        }

        const property = searchFor.split('.')[0];
        searchFor = searchFor.slice(property.length + 1)

        if (Array.isArray(searchIn)) {
            searchIn = searchIn.map(el => {
                el[property] = autoCompleteFilter(value, el[property], searchFor, filterFunction);
                return el;
            });
        } else if (searchIn[property]) {
            searchIn[property] = autoCompleteFilter(value, searchIn[property], searchFor, filterFunction);
        }

        return searchIn;
    }

    function modifyAddEventListener() {
        const oldAddEventListener = HTMLElement.prototype.addEventListener;
        HTMLElement.prototype.addEventListener = function (event, handler, bubbling) {

            const superHandler = (e) => {
                if (
                    e && e.type &&
                    (e.type == 'focus' || e.type == 'blur' || e.type == 'change' || e.type == 'keyup') &&
                    // not sure i need to filter the htmlElements
                    e.target.type == 'text' && e.target.nodeName === 'INPUT' &&
                    e.target.hasAttribute('typeAheadSearch')
                ) {
                    if (e.type === 'blur') {
                        e.autoCompleteResult = [];
                    } else {
                        const value = e.target.value;
                        let searchFor = e.target.getAttribute('typeAheadSearch');
                        const filterFunction = e.target.getAttribute('typeAheadFilterFunction');

                        const property = searchFor.split('.')[0];
                        searchFor = searchFor.slice(property.length + 1)

                        if (typeof window[filterFunction] !== 'function') {
                            handler(e);
                            return
                        }

                        e.autoCompleteResult = autoCompleteFilter(value, window[property], searchFor, window[filterFunction]);
                    }
                }

                handler(e);
            }

            oldAddEventListener.call(this, event, superHandler, bubbling);
        }
    }

    modifyAddEventListener();
})()