

import {Network} from "./framework/NetWork"
const {ccclass, property} = cc._decorator;

@ccclass
export class ChatModel {

    private static instance: ChatModel = null;
    private et: cc.EventTarget = null;
    private host:string = "ws://47.106.107.185:8001";

    // 对方的名字和性别
    public name:string = "未知";
    public sex:string = "女";

    public constructor() {
        if (ChatModel.instance) {
            throw (new Error(" ChatModel.instance already exist"));
        }

        this.et = cc['NetTarget'];
        
        this.et.on('net', this.netData, this);
        this.et.on('netstart', this.netStart, this);
        this.et.on('neterror', this.netError, this);
        this.et.on('netclose', this.netClose, this);

        ChatModel.instance = this;
        console.log("涂鸦聊天Model初始化");
    }
    
    public static getInstance() { //获得单例
        if (!ChatModel.instance) {
            return new ChatModel();
        }
        return ChatModel.instance;
    }

    public send(cmd: any) {
        cc['Network'].send(cmd);
    }

    public connect() {
        cc['Network'].connect(this.host)
    }

    public close() {
        if (cc['Network'].isConnected) {
            console.log("关闭联网");
            if(cc['Network']){
                 cc['Network'].close()
            }
        }
    }
    
    netData(event) {
        this.et.emit("dummynet", event);
    }
    
    netStart(event) {
        var cmd = event.detail;
        this.et.emit("dummynetstart", cmd);
    }
    
    netError(event) {
        var cmd = event.detail;
        this.et.emit("dummyneterror", cmd);
    }
    
    netClose(event) {
        var cmd = event.detail;
        this.et.emit("dummynetclose", cmd);
    }
}
