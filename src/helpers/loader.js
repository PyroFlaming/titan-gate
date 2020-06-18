class Loader {
    loaderHtmlElement = document.createElement('div');
    loaderCount = 0;
    loadersStack = [];

    constructor() {
        const styleElement = document.createElement('style');
        styleElement.innerHTML = `
        .loader-overlay {
            position:fixed;
            top:0;
            bottom:0;
            right:0;
            left:0;
            background:rgba(0,0,0,0.3);
            display:none;
        }`;
        document.body.appendChild(styleElement)

        this.loaderHtmlElement.setAttribute('class', 'loader-overlay');
        document.body.appendChild(this.loaderHtmlElement)
    }

    show() {
        this.loaderCount++;

        const loader = {
            id: this.loaderCount
        };

        this.loadersStack.push(loader);
        this.loaderHtmlElement.style.display = "block";

        return loader;
    }

    hide(loaderInst) {
        let loaderIndex = this.loadersStack.indexOf(el => {
            return el.loaderId = loader.loaderId;
        });

        this.loadersStack.splice(loaderIndex, 1);

        if (!this.loadersStack.length) {
            this.loaderHtmlElement.style.display = "none";
        }
    }
}

export const loader = new Loader();