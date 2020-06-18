import { modal } from '../helpers/modal'


class Authentication {
    #auth

    modalContent = {
        body: `
        <p>The form just save username and password in cookie<p>
        <form id="user-login">
            <div class="form-group">
                <label for="username">Username:</label>
                <input type="text" class="form-control" id="username">
            </div>
            <div class="form-group">
                <label for="password">Password:</label>
                <input type="password" class="form-control" id="password">
            </div>
        </form>`,
        footer: `<button type="button" class="btn btn-success" data-action="submit">LOGIN</button>`,
        title: 'Login'
    }

    constructor() {
        let cookie = this.getCookie('user-login');

        if (!cookie) {
            this.openLoginForm();
        } else {
            try {
                cookie = JSON.parse(cookie);

                if (cookie.username && cookie.password) {
                    this.auth = cookie;
                } else {
                    this.openLoginForm();
                }

            } catch (e) {
                throw new Error('user-login cookie is broken')
            }
        }
    }

    openLoginForm() {
        const modalInstance = modal.showModal(this.modalContent, (action) => {
            if (action === 'submit') {
                const user = {};
                const errors = [];

                Object.values(document.querySelector('#user-login').elements).forEach(el => {
                    if (el.value && el.value.trim().length) {
                        user[el.id] = el.value;
                    } else {
                        el.classList.add('error');
                        errors.push(el.id);
                    }
                })

                if (!errors.length) {
                    const domainName = location.host;
                    const date = new Date();
                    date.setTime(date.getTime() + (2 * 60 * 60 * 1000));
                    this.auth = user;
                    document.cookie = 'user-login=' + JSON.stringify(this.auth) + '; expires=' + date.toGMTString() + '; path=/; domain=' + domainName + '; SameSite=Lax;';
                }

                modal.hideModal(modalInstance);
            } else {
                window.location.replace('./404.html');
            }

        });
    }

    get auth() {
        return this.#auth;
    }

    set auth(value) {
        this.#auth = value;
    }


    getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }

        return null;
    }

}

export const authenticationService = new Authentication();