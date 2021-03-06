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
            myname: this.Username || '',
            connected: false
            // history: this.chatHistory()
        };
        this.checkInfo();
    }
    checkInfo() {
        if (this.data.myname) this.socket.emit('add user',this.data.myname);
    }
    bindEvent() {
        const {loginPage,chatPage,nameInput,chatdom,sendBtn,loginBtn,editdom} = this.el;
        // const {myname,connected} = this.data;
        loginBtn.addEventListener("click",e => {
            this.data.myname = this.Username = nameInput.value;
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
        });
        this.socket.on('user joined', ({username,numUsers}) => {
            chatdom.innerHTML += `
            <p class="chat-tip">
                ${username} 进入了聊天室，在线人数：${numUsers}
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
        this.socket.on('user left', ({username,numUsers}) => {
            chatdom.innerHTML += `
            <p class="chat-tip">
                ${username} 退出了聊天室，在线人数：${numUsers}
            </p>`;
        });
    }
    get Username() {
        return localStorage.getItem('username');
    }
    set Username(val) {
        localStorage.setItem('username',val);
    }
    get chatHistory() {
        return localStorage.getItem(`${this.Username}-chathistory`)
    }
    set chatHistory(val) {
        localStorage.setItem(`${this.Username}-chathistory`,val);
    }
}
new Chat();