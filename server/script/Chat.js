
let CHAT_ID = 1;
// Chat 游戏逻辑
module.exports = class Chat {
    
    constructor(player1,player2) {
        this.chat_id = CHAT_ID;
        CHAT_ID++;
        this.chat_name = "Chat"+this.chat_id;
        this.player1 = player1;
        this.player2 = player2;
        this.init();
    }

    init() {    //初始化游戏
        this.over_call = {};
        this.is_game = true;
        this.player1.set_close(this.chat_name,this.player1_close.bind(this));
        this.player2.set_close(this.chat_name,this.player2_close.bind(this));
        this.start_game();
    }

    player1_close() {
        let self = this;
        for (const key in self.over_call) {
            if (self.over_call.hasOwnProperty(key)) {
                let fun = self.over_call[key];
                fun(this.player2,this);
            }
        }
        this.destroy();
    }

    player2_close() {
        let self = this;
        for (const key in self.over_call) {
            if (self.over_call.hasOwnProperty(key)) {
                let fun = self.over_call[key];
                fun(this.player1,this);
            }
        }
        this.destroy();
    }

    set_over(key,fun) {
        this.over_call[key] = fun;
    }

    start_game() {  //开始游戏
        let self = this;
        let init1 = {opt:"init", name:this.player1.name, sex:this.player1.sex};
        let init2 = {opt:"init", name:this.player2.name, sex:this.player2.sex};
        this.player1.send(JSON.stringify(init2));
        this.player2.send(JSON.stringify(init1));

        this.player1.set_message(this.chat_name,this.player1_message.bind(this));
        this.player2.set_message(this.chat_name,this.player2_message.bind(this));
    }

    player1_message(obj) {
        this.player2.send(JSON.stringify(obj));
    }

    player2_message(obj) {
        this.player1.send(JSON.stringify(obj));
    }

    destroy() {     //销毁对象
        if(this.player1.is_connect)this.player1.set_close(this.chat_name,null);
        if(this.player2.is_connect)this.player2.set_close(this.chat_name,null);
        if(this.player1.is_connect)this.player1.set_message(this.chat_name,null);
        if(this.player2.is_connect)this.player2.set_message(this.chat_name,null);
        this.player1 = null;
        this.player2 = null;
        this.over_call = null;
        this.is_game = false;
    }
};