
let Chat = require("./Chat");
let manager = null;
// MateManager 负责配对
module.exports = class MateManager {

    constructor() {
        this.uninit_pool = {};  //未初始化的对象池 Link 对象
        this.select_pool = {};  //搜寻玩家的对象池 Link 对象
        this.game_pool = {};    //游戏中的对象池,Chat 对象
        this.name = "MateManager";
    }

    static getInstance() {  //获得单例
        if (!manager) {
            manager = new MateManager();
        }
        return manager;
    }

    into_link(link) {   //加入连接
        let self = this;
        let init = function () {
            self.uninit_pool[link.link_name] = null;
            self.select_pool[link.link_name] = link;
            self.mate_link();
        }
        this.uninit_pool[link.link_name] = link;
        link.set_init(this.name,init);
        // 处理close 消息
        let close = function () {
            self.uninit_pool[link.link_name] = null;
            self.select_pool[link.link_name] = null;
            // link.set_init(self.name,null);
            // link.set_close(self.name,null);
            link.destroy();
        }
        link.set_close(this.name,close);
    }

    mate_link() {   //配对搜索池连接
        let self = this;
        let player1 = null;
        let player2 = null;
        let object = self.select_pool;
        let back = function (player,chat) {
            self.select_pool[player.link_name] = player;
            self.game_pool[chat.chat_name] = null;
            self.mate_link();
        }
        for (const key in object) {
            if (object.hasOwnProperty(key)) {
                let player = object[key];
                if (!player1) {
                    player1 = player;
                }else{
                    player2 = player;
                    let chat = new Chat(player1,player2);
                    chat.set_over(this.name,back);
                    this.game_pool[chat.chat_name] = chat;
                    this.select_pool[player1.link_name] = null;
                    this.select_pool[player2.link_name] = null;
                    break;
                }
            }
        }
    }

    destroy() {     //销毁对象
        this.uninit_pool = null;  //未初始化的对象池
        this.select_pool = null;  //搜寻玩家的对象池
        this.game_pool = null;    //游戏中的对象池
    }
};