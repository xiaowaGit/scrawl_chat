
const {ccclass, property} = cc._decorator;

@ccclass
export default class ChatItem extends cc.Component {

    @property(cc.Sprite)
    spr_self: cc.Sprite = null;
    @property(cc.Sprite)
    spr_party: cc.Sprite = null;
    @property(cc.Node)
    node_chat_info: cc.Node = null;
    @property(cc.Sprite)
    spr_chat_info: cc.Sprite = null;
    @property(cc.Label)
    lbl_chat_info: cc.Label = null;

    private back_h:number = 40; // 文字背景高，默认40
    private info_y:number = 0;  // 聊天框的初始位置
    
    start () {
    }

    set_info(cmd:any,is_self:boolean,has_height:number):number { // 返回这条信息所占的高度
        let {opt,info} = cmd;
        if (opt != "chat") throw new Error("聊天信息错误！");

        if (is_self) { // 是自己发送的消息
            this.spr_self.node.active = true;
            this.node_chat_info.active = true;
            this.spr_party.node.active = false;
            this.lbl_chat_info.string = info;
            this.node.y = -1 * has_height;
            this.node.x = 0;
        }else{ //对方发来的信息
            this.spr_party.node.active = true;
            this.node_chat_info.active = true;
            this.spr_self.node.active = false;
            this.lbl_chat_info.string = info;
            this.node.y = -1 * has_height;
            this.node.x = 0;
        }

        let len:number = info.length; // 16个汉字为一行
        let has_h:number = (Math.floor(len / 16) + 1) * 25; // 字体高25，这是占的总高
        let move_h:number = has_h - 25; // 需要移动的高度
        this.spr_chat_info.node.height = this.back_h + move_h;
        this.node_chat_info.y = this.info_y - move_h;

        let total_h:number = this.back_h + move_h + 50;
        return total_h > 100 ? total_h:100;
    }

}
