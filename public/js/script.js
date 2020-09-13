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
                this.clearMessages();
                
                if (status === 500)
                    return this.addMessage('Internal Server Error...');
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



const _STATIC_LOGOUT = {
    className: 'js-logout',
    logoutUrl: '/api/users/logout',
    instances: []
};
class Logout {
    constructor(logoutButton) {
        this.logoutButton = logoutButton;
        
        if (!this.logoutButton.classList.contains(_STATIC_LOGOUT.className))
            throw 'Wrong class...';

        this.logoutButton.addEventListener('click', this.onClick);
    }

    onClick = () => {
        const callbacks = {
            checkSuccess: (status) => (status === 200),
            onSuccess: () => Helpers.reloadPage()
        };

        const data = {
            method: 'post',
            url: _STATIC_LOGOUT.logoutUrl
        };
        Helpers.sendData(data, callbacks);
    }



    static initAll() {
        const buttons = document.querySelectorAll(`.${_STATIC_LOGOUT.className}`);
        var i = 1;
        for (const button of buttons) {
            try {
                _STATIC_LOGOUT.instances.push(new Logout(button));
            }
            catch (err) {
                console.log(`Logout[${i}]: "${err}"`);
            }
            i++;
        }
    }
}



const _STATIC_MESSAGE_FORM = {
    className: 'js-message-form',
    formUrl: '',
    instances: []
};
class MessageForm {
    constructor(formContainer) {
        this.state = {
            serverError: false,
            allowedEdit: false
        };

        this.formContainer = formContainer;
        
        if (!this.formContainer.classList.contains(_STATIC_MESSAGE_FORM.className))
            throw 'Wrong class...';

        this.jsForm = this.formContainer.querySelector('.js-form');
        if (!this.jsForm)
            throw 'Form not found...';
        
        this.inputContainer = this.jsForm.querySelector('.js-input-container');
        if (!this.inputContainer)
            throw "'.js-input-container' not found...";

        this.messageInput = this.jsForm.querySelector('.js-message');
        if (!this.messageInput)
            throw "'.js-message' not found...";

        this.placeholder = this.jsForm.querySelector('.js-input-placeholder');
        if (!this.placeholder)
            throw "'.js-message' not found...";

        this.buttonSubmit = this.jsForm.querySelector('.js-button');
        if (!this.buttonSubmit)
            throw "'.js-button' not found...";

        this.buttonSubmit.addEventListener('click', this.onSubmit);
        this.inputContainer.addEventListener('click', this.editMessage);

        this.fetchMessage();
    }

    onSubmit = () => {
        const callbacks = {
            checkSuccess: (status) => (status === 200),
            onSuccess: this.freezeMessage
        };

        const data = {
            method: 'put',
            url: _STATIC_MESSAGE_FORM.formUrl,
            params: `new_message=${this.messageInput.textContent}`
        };

        if (data.url === '')
            return;

        Helpers.sendData(data, callbacks);
    };


    fetchMessage = () => {
        this.showPlaceholder('Loading...');

        const data = {
            method: 'get',
            url: _STATIC_MESSAGE_FORM.formUrl
        };
        
        const callbacks = {
            checkSuccess: (status) => (status === 200),
            onSuccess: (status, jsonString) => {
                try {
                    var jsonString = JSON.parse(jsonString);
                }
                catch {
                    return this.blockForm();
                }
                this.setText(jsonString.message);
                this.allowEdit()
            },
            onFailure: (status) => {
                if (status === 404)
                    return this.allowEdit('Your message here...');
                
                this.blockForm()
            }
        }

        Helpers.sendData(data, callbacks);
    };

    blockForm = () => {
        this.state.serverError = true;
        this.showPlaceholder('Failed to connect...');
        this.freezeMessage();
    };

    allowEdit = (placeholder) => {
        this.state.allowedEdit = true;

        if (placeholder)
            this.showPlaceholder(placeholder);
        else
            this.hidePlaceholder();
    };



    editMessage = () => {
        if (!this.state.allowedEdit)
            return;
        this.messageInput.setAttribute('contentEditable', 'true');
        this.messageInput.classList.remove('readonly')
        this.hidePlaceholder();
    };

    freezeMessage = () => {
        this.messageInput.setAttribute('contentEditable', 'false');
        this.messageInput.classList.add('readonly');
    };


    
    showPlaceholder = (message) => {
        this.placeholder.classList.add('show');
        this.placeholder.textContent = message;
    }

    hidePlaceholder = () => {
        this.placeholder.classList.remove('show');
        this.placeholder.textContent = '';
    }



    setText = (message) => {
        if (message === '')
            this.hidePlaceholder();
        else
            this.messageInput.textContent = message;
    }



    static initAll() {
        _STATIC_MESSAGE_FORM.formUrl = `/api/messages/${fromServer.userdata.id }`;

        const forms = document.querySelectorAll(`.${_STATIC_MESSAGE_FORM.className}`);
        var i = 1;
        for (const form of forms) {
            try {
                _STATIC_MESSAGE_FORM.instances.push(new MessageForm(form));
            }
            catch (err) {
                console.log(`Logout[${i}]: "${err}"`);
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
        for (const callbackName of ['checkSuccess', 'onFailure', 'onSuccess', 'onAfter']) {
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

    static getCookie(cookieName) {
        const cookies = document.cookie.split(';');

        for (const cookieString of cookies) {
            if (cookieString === '')
                continue;
            var [name, value] = cookieString.split('=');
            name = name.trim();
            value = value.trim();
            if (name === cookieName)
                return value;
        }
        return false;
    }


    static getUserdata() {
        const jsonValue = Helpers.getCookie('userdata');
        if (jsonValue === false)
            return false;
        
        try {
            var json = JSON.parse(decodeURIComponent(jsonValue));
        }
        catch {
            return false;
        }

        return json;
    }
}


const fromServer = {
    userdata: Helpers.getUserdata()
}
document.addEventListener('DOMContentLoaded', () => {
    LoginForm.initAll();
    RegisterForm.initAll();
    Logout.initAll();
    MessageForm.initAll();
});