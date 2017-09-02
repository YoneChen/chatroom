class Chat {
    constructor() {
        this.socket = io();
        this.el = {
            loginPage: document.querySelector('.login-page'),
            chatPage: document.querySelector('.chat-page'),
            nameInput: document.querySelector('.nickname-input'),
            editdom: document.querySelector('.edit-box'),
            chatdom: document.querySelector('.chat-frame'),
            sendBtn: document.querySelector('.send-btn'),
            loginBtn: document.querySelector(".login-btn")
        }
        this.bindEvent();
        this.data = {
            myname: '',
            connected: false
            // history: this.chatHistory()
        }
    }
    bindEvent() {
        const {loginPage,chatPage,nameInput,chatdom,sendBtn,loginBtn,editdom} = this.el;
        // const {myname,connected} = this.data;
        loginBtn.addEventListener("click",e => {
            this.data.myname = nameInput.value;
            this.socket.emit('add user',this.data.myname);
        });
        sendBtn.addEventListener('click',e => {
            sendMsg();
        });
        editdom.addEventListener('keypress',e => {
            if (e.code == "Enter") {
                e.preventDefault();
                sendMsg();
            }
        });
        const sendMsg = () => {
            const message = editdom.value;
            if (!message || !message.trim()) return;
            this.socket.emit('new message',message);
            console.log(message);
            chatdom.innerHTML += `
            <div class="chat-item me">
                <div class="user">${this.data.myname}：</div>
                <div class="message">${message}</div>
            </div>`;
            editdom.value = '';
        }
        this.socket.on('login', () => {
            this.data.connected = true;
            loginPage.setAttribute('hide','');
            chatPage.removeAttribute('hide');
        })
        this.socket.on('user joined', ({username}) => {
            chatdom.innerHTML += `
            <p class="chat-tip">
                ${username} 进入了聊天室
            </p>`;
        });
        this.socket.on('new message',msg => {
            const {username,message} = msg;
            chatdom.innerHTML += `
            <div class="chat-item">
                <div class="user">${username}：</div>
                <div class="message">${message}</div>
            </div>`;

        });
    }
    get chatHistory() {
        return localStorage.getItem(`${this.data.myname}-chathistory`)
    }
    set chatHistory(val) {
        localStorage.setItem(`${this.data.myname}-chathistory`,val);
    }
}
new Chat();