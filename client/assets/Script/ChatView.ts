import {ChatCtrl} from "./ChatCtrl"
import {ChatModel} from "./ChatModel"

const {ccclass, property} = cc._decorator;

@ccclass
export default class ChatView extends cc.Component {

    // 起始页面 ui
    @property(cc.Node)
    node_start:cc.Node = null;
    @property(cc.Label)
    lbl_info: cc.Label = null;
    @property(cc.EditBox)
    edit_name:cc.EditBox = null;
    @property(cc.Toggle)
    toe_man:cc.Toggle = null;
    @property(cc.Toggle)
    toe_woman:cc.Toggle = null;
    @property(cc.Button)
    btn_start:cc.Button = null;


    // 主游戏 ui
    @property(cc.Node)
    node_main:cc.Node = null;
    @property(cc.Button)
    btn_back:cc.Button = null;
    @property(cc.Button)
    btn_change:cc.Button = null;
    @property(cc.Label)
    lbl_name:cc.Label = null;
    @property(cc.Graphics)
    node_grs:cc.Graphics = null;
    @property(cc.Graphics)
    node_grs2:cc.Graphics = null;
    // 主游戏 --------> 涂鸦
    @property(cc.Node)
    node_scrawl:cc.Node = null;
    @property(cc.Button)
    btn_clean:cc.Button = null;
    @property(cc.Toggle)
    toe_fine:cc.Toggle = null;
    @property(cc.Toggle)
    toe_middle:cc.Toggle = null;
    @property(cc.Toggle)
    toe_wide:cc.Toggle = null;

    
    @property(cc.Toggle)
    toe_red:cc.Toggle = null;
    @property(cc.Toggle)
    toe_violet:cc.Toggle = null;
    @property(cc.Toggle)
    toe_green:cc.Toggle = null;
    @property(cc.Toggle)
    toe_yellow:cc.Toggle = null;
    @property(cc.Toggle)
    toe_blue:cc.Toggle = null;
    @property(cc.Toggle)
    toe_cyan:cc.Toggle = null;
    @property(cc.Toggle)
    toe_pink:cc.Toggle = null;
    @property(cc.Toggle)
    toe_lavender:cc.Toggle = null;
    @property(cc.Toggle)
    toe_ondine:cc.Toggle = null;
    @property(cc.Toggle)
    toe_yellowish:cc.Toggle = null;
    @property(cc.Toggle)
    toe_smoke:cc.Toggle = null;
    @property(cc.Toggle)
    toe_nattierblue:cc.Toggle = null;
    // 主游戏 --------> 聊天
    @property(cc.Node)
    node_chat:cc.Node = null;
    @property(cc.EditBox)
    edit_info:cc.EditBox = null;
    @property(cc.Button)
    btn_send:cc.Button = null;
    @property(cc.ScrollView)
    scl_info:cc.ScrollView = null;
    @property(cc.Prefab)
    item: cc.Prefab = null;


    private chat_ctrl: ChatCtrl;
    private chat_model: ChatModel;
    private et: cc.EventTarget = null;
    private point_list = [];
    private no_line: boolean = false;

    private line_w: number;
    private color_b: cc.Color;
    // 定义颜色属性
    private red:cc.Color = cc.color(0xFF,0x00,0x00);
    private violet:cc.Color = cc.color(0xFF,0x00,0xFF);
    private green:cc.Color = cc.color(0x00,0xFF,0x00);
    private yellow:cc.Color = cc.color(0xFF,0xFF,0x00);
    private blue:cc.Color = cc.color(0x00,0x00,0xFF);
    private cyan:cc.Color = cc.color(0x00,0xFF,0xFF);
    private pink:cc.Color = cc.color(0xFF,0x88,0x88);
    private lavender:cc.Color = cc.color(0xFF,0x88,0xFF);
    private ondine:cc.Color = cc.color(0x88,0xFF,0x88);
    private yellowish:cc.Color = cc.color(0xFF,0xFF,0x88);
    private smoke:cc.Color = cc.color(0x88,0x88,0xFF);
    private nattierblue:cc.Color = cc.color(0x88,0xFF,0xFF);

    // 定义线宽
    private fine:number = 3;
    private middle:number = 10;
    private wide:number = 20;


    // 定义聊天info 数据
    private base_h:number = 20;
    private total_h:number = 0;


    start () {
        //引用model 和 控制器
        this.chat_ctrl = ChatCtrl.getInstance()
        this.chat_model = ChatModel.getInstance()

        this.et = cc['NetTarget'];
        
        this.et.on('init', this.init, this);
        this.et.on('chat', this.chat, this);
        this.et.on('scrawl', this.scrawl, this);
        this.et.on('error', this.error, this);

        this.goto_Start();
        
        this.node_grs.node.on(cc.Node.EventType.TOUCH_START,this.grs_start,this);
        this.node_grs.node.on(cc.Node.EventType.TOUCH_MOVE,this.grs_move,this);
        this.node_grs.node.on(cc.Node.EventType.TOUCH_END,this.grs_end,this);
        this.node_grs.node.on(cc.Node.EventType.TOUCH_CANCEL,this.grs_cancel,this);
        // __T:
        // this.add_info({opt:"chat",info:"我是一个大傻逼！"},false);
    }

    goto_Main() {
        let name:string,sex:string;
        name = this.edit_name.string;
        if (this.toe_man.isChecked) {
            sex = '男'
        }else if (this.toe_woman.isChecked) {
            sex = '女'
        }
        if (name.length < 1 ) {
            return
        }
        this.node_main.active = true;
        this.node_start.active = false;
        this.chat_ctrl.init(name,sex);
    }

    goto_Start() {
        this.chat_ctrl.back();
        this.node_main.active = false;
        this.node_start.active = true;
    }
    
    init(event) {
        var cmd = event;
        let {name,sex} = cmd;
        this.lbl_name.string = name + "(" + sex + ")";
        this.base_h = 0;
        this.total_h = 0;
        this.scl_info.content.removeAllChildren();
        // 清理涂鸦
        this.node_grs.clear();
        this.node_grs2.clear();
    }
    
    chat(event) {
        var cmd = event;
        this.add_info(cmd,false);
    }
    
    scrawl(event) {
        var cmd = event;
        let {color,width,line} = cmd;
        if (color == "#ffffff") {
            this.node_grs.clear();
            this.node_grs2.clear();
            return;
        }
        let color_b:cc.Color;
        if (color == 'ff0000') {
            color_b = this.red;
        }else if (color == 'ff00ff') {
            color_b = this.violet;
        }else if (color == '00ff00') {
            color_b = this.green;
        }else if (color == 'ffff00') {
            color_b = this.yellow;
        }else if (color == '0000ff') {
            color_b = this.blue;
        }else if (color == '00ffff') {
            color_b = this.cyan;
        }else if (color == 'ff8888') {
            color_b = this.pink;
        }else if (color == 'ff88ff') {
            color_b = this.lavender;
        }else if (color == '88ff88') {
            color_b = this.ondine;
        }else if (color == 'ffff88') {
            color_b = this.yellowish;
        }else if (color == '8888ff') {
            color_b = this.smoke;
        }else if (color == '88ffff') {
            color_b = this.nattierblue;
        }
        for (let index = 0; index < line.length; index++) {
            const element = line[index];
            let [o_x,o_y] = element;
            if (index == 0) {
                // 绘制准备
                this.node_grs2.lineWidth = width;
                this.node_grs2.strokeColor = color_b;
                this.node_grs2.moveTo(o_x,o_y);
            }else {
                this.node_grs2.lineTo(o_x,o_y);
                this.node_grs2.stroke();
            }
        }
    }
    
    error(event) {
        this.add_info({opt:"chat",info:"连接关闭！请返回起始页重新开始！"},true);
    }

    add_info(cmd:any,is_self:boolean) {
        let item = cc.instantiate(this.item);
        let item_h = item.getComponent('ChatItem').set_info(cmd,is_self,this.total_h);
        this.total_h += item_h;
        this.scl_info.content.addChild(item);
        this.scl_info.content.height = this.total_h + this.base_h;
    }

    goto_chat() {
        this.node_chat.active = true;
        this.node_scrawl.active = false;
    }

    goto_scrawl() {
        this.node_chat.active = false;
        this.node_scrawl.active = true;
    }

    ///  按钮事件  ///////////////////


    onStartClicked() {
        this.goto_Main();
    }
    
    onBackClicked() {
        this.goto_Start();
    }
    
    onChangeClicked() {
        if (this.node_chat.active) {
            this.goto_scrawl();
        }else if (this.node_scrawl.active) {
            this.goto_chat();
        }
    }

    onSendClicked() {
        let info:string = this.edit_info.string;
        if (info.length < 1) {
            return
        }
        let cmd = {opt:"chat",info:info};
        this.chat_model.send(cmd);
        this.add_info(cmd,true);
        this.edit_info.string = "";
    }

    onCleanClicked() {
        this.node_grs.clear();
        this.node_grs2.clear();
        this.chat_model.send({opt:"scrawl",color:"#ffffff",width:1,line:[]});
    }

    grs_start(event) {
        if (!this.node_scrawl.active) {
            return false;
        }
        let o_x = event.touch._point.x;
        let o_y = event.touch._point.y;
        this.point_list.push([o_x,o_y]);
        let line_w:number;
        if (this.toe_fine.isChecked) {
            line_w = this.fine;
        }else if (this.toe_middle.isChecked) {
            line_w = this.middle;
        }else if (this.toe_wide.isChecked) {
            line_w = this.wide;
        }
        let color_b:cc.Color;
        if (this.toe_red.isChecked) {
            color_b = this.red;
        }else if (this.toe_violet.isChecked) {
            color_b = this.violet;
        }else if (this.toe_green.isChecked) {
            color_b = this.green;
        }else if (this.toe_yellow.isChecked) {
            color_b = this.yellow;
        }else if (this.toe_blue.isChecked) {
            color_b = this.blue;
        }else if (this.toe_cyan.isChecked) {
            color_b = this.cyan;
        }else if (this.toe_pink.isChecked) {
            color_b = this.pink;
        }else if (this.toe_lavender.isChecked) {
            color_b = this.lavender;
        }else if (this.toe_ondine.isChecked) {
            color_b = this.ondine;
        }else if (this.toe_yellowish.isChecked) {
            color_b = this.yellowish;
        }else if (this.toe_smoke.isChecked) {
            color_b = this.smoke;
        }else if (this.toe_nattierblue.isChecked) {
            color_b = this.nattierblue;
        }
        this.line_w = line_w;
        this.color_b = color_b;
        // 绘制准备
        this.node_grs.lineWidth = this.line_w;
        this.node_grs.strokeColor = this.color_b;
        this.node_grs.moveTo(o_x,o_y);
        this.no_line = false;
        return true;
    }

    grs_move(event) {
        if (!this.node_scrawl.active || this.no_line) {
            return false;
        }
        let o_x = event.touch._point.x;
        let o_y = event.touch._point.y;
        // 修正 bug 
        let p_len:number = this.point_list.length;
        let last_pot = this.point_list[p_len-1];
        let [e_x,e_y] = last_pot;
        if (o_x == e_x && o_y == e_y) return;
        
        this.point_list.push([o_x,o_y]);
        this.node_grs.lineTo(o_x,o_y);
        try {
            this.node_grs.stroke();
        } catch (error) {
            this.no_line = true;
        }
    }

    grs_end(event) {
        if (!this.node_scrawl.active) {
            return false;
        }
        let color_hex:string = this.color_b.toHEX("#rrggbb");
        this.chat_model.send({opt:"scrawl",color:color_hex,width:this.line_w,line:this.point_list});
        this.point_list = [];
        
    }

    grs_cancel(event) {
        // if (!this.node_scrawl.active) {
        //     return false;
        // }
        // let color_hex:string = this.color_b.toHEX("#rrggbb");
        // this.chat_model.send({opt:"scrawl",color:color_hex,width:this.line_w,line:this.point_list});
        // this.point_list = [];
    }
}
