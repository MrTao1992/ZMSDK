import SDKApp from "../SDKBase/SDKApp";

//公共的style标签，以供异步的css写入
let publicStyle: any = document.createElement('style');
publicStyle.setAttribute('class', 'sdk-controller-public');
document.getElementsByTagName('head')[0].appendChild(publicStyle);
publicStyle.addStyle = function (styleText: string) {
    this.appendChild(document.createTextNode(styleText));
};
(window as any).publicStyle = publicStyle;

declare interface Dictionary<T> {
    [key: string]: T;
}

export interface SDKControllerUIComponent {
    name: string;
    classname: string;
    hide?: boolean;
    texture: Dictionary<string>;
    defaultStatus: string;
    type: string;
    desc: string;
}

export let assetsRoot = 'https://rs.hdkj.zmlearn.com/atlas/controller/';
if (window['SDKConfig'] &&
    window['SDKConfig'].assetsRoot &&
    window['SDKConfig'].assetsRoot != '') {
    assetsRoot = window['SDKConfig'].assetsRoot;
}

export let SDKControllerUIComponents: Dictionary<SDKControllerUIComponent> = {
    backward: {
        name: 'backward',
        classname: 'button-backward',
        texture: {
            normal: assetsRoot + 'backward_normal.png',
            unabled: assetsRoot + 'backward_unabled.png',
        },
        defaultStatus: 'normal',
        type: 'button',
        desc: '快退',
    },
    forward: {
        name: 'forward',
        classname: 'button-forward',
        texture: {
            normal: assetsRoot + 'forward_normal.png',
            unabled: assetsRoot + 'forward_unabled.png',
        },
        defaultStatus: 'normal',
        type: 'button',
        desc: '快退',
    },
    play: {
        name: 'play',
        classname: 'button-play',
        texture: {
            play: assetsRoot + 'play_normal.png',
            pause: assetsRoot + 'pause_normal.png',
        },
        defaultStatus: 'play',
        type: 'button',
        desc: '播放',
    },
    prev: {
        name: 'prev',
        classname: 'button-prev',
        texture: {
            normal: assetsRoot + 'btn_pre.png',
            unabled: assetsRoot + 'btn_pre.png',
        },
        defaultStatus: 'normal',
        type: 'button',
        desc: '前一条',
    },
    next: {
        name: 'next',
        classname: 'button-next',
        texture: {
            normal: assetsRoot + 'btn_next.png',
            unabled: assetsRoot + 'btn_next.png',
        },
        defaultStatus: 'normal',
        type: 'button',
        desc: '后一条',
    },
    prevCheck: {
        name: 'prevCheck',
        classname: 'button-prev-check',
        texture: {
            normal: assetsRoot + 'prev_check_normal.png',
            unabled: assetsRoot + 'prev_check_unabled.png',
        },
        defaultStatus: 'normal',
        type: 'button',
        desc: '前一关',
    },
    nextCheck: {
        name: 'nextCheck',
        classname: 'button-next-check',
        texture: {
            normal: assetsRoot + 'next_check_normal.png',
            unabled: assetsRoot + 'next_check_unabled.png',
        },
        defaultStatus: 'normal',
        type: 'button',
        desc: '下一关',
    },
    controll: {
        name: 'controll',
        classname: 'checkbox-controll',
        texture: {
            teacher: assetsRoot + 'btn_teacher.png',
            student: assetsRoot + 'btn_student.png',
        },
        defaultStatus: 'teacher',
        type: 'checkbox',
        desc: '控制权切换'
    },
    split: {
        name: 'split',
        classname: 'checkbox-split',
        texture: {
            full: assetsRoot + 'btn_full.png',
            split: assetsRoot + 'btn_shrink.png',
        },
        defaultStatus: 'full',
        type: 'checkbox',
        desc: '分屏切换'
    },
    offline: {
        name: 'offline',
        classname: 'image-offline',
        texture: {
            normal: assetsRoot + 'img_tips.png',
            unabled: assetsRoot + 'img_tips@2x.png'
        },
        defaultStatus: 'normal',
        type: 'button',
        desc: '离线'
    },
    refresh: {
        name: 'refresh',
        classname: 'button-refresh',
        texture: {
            normal: assetsRoot + 'refresh.png',
            unabled: assetsRoot + 'refresh.png',
        },
        defaultStatus: 'normal',
        type: 'button',
        desc: '刷新',
    },
    scale: {
        name: 'scale',
        classname: 'checkbox-scale',
        texture: {
            normal: assetsRoot + 'scaleFull.png',
            full: assetsRoot + 'scaleNormal.png',
        },
        defaultStatus: 'normal',
        type: 'checkbox',
        desc: '分屏缩放'
    },
    audioPlay: {
        name: 'audioPlay',
        classname: 'checkbox-audioPlay',
        texture: {
            normal: assetsRoot + 'audioPlay.png',
            full: assetsRoot + 'audioStop.png',
        },
        defaultStatus: 'normal',
        type: 'checkbox',
        desc: '音频播放'
    },
    switchView:{
        name: 'switchView',
        classname: 'checkbox-switchView',
        texture: {
            normal: assetsRoot + 'switchView.png',
            full: assetsRoot + 'switchView.png',
        },
        defaultStatus: 'normal',
        type: 'checkbox',
        desc: '音频测评视图切换'
    },
    videoReplay: {
        name: 'videoReplay',
        classname: 'button-videoReplay',
        texture: {
            normal: assetsRoot + 'btn_refresh.png',
            unabled: assetsRoot + 'btn_refresh.png',
        },
        defaultStatus: 'normal',
        type: 'button',
        desc: '视频重播',
    },
};

export class DOMComponent {
    public domElem: any;
    public status: string;
    public name: string;
    public top: any;
    public enable: boolean = true;

    constructor(comp: SDKControllerUIComponent, top: any) {
        this.top = top;
    }
    public show() {
        this.domElem.style.display = 'block';
    }
    public hide() {
        this.domElem.style.display = 'none';
    }
    // 设置为可用
    public setStatus(status: string) {
        if (this.status) {
            this.domElem.classList.remove(this.status);
        }
        this.domElem.classList.add(status);
        this.status = status;
    }

    public setEnable(value: boolean) {
        this.enable = value;
    }
}
export class DOMButton extends DOMComponent {
    private lastClickTime: number;
    // 目前的按钮只有normal 和 unabled
    constructor(comp: SDKControllerUIComponent, top: any) {
        super(comp, top);
        this.lastClickTime = new Date().getTime();
        const button = document.createElement('div');
        button.classList.add('sdk-ui-button');
        button.classList.add(comp.classname);
        button.classList.add(comp.defaultStatus);
        this.status = comp.defaultStatus;
        this.name = comp.name;
        for (const p in comp.texture) {
            if (p) {
                publicStyle.addStyle(
                    `.sdk-ui-button.${comp.classname}.${p}{background-image:url('${comp.texture[p]}')}`
                );
            }
        }
        this.domElem = button;
        // click是移动端和pc端通用的
        this.domElem.addEventListener(
            'click',
            function (e: any) {
                const now: number = new Date().getTime();
                if (now - this.lastClickTime < 300) {
                    return;
                }
                this.lastClickTime = now;
                this.onClick(e);
                this.onMouseOver();
            }.bind(this),
            false
        );
        this.domElem.addEventListener(
            'mouseover',
            function (e: any) {
                this.onMouseOver(e);
            }.bind(this),
            false
        );
        this.domElem.addEventListener(
            'mouseout',
            function (e: any) {
                this.onMouseOut(e);
            }.bind(this),
            false
        );
    }
    // e 原生事件
    public onClick(e: any) {
        console.log('组件' + this.name);
    }
    public onMouseOver(e: any) { }
    public onMouseOut(e: any) { }
}

export class DOMCheckbox extends DOMComponent {
    private statusList: string[] = [];
    private lastClickTime: number;
    constructor(comp: SDKControllerUIComponent, top: any) {
        super(comp, top);
        this.lastClickTime = new Date().getTime();
        const checkbox = document.createElement('div');
        checkbox.classList.add('sdk-ui-checkbox');
        checkbox.classList.add(comp.classname);
        checkbox.classList.add(comp.defaultStatus);
        this.status = comp.defaultStatus;
        this.name = comp.name;
        for (const p in comp.texture) {
            if (p) {
                this.statusList.push(p);
                publicStyle.addStyle(
                    `.sdk-ui-checkbox.${comp.classname}.${p}{background-image:url('${comp.texture[p]}')}`
                );
            }
        }
        this.domElem = checkbox;
        this.domElem.addEventListener(
            'click',
            function (e: any) {
                if (!this.enable) {
                    return;
                }
                const now: number = new Date().getTime();
                if (now - this.lastClickTime < 1000) {
                    return;
                }
                this.lastClickTime = now;
                let next = this.statusList.indexOf(this.status);
                if (next < this.statusList.length - 1) {
                    next++;
                } else {
                    next = 0;
                }
                next = this.statusList[next];
                this.setStatus(next);
                this.onClick(e);
                this.onMouseOver();
            }.bind(this),
            false
        );
        this.domElem.addEventListener(
            'mouseover',
            function (e: any) {
                this.onMouseOver(e);
            }.bind(this),
            false
        );
        this.domElem.addEventListener(
            'mouseout',
            function (e: any) {
                this.onMouseOut(e);
            }.bind(this),
            false
        );
    }
    // e 原生事件
    public onClick(e: any) {
        console.log('组件' + this.name);
    }
    public onMouseOver(e: any) { }
    public onMouseOut(e: any) { }
}

export class DomDropList {
    public domElem: any;
    public status: string;
    public top: any;
    public select: number = 0;
    public dropName: HTMLSpanElement;
    public data: Array<string>;
    public items:Array<HTMLDivElement> = [];

    constructor(data: Array<string>, top: any) {
        this.top = top;
        this.data = data;
        let dropdown = document.createElement('div');
        dropdown.classList.add('dropdown');
        let dropbtn = document.createElement('div');
        dropbtn.classList.add('dropbtn');
        this.dropName = document.createElement('span');
        let img = document.createElement('img');
        img.classList.add('dropImg');
        dropbtn.appendChild(this.dropName);
        dropbtn.appendChild(img);
        dropdown.appendChild(dropbtn);
        let dropdownContent = document.createElement('div');
        dropdownContent.classList.add('dropdown-content');
        dropdown.appendChild(dropdownContent);
        let index = 0;
        let count = data.length;
        for (index = 0; index < count; index++) {
            let item = document.createElement('div');
            item.id = index + '';
            item.innerText = data[index];
            dropdownContent.appendChild(item);
            this.items.push(item);
            item.addEventListener(
                'click',
                function (e: any) {
                    let itemIndex = parseInt(e.currentTarget.id);
                    this.setSelect(itemIndex);
                    this.onClick(e, this.select);
                    dropdownContent.style.display = 'none';
                    setTimeout(() => {
                        dropdownContent.style.removeProperty('display');
                    }, 100);
                }.bind(this),
                false
            );
        }
        this.domElem = dropdown;
        this.top.appendChild(dropdown);
        this.setSelect(this.select);
    }

    public show() {
        this.domElem.style.display = 'block';
    }

    public hide() {
        this.domElem.style.display = 'none';
    }

    public setSelect(index: number) {
        if (index >= 0 && index <= this.data.length) {
            this.select = index;
            this.dropName.innerText = this.data[this.select];
        }
    }

    public onClick(e: any, select:number) {
        console.log('droplist');
    }
}

/**
 * 设置固有style
 */
export function setDefaultStyle() {
    if (SDKApp.instance().thirdInterface.isZMG2()) {
        let style = SDKApp.instance().thirdInterface.defaultStyle();
        if(style.length > 0) {
            publicStyle.addStyle(style);
            return;
        }
    }

    publicStyle.addStyle(`
        /*这些是按钮ui的style*/
        #controllCenter{position:fixed;width:100%;height:100%;left:0;top:0;z-index:1001;pointer-events:none;}
        #extraContainer{position:fixed;width:100%;height:100%;left:0;top:0;z-index:1002;pointer-events:none;}
        #pageContainer{position:absolute;background-position:0;width:2rem;height:0.5rem;left:50%;margin-left:-0.35rem;bottom:0rem;}
        .pageCodeRed{background:#f00;border-radius:50%;width:10px;height:10px;float:left;margin-left:4px;margin-top:-1px}
        .pageCodeGray{border-radius:50%;width:8px;height:8px;width:8px;background:rgba(255,255,255,0.9);opacity:0.4;float:left;margin-left:4px}
        .sdk-ui-button{position:absolute;background-size:100% 100%;transition:transform 0.2s;pointer-events:auto;}
        .sdk-ui-button:not(.unabled):hover{transform:scale(1.15);}
        .sdk-ui-button:not(.unabled):active{transform:scale(0.9);}
        .button-prev{background-position:0;width:1rem;height:1rem;top:50%;left:0rem;margin-top:-0.5rem}
        .button-next{background-position:0;width:1rem;height:1rem;top:50%;right:0rem;margin-top:-0.5rem}
        .button-prev-check{background-position:0;width:1rem;height:1rem;top:50%;left:0.15rem;margin-top:-0.5rem}
        .button-next-check{background-position:0;width:1rem;height:1rem;top:50%;right:0.15rem;margin-top:-0.5rem}
        .button-play{width:0.91rem;height:0.94rem;left:50%;top:50%;margin-top:-0.47rem;pointer-events:none;}
        .button-pause{width:0.91rem;height:0.94rem;left:50%;bottom:-0.37rem;}
        .button-backward{width:0.91rem;height:0.94rem;left:50%;margin-left:-1.78rem;bottom:-0.37rem;}
        .button-forward{width:0.91rem;height:0.94rem;left:50%;margin-left:1.78rem;bottom:-0.37rem;}
        .sdk-ui-checkbox{position:absolute;background-size:100% 100%;pointer-events:auto;}
        .checkbox-split{width:2.272rem;height:1rem;right:0.15rem;top:0.17rem;}
        .checkbox-controll{width:2.272rem;height:1rem;right:3rem;top:0.17rem;}
        .image-offline{width:6rem;height:1.2rem;left:0rem;bottom:0.3rem;pointer-events:none;}
        .dropdown{position: absolute;display:inline-block;width:3.5rem;height:0.6rem;right:3rem;top:0.25rem}
        .dropbtn{background-color: #313541;font-size: 0.4rem; height:0.6rem; border: none;border-radius: 15px;pointer-events: auto;text-align: center;}
        .dropbtn span{line-height: 0.4rem; height: 0.4rem;color:#B7BED3}
        .dropImg{content: url(https://rs.hdkj.zmlearn.com/atlas/controller/icon_dropdown@2x.png);width:0.5rem;height:0.5rem;position:absolute;top:0.03rem;}
        .dropdown-content{display: none;position: absolute;background-color: #292D3B;pointer-events: auto; font-size:0.4rem;left:0.2rem}
        .dropdown-content div { color: #B7BED3; padding: 2px 2px;text-decoration: none;display: block; width:3rem; text-align: center}
        .dropdown-content div:hover {background-color: #4F5360; color:#FFFFFF}
        .dropdown:hover .dropdown-content {display: block;}
        .dropdown:hover .dropbtn{background-color: #313541;}
        .dropdown:hover .dropImg{content: url(https://rs.hdkj.zmlearn.com/atlas/controller/icon_dropup@2x.png);width:0.5rem;height:0.6rem;position:absolute;top:0.03rem;}
        .button-videoReplay{background-position:0;width:0.9rem;height:0.9rem;top:50%;left:0.1rem;margin-top:-2.65rem}
        /*这些是分屏ui的style*/
        body{overflow:hidden;background-color:transparent !important;}
        #childIframes{width:19.2rem;height:10.8rem;position:absolute;left:50%;top:50%;margin-left:-9.6rem;margin-top:-5.4rem;}
        .inspliting{background-color:#2F2F37;}
        .inspliting canvas{display:none}
        .inspliting video{display:none}
        .sdk-child{position:absolute;display:none;}
        .sdk-child-iframe{position:absolute;outline:none;border:none;z-index:0;background-color:#ccc;}
        .sdk-child-name{left:0.55rem;color:#fff;position:absolute;bottom:0;z-index:4}
        .sdk-child-bg{left:0;position:absolute;z-index:3;width:100%;background:black;opacity:0.6}
        .sdk-child-event{position:absolute;width:100%;height:100%;left:0;right:0;z-index:1;}
        .button-refresh,.checkbox-scale,.checkbox-switchView{z-index:3}
        .checkbox-scale:not(.unabled):hover{transform:scale(1.15);}
        .checkbox-scale:not(.unabled):active{transform:scale(0.9);}
        .checkbox-switchView:not(.unabled):hover{transform:scale(1.15);}
        .checkbox-switchView:not(.unabled):active{transform:scale(0.9);}

        .split1 .sdk-child:nth-child(1){display:block}
        .split1 .sdk-child{width:16rem;height:9rem;left:50%;top:50%;margin-left:-8rem;margin-top:-4.5rem}
        .split1 .sdk-child-iframe{width:16rem;height:9rem;}
        .split1 .sdk-child-name{line-height:0.8rem;height:0.8rem;font-size:0.36rem;text-indent:0.1rem;}
        .split1 .button-refresh{position:absolute;bottom:0.15rem;left:0.1rem;width:0.5rem;height:0.5rem;}
        .split1 .checkbox-scale{position:absolute;bottom:0.15rem;right:0.1rem;width:0.5rem;height:0.5rem;}
        .split1 .checkbox-switchView{position:absolute;bottom:0.15rem;right:0.75rem;width:0.5rem;height:0.5rem;}
        .split1 .sdk-child-bg{height:0.8rem;bottom:0rem;}

        .split2 .sdk-child:nth-child(1),.split2 .sdk-child:nth-child(2){display:block}
        .split2 .sdk-child{width:8.88rem;height:5rem;left:50%;top:50%;margin-left:0.19rem;margin-top:-2.5rem}
        .split2 .sdk-child:nth-child(1){margin-left:-9.07rem;}
        .split2 .sdk-child-iframe{width:8.88rem;height:5rem;}
        .split2 .sdk-child-name{line-height:0.5rem;height:0.5rem;font-size:0.26rem;text-indent:0.03rem;}
        .split2 .button-refresh{position:absolute;bottom:0.05rem;left:0.1rem;width:0.4rem;height:0.4rem;}
        .split2 .checkbox-scale{position:absolute;bottom:0.05rem;right:0.1rem;width:0.4rem;height:0.4rem;}
        .split2 .checkbox-switchView{position:absolute;bottom:0.05rem;right:0.65rem;width:0.4rem;height:0.4rem;}
        .split2 .sdk-child-bg{height:0.5rem;bottom:0rem;}

        .split3 .sdk-child:nth-child(1),.split3 .sdk-child:nth-child(2),.split3 .sdk-child:nth-child(3){display:block}
        .split3 .sdk-child{width:8rem;height:4.5rem;left:50%;top:50%;margin-top:0.2rem;}
        .split3 .sdk-child:nth-child(1), .split3 .sdk-child:nth-child(2){margin-top:-4.7rem;}
        .split3 .sdk-child:nth-child(3){margin-top:0.2rem;}
        .split3 .sdk-child:nth-child(1), .split3 .sdk-child:nth-child(3){margin-left:-8.2rem;}
        .split3 .sdk-child:nth-child(2){margin-left:0.2rem;}
        .split3 .sdk-child-iframe{width:8rem;height:4.5rem;}
        .split3 .sdk-child-name{line-height:0.5rem;height:0.5rem;font-size:0.26rem;text-indent:0.02rem;}
        .split3 .button-refresh{position:absolute;bottom:0.05rem;left:0.1rem;width:0.4rem;height:0.4rem;}
        .split3 .checkbox-scale{position:absolute;bottom:0.05rem;right:0.1rem;width:0.4rem;height:0.4rem;}
        .split3 .checkbox-switchView{position:absolute;bottom:0.05rem;right:0.65rem;width:0.4rem;height:0.4rem;}
        .split3 .sdk-child-bg{height:0.5rem;bottom:0rem;}

        .split4 .sdk-child:nth-child(1), .split4 .sdk-child:nth-child(2), .split4 .sdk-child:nth-child(3), .split4 .sdk-child:nth-child(4){display:block}
        .split4 .sdk-child{width:8rem;height:4.5rem;left:50%;top:50%;margin-top:0.2rem;}
        .split4 .sdk-child:nth-child(1), .split4 .sdk-child:nth-child(2){margin-top:-4.7rem;}
        .split4 .sdk-child:nth-child(3), .split4 .sdk-child:nth-child(4){margin-top:0.2rem;}
        .split4 .sdk-child:nth-child(1), .split4 .sdk-child:nth-child(3){margin-left:-8.2rem;}
        .split4 .sdk-child:nth-child(2), .split4 .sdk-child:nth-child(4){margin-left:0.2rem;}
        .split4 .sdk-child-iframe{width:8rem;height:4.5rem;}
        .split4 .sdk-child-name{line-height:0.5rem;height:0.5rem;font-size:0.26rem;text-indent:0.02rem;}
        .split4 .button-refresh{position:absolute;bottom:0.05rem;left:0.1rem;width:0.4rem;height:0.4rem;}
        .split4 .checkbox-scale{position:absolute;bottom:0.05rem;right:0.1rem;width:0.4rem;height:0.4rem;}
        .split4 .checkbox-switchView{position:absolute;bottom:0.05rem;right:0.65rem;width:0.4rem;height:0.4rem;}
        .split4 .sdk-child-bg{height:0.5rem;bottom:0rem;}

        .split5 .sdk-child:nth-child(1), .split5 .sdk-child:nth-child(2), .split5 .sdk-child:nth-child(3), .split5 .sdk-child:nth-child(4), .split5 .sdk-child:nth-child(5){display:block}
        .split5 .sdk-child{width:5.2rem;height:3.28rem;left:50%;top:50%;}
        .split5 .sdk-child:nth-child(1), .split5 .sdk-child:nth-child(2), .split5 .sdk-child:nth-child(3){margin-top:-3.48rem;}
        .split5 .sdk-child:nth-child(4), .split5 .sdk-child:nth-child(5){margin-top:0.2rem;}
        .split5 .sdk-child:nth-child(1){margin-left:-8.36rem;}
        .split5 .sdk-child:nth-child(2){margin-left:-2.6rem;}
        .split5 .sdk-child:nth-child(3){margin-left:3.16rem;}
        .split5 .sdk-child:nth-child(4){margin-left:-5.48rem;}
        .split5 .sdk-child:nth-child(5){margin-left:0.28rem;}
        .split5 .sdk-child-iframe{width:5.2rem;height:2.88rem;}
        .split5 .sdk-child-name{line-height:0.4rem;height:0.4rem;font-size:0.24rem;text-indent:0.02rem;}

        .split6 .sdk-child:nth-child(1), .split6 .sdk-child:nth-child(2), .split6 .sdk-child:nth-child(3), .split6 .sdk-child:nth-child(4), .split6 .sdk-child:nth-child(5), .split6 .sdk-child:nth-child(6){display:block}
        .split6 .sdk-child{width:5.2rem;height:3.28rem;left:50%;top:50%;}
        .split6 .sdk-child:nth-child(1), .split6 .sdk-child:nth-child(2), .split6 .sdk-child:nth-child(3){margin-top:-3.48rem;}
        .split6 .sdk-child:nth-child(4), .split6 .sdk-child:nth-child(5), .split6 .sdk-child:nth-child(6){margin-top:0.2rem;}
        .split6 .sdk-child:nth-child(1), .split6 .sdk-child:nth-child(4){margin-left:-8.36rem;}
        .split6 .sdk-child:nth-child(2), .split6 .sdk-child:nth-child(5){margin-left:-2.6rem;}
        .split6 .sdk-child:nth-child(3), .split6 .sdk-child:nth-child(6){margin-left:3.16rem;}
        .split6 .sdk-child-iframe{width:5.2rem;height:2.88rem;}
        .split6 .sdk-child-name{line-height:0.4rem;height:0.4rem;font-size:0.24rem;text-indent:0.02rem;}
    `);
}

/**
 * 设置观察者style
 */
export function setObserverStyle() {
    if (SDKApp.instance().thirdInterface.isZMG2()) {
        let style = SDKApp.instance().thirdInterface.observerStyle();
        if(style.length > 0) {
            publicStyle.addStyle(style);
            return;
        }
    }

    publicStyle.addStyle(`
        /*setObserverStyle 这些是按钮ui的style*/
        #controllCenter{position:fixed;width:100%;height:100%;left:0;top:0;z-index:1001;pointer-events:auto;}
        #extraContainer{position:fixed;width:100%;height:100%;left:0;top:0;z-index:1002;pointer-events:auto;}
        #pageContainer{position:absolute;background-position:0;width:2rem;height:0.5rem;left:50%;margin-left:-0.35rem;bottom:0rem;}
        .pageCodeRed{background:#f00;border-radius:50%;width:10px;height:10px;float:left;margin-left:4px;margin-top:-1px}
        .pageCodeGray{border-radius:50%;width:8px;height:8px;width:8px;background:rgba(255,255,255,0.9);opacity:0.4;float:left;margin-left:4px}
        .sdk-ui-button{position:absolute;background-size:100% 100%;transition:transform 0.2s;pointer-events:none;}
        .sdk-ui-button:not(.unabled):hover{transform:scale(1.15);}
        .sdk-ui-button:not(.unabled):active{transform:scale(0.9);}
        .button-prev{background-position:0;width:1rem;height:1rem;top:50%;left:0rem;margin-top:-0.5rem}
        .button-next{background-position:0;width:1rem;height:1rem;top:50%;right:0rem;margin-top:-0.5rem}
        .button-prev-check{background-position:0;width:1rem;height:1rem;top:50%;left:0.15rem;margin-top:-0.5rem}
        .button-next-check{background-position:0;width:1rem;height:1rem;top:50%;right:0.15rem;margin-top:-0.5rem}
        .button-play{width:0.91rem;height:0.94rem;left:50%;top:50%;margin-top:-0.47rem;pointer-events:none;}
        .button-pause{width:0.91rem;height:0.94rem;left:50%;bottom:-0.37rem;}
        .button-backward{width:0.91rem;height:0.94rem;left:50%;margin-left:-1.78rem;bottom:-0.37rem;}
        .button-forward{width:0.91rem;height:0.94rem;left:50%;margin-left:1.78rem;bottom:-0.37rem;}
        .sdk-ui-checkbox{position:absolute;background-size:100% 100%;pointer-events:none;}
        .checkbox-split{width:2.272rem;height:1rem;right:0.15rem;top:0.17rem;}
        .checkbox-controll{width:2.272rem;height:1rem;right:3rem;top:0.17rem;}
        .image-offline{width:6rem;height:1.2rem;left:0rem;bottom:0.3rem;pointer-events:none;}
        .button-videoReplay{background-position:0;width:0.9rem;height:0.9rem;top:50%;left:0.1rem;margin-top:-2.65rem}
        /*这些是分屏ui的style*/
        body{overflow:hidden;background-color:transparent !important;}
        #childIframes{width:19.2rem;height:10.8rem;position:absolute;left:50%;top:50%;margin-left:-9.6rem;margin-top:-5.4rem;}
        .inspliting{background-color:#2F2F37;}
        .inspliting canvas{display:none}
        .inspliting video{display:none}
        .sdk-child{position:absolute;display:none;}
        .sdk-child-iframe{position:absolute;outline:none;border:none;z-index:0;background-color:#ccc;}
        .sdk-child-name{color:#fff;position:absolute;bottom:0;z-index:4}
        .sdk-child-bg{left:0;background:black;position:absolute;z-index:3;width:100%;opacity:0.6}
        .checkbox-scale,.checkbox-switchView{z-index:3}
        .checkbox-scale:not(.unabled):hover{transform:scale(1.15);}
        .checkbox-scale:not(.unabled):active{transform:scale(0.9);}
        .checkbox-switchView:not(.unabled):hover{transform:scale(1.15);}
        .checkbox-switchView:not(.unabled):active{transform:scale(0.9);}

        .split1 .sdk-child:nth-child(1){display:block}
        .split1 .sdk-child{width:16rem;height:9rem;left:50%;top:50%;margin-left:-8rem;margin-top:-4.5rem}
        .split1 .sdk-child-iframe{width:16rem;height:9rem;}
        .split1 .sdk-child-name{line-height:0.8rem;height:0.8rem;font-size:0.36rem;text-indent:0.1rem;}
        .split1 .checkbox-scale{position:absolute;bottom:0.15rem;right:0.1rem;width:0.5rem;height:0.5rem;}
        .split1 .sdk-child-bg{height:0.8rem;bottom:0rem;}
        .split1 .checkbox-switchView{position:absolute;bottom:0.15rem;right:0.75rem;width:0.5rem;height:0.5rem;}

        .split2 .sdk-child:nth-child(1),.split2 .sdk-child:nth-child(2){display:block}
        .split2 .sdk-child{width:8.88rem;height:5rem;left:50%;top:50%;margin-left:0.19rem;margin-top:-2.5rem}
        .split2 .sdk-child:nth-child(1){margin-left:-9.07rem;}
        .split2 .sdk-child-iframe{width:8.88rem;height:5rem;}
        .split2 .sdk-child-name{line-height:0.5rem;height:0.5rem;font-size:0.26rem;text-indent:0.03rem;}
        .split2 .checkbox-scale{position:absolute;bottom:0.05rem;right:0.1rem;width:0.4rem;height:0.4rem;}
        .split2 .sdk-child-bg{height:0.5rem;bottom:0rem;}
        .split2 .checkbox-switchView{position:absolute;bottom:0.05rem;right:0.65rem;width:0.4rem;height:0.4rem;}

        .split3 .sdk-child:nth-child(1),.split3 .sdk-child:nth-child(2),.split3 .sdk-child:nth-child(3){display:block}
        .split3 .sdk-child{width:8rem;height:4.5rem;left:50%;top:50%;margin-top:0.2rem;}
        .split3 .sdk-child:nth-child(1), .split3 .sdk-child:nth-child(2){margin-top:-4.7rem;}
        .split3 .sdk-child:nth-child(3){margin-top:0.2rem;}
        .split3 .sdk-child:nth-child(1), .split3 .sdk-child:nth-child(3){margin-left:-8.2rem;}
        .split3 .sdk-child:nth-child(2){margin-left:0.2rem;}
        .split3 .sdk-child-iframe{width:6rem;height:4.5rem;}
        .split3 .sdk-child-name{line-height:0.5rem;height:0.5rem;font-size:0.26rem;text-indent:0.02rem;}
        .split3 .checkbox-scale{position:absolute;bottom:0.05rem;right:0.1rem;width:0.4rem;height:0.4rem;}
        .split3 .sdk-child-bg{height:0.5rem;bottom:0rem;}
        .split3 .checkbox-switchView{position:absolute;bottom:0.05rem;right:0.65rem;width:0.4rem;height:0.4rem;}

        .split4 .sdk-child:nth-child(1), .split4 .sdk-child:nth-child(2), .split4 .sdk-child:nth-child(3), .split4 .sdk-child:nth-child(4){display:block}
        .split4 .sdk-child{width:8rem;height:4.5rem;left:50%;top:50%;margin-top:0.2rem;}
        .split4 .sdk-child:nth-child(1), .split4 .sdk-child:nth-child(2){margin-top:-4.7rem;}
        .split4 .sdk-child:nth-child(3), .split4 .sdk-child:nth-child(4){margin-top:0.2rem;}
        .split4 .sdk-child:nth-child(1), .split4 .sdk-child:nth-child(3){margin-left:-8.2rem;}
        .split4 .sdk-child:nth-child(2), .split4 .sdk-child:nth-child(4){margin-left:0.2rem;}
        .split4 .sdk-child-iframe{width:8rem;height:4.5rem;}
        .split4 .sdk-child-name{line-height:0.5rem;height:0.5rem;font-size:0.26rem;text-indent:0.02rem;}
        .split4 .checkbox-scale{position:absolute;bottom:0.05rem;right:0.1rem;width:0.4rem;height:0.4rem;}
        .split4 .sdk-child-bg{height:0.5rem;bottom:0rem;}
        .split4 .checkbox-switchView{position:absolute;bottom:0.05rem;right:0.65rem;width:0.4rem;height:0.4rem;}

        .split5 .sdk-child:nth-child(1), .split5 .sdk-child:nth-child(2), .split5 .sdk-child:nth-child(3), .split5 .sdk-child:nth-child(4), .split5 .sdk-child:nth-child(5){display:block}
        .split5 .sdk-child{width:5.2rem;height:3.28rem;left:50%;top:50%;}
        .split5 .sdk-child:nth-child(1), .split5 .sdk-child:nth-child(2), .split5 .sdk-child:nth-child(3){margin-top:-3.48rem;}
        .split5 .sdk-child:nth-child(4), .split5 .sdk-child:nth-child(5){margin-top:0.2rem;}
        .split5 .sdk-child:nth-child(1){margin-left:-8.36rem;}
        .split5 .sdk-child:nth-child(2){margin-left:-2.6rem;}
        .split5 .sdk-child:nth-child(3){margin-left:3.16rem;}
        .split5 .sdk-child:nth-child(4){margin-left:-5.48rem;}
        .split5 .sdk-child:nth-child(5){margin-left:0.28rem;}
        .split5 .sdk-child-iframe{width:5.2rem;height:2.88rem;}
        .split5 .sdk-child-name{line-height:0.4rem;height:0.4rem;font-size:0.24rem;text-indent:0.02rem;}

        .split6 .sdk-child:nth-child(1), .split6 .sdk-child:nth-child(2), .split6 .sdk-child:nth-child(3), .split6 .sdk-child:nth-child(4), .split6 .sdk-child:nth-child(5), .split6 .sdk-child:nth-child(6){display:block}
        .split6 .sdk-child{width:5.2rem;height:3.28rem;left:50%;top:50%;}
        .split6 .sdk-child:nth-child(1), .split6 .sdk-child:nth-child(2), .split6 .sdk-child:nth-child(3){margin-top:-3.48rem;}
        .split6 .sdk-child:nth-child(4), .split6 .sdk-child:nth-child(5), .split6 .sdk-child:nth-child(6){margin-top:0.2rem;}
        .split6 .sdk-child:nth-child(1), .split6 .sdk-child:nth-child(4){margin-left:-8.36rem;}
        .split6 .sdk-child:nth-child(2), .split6 .sdk-child:nth-child(5){margin-left:-2.6rem;}
        .split6 .sdk-child:nth-child(3), .split6 .sdk-child:nth-child(6){margin-left:3.16rem;}
        .split6 .sdk-child-iframe{width:5.2rem;height:2.88rem;}
        .split6 .sdk-child-name{line-height:0.4rem;height:0.4rem;font-size:0.24rem;text-indent:0.02rem;}
    `);
}
