class Modal {
    modal;
    backDrop;
    modalFooter;
    modalBody;
    modalTitle;

    modalIsOpen = false;

    actionHandler;

    constructor() {
        this.appendModalContainer();
    }

    showModal(modalContent, actionHandler) {
        this.modalIsOpen = true;

        this.modal.focus();

        if (modalContent.footer)
            this.modalFooter.innerHTML = modalContent.footer;

        if (modalContent.body) {
            this.modalBody.innerHTML = modalContent.body;
        }

        if (modalContent.title) {
            this.modalTitle.innerHTML = modalContent.title;
        }

        this.actionHandler = actionHandler;
        this.modal.style.display = 'block';

        document.body.appendChild(this.backDrop);

        this.backDrop.classList.add('show');
        this.modal.classList.add('show');
    }

    hideModal() {
        this.modalIsOpen = false;

        this.modalFooter.innerHTML = '';
        this.modalBody.innerHTML = '';
        this.modalTitle.innerHTML = '';

        this.actionHandler = null;
        this.modal.classList.remove('show');
        this.backDrop.classList.remove('show');

        setTimeout(() => {
            document.body.removeChild(this.backDrop);
            this.modal.style.display = 'none';
        }, 100);
    }

    appendModalContainer() {
        this.modal = document.createElement('div');
        this.appendEventListener();
        this.modal.classList.add('modal');
        this.modal.classList.add('fade');

        this.backDrop = document.createElement('div');
        this.backDrop.setAttribute('class', 'modal-backdrop fade');

        this.modal.innerHTML =
            `<div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title"></h5>
                        <button type="button" class="close" data-action="close" aria-label="Close">
                            <span aria-hidden="true" data-action="close">×</span>
                        </button>
                    </div>
                    <div class="modal-body">

                    </div>
                    <div class="modal-footer">
                    </div>
                </div>
            </div>`;

        this.modalTitle = this.modal.querySelector('.modal-dialog .modal-title');
        this.modalBody = this.modal.querySelector('.modal-dialog .modal-body');
        this.modalFooter = this.modal.querySelector('.modal-dialog .modal-footer');

        document.body.appendChild(this.modal);
    }

    appendEventListener() {
        this.modal.addEventListener('click', (event) => {
            if (typeof this.actionHandler === "function", event.target.hasAttribute('data-action')) {
                this.actionHandler(event.target.getAttribute('data-action'));
            }
        })

        this.modal.addEventListener('blur', (e) => {
            if (modalIsOpen) {
                this.modal.focus();
            }
        })
    }

}

export const modal = new Modal();