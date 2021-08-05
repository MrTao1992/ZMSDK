import SDKUserInfo from '../SDKLogics/SDKUserInfo';
import * as SDKLogicsCore from '../SDKLogics/SDKLogicsCore';
import {
    assetsRoot,
    SDKControllerUIComponents,
    DOMCheckbox,
} from './SDKControlUI';
// import * as SVGA from 'svgaplayerweb';
import { VoiceAnswerState } from '../SDKLogics/SDKVoiceAnswerInfo';
import * as SDKEnum from '../SDKConst/SDKEnum';
import SDKApp from '../SDKBase/SDKApp';
import { VOICE_CLICK_CHANGE_PROGRESS, VOICE_CLICK_PLAY_AUDIO, VOICE_CLICK_PLAY_PAUSE } from '../SDKConst/SDKRecordEventConst';

//公共的style标签，以供异步的css写入
let voiceStyle: any = document.createElement('style');
voiceStyle.setAttribute('class', 'voice-controll');
document.getElementsByTagName('head')[0].appendChild(voiceStyle);
voiceStyle.addStyle = function (styleText: string) {
    this.appendChild(document.createTextNode(styleText));
};
voiceStyle.addStyle(`
    body{font-family: "PingFangSC-Regular", "PingFang SC", "Microsoft YaHei", "思源黑体 CN Normal", "Helvetica Neue", Helvetica, Arial, "Hiragino Sans GB", "Heiti SC", sans-serif;}
    .voice-root{position: absolute;overflow: hidden;width: 100%;height: 100%;left: 0rem;top: 0rem; background-color:#FFFFFF;z-index: 2;}
    .voice-head{width: 100%;height: 1.2rem;background: #FFFFFF;box-shadow:0px 1px 0px 0px #eeeeee;display: -webkit-flex;display: flex;flex-direction: row;justify-content: left;align-items: center;font-size:0.45rem;color:#666666;}
    .voice-head-title{padding-left:20px}
    .voice-head-titleValue{padding-left:8px}
    .voice-head-privateChat{display: -webkit-flex;display: flex;flex-direction: row;justify-content: center;align-items: center;width:100%}
    .voice-head-privateChat-img{content:url(${assetsRoot}privateChat.png); width:0.8rem; height:0.8rem}
    .voice-head-privateChat-tip{color:#FF4F52}
    .voice-voiceAnswer{display: -webkit-flex;display: flex;flex-direction: row;justify-content: left;align-items: center;width:auto; padding-left:10px; padding-top:10px}
    .voice-voiceAnswerState{background: #F9F9F9;border-radius: 14px;display: -webkit-flex;display: flex;flex-direction: row;justify-content: center;align-items: center;}
    .voice-voiceAnswerStateImg{content:url(${assetsRoot}speechtopic.png); width:0.8rem; height:0.8rem; padding-left:10px;padding-right:10px;}
    .answeringSVAG{width:0.8rem; height:0.8rem; margin-left:10px;margin-right:8px; background-size:100% 100%}
    .voice-voiceAnswerStateTip{color:#ffffff; font-size:0.4rem;padding-right:10px;}
    .voice-voiceAnswerPlayController{background: #F9F9F9;border-radius: 14px;display: -webkit-flex;display: flex;flex-direction: row;justify-content: center;align-items: center; height:0.8rem}
    .checkbox-audioPlay{width:0.5rem;height:0.5rem;margin-left:10px;position: inherit;}
    .voice-voiceAnswerPlay-progressCon{width:5rem;padding-bottom:0.1rem;height:0.3rem}
    .voice-voiceAnswerPlay-progressBack{width:5rem; height:0.1rem; background: #000000; border-radius: 3px;opacity: 0.1; position: absolute;margin-top: 0.15rem;}
    .voice-voiceAnswerPlay-progress{width:5rem; height:0.1rem; background: #EF4C4F; border-radius: 3px;position: absolute;margin-top: 0.15rem;}
    .voice-voiceAnswerPlay-progressBar{width:0.3rem; height:0.3rem; border-radius: 50%;position: absolute; background: #ff0000;margin-top: 0.04rem;}
    .voice-voiceAnswerPlay-tip{font-size:0.4rem; color: #666666;margin-right:10px;margin-left:10px;}
    .voice-voiceText{padding:10px;overflow-x: scroll;height: 7rem;padding-top:5px;}
    .voice-voiceText-bg{background: #F9F9F9; border-radius: 4px;}
    .voice-voiceText-content{color:#333333; font-size:0.4rem;margin:10px;padding-top:10px;padding-bottom:10px;}
    .voice-voiceText-keyword{background: #FFDC75;}
    .voice-answer-countDown{z-index:1003;background:#000000; width:5.8rem; height:0.6rem;position:absolute;left:50%;top:0.25rem;margin-left:-3.5rem;font-size:0.3rem;display: -webkit-flex;display: flex;flex-direction: row;justify-content: center;align-items: center;border-radius: 21px;line-height: 0.4rem;}
    .voice-answer-countDown-title{color:#FFFFFF;}
    .voice-answer-countDown-timeImg{content:url(${assetsRoot}count_down.png);width:0.5rem}
    .voice-answer-countDown-time{color:#FFFFFF; padding-left: 5px;}
    .voice-answer-countDown-tip{color: rgba(183, 190, 211, 0.8); padding-left: 5px;}
    .voice-answer-notify{width:100%;height:100%;background:#2A2C37;position:absolute;left:0rem;top:0rem;display:-webkit-flex;display:flex;flex-direction:column;justify-content:center;align-items:center;}
    .voice-answer-notify-img{content:url(${assetsRoot}lowDeviceVersion.png);width:5rem; height:5rem;margin-top:-2rem}
    .voice-answer-notify-tip{color:#B7BED3; font-size:0.3rem;}
    /*test  2=0.55*/
    .split2 .voice-head{height: 0.66rem;font-size:0.25rem;}
    .split2 .voice-head-privateChat-img{width:0.44rem; height:0.44rem;}
    .split2 .voice-voiceAnswer{padding-left:5.5px; padding-top:5.5px}
    .split2 .voice-voiceAnswerStateImg{width:0.44rem; height:0.44rem;}
    .split2 .answeringSVAG{width:0.44rem; height:0.44rem; margin-left:10px; margin-right:8px;}
    .split2 .voice-voiceAnswerStateTip{font-size:0.22rem;}
    .split2 .voice-voiceAnswerPlayController{height:0.44rem;};
    .split2 .checkbox-audioPlay{width:0.275rem;height:0.275rem;}
    .split2 .voice-voiceAnswerPlay-tip{font-size:0.22rem;}
    .split2 .voice-voiceText{padding:5.5px; height: 3.85rem;padding-top:2.75px;}
    .split2 .voice-voiceText-content{font-size:0.22rem;margin:5.5px;padding-top:5.5px;padding-bottom:5.5px;}
    .split2 .voice-answer-notify-img{width:2.75rem; height:2.75rem; margin-top:-1.1rem}

    .split3 .voice-head{height: 0.66rem;font-size:0.25rem;}
    .split3 .voice-head-privateChat-img{width:0.44rem; height:0.44rem;}
    .split3 .voice-voiceAnswer{padding-left:5.5px; padding-top:5.5px}
    .split3 .voice-voiceAnswerStateImg{width:0.44rem; height:0.44rem;}
    .split3 .answeringSVAG{width:0.44rem; height:0.44rem; margin-left:10px; margin-right:8px;}
    .split3 .voice-voiceAnswerStateTip{font-size:0.22rem;}
    .split3 .voice-voiceAnswerPlayController{height:0.44rem;};
    .split3 .checkbox-audioPlay{width:0.275rem;height:0.275rem;}
    .split3 .voice-voiceAnswerPlay-tip{font-size:0.22rem;}
    .split3 .voice-voiceText{padding:5.5px; height: 3.85rem;padding-top:2.75px;}
    .split3 .voice-voiceText-content{font-size:0.22rem;margin:5.5px;padding-top:5.5px;padding-bottom:5.5px;}
    .split3 .voice-answer-notify-img{width:2.75rem; height:2.75rem; margin-top:-1.1rem}

    .split4 .voice-head{height: 0.66rem;font-size:0.25rem;}
    .split4 .voice-head-privateChat-img{width:0.44rem; height:0.44rem;}
    .split4 .voice-voiceAnswer{padding-left:5.5px; padding-top:5.5px}
    .split4 .voice-voiceAnswerStateImg{width:0.44rem; height:0.44rem;}
    .split4 .answeringSVAG{width:0.44rem; height:0.44rem; margin-left:10px; margin-right:8px;}
    .split4 .voice-voiceAnswerStateTip{font-size:0.22rem;}
    .split4 .voice-voiceAnswerPlayController{height:0.44rem;};
    .split4 .checkbox-audioPlay{width:0.275rem;height:0.275rem;}
    .split4 .voice-voiceAnswerPlay-tip{font-size:0.22rem;}
    .split4 .voice-voiceText{padding:5.5px; height: 3.85rem;padding-top:2.75px;}
    .split4 .voice-voiceText-content{font-size:0.22rem;margin:5.5px;padding-top:5.5px;padding-bottom:5.5px;}
    .split4 .voice-answer-notify-img{width:2.75rem; height:2.75rem; margin-top:-1.1rem}
`);

class BaseView {
    protected _root: HTMLElement;
    protected _container: HTMLDivElement;

    protected _userInfo: SDKUserInfo;
    protected _voiceState: VoiceAnswerState;
    protected _children: Array<BaseView>;
    protected _visible: boolean;

    constructor(root: HTMLElement) {
        this._root = root;
        this._children = [];
        this._visible = true;
        this.initContainer();
        this.initContent();
    }

    protected initContainer() {
    }

    protected initContent(): void {
    }

    protected notifyVisible(value: boolean): void {
        this._children.forEach(element => {
            element.notifyVisible(value);
        });
    }

    public setUserInfo(value: SDKUserInfo) {
        if (!value || (this._userInfo && this._userInfo.userId != value.userId)) {
            this.reset();
        }
        this._userInfo = value;
        this._voiceState = SDKLogicsCore.voiceAnswerInfo.getVoiceAnswerStateById(this._userInfo.userId);
        this._children.forEach(element => {
            element.setUserInfo(value);
        });
    }

    public updateUI() {
        this._children.forEach(element => {
            element.updateUI();
        });
    }

    public show() {
        this._visible = true;
        this._container.style.display = 'block';
        this.notifyVisible(true);
    }

    public hide() {
        this._visible = false;
        this._container.style.display = 'none';
        this.notifyVisible(false);
    }

    public addChild(value: BaseView) {
        this._children.push(value);
    }

    public removeChild(value: BaseView) {
        let index = this._children.indexOf(value);
        if (index != -1) {
            this._children.splice(index, 1);
        }
    }

    public reset() {

    }

    public destroy() {
        this._children.forEach(element => {
            element.destroy();
        });
        this._children = [];
        this._children = null;
        this._root.removeChild(this._container);
        this._root = null;
        this._container = null;
    }
}

export class SDKVoiceAnswerCountDownView extends BaseView {
    private _title: HTMLSpanElement;
    private _img: HTMLImageElement;
    private _time: HTMLSpanElement;
    private _tips: HTMLSpanElement;
    private _timeId;

    constructor(root: HTMLElement) {
        super(root);
    }

    protected initContainer(): void {
        const child = document.createElement('div');
        child.classList.add('voice-answer-countDown');
        this._container = child;
        this._root.appendChild(this._container);
    }

    protected initContent(): void {
        this._title = document.createElement('p');
        this._container.appendChild(this._title);
        this._img = document.createElement('img');
        this._container.appendChild(this._img);
        this._time = document.createElement('p');
        this._container.appendChild(this._time);
        this._tips = document.createElement('p');
        this._container.appendChild(this._tips);

        this._title.innerText = '';//'答题倒计时';
        this._title.classList.add('voice-answer-countDown-title');
        this._img.classList.add('voice-answer-countDown-timeImg');
        this._time.innerText = '00:00';
        this._time.classList.add('voice-answer-countDown-time');
        this._tips.innerText = `(可与学生“语音私聊”)`;//'(答题中,如需与学生沟通请使用“语音私聊”)';
        this._tips.classList.add('voice-answer-countDown-tip');

        this.initTimeUpdate();
    }

    public updateUI() {
        if (SDKLogicsCore.voiceAnswerInfo.isAnswerBegin() && SDKLogicsCore.controllState.isInspection()) {
            let leastTime = SDKLogicsCore.voiceAnswerInfo.countDownEnd - new Date().getTime();
            leastTime = Math.floor(leastTime / 1000);
            if (leastTime > 10) {
                this._time.style.color = '#FFFFFF';
                this._time.innerText = this.formateTime(leastTime);
            } else if (leastTime <= 10 && leastTime > 0) {
                this._time.style.color = '#EF4C4F';
                this._time.innerText = this.formateTime(leastTime);
            } else {
                this._time.style.color = '#EF4C4F';
                this._time.innerText = '答题结束';
            }
            if (!this._visible) {
                this.show();
            }
        } else {
            if (this._visible) {
                this.hide();
            }
        }
    }

    public show() {
        super.show();
        this._container.style.display = 'flex';
    }

    private initTimeUpdate() {
        clearInterval(this._timeId);
        this._timeId = setInterval(this.updateUI.bind(this), 1000);
    }

    public destroy() {
        clearInterval(this._timeId);
        this._timeId = -1;
    }

    /**
     * @param value 数据类型
     * @return 00:00
     */
    private formateTime(value: number): string {
        let min = 0;
        let sec = 0;
        let content: string = '';

        value = Math.floor(value);
        min = Math.floor(value / 60);
        sec = value % 60;
        if (min < 10) {
            content = '0' + min;
        } else {
            content = min.toString();
        }
        if (sec < 10) {
            content += ':0' + sec;
        } else {
            content += ':' + sec;
        }
        return content;
    }
}

class NotifyView extends BaseView {
    private _img: HTMLImageElement;
    private _tip: HTMLSpanElement;

    constructor(root: HTMLDivElement) {
        super(root);
    }

    protected initContainer(): void {
        const child = document.createElement('div');
        child.classList.add('voice-answer-notify');
        this._container = child;
        this._root.appendChild(this._container);
    }

    protected initContent(): void {
        this._img = document.createElement('img');
        this._container.appendChild(this._img);
        this._tip = document.createElement('p');
        this._container.appendChild(this._tip);

        this._img.classList.add('voice-answer-notify-img');
        this._tip.innerText = '该同学使用的端暂未支持实时语音翻译';
        this._tip.classList.add('voice-answer-notify-tip');
        this.hide();
    }

    public show() {
        super.show();
        this._container.style.display = 'flex';
    }

    public updateUI() {
        if (!this._voiceState.isSupport) {
            this.show();
        } else {
            this.hide();
        }
    }
}

class HeadView extends BaseView {
    protected _fluentValue: HTMLSpanElement;
    protected _accuracyValue: HTMLSpanElement;
    protected _scoreValue: HTMLSpanElement;
    protected _privateChat: HTMLDivElement;
    protected _spanContainer: HTMLDivElement;

    constructor(root: HTMLDivElement) {
        super(root);
    }

    protected initContainer(): void {
        const child = document.createElement('div');
        child.classList.add('voice-head');
        child.style.overflowX = 'hidden';
        child.style.overflowY = 'hidden';
        this._container = child;
        this._root.appendChild(this._container);
    }

    protected initContent() {
        this._spanContainer = document.createElement('div');
        this._container.appendChild(this._spanContainer);
        const fluentKey = document.createElement('span');
        fluentKey.classList.add('voice-head-title');
        fluentKey.innerText = '流利度:';
        this._spanContainer.appendChild(fluentKey);
        this._fluentValue = document.createElement('span');
        this._fluentValue.classList.add('voice-head-titleValue');
        this._spanContainer.appendChild(this._fluentValue);
        const accuracyKey = document.createElement('span');
        accuracyKey.classList.add('voice-head-title');
        accuracyKey.innerText = '准确度:';
        this._spanContainer.appendChild(accuracyKey);
        this._accuracyValue = document.createElement('span');
        this._accuracyValue.classList.add('voice-head-titleValue');
        this._spanContainer.appendChild(this._accuracyValue);
        const scoreKey = document.createElement('span');
        scoreKey.classList.add('voice-head-title');
        scoreKey.innerText = '得分:';
        this._spanContainer.appendChild(scoreKey);
        this._scoreValue = document.createElement('span');
        this._scoreValue.classList.add('voice-head-titleValue');
        this._spanContainer.appendChild(this._scoreValue);

        this._privateChat = document.createElement('div');
        this._privateChat.classList.add('voice-head-privateChat');
        const img = document.createElement('img');
        img.classList.add('voice-head-privateChat-img');
        const privateTip = document.createElement('span');
        privateTip.classList.add('voice-head-privateChat-tip');
        privateTip.innerText = '正在与学生语音私聊中，学生语音答题暂停';
        this._privateChat.appendChild(img);
        this._privateChat.appendChild(privateTip);
        this._container.appendChild(this._privateChat);
    }

    public updateUI() {
        super.updateUI();
        if (this._voiceState) {
            this._privateChat.style.display = this._voiceState.isPrivateChat ? 'flex' : 'none';
            this._spanContainer.style.display = this._voiceState.isPrivateChat ? 'none' : 'block';
        }
        this.formateValue(this._fluentValue, this._voiceState.fluent);
        this.formateValue(this._accuracyValue, this._voiceState.accuracy);
        if (this._voiceState.isEnd) {
            if (this._voiceState.isSettlementSuc) {
                this._scoreValue.innerText = Math.floor(this._voiceState.score).toString();
                this._scoreValue.style.color = '#666666';
            } else {
                this._scoreValue.innerText = '-';
                this._scoreValue.style.color = '#CCCCCC';
                this.formateValue(this._fluentValue, SDKEnum.VOICE_EVALUATE.NONE);
                this.formateValue(this._accuracyValue, SDKEnum.VOICE_EVALUATE.NONE);
            }
        } else {
            this._scoreValue.innerText = '-';
            this._scoreValue.style.color = '#CCCCCC';
        }
    }

    private formateValue(ele: HTMLElement, value: SDKEnum.VOICE_EVALUATE) {
        if (value == SDKEnum.VOICE_EVALUATE.NONE) {
            ele.innerText = '-';
            ele.style.color = '#CCCCCC';
        } else if (value == SDKEnum.VOICE_EVALUATE.BAD) {
            ele.innerText = '差';
            ele.style.color = '#EF4C4F';
        } else if (value == SDKEnum.VOICE_EVALUATE.NOMAL) {
            ele.innerText = '一般';
            ele.style.color = '#FF8A00';
        } else if (value == SDKEnum.VOICE_EVALUATE.GOOD) {
            ele.innerText = '优秀';
            ele.style.color = '#23C76C';
        }
    }
}
class Animation {
    private _ele: HTMLElement;
    private _srcs: string[];
    private _isPlay: boolean;
    private _loops: number;
    private _complete: Function;
    private _timeId;
    private _interval: number = 30;
    private _curIndex: number = 0;
    private _runTime: number = 0;
    private _isRotate: boolean = false;
    private _delay: number = 0;
    private _curRotate: number = 0;

    public init(container: HTMLElement, srcs: string[] = [], loops: number = 0) {
        this._ele = container;
        this._srcs = srcs;
        this._loops = loops;
    }

    public loops(value: number) {
        this._loops = value;
    }

    public srcs(value: string[]) {
        if (!this._srcs || value.length != this._srcs.length) {
            //切换动画
            this._curIndex = 0;
            this._runTime = 0;
        }
        this._srcs = value;
    }

    public rotation(isRotation: boolean, delay: number = 0.1) {
        this._isRotate = isRotation;
        this._delay = delay;
    }

    public interval(value: number) {
        this._interval = value;
    }

    public play(index?: number, callBack?: Function) {
        this._isPlay = true;
        this._complete = callBack;
        if (index !== undefined) {
            this._curIndex = index;
        }
        this._runTime = 0;
        clearInterval(this._timeId);
        this._timeId = setInterval(this.updateUI.bind(this), this._interval);
    }

    public stop() {
        if (!this._isPlay) {
            return;
        }
        this._isPlay = false;
        clearInterval(this._timeId);
    }

    public destroy() {
        this._isPlay = false;
        this._complete = null;
        clearInterval(this._timeId);
    }

    protected updateUI() {
        let imgUrl: string;
        imgUrl = this.animationName(this._curIndex);
        this._ele.style.backgroundImage = `url(${imgUrl})`;
        if (this._curIndex >= this._srcs.length - 1) {
            this._runTime++;
            this._curIndex = 0;
        } else {
            this._curIndex++;
        }
        if (this._loops > 0 && this._runTime >= this._loops) {
            this._runTime = 0;
            this._complete && this._complete();
            this.stop();
        }

        if (this._isRotate) {
            this._curRotate += this._delay;
            this._ele.style.transform = `rotate(${this._curRotate}deg)`;
        } else {
            this._ele.style.removeProperty('transform');
        }
    }

    protected animationName(index: number): string {
        if (index < this._srcs.length) {
            let imgUrl = `${assetsRoot}${this._srcs[index]}`;
            return imgUrl;
        }
        return '';
    }
}

class SvagElement {
    // private _eleId: string;
    private _ele: HTMLElement;
    private _player: any;
    private _parser: any;
    private _src: string;
    private _loadFinish: boolean;
    private _isPlay: boolean;
    private _finishCallBack: Function;

    public init(container: HTMLElement, loops: number = 0, clearsAfterStop: boolean = true, fillMode: string = 'Forward') {
        // this._eleId = id;
        // this._ele = document.getElementById(this._eleId.replace('#', ""));
        this._ele = container;
        // this._player = new SVGA.Player(this._eleId);
        // this._player = new SVGA.Player(this._eleId);
        // this._parser = new SVGA.Parser(this._ele);
        // this._player = new SVGA.Player(container);
        this._player.loops = loops;
        this._player.clearsAfterStop = clearsAfterStop;
        this._player.fillMode = fillMode;
        window.addEventListener('resize', this.onResize.bind(this));
    }

    public loops(value: number) {
        if (this._player) {
            this._player.loops = value;
        }
    }

    public clearsAfterStop(value: boolean) {
        if (this._player) {
            this._player.clearsAfterStop = value;
        }
    }

    public fillMode(value: string) {
        if (this._player) {
            this._player.fillMode = value;
        }
    }

    public url(value: string, callBack: Function = null) {
        let self = this;
        if (this._src == value) {
            callBack && callBack();
            return;
        }
        this._src = value;
        this._loadFinish = false;
        if (this._parser) {
            this._parser.load(value, function (sourceItem) {
                self._loadFinish = true;
                self._player.setVideoItem(sourceItem);
                callBack && callBack();
                if (self._isPlay) {
                    self._isPlay = false;
                    self.play(self._finishCallBack);
                }
            });
        }
    }

    public play(callBack: Function = null) {
        if (this._isPlay) {
            callBack && callBack();
            return;
        }
        this._isPlay = true;
        this._finishCallBack = callBack;
        if (this._loadFinish) {
            this._player.startAnimation();
            let canvas = this._ele.firstElementChild as HTMLElement;
            if (canvas) {
                canvas.style.display = 'block';
            }
            this._player.onFinished(function () {
                callBack && callBack();
            });
        }
    }

    public stop() {
        if (!this._isPlay) {
            return;
        }
        this._isPlay = false;
        if (this._loadFinish) {
            this._player && this._player.stopAnimation();
        }
    }

    public destroy() {
        this._isPlay = false;
        this._loadFinish = false;
        this._player.clear();
        let canvas = this._ele.firstElementChild as HTMLElement;
        if (canvas) {
            this._ele.removeChild(canvas);
        }
    }

    private onResize() {
        if (this._player['_resize']) {
            this._player['_resize']();
        }
    }
}

class VoiceAnswerStateView extends BaseView {
    protected _noAnswer: HTMLImageElement;
    protected _answering: HTMLDivElement;
    // protected _svagElement: SvagElement;
    protected _animation: Animation;
    protected _answeringTip: HTMLSpanElement;

    constructor(root) {
        super(root);
    }

    protected initContainer() {
        const child = document.createElement('div');
        child.classList.add('voice-voiceAnswerState');
        this._container = child;
        this._root.appendChild(this._container);
    }

    protected initContent() {
        this._noAnswer = document.createElement('img');
        this._noAnswer.classList.add('voice-voiceAnswerStateImg');
        this._container.appendChild(this._noAnswer);
        this._answering = document.createElement('div');
        this._answering.id = `answeringSVAG${new Date().getTime()}`;
        this._answering.classList.add('answeringSVAG');
        this._container.appendChild(this._answering);

        // this._svagElement = new SvagElement();
        // this._svagElement.init(this._answering);
        // this._svagElement.url(`${assetsRoot}voiceAnswering.svga`);
        this._animation = new Animation();
        this._animation.init(this._answering, []);
        this._animation.interval(150);

        this._answeringTip = document.createElement('span');
        this._answeringTip.classList.add('voice-voiceAnswerStateTip');
        this._container.appendChild(this._answeringTip);
    }

    public updateUI() {
        super.updateUI();
        if (!this._voiceState.isBegin) {
            //未作答
            this._noAnswer.style.display = 'block';
            this._answering.style.display = 'none';
            this._answeringTip.style.display = 'none';
            this.show();
            this._container.style.backgroundColor = '#F9F9F9';
        } else if (!this._voiceState.isEnd) {
            //作答中
            this._noAnswer.style.display = 'none';
            this._answering.style.display = 'block';
            this._answeringTip.style.display = 'block';
            // this._svagElement.play();
            this.show();
            if (this._voiceState.isSettlement) {
                this._answeringTip.innerText = '测评中';
                this._animation.srcs(['icon_loading.png']);
                this._container.style.backgroundColor = '#F9F9F9';
                this._answeringTip.style.color = '#000000';
                this._animation.rotation(true, 60);
            } else {
                this._answeringTip.innerText = '答题中';
                this._animation.srcs(['voiceAnimation0.png', 'voiceAnimation1.png', 'voiceAnimation2.png']);
                this._container.style.backgroundColor = '#EF4C4F';
                this._answeringTip.style.color = '#ffffff';
                this._animation.rotation(false);
            }
            this._animation.play();
        } else {
            //作答结束
            this.hide();
            // this._svagElement.stop();
            this._animation.stop();
            // this._svagElement.destroy();
        }
    }

    public show() {
        super.show();
        this._container.style.display = 'flex';
    }

    public destroy() {
        super.destroy();
        // this._svagElement.stop();
        // this._svagElement.destroy();
        this._animation.stop();
        this._animation.destroy();
    }
}

enum AUDIO_PLAY {
    INIT = 0,
    PLAY = 1,
    STOP = 2,
    COMPLETE = 3
}

class VoicePlayView extends BaseView {
    private _controller: HTMLDivElement;
    private _palyBtn: DOMCheckbox;
    private _process: HTMLDivElement;
    private _processBar: HTMLDivElement;
    private _progressBack: HTMLDivElement;
    private _progressCon: HTMLDivElement;
    private _processTip: HTMLSpanElement;
    private _audioElement: HTMLAudioElement;
    private _state: AUDIO_PLAY = AUDIO_PLAY.INIT;
    private _timeId;

    constructor(root) {
        super(root);
    }

    protected initContainer() {
        const child = document.createElement('div');
        child.classList.add('voice-voiceAnswerPlay');
        this._container = child;
        this._root.appendChild(this._container);
    }

    protected initContent() {
        this._controller = document.createElement('div');
        this._controller.classList.add('voice-voiceAnswerPlayController');
        this._container.appendChild(this._controller);

        this._palyBtn = new DOMCheckbox(SDKControllerUIComponents['audioPlay'], this);
        this._controller.appendChild(this._palyBtn.domElem);
        this._palyBtn.onClick = this.onPlay.bind(this);

        this._progressCon = document.createElement('div');
        this._progressCon.classList.add('voice-voiceAnswerPlay-progressCon');
        this._controller.appendChild(this._progressCon);
        this._progressBack = document.createElement('div');
        this._progressBack.classList.add('voice-voiceAnswerPlay-progressBack');
        this._progressCon.appendChild(this._progressBack);
        this._process = document.createElement('div');
        this._process.classList.add('voice-voiceAnswerPlay-progress');
        this._progressCon.appendChild(this._process);
        this._processBar = document.createElement('div');
        this._processBar.classList.add('voice-voiceAnswerPlay-progressBar');
        this._progressCon.appendChild(this._processBar);
        this._processTip = document.createElement('span');
        this._processTip.classList.add('voice-voiceAnswerPlay-tip');
        this._controller.appendChild(this._processTip);

        this._audioElement = new Audio();
        this._audioElement.addEventListener('ended', this.onEnded.bind(this));
        this._audioElement.addEventListener('loadedmetadata', this.onLoadedmetadata.bind(this));

        this.addEleLisener(this._progressCon);
    }

    public destroy() {
        super.destroy();
        if (this._state == AUDIO_PLAY.PLAY) {
            this._audioElement.pause();
        }
        this._audioElement.src = '';
        this._audioElement = null;
    }

    public updateUI() {
        super.updateUI();
        if (this._voiceState.isEnd && this._voiceState.isBegin) {
            this.show();
        } else {
            this.hide();
            this.reset();
        }
        if (this._state == AUDIO_PLAY.INIT || this._state == AUDIO_PLAY.COMPLETE) {
            this.initState();
        }
    }

    public reset() {
        super.reset();
        this.onEnded();
        // if(this._state == AUDIO_PLAY.PLAY) {
        //     this._audioElement.pause();
        // }
        // if(this._state != AUDIO_PLAY.INIT) {
        //     this.onSetCurentTime(0);
        // }
        // this._state = AUDIO_PLAY.INIT;
    }

    protected notifyVisible(value: boolean) {
        super.notifyVisible(value);
        if (!value) {
            this.reset();
        }
    }

    private onEnded() {
        this._state = AUDIO_PLAY.INIT;
        this.onSetCurentTime(0);
        this._audioElement.pause();
        this.syncProcess();
        this.initState();
    }

    private onLoadedmetadata() {
        if (this._audioElement) {
            if (this._voiceState.isEnd && this._voiceState.isBegin) {
                if (Math.abs(this._voiceState.progress - this._audioElement.duration) > 0.5) {
                    if (this._voiceState.voiceUrl == this._audioElement.currentSrc) {
                        this._voiceState.progress = this._audioElement.duration;
                        this.updateUI();
                    }
                }
            }
        }
    }

    private onPlay() {
        if (this._voiceState.voiceUrl == '') {
            return;
        }
        if (this._state != AUDIO_PLAY.PLAY) {
            this._state = AUDIO_PLAY.PLAY;
            SDKApp.instance().newRecordTransceiver.send(VOICE_CLICK_PLAY_AUDIO);
        } else {
            this._state = AUDIO_PLAY.STOP;
            SDKApp.instance().newRecordTransceiver.send(VOICE_CLICK_PLAY_PAUSE);
        }
        this._palyBtn.setStatus(this._state == AUDIO_PLAY.PLAY ? 'full' : 'normal');
        if (this._state == AUDIO_PLAY.PLAY) {
            if (this._audioElement.src != this._voiceState.voiceUrl) {
                this._audioElement.src = this._voiceState.voiceUrl;
            }
            this._audioElement.play();
        } else if (this._state == AUDIO_PLAY.STOP) {
            this._audioElement.pause();
        }
        this.syncProcess();
    }

    private syncProcess() {
        clearInterval(this._timeId);
        if (this._state == AUDIO_PLAY.PLAY) {
            this.upateProcess();
            this._timeId = setInterval(this.upateProcess.bind(this), 500);
        }
    }

    private addEleLisener(docElem) {
        let self = this;
        docElem.addEventListener(
            'click',
            function (e) {
                if (e.target == self._processBar) {
                    return;
                }
                if (self._state != AUDIO_PLAY.PLAY) {
                    return;
                }
                let per = e.offsetX / docElem.offsetWidth;
                let currentTime = per * self._voiceState.progress;
                self.onSetCurentTime(currentTime);
                SDKApp.instance().newRecordTransceiver.send(VOICE_CLICK_CHANGE_PROGRESS, { progress: Math.floor(per * 100) });
            },
            false
        );
        // self._processBar.addEventListener(
        //     'mousedown',
        //     function (e: any) {
        //         document.addEventListener(
        //             'mousemove',
        //             function (e: any) {
        //                 console.log(e.clientX+'px');
        //             }.bind(this),
        //             false
        //         );
        //         document.addEventListener(
        //             'mouseup',
        //             function (e: any) {
        //                 document.removeEventListener('mousemove', null);
        //                 document.removeEventListener('mouseup', null);
        //             }.bind(this),
        //             false
        //         );
        //     }.bind(this),
        //     false
        // );
    }

    private upateProcess() {
        let curentTime = this._audioElement.currentTime;
        if (curentTime > this._voiceState.progress) {
            curentTime = this._voiceState.progress;
        }
        let per = curentTime / this._voiceState.progress;
        this._process.style.width = per * 5 + 'rem';//per * 100 + "%";
        this._processBar.style['margin-left'] = (per * 5 - 0.1) + 'rem';//per * 100 + "%";
        this._processBar.style.display = 'block';
        this._processTip.innerText = this.formateTime(curentTime) + '/' + this.formateTime(this._voiceState.progress);
    }

    private initState() {
        this._process.style.width = 0 + "%";
        this._processBar.style['margin-left'] = -0.1 + "rem";
        this._processBar.style.display = 'none';
        this._processTip.innerText = this.formateTime(this._voiceState.progress);
        this._palyBtn.setStatus(this._state == AUDIO_PLAY.PLAY ? 'full' : 'normal');
    }

    private onSetCurentTime(value: number) {
        let self = this;
        try {
            this._audioElement.currentTime = value;
            self.upateProcess();
        }
        catch (err) {
            if (self._audioElement.addEventListener) {
                let func = function () {
                    self._audioElement.removeEventListener('loadedmetadata', func);
                    self._audioElement.currentTime = value;
                };
                self._audioElement.addEventListener('loadedmetadata', func);
            }
        }
    }

    /**
     * @param value 数据类型
     * @return 00:00
     */
    private formateTime(value: number): string {
        let min = 0;
        let sec = 0;
        let content: string = '';

        value = Math.floor(value);
        min = Math.floor(value / 60);
        sec = value % 60;
        if (min < 10) {
            content = '0' + min;
        } else {
            content = min.toString();
        }
        if (sec < 10) {
            content += ':0' + sec;
        } else {
            content += ':' + sec;
        }
        return content;
    }
}

class VoiceAnswerView extends BaseView {
    protected _voiceAnswerStateView: VoiceAnswerStateView;
    protected _voicePlayView: VoicePlayView;

    constructor(root) {
        super(root);
    }

    protected initContainer() {
        const child = document.createElement('div');
        child.classList.add('voice-voiceAnswer');
        this._container = child;
        this._root.appendChild(this._container);
    }

    protected initContent() {
        this._voiceAnswerStateView = new VoiceAnswerStateView(this._container);
        this._voicePlayView = new VoicePlayView(this._container);
        this.addChild(this._voiceAnswerStateView);
        this.addChild(this._voicePlayView);
    }
}

class VoiceTextView extends BaseView {
    protected _voiceText: HTMLSpanElement;
    protected _bg: HTMLDivElement;

    constructor(root) {
        super(root);
    }

    protected initContainer(): void {
        const child = document.createElement('div');
        child.classList.add('voice-voiceText');
        this._container = child;
        this._root.appendChild(this._container);
    }

    protected initContent() {
        this._bg = document.createElement('div');
        this._bg.classList.add('voice-voiceText-bg');
        this._container.appendChild(this._bg);

        this._voiceText = document.createElement('p');
        this._voiceText.classList.add('voice-voiceText-content');
        this._bg.appendChild(this._voiceText);
    }

    public updateUI() {
        super.updateUI();
        if (!this._voiceState.isBegin) {
            this._voiceText.innerHTML = '学生暂未答题';
        } else {
            if (this._voiceState.isSuccess) {
                this._voiceText.innerHTML = this.formateContent(this._voiceState.content, []).join('');
            } else {
                this._voiceText.innerHTML = '抱歉,获取语音信息失败';
            }
        }
    }

    private formateContent(value: string, contents: Array<string>): Array<string> {
        let index = 0;
        let count = 0;
        let keywords = SDKLogicsCore.voiceAnswerInfo.getKeywords();
        let has: boolean = false;

        if (value == undefined || value == null || value == '') {
            return contents;
        }
        count = keywords.length;
        for (index = 0; index < count; index++) {
            if (keywords[index] == '') {
                continue;
            }
            let flag = value.indexOf(keywords[index]);
            if (flag != -1) {
                has = true;
                let pre = value.substring(0, flag);
                contents.push(pre);
                contents.push(`<span class='voice-voiceText-keyword'>${keywords[index]}</span>`);
                value = value.substring(flag + keywords[index].length);
            }
        }
        if (!has) {
            contents.push(value);
            value = '';
        }
        return this.formateContent(value, contents);
    }
}

class ContentView extends BaseView {
    protected _voiceAnswerView: VoiceAnswerView;
    protected _voiceTextView: VoiceTextView;

    constructor(root) {
        super(root);
    }

    protected initContainer() {
        const child = document.createElement('div');
        child.classList.add('voice-content');
        this._container = child;
        this._root.appendChild(this._container);
    }

    protected initContent() {
        this._voiceAnswerView = new VoiceAnswerView(this._container);
        this._voiceTextView = new VoiceTextView(this._container);
        this.addChild(this._voiceAnswerView);
        this.addChild(this._voiceTextView);
    }
}

export default class SDKVoiceAnswerView extends BaseView {
    protected _container: any;
    protected _headView: HeadView;
    protected _contentView: ContentView;
    protected _notifyView: NotifyView;

    constructor(root: HTMLDivElement) {
        super(root);
    }

    protected initContainer(): void {
        const child = document.createElement('div');
        child.classList.add('voice-root');
        child.style.overflowX = 'hidden';
        child.style.overflowY = 'hidden';
        this._container = child;
        this._root.appendChild(this._container);
    }

    protected initContent(): void {
        this._headView = new HeadView(this._container);
        this._contentView = new ContentView(this._container);
        this._notifyView = new NotifyView(this._container);
        this.addChild(this._headView);
        this.addChild(this._contentView);
        this.addChild(this._notifyView);
    }
}
