const {ccclass, property} = cc._decorator;
let instance = null;

@ccclass
export class Network {
    private isInit: boolean = false;
    private socket: WebSocket = null;
    private host: string = null;
    private static instance: any = null;
    private closedByClient: boolean = false;
    private USEGZIP = false;

    public constructor() {
        cc['NetTarget'] = new cc.EventTarget();
        console.log("初始化消息队列");
    }

    public get readyState(): number {
        if (this.socket == null) {
            return WebSocket.CLOSED;
        }
        return this.socket.readyState;
    }

    public get isConnected(): boolean {
        return this.readyState == WebSocket.OPEN;
    }

    public get isClosedByClient(): boolean {
        return this.closedByClient;
    }

    private Utf8ArrayToStr(array) {
        var out, i, len, c;
        var char2, char3;

        out = "";
        len = array.length;
        i = 0;
        while (i < len) {
            c = array[i++];
            switch (c >> 4) {
                case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
                    // 0xxxxxxx
                    out += String.fromCharCode(c);
                    break;
                case 12: case 13:
                    // 110x xxxx   10xx xxxx
                    char2 = array[i++];
                    out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                    break;
                case 14:
                    // 1110 xxxx  10xx xxxx  10xx xxxx
                    char2 = array[i++];
                    char3 = array[i++];
                    out += String.fromCharCode(((c & 0x0F) << 12) |
                        ((char2 & 0x3F) << 6) |
                        ((char3 & 0x3F) << 0));
                    break;
            }
        }

        return out;
    }
    public ab2str(buf) {
        return String.fromCharCode.apply(null, new Uint8Array(buf));
    }

    public connect(url: string) {
        var self = this;
        if (self.isInit) {
            return;
        }
        self.closedByClient = false;
        let host = "";
        if (url.indexOf("ws://") == -1) {
            host = "ws://" + url;
        } else {
            host = url;
        }
        self.host = host;
        self.socket = new WebSocket(host);

        self.socket.onopen = (evt) => {
            cc.log('Network onopen...', evt);
            self.isInit = true;
            cc['NetTarget'].emit("netstart", evt);
        }

        self.socket.onmessage = (evt) => {
            // console.log("onmessageonmessageonmessage",evt.data);
            if (this.USEGZIP) {
            } else {
                let packet: Object = JSON.parse(evt.data);
                self.appandeMsg(packet);
            }

        }
        self.socket.onerror = (evt) => {
            cc.log('Network onerror...');
            cc['NetTarget'].emit("neterror", evt);
        };
        self.socket.onclose = (evt) => {
            cc.log('Network onclose...1');
            evt['closeByClient'] = self.closedByClient;
            cc['NetTarget'].emit("netclose", evt);
            this.isInit = false;
        }
    }

    private str2UTF8(str) {
        var bytes = new Array();
        var len, c;
        len = str.length;
        for (var i = 0; i < len; i++) {
            c = str.charCodeAt(i);
            if (c >= 0x010000 && c <= 0x10FFFF) {
                bytes.push(((c >> 18) & 0x07) | 0xF0);
                bytes.push(((c >> 12) & 0x3F) | 0x80);
                bytes.push(((c >> 6) & 0x3F) | 0x80);
                bytes.push((c & 0x3F) | 0x80);
            } else if (c >= 0x000800 && c <= 0x00FFFF) {
                bytes.push(((c >> 12) & 0x0F) | 0xE0);
                bytes.push(((c >> 6) & 0x3F) | 0x80);
                bytes.push((c & 0x3F) | 0x80);
            } else if (c >= 0x000080 && c <= 0x0007FF) {
                bytes.push(((c >> 6) & 0x1F) | 0xC0);
                bytes.push((c & 0x3F) | 0x80);
            } else {
                bytes.push(c & 0xFF);
            }
        }
        return bytes;
    }

    public sendmc(c: string, m: string, data: any) {
        var obj: Object = {
            "c": c,
            "m": m,
            "data": data
        };

        if (data) {
            // data.ctx_seq = this.ctx_seq;
        }

        this.send(obj)
    }

    public send(cmd: any) {
        if (this.USEGZIP) {
        } else {
            var str = JSON.stringify(cmd)
            this.socket.send(str);
        }
    }

    public close() {
        console.log("关闭网络");
        if (this.socket) {
            console.log("关闭网络1");
            this.closedByClient = true;
            this.socket.close();
            this.socket.onclose = null;
            this.socket.onerror = null;
            this.socket.onmessage = null;
            this.socket.onopen = null;
            this.socket = null;
            this.isInit = false;
        }
    }

    private appandeMsg(data) {
        cc.log("----------------------->", data)
        data['src'] = 'tcp'
        if(data['m'] =='kick'){
            cc['NetTarget'].emit("kick", data);
        }else{
            cc['NetTarget'].emit("net", data);
        }
    }
}

instance = new Network();
cc['Network'] = instance ? instance : new Network();
