

import {ChatModel} from "./ChatModel"

const {ccclass, property} = cc._decorator;

@ccclass
export class ChatCtrl {

    private static instance: ChatCtrl = null;
    private et: cc.EventTarget = null;
    private chat_model: ChatModel;

    // 自己的名字和性别 ， 自己的名字不用做显示，只用作初始化
    private name: string;
    private sex: string;
    
    public constructor() {
        if (ChatCtrl.instance) {
            throw (new Error(" ChatCtrl.instance already exist"));
        }

        this.chat_model = ChatModel.getInstance();

        this.et = cc['NetTarget'];
        
        this.et.on('dummynet', this.netData, this);
        this.et.on('dummynetstart', this.netStart, this);
        this.et.on('dummyneterror', this.netError, this);
        this.et.on('dummynetclose', this.netClose, this);

        ChatCtrl.instance = this;
        console.log("涂鸦聊天Ctrl初始化");
    }

    public static getInstance() { //获得单例
        if (!ChatCtrl.instance) {
            return new ChatCtrl();
        }
        return ChatCtrl.instance;
    }

    init(name:string,sex:string) { // 初始化自己
        this.chat_model.connect();
        this.name = name;
        this.sex = sex;
    }

    back() { // 退出对话界面
        this.chat_model.close();
    }
    
    netData(event) {
        var cmd = event;
        let {opt} = cmd;
        if (opt == "init") {
            this.et.emit("init", cmd);
        }else if (opt == "chat") {
            this.et.emit("chat", cmd);
        }else if (opt == "scrawl") {
            this.et.emit("scrawl", cmd);
        }
    }
    
    netStart(event) {
        let init = {opt:"init", name:this.name, sex:this.sex}
        this.chat_model.send(init);
    }
    
    netError(event) {
        this.et.emit("error", null);
    }
    
    netClose(event) {
        this.et.emit("error", null);
    }
}
