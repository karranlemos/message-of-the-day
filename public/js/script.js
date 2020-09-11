const _STATIC_LOGIN_FORM = {
    className: 'js-login-form',
    instances: []
};
class LoginForm {
    constructor(formContainer) {
        this.formContainer = formContainer;
        
        if (!this.formContainer.classList.contains(_STATIC_LOGIN_FORM.className))
            throw 'Wrong class...';
        
        this.form = this.formContainer.querySelector('form');
        if (!this.form)
            throw 'Form tag unavailable...';
        
        this.messages = this.formContainer.querySelector('.messages');
        if (!this.messages)
            throw 'Messages div unavailable...';

        this.form.addEventListener('submit', this.onSubmit);
    }

    onSubmit = (e) => {
        e.preventDefault();
        this.clearMessages();

        const username = e.target.elements.username.value;
        const password = e.target.elements.password.value;

        if (!username || username === '')
            return this.addMessage('Username must be inserted...');
        if (!password || password === '')
            return this.addMessage('Password must be inserted...');

        const callbacks = {
            checkSuccess: (status) => (status === 200),
            onSuccess: () => Helpers.reloadPage(),
            onFailure: (status, jsonString) => {
                try {
                    var json = JSON.parse(jsonString);
                }
                catch {
                    return this.addMessage('Could not parse answer...');
                }

                return this.addMessage(json.message ?? 'Unknown error.');
            }
        };

        const data = {
            method: 'post',
            params: `username=${username}&password=${password}`,
            url: e.target.action
        };
        Helpers.sendData(data, callbacks);
    }

    addMessage = (message, type="error") => {
        if (!['error', 'success', 'warning'].includes(type))
            throw 'Invalid type...';

        const messageHtml = `<div class="message-box ${type}">${message}</div>`;
        this.messages.insertAdjacentHTML('beforeend', messageHtml);
    }

    clearMessages = () => {
        while (this.messages.firstChild)
            this.messages.removeChild(this.messages.firstChild);
    }

    static initAll() {
        const forms = document.querySelectorAll(`.${_STATIC_LOGIN_FORM.className}`);
        var i = 1;
        for (const form of forms) {
            try {
                _STATIC_LOGIN_FORM.instances.push(new LoginForm(form));
            }
            catch (err) {
                console.log(`LoginForm[${i}]: "${err}"`);
            }
            i++;
        }
    }
}



const _STATIC_REGISTER_FORM = {
    className: 'js-register-form',
    instances: []
};
class RegisterForm {
    constructor(formContainer) {
        this.formContainer = formContainer;
        
        if (!this.formContainer.classList.contains(_STATIC_REGISTER_FORM.className))
            throw 'Wrong class...';
        
        this.form = this.formContainer.querySelector('form');
        if (!this.form)
            throw 'Form tag unavailable...';
        
        this.messages = this.formContainer.querySelector('.messages');
        if (!this.messages)
            throw 'Messages div unavailable...';

        this.form.addEventListener('submit', this.onSubmit);
    }

    onSubmit = (e) => {
        e.preventDefault();
        this.clearMessages();

        const username = e.target.elements.username.value;
        const email = e.target.elements.email.value;
        const password = e.target.elements.password.value;
        const password2 = e.target.elements.repeat_password.value;

        if (!username || username === '')
            return this.addMessage('Username must be inserted...');
        if (!email || email === '')
            return this.addMessage('Email must be inserted...');
        if (!password || password === '')
            return this.addMessage('Password must be inserted...');
        if (!password2 || password2 === '')
            return this.addMessage('Password must be repeated...');

        if (password !== password2)
            return this.addMessage(`Passwords must match...`);

        const callbacks = {
            checkSuccess: (status) => (status === 201),
            onSuccess: () => this.addMessage(
                'User created successfully! Please <a href="/">log into your account</a>!',
                'success'
            ),
            onFailure: (status, jsonString) => {
                try {
                    var json = JSON.parse(jsonString);
                }
                catch {
                    return this.addMessage('Could not parse answer...');
                }

                return this.addMessage(json.message ?? 'Unknown error.');
            }
        };

        const data = {
            method: 'post',
            params: `username=${username}&password=${password}&email=${email}`,
            url: e.target.action
        };
        Helpers.sendData(data, callbacks);
    }

    addMessage = (message, type="error") => {
        if (!['error', 'success', 'warning'].includes(type))
            throw 'Invalid type...';

        const messageHtml = `<div class="message-box ${type}"><span>${message}</span></div>`;
        this.messages.insertAdjacentHTML('beforeend', messageHtml);
    }

    clearMessages = () => {
        while (this.messages.firstChild)
            this.messages.removeChild(this.messages.firstChild);
    }

    static initAll() {
        const forms = document.querySelectorAll(`.${_STATIC_REGISTER_FORM.className}`);
        var i = 1;
        for (const form of forms) {
            try {
                _STATIC_REGISTER_FORM.instances.push(new RegisterForm(form));
            }
            catch (err) {
                console.log(`RegisterForm[${i}]: "${err}"`);
            }
            i++;
        }
    }
}



class Helpers {
    constructor() {
        throw 'Static Class';
    }

    static sendData(data, callbacks) {
        Helpers._prepareSendDataParameters(data, callbacks);

        const request = new XMLHttpRequest();
        request.onload = () => {
            if (callbacks.checkSuccess(request.status, request.responseText))
                callbacks.onSuccess(request.status, request.responseText);
            else
                callbacks.onFailure(request.status, request.responseText);
            callbacks.onAfter(request.status, request.responseText);
        };
        request.open(data.method, data.url)
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        request.send(data.params);
    }

    static _prepareSendDataParameters(data, callbacks) {
        for (const callbackName of ['checkSuccess', 'onload', 'onSuccess', 'onAfter']) {
            if (!callbacks.hasOwnProperty(callbackName))
                callbacks[callbackName] = () => {};
        }
        if (!data.method)
            data.method = 'get';
        if (!data.params)
            data.params = '';

        return [data, callbacks];
    }


    static reloadPage() {
        window.location.replace(window.location.href);
    }


    static getQueryObject() {
        return new URLSearchParams(window.location.search);
    }
}



document.addEventListener('DOMContentLoaded', () => {
    LoginForm.initAll();
    RegisterForm.initAll();
});