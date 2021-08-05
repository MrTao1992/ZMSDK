import SDKUserInfo from '../SDKLogics/SDKUserInfo';
import * as SDKLogicsCore from '../SDKLogics/SDKLogicsCore';
import * as SDKENUM from '../SDKConst/SDKEnum'
import SDKPacket from '../SDKNetwork/SDKPacket';
import * as SDKRegistCommand from '../SDKConst/SDKRegistCommand';
import SDKPacketPool from '../SDKNetwork/SDKPacketPool';
import SDKReplayController from '../SDKController/SDKReplayController';
import SDKContrllerManager from '../SDKController/SDKContrllerManager';
import * as SDKControllerConst from '../SDKConst/SDKControllerConst';
import * as SDKRecordEventConst from '../SDKConst/SDKRecordEventConst';
import {
    DOMButton,
    SDKControllerUIComponents,
    DOMCheckbox,
} from './SDKControlUI';
import SDKApp from '../SDKBase/SDKApp';
import SDKVoiceAnswerView from './SDKVoiceAnswerView';

export default class SDKStudentView {
    protected _container: any;
    protected _iframe: any;
    protected _tfName: any;
    protected _refresh: DOMButton;
    protected _scale: DOMCheckbox;
    protected _bg: any;
    protected _evtDiv: any;
    protected _voiceView: SDKVoiceAnswerView;
    protected _switchView: DOMCheckbox;

    protected _userId: string;
    protected _userInfo: SDKUserInfo;
    protected _isInit: boolean;
    protected _isShow: boolean;
    protected _tempUserInfo: SDKUserInfo;
    protected _isActive: boolean;
    protected _clickTime: number;
    protected _isShowVoiceView: boolean;
    protected _scaleFun: (userId: string, isFull: boolean) => void;

    constructor() {
        this.reset();
        this.initContainer();
    }

    public set scaleFun(value: (userId: string, isFull: boolean) => void) {
        this._scaleFun = value;
    }

    public sendPacket(packet: SDKPacket) {
        if (this._iframe) {
            this._iframe.contentWindow.postMessage(packet, '*');
            this.addExpendPacket(packet);
        }
    }

    public updateUserInfo(userInfo: SDKUserInfo): void {
        if (this._iframe && !this._isInit) {
            this._tempUserInfo = userInfo;
            return;
        }
        this._userId = userInfo.userId;
        this._userInfo = userInfo;
        if (this._iframe && this._isInit) {
            if (SDKLogicsCore.parameterVo.isReplay() && this._userInfo.isSplitReady) {
                this.replayResumeUserView();
            }
            this._userInfo.isSplitReady = true;
        }

        if (this._iframe) {
            this.changeUserInfo();
            this.updateUI();
        } else {
            this.createIframe();
        }
        if (this._voiceView) {
            this._voiceView.setUserInfo(this._userInfo);
        }
    }

    public setScaleState(isFull): void {
        let className = isFull ? 'full' : 'normal';
        if(this._scale) {
            this._scale.setStatus(className);
        }
    }

    public synchronizePacket(): void {
        let index = 0;
        let count = 0;
        let packet: SDKPacket;

        if (!this._isShow) {
            return;
        }
        index = this._userInfo.getLastMainIndex();
        if (index === -1) {
            return;
        }
        count = this._userInfo.count();
        for (index; index < count; index++) {
            packet = this._userInfo.getPacketByIndex(index);
            const sceneName = packet.data;
            const actionName: string = packet.name;
            if (SDKRegistCommand.EVENTS_LIST.indexOf(packet.name) === -1) {
                if (packet.name !== 'gameChangeScene' && packet.isMainFrame) {
                    this.checkChangeScene(packet);
                }
                this.sendPacket(packet);
                if (actionName === 'gameChangeScene') {
                    this.initScene(sceneName);
                }
            }
        }
    }

    public show(): void {
        if(!this._userInfo) {
            return;
        }
        if (this._userInfo.isActive && this._isActive) {
            this._iframe.style.display = 'block';
            this._isShow = true;
        } else {
            this._iframe.style.display = 'none';
            this._isShow = false;
        }
        this.updateUI();
        if (this._isShowVoiceView && this._isShow) {
            this._voiceView && this._voiceView.show();
        }else{
            this._voiceView && this._voiceView.hide();
        }
    }

    public hide(isExit: boolean = false): void {
        if(!this._userInfo) {
            return;
        }
        this._iframe.style.display = 'none';
        this._isShow = false;
        this.updateUI();
        if (isExit) {
            this._isShowVoiceView = true;
        }
        this._voiceView && this._voiceView.hide();
    }

    public reset() {
        this._userId = '';
        this._userInfo = null;
        this._isInit = false;
        this._isShow = false;
        this._clickTime = 0;

        this._container = null;
        this._iframe = null;
        this._tfName = null;
        this._isShowVoiceView = true;
    }

    public destory() {
        if (this._iframe) {
            try {
                this._iframe.src = 'javascript:void(0)';
                this._iframe.document.write('');
                this._iframe.document.clear();
            } catch (e) { };
        }
        this.reset();
        this._voiceView && this._voiceView.destroy();
    }

    public get container(): any {
        return this._container;
    }

    public get isInit(): boolean {
        return this._isInit;
    }

    public set isInit(value: boolean) {
        this._isInit = value;
        if (this._isInit && this._tempUserInfo) {
            this.updateUserInfo(this._tempUserInfo);
            this.synchronizePacket();
            this._tempUserInfo = null;
        }
    }

    public set isActive(value: boolean) {
        this._isActive = value;
    }

    public get userId(): string {
        return this._userId;
    }

    public updateVoiceAnswer() {
        this._voiceView && this._voiceView.updateUI();
    }

    protected updateUI(): void {
        if (this._userInfo) {
            this._tfName.innerText = `学生${this._userInfo.name}`;
        }
        if (!this._isActive) {
            this._tfName.innerText = '';
        }
        this.updateBtnState(this._refresh);
        this.updateBtnState(this._scale);
        this.updateBtnState(this._switchView);
        this._bg.style.display = this._isShow ? 'block' : 'none';
        if (this._isShow) {
            this._evtDiv.style.background = '';
        } else {
            this._evtDiv.style.background = '#2A2C37';
        }
        this._voiceView && this._voiceView.updateUI();
    }

    protected updateBtnState(target) {
        if (target) {
            if (this._isShow) {
                target.show();
            } else {
                target.hide();
            }
        }
    }

    protected checkChangeScene(packet: SDKPacket): void {
        let tempPacket: SDKPacket;

        tempPacket = SDKPacketPool.Acquire(packet.name);
        packet.clone(tempPacket);
        tempPacket.name = 'gameChangeScene';
        tempPacket.sendId = SDKLogicsCore.parameterVo.userId;
        tempPacket.data = packet.secene;

        this.sendPacket(tempPacket);
    }

    protected initScene(sceneName: string): void {
        let tempPacket: SDKPacket;

        tempPacket = SDKPacketPool.Acquire('gameSceneReset');
        tempPacket.sendId = SDKLogicsCore.parameterVo.userId;
        tempPacket.isMainFrame = false;
        tempPacket.data = sceneName;

        this.sendPacket(tempPacket);
    }

    protected initContainer(): void {
        const child = document.createElement('div');
        child.classList.add('sdk-child');
        child.style.overflowX = 'hidden';
        child.style.overflowY = 'hidden';
        this._container = child;
    }

    protected changeUserInfo(): void {
        let packet: SDKPacket;

        packet = SDKPacketPool.Acquire(SDKRegistCommand.SET_SUB_IFRAME_INFO);
        packet.data = {
            'userId': this._userId,
            'name': this._userInfo.name
        }
        this.sendPacket(packet);
    }

    protected replayResumeUserView(): void {
        let controller: SDKReplayController;
        controller = SDKContrllerManager.instance().getController(SDKControllerConst.REPLAY) as SDKReplayController;
        if (controller) {
            controller.replayResumeUserView(this._userInfo.userId);
        }
    }

    protected onDoubleClick() {
        if (!this._isShow) {
            return;
        }
        if (!this._isInit) {
            this._scale.setStatus('normal');
            return;
        }
        let isFull = this._scale.status === 'normal';
        this.setScaleState(isFull);
        let eventName = SDKRecordEventConst.SPLIT_SCRREN_DOUBLE_TOMAX;
        if (!isFull) {
            eventName = SDKRecordEventConst.SPLIT_SCRREN_DOUBLE_TOMIN;
        }
        SDKApp.instance().newRecordTransceiver.send(eventName, { userId: this._userId });

        this.onScale(null);
    }

    protected onRefresh(): void {
        if (this._iframe) {
            let now = new Date().getTime();
            if (now - this._clickTime > 5000) {
                this._clickTime = now;
                if (this._isInit) {
                    this._tempUserInfo = this._userInfo;
                }
                this._isInit = false;
                this._userInfo.isSplitReady = false;
                this._iframe.src = this.createStudentUrl(this._userId);

                SDKApp.instance().newRecordTransceiver.send(
                    SDKRecordEventConst.SPLIT_SCREEN_REFRESH,
                    { userId: this._userId }
                );
            }
        }
    }

    protected onScale(evt: any): void {
        if (!this._isInit) {
            this._scale.status = 'normal';
            return;
        }
        let isFull = this._scale.status === 'full';
        this._scaleFun(this._userId, isFull);

        if (evt) {
            let eventName = SDKRecordEventConst.SPLIT_SCRREN_CLICK_TOMAX;
            if (!isFull) {
                eventName = SDKRecordEventConst.SPLIT_SCRREN_CLICK_TOMIN;
            }
            SDKApp.instance().newRecordTransceiver.send(eventName, { userId: this._userId });
        }
    }

    protected onSwitchView(evt: any): void {
        this._isShowVoiceView = !this._isShowVoiceView;
        SDKApp.instance().newRecordTransceiver.send(SDKRecordEventConst.VOICE_CLICK_SWITCH,{display:this._isShowVoiceView});
        if (this._isShowVoiceView) {
            this._voiceView && this._voiceView.show();
            this._voiceView && this._voiceView.updateUI();
        } else {
            this._voiceView && this._voiceView.hide();
        }
    }

    protected createIframe(): void {
        // 增加一个新的iframe
        const iframe = document.createElement('iframe');
        iframe.src = this.createStudentUrl(this._userId);
        iframe.setAttribute('border', 'none');
        iframe.classList.add('sdk-child-iframe'); // 这个类一定要有
        iframe.style.overflowX = 'hidden';
        iframe.style.overflowY = 'hidden';
        this._container.appendChild(iframe);
        const name = document.createElement('div');
        name.classList.add('sdk-child-name');
        name.innerText = `学生${this._userInfo.name}`;
        this._container.appendChild(name);

        const evtDiv = document.createElement('div');
        evtDiv.classList.add('sdk-child-event');
        evtDiv.ondblclick = this.onDoubleClick.bind(this);
        this._container.appendChild(evtDiv);
        this._evtDiv = evtDiv;

        const bg = document.createElement('div');
        bg.classList.add('sdk-child-bg');
        this._bg = bg;
        this._container.appendChild(bg);

        if (SDKLogicsCore.parameterVo.isTeacher()) {
            const refreshBtn = new DOMButton(SDKControllerUIComponents['refresh'], this);
            refreshBtn.onClick = this.onRefresh.bind(this);
            this._container.appendChild(refreshBtn.domElem);
            this._refresh = refreshBtn;
        }

        this._scale = new DOMCheckbox(SDKControllerUIComponents['scale'], this);
        this._container.appendChild(this._scale.domElem);
        this._scale.onClick = this.onScale.bind(this);

        if (SDKLogicsCore.voiceAnswerInfo.isVoiceAnswer()) {
            if(SDKLogicsCore.parameterVo.isTeacher()) {
                this._voiceView = new SDKVoiceAnswerView(this._container);
                this._switchView = new DOMCheckbox(SDKControllerUIComponents['switchView'], this);
                this._container.appendChild(this._switchView.domElem);
                this._switchView.onClick = this.onSwitchView.bind(this);
            }
        }
        this._iframe = iframe;
        this._tfName = name;
    }

    /** 生成一个新的url */
    protected createStudentUrl(studentId: string): string {
        const parameterVo = SDKLogicsCore.parameterVo.clone();

        parameterVo.userId = studentId;
        parameterVo.role = SDKENUM.USER_ROLE.STUDENT;
        parameterVo.usage = SDKENUM.GAME_TYPE.SPLITSCREEN;
        parameterVo.parentUsage = SDKLogicsCore.parameterVo.usage;

        return parameterVo.getUrl();
    }

    protected addExpendPacket(packet: SDKPacket): void {
        if(packet.action == 'gameVideoReplay') {
            let tempPacket: SDKPacket = SDKPacketPool.Clone(packet, 'gameVideoPlay');
            tempPacket.data = 1;
            this._userInfo && this._userInfo.addPacket(tempPacket);
        }
    }
}