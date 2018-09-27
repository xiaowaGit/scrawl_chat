
let LINK_ID = 1;
// Link 表示每个用户的连接
module.exports = class Link {
    constructor(conn) {
        this.conn = conn;
        this.link_id = LINK_ID;
        LINK_ID++;
        this.link_name = "Link"+this.link_id;

        conn.on("text",this.onmessage.bind(this));
        conn.on("close",this.onclose.bind(this));
        conn.on("error",this.onerror.bind(this));

        this.name = null;
        this.sex = null;
        this.init = false;
        this.message_call = {};
        this.close_call = {};
        this.error_call = {};
        this.init_call = {};
        this.is_connect = true;
    }

    set_message(key,fun) {
        this.message_call[key] = fun;
    }
    set_close(key,fun) {
        this.close_call[key] = fun;
    }
    set_error(key,fun) {
        this.error_call[key] = fun;
    }
    set_init(key,fun) {
        this.init_call[key] = fun;
    }

    onmessage (str) {  //收到文本消息
        /*
            client <----------------- server

            {opt:"init", name:"tony", sex:"男"}     //角色初始化命令
            {opt:"chat", info:"你好！我是小娃。"}    //对话命令
            {opt:"scrawl", color:0xFF0000, width:5, line:[[0,0],[10,10],[20,20],[30,30]]}   //涂鸦命令

            client -----------------> server

            {opt:"init", name:"tony", sex:"男"}     //角色初始化命令
            {opt:"chat", info:"你好！我是小娃。"}    //对话命令
            {opt:"scrawl", color:0xFF0000, width:5, line:[[0,0],[10,10],[20,20],[30,30]]}   //涂鸦命令
        */

        let obj = JSON.parse(str);
        let { opt } = obj;
        if (opt == "init" && !this.init) {
            let {name, sex} = obj;
            this.name = name;
            this.sex = sex;
            this.init = true;
            for (const key in this.init_call) { // 依次调用回调函数
                if (this.init_call&&this.init_call.hasOwnProperty(key)) {
                    let call = this.init_call[key];
                    call(obj);
                }
            }
        }else if (opt != "init") {
            for (const key in this.message_call) { // 依次调用回调函数
                if (this.message_call&&this.message_call.hasOwnProperty(key)) {
                    let call = this.message_call[key];
                    call(obj);
                }
            }
        }
    }

    onclose (code, reason) {    //连接关闭
        this.is_connect = false;
        for (const key in this.close_call) { // 依次调用回调函数
            if (this.close_call && this.close_call.hasOwnProperty(key)) {
                let call = this.close_call[key];
                call(code, reason);
            }
        }
        console.log(this.link_name+"关闭连接");
    }

    onerror (code, reason) {    //连接错误
        this.is_connect = false;
        for (const key in this.error_call) { // 依次调用回调函数
            if (this.error_call && this.error_call.hasOwnProperty(key)) {
                let call = this.error_call[key];
                call(code, reason);
            }
        }
        console.log(this.link_name+"异常关闭");
    }

    send (str) {    //发送字符串
        if (this.is_connect) this.conn.sendText(str);
    }

    destroy() {     //销毁对象
        if(this.is_connect) this.conn.close();
        this.message_call = null;
        this.close_call = null;
        this.error_call = null;
        this.init_call = null;
        // this.conn.removeAllListeners();
        this.conn = null;
    }
};