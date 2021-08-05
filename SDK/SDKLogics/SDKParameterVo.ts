import * as SDKEnum from '../SDKConst/SDKEnum';
import * as SDKConfigConst from '../SDKConst/SDKConfigConst';

export default class SDKParameterVo {
    public get lessonId(): string {
        return this._lessonId;
    }

    public get lessonUid(): string {
        return this._lessonUid;
    }

    public get appId(): string {
        return this._appId;
    }

    public set appId(value: string) {
        this._appId = value;
    }

    public set sessionId(value: string) {
        this._sessionId = value;
    }

    public get sessionId() {
        return this._sessionId;
    }

    public get gameId(): number {
        return this._gameId;
    }

    public get userId(): string {
        return this._userId;
    }

    public set userId(value: string) {
        this._userId = value;
    }

    public get user_id(): string {
        return this._user_id;
    }

    public get observerId(): string {
        return this._observerId;
    }

    public set observerId(value: string) {
        this._observerId = value;
    }

    public get replayId(): string {
        return this._replayId;
    }

    public set replayId(value: string) {
        this._replayId = value;
    }

    public get observerRole(): SDKEnum.USER_ROLE {
        return this._observerRole;
    }

    public set observerRole(value: SDKEnum.USER_ROLE) {
        this._observerRole = value;
    }

    public get role(): SDKEnum.USER_ROLE {
        return this._role;
    }

    public set role(value: SDKEnum.USER_ROLE) {
        this._role = value;
    }

    public set usage(value: SDKEnum.GAME_TYPE) {
        this._usage = value;
    }

    public get usage(): SDKEnum.GAME_TYPE {
        return this._usage;
    }

    public set parentUsage(value: SDKEnum.GAME_TYPE) {
        this._parentUsage = value;
    }

    public get parentUsage(): SDKEnum.GAME_TYPE {
        return this._parentUsage;
    }

    public get replayMobiles(): string[] {
        return this._replayMobiles;
    }

    public get msgSendModle(): SDKEnum.TYPE_MSG {
        return this._msgSendModle;
    }

    public get enviroment(): SDKEnum.TYPE_ENVIRONMENT {
        return this._enviroment;
    }

    public get isLocal(): boolean {
        return this._isLocal;
    }

    public get isMix(): boolean {
        return this._isMix;
    }

    public get isOld(): boolean {
        return this._isOld;
    }

    public get isInit(): boolean {
        return this._isInit;
    }

    public get replayType(): SDKEnum.TYPE_REPLAY {
        return this._replayType;
    }

    public get gameOrigin(): string {
        return this._gameOrigin;
    }

    public get gameRoot(): string {
        return this._gameRoot;
    }

    public get localVideo(): boolean {
        return this._localVideo;
    }

    public get sdkVersion(): string {
        return this._sdkVersion;
    }

    public get gameVersion(): string {
        return this._gameVersion;
    }

    public get assertPath(): string {
        return this._assertPath;
    }

    public get roomSessionId(): string {
        return this._roomSessionId;
    }

    public get coursewareUuid(): string {
        return this._coursewareUuid;
    }

    public get coursewareId(): string {
        return this._coursewareId;
    }

    public get versionCode(): string {
        return this._versionCode;
    }

    public get courseWareLevel(): number {
        return this._courseWareLevel;
    }

    public get buType(): SDKEnum.TYPE_BU {
        return this._buType;
    }

    private _isInit: boolean;
    private _url: string;
    private _lessonId: string;
    private _gameId: number;
    private _usage: SDKEnum.GAME_TYPE;
    private _parentUsage: SDKEnum.GAME_TYPE;
    private _role: SDKEnum.USER_ROLE;
    private _courseWare: SDKEnum.COURSEWARE_TEYPE;
    private _replayMobiles: string[];
    private _lessonUid: string;
    private _appId: string;
    private _sessionId: string;
    private _msgSendModle: SDKEnum.TYPE_MSG;
    private _device: SDKEnum.TYPE_DEVICE;
    private _enviroment: SDKEnum.TYPE_ENVIRONMENT;
    private _isTrain: boolean;
    private _replayType: SDKEnum.TYPE_REPLAY;
    private _isLocal: boolean;
    private _isMix: boolean;
    private _gameOrigin: string;
    private _localVideo: boolean;
    private _repair: SDKEnum.TYPE_REPAIR;
    private _isDebugInfo: boolean;
    private _gameRoot: string;
    private _sdkVersion: string;
    private _gameVersion: string;
    private _assertPath: string;
    private _roomSessionId: string;
    private _coursewareUuid: string;
    private _buType: SDKEnum.TYPE_BU;
    //zmg2.0
    private _coursewareId:string;
    private _versionCode: string;
    private _courseWareLevel: number;

    private _userId: string;
    private _replayId: string;
    private _observerId: string;
    private _observerRole: SDKEnum.USER_ROLE;
    private _isOld: boolean;
    private _user_id: string;

    constructor() {
        this.reset();
    }

    public parseUrl(url: string): boolean {
        this._isInit = true;
        this._url = url;
        const query: any = this.getRequest(url);
        if (!query) {
            return false;
        }

        if (query.usage) {
            switch (query.usage) {
                case 'preview':
                    this._usage = SDKEnum.GAME_TYPE.PREVIEW;
                    break;
                case 'class':
                    this._usage = SDKEnum.GAME_TYPE.CLASS;
                    break;
                case 'replay':
                    this._usage = SDKEnum.GAME_TYPE.REPLAY;
                    break;
                case 'splitscreen':
                    this._usage = SDKEnum.GAME_TYPE.SPLITSCREEN;
                    break;
            }
        }

        if (query.parentUsage) {
            switch (query.parentUsage) {
                case 'preview':
                    this._parentUsage = SDKEnum.GAME_TYPE.PREVIEW;
                    break;
                case 'class':
                    this._parentUsage = SDKEnum.GAME_TYPE.CLASS;
                    break;
                case 'replay':
                    this._parentUsage = SDKEnum.GAME_TYPE.REPLAY;
                    break;
            }
        }

        if (query.role) {
            this._role = this.getRoleByValue(query.role);
        }

        if (query.kjType) {
            switch (query.kjType) {
                case 'zml':
                    this._courseWare = SDKEnum.COURSEWARE_TEYPE.ZML;
                    break;
                case 'zmg':
                    this._courseWare = SDKEnum.COURSEWARE_TEYPE.ZMG;
            }
        }

        if (query.device) {
            switch (query.device) {
                case 'pc':
                case 'PC':
                    this._device = SDKEnum.TYPE_DEVICE.TYPE_PC;
                    break;
                case 'iPad':
                    this._device = SDKEnum.TYPE_DEVICE.TYPE_IPAD;
                    break;
                case 'aPad':
                    this._device = SDKEnum.TYPE_DEVICE.TYPE_APAD;
                    break;
                case 'IPhone':
                    this._device = SDKEnum.TYPE_DEVICE.TYPE_IPHONE;
                    break;
                case 'APhone':
                    this._device = SDKEnum.TYPE_DEVICE.TYPE_APHONE;
                    break;
            }
        }

        if (query.gameId) {
            if (!isNaN(Number(query.gameId))) {
                this._gameId = Number(query.gameId);
            }
        }

        if (query.lessonId) {
            this._lessonId = query.lessonId;
        }

        if (query.lessonUid) {
            this._lessonUid = query.lessonUid;
        }

        if (query["userMobile"]) {
            this._userId = String(query["userMobile"]);
        }

        if (query["mobile"]) {
            this._userId = String(query["mobile"]);
        }

        if (query["userId"]) {
            this._user_id = String(query["userId"]);
        }

        if (query.replayMobiles) {
            this._replayMobiles = query.replayMobiles.split(',');
        }

        if (this.isReplay()) {
            if (
                this._role === SDKEnum.USER_ROLE.TEACHER ||
                this._replayMobiles.length > 1
            ) {
                this._replayId = this._userId;
            } else if (
                this._role === SDKEnum.USER_ROLE.STUDENT &&
                this._replayMobiles.length === 1
            ) {
                this._replayId = this._replayMobiles[0];
            }
        }

        if (query.msgSendModle) {
            switch (query.msgSendModle) {
                case 'jsb':
                    this._msgSendModle = SDKEnum.TYPE_MSG.YTPE_JSB_MESSAGE;
                    break;
                case 'post':
                    this._msgSendModle = SDKEnum.TYPE_MSG.TYPE_POST_MESSAGE;
                    break;
            }
        }

        if (query.isTrain) {
            this._isTrain = query.isTrain === 'true' ? true : false;
        }

        if (query.replayType) {
            switch (query.replayType) {
                case 'train':
                    this._replayType = SDKEnum.TYPE_REPLAY.TRAIN;
                    break;
            }
        }

        if (query.local) {
            this._isLocal = query.local === 'true' ? true : false;
        }

        if (query.isMix) {
            this._isOld = false;
            if (!isNaN(Number(query.isMix))) {
                this._isMix = Number(query.isMix) === 1 ? true : false;
            }
        } else {
            this._isOld = true;
        }

        if (query.localVideo) {
            this._localVideo = query.localVideo === 'true' ? true : false;
        }

        if (query['repair']) {
            switch (query["repair"]) {
                case "record":
                    this._repair = SDKEnum.TYPE_REPAIR.RECORD;
                    break;
                case "play":
                    this._repair = SDKEnum.TYPE_REPAIR.PLAY;
                    break;
            }
        }

        if(query.appId) {
            this._appId = query.appId;
        }

        if(query.user_id) {
            this._user_id = query.user_id;
        }

        if (query['isDebug']) {
            this._isDebugInfo = query['isDebug'] == 'true' ? true : false;
        }

        if(query.sdkVersion) {
            this._sdkVersion = query.sdkVersion;
        }

        if(query.gameVersion) {
            this._gameVersion = query.gameVersion;
        }

        if(query.assertPath) {
            this._assertPath = query.assertPath;
        }

        if(query.coursewareId) {
            this._coursewareId = query.coursewareId;
        }

        if(query.versionCode) {
            this._versionCode = query.versionCode;
        }

        if(query.courseWareLevel) {
            this._courseWareLevel =  query.courseWareLevel;
        }

        if(query.roomSessionId) {
            this._roomSessionId = query.roomSessionId;
        }

        if(query.coursewareUuid) {
            this._coursewareUuid = query.coursewareUuid;
        }

        if(query.buType) {
            this._buType = query.buType;
        }

        if (query.enviroment) {
            switch (query.enviroment) {
                case 'localhost':
                    this._enviroment = SDKEnum.TYPE_ENVIRONMENT.LOCALHOST;
                    break;
                case 'test':
                    this._enviroment = SDKEnum.TYPE_ENVIRONMENT.TEST;
                    break;
                case 'uat':
                    this._enviroment = SDKEnum.TYPE_ENVIRONMENT.UAT;
                    break;
                case 'production':
                    this._enviroment = SDKEnum.TYPE_ENVIRONMENT.PRODUCTION;
                    break;
            }
        }

        if (query.env) {
            switch (query.env) {
                case 'test':
                    this._enviroment = SDKEnum.TYPE_ENVIRONMENT.TEST;
                    break;
                case 'uat':
                    this._enviroment = SDKEnum.TYPE_ENVIRONMENT.UAT;
                    break;
                case 'prod':
                    this._enviroment = SDKEnum.TYPE_ENVIRONMENT.PRODUCTION;
                    break;
            }
        }

        if (this._enviroment === SDKEnum.TYPE_ENVIRONMENT.NONE) {
            switch (window.location.hostname) {
                case SDKConfigConst.ENVIRONMENT_LOCAL:
                    this._enviroment = SDKEnum.TYPE_ENVIRONMENT.LOCALHOST;
                    break;
                case SDKConfigConst.ENVIRONMENT_LOCALIP:
                    this._enviroment = SDKEnum.TYPE_ENVIRONMENT.LOCALHOST;
                    break;
                case SDKConfigConst.ENVIRONMENT_TEST:
                    this._enviroment = SDKEnum.TYPE_ENVIRONMENT.TEST;
                    break;
                case SDKConfigConst.ENVIRONMENT_UAT:
                    this._enviroment = SDKEnum.TYPE_ENVIRONMENT.UAT;
                    break;
                case SDKConfigConst.ENVIRONMENT_PRODUCTION:
                    this._enviroment = SDKEnum.TYPE_ENVIRONMENT.PRODUCTION;
                    break;
            }
        }

        return true;
    }

    public isZML(): boolean {
        return this._courseWare === SDKEnum.COURSEWARE_TEYPE.ZML;
    }

    public isZMG(): boolean {
        return this._courseWare === SDKEnum.COURSEWARE_TEYPE.ZMG;
    }

    public isSplitScreen(): boolean {
        return this._usage === SDKEnum.GAME_TYPE.SPLITSCREEN;
    }

    public isGamePreview(): boolean {
        return (
            this._usage === SDKEnum.GAME_TYPE.NORMAL ||
            this._usage === SDKEnum.GAME_TYPE.PREVIEW
        );
    }

    public isGameClass(): boolean {
        return this._usage === SDKEnum.GAME_TYPE.CLASS;
    }

    public isGameObserver(): boolean {
        return (
            this.isGameClass() &&
            (this._role === SDKEnum.USER_ROLE.OBSERVER ||
                this._role === SDKEnum.USER_ROLE.SELLER)
        );
    }

    public isGameReplay(): boolean {
        return this._usage === SDKEnum.GAME_TYPE.REPLAY;
    }

    public isGameTrain(): boolean {
        return this.isGameClass() && this._isTrain;
    }

    public isTeacher(): boolean {
        return this.isGameClass() && this._role === SDKEnum.USER_ROLE.TEACHER;
    }

    public isStudent(): boolean {
        return this.isGameClass() && this._role === SDKEnum.USER_ROLE.STUDENT;
    }

    public isObserver(): boolean {
        return (
            this.isGameObserver() && this._role === SDKEnum.USER_ROLE.OBSERVER
        );
    }

    public isSeller(): boolean {
        return this.isGameObserver() && this._role === SDKEnum.USER_ROLE.SELLER;
    }

    public isOberverTeacher(): boolean {
        return (
            this.isGameObserver() &&
            this._observerRole === SDKEnum.USER_ROLE.TEACHER
        );
    }

    public isOberverStudent(): boolean {
        return (
            this.isGameObserver() &&
            this._observerRole === SDKEnum.USER_ROLE.STUDENT
        );
    }

    public isReplayTeacher(): boolean {
        return (
            this.isGameReplay() &&
            (this.role === SDKEnum.USER_ROLE.TEACHER ||
                this._replayMobiles.length > 1)
        );
    }

    public isReplayStudent(): boolean {
        return (
            this.isGameReplay() &&
            (this.role === SDKEnum.USER_ROLE.STUDENT &&
                this._replayMobiles.length === 1)
        );
    }

    public isReplay(): boolean {
        return this._usage === SDKEnum.GAME_TYPE.REPLAY;
    }

    public isProduction(): boolean {
        return this._enviroment == SDKEnum.TYPE_ENVIRONMENT.PRODUCTION;
    }

    public isTest(): boolean {
        return this._enviroment == SDKEnum.TYPE_ENVIRONMENT.TEST;
    }

    public isUat(): boolean {
        return this._enviroment == SDKEnum.TYPE_ENVIRONMENT.UAT;
    }

    public isJsb(): boolean {
        return this._msgSendModle === SDKEnum.TYPE_MSG.YTPE_JSB_MESSAGE;
    }

    public isPost(): boolean {
        return this._msgSendModle === SDKEnum.TYPE_MSG.TYPE_POST_MESSAGE;
    }

    public isPc(): boolean {
        return this._device === SDKEnum.TYPE_DEVICE.TYPE_PC;
    }

    public isIpad(): boolean {
        return this._device === SDKEnum.TYPE_DEVICE.TYPE_IPAD;
    }

    public isApad(): boolean {
        return this._device === SDKEnum.TYPE_DEVICE.TYPE_APAD;
    }

    public isIphone(): boolean {
        return this._device === SDKEnum.TYPE_DEVICE.TYPE_IPHONE;
    }

    public isAphone(): boolean {
        return this._device === SDKEnum.TYPE_DEVICE.TYPE_APHONE;
    }

    public get isRepairRecord(): boolean {
        return this._repair == SDKEnum.TYPE_REPAIR.RECORD;
    }

    public get isRepairPlay(): boolean {
        return this._repair == SDKEnum.TYPE_REPAIR.PLAY;
    }

    public get isRepair(): boolean {
        return this._repair != SDKEnum.TYPE_REPAIR.NONE;
    }

    public get isDebugInfo(): boolean {
        return this._isDebugInfo;
    }

    public clone(): SDKParameterVo {
        let parameterVo: SDKParameterVo;
        parameterVo = new SDKParameterVo();
        parameterVo._usage = this._usage;
        parameterVo._parentUsage = this._parentUsage;
        parameterVo._role = this._role;
        parameterVo._gameId = this._gameId;
        parameterVo._lessonId = this._lessonId;
        parameterVo._lessonUid = this._lessonUid;
        parameterVo._userId = this._userId;
        parameterVo._url = this._url;
        parameterVo._courseWare = this._courseWare;
        parameterVo._observerId = this._observerId;
        parameterVo._observerRole = this._observerRole;
        parameterVo._replayId = this._replayId;
        parameterVo._device = this._device;
        parameterVo._enviroment = this._enviroment;
        parameterVo._isLocal = this._isLocal;
        parameterVo._isMix = this._isMix;
        parameterVo._gameOrigin = this._gameOrigin;
        parameterVo._gameRoot = this._gameRoot;
        parameterVo._localVideo = this._localVideo;
        parameterVo._repair = this._repair;
        parameterVo._appId = this._appId;
        parameterVo._user_id = this._user_id;
        parameterVo._isDebugInfo = this._isDebugInfo;
        parameterVo._sdkVersion = this._sdkVersion;
        parameterVo._gameVersion = this._gameVersion;
        parameterVo._assertPath = this._assertPath;
        parameterVo._coursewareId = this._coursewareId;
        parameterVo._versionCode = this._versionCode;
        parameterVo._courseWareLevel = this._courseWareLevel;
        parameterVo._roomSessionId = this.roomSessionId;
        parameterVo._coursewareUuid = this._coursewareUuid;
        parameterVo._buType = this._buType;
        return parameterVo;
    }

    public getUrl(): string {
        let index = -1;
        let str = '';

        index = this._url.indexOf('?');
        if (index !== -1) {
            str = this._url.substr(1, index);
        } else {
            str = this._url;
        }
        str += `?userMobile=${this._userId}`;
        switch (this._usage) {
            case SDKEnum.GAME_TYPE.PREVIEW:
                str += '&usage=preview';
                break;
            case SDKEnum.GAME_TYPE.CLASS:
                str += '&usage=class';
                break;
            case SDKEnum.GAME_TYPE.REPLAY:
                str += '&usage=replay';
                break;
            case SDKEnum.GAME_TYPE.SPLITSCREEN:
                str += '&usage=splitscreen';
                break;
        }

        switch (this._parentUsage) {
            case SDKEnum.GAME_TYPE.PREVIEW:
                str += '&parentUsage=preview';
                break;
            case SDKEnum.GAME_TYPE.CLASS:
                str += '&parentUsage=class';
                break;
            case SDKEnum.GAME_TYPE.REPLAY:
                str += '&parentUsage=replay';
                break;
        }

        switch (this._role) {
            case SDKEnum.USER_ROLE.STUDENT:
                str += '&role=student';
                break;
            case SDKEnum.USER_ROLE.TEACHER:
                str += '&role=teacher';
                break;
            case SDKEnum.USER_ROLE.OBSERVER:
                str += '&role=watcher';
                break;
            case SDKEnum.USER_ROLE.SELLER:
                str += '&role=seller';
                break;
            case SDKEnum.USER_ROLE.TRAINER:
                str += '&role=trainer';
                break;
        }

        switch (this._courseWare) {
            case SDKEnum.COURSEWARE_TEYPE.ZML:
                str += '&kjType=zml';
                break;
            case SDKEnum.COURSEWARE_TEYPE.ZMG:
                str += '&kjType=zmg';
                break;
        }

        switch (this._device) {
            case SDKEnum.TYPE_DEVICE.TYPE_PC:
                str += '&device=PC';
                break;
            case SDKEnum.TYPE_DEVICE.TYPE_IPAD:
                str += '&device=iPad';
                break;
            case SDKEnum.TYPE_DEVICE.TYPE_APAD:
                str += '&device=aPad';
                break;
            case SDKEnum.TYPE_DEVICE.TYPE_APHONE:
                str += "&device=APhone";
                break;
            case SDKEnum.TYPE_DEVICE.TYPE_IPHONE:
                str += "&device=IPhone";
                break;
        }

        switch (this._repair) {
            case SDKEnum.TYPE_REPAIR.RECORD:
                str += "&repair=record";
                break;
            case SDKEnum.TYPE_REPAIR.PLAY:
                str += "&repair=play";
                break;
        }

        if (this._gameId > 0) {
            str += `&gameId=${this._gameId}`;
        }
        if (this._lessonId !== '') {
            str += `&lessonId=${this._lessonId}`;
        }
        if (this._lessonUid !== '0') {
            str += `&lessonUid=${this._lessonUid}`;
        }
        if (this._localVideo) {
            str += '&localVideo=true';
        }
        if(this._appId !== '0') {
            str += `&appId=${this._appId}`;
        }
        if(this._user_id !== '') {
            str += `&user_id=${this._user_id}`;
        }
        if(this._sdkVersion !== '') {
            str += `&sdkVersion=${this._sdkVersion}`;
        }
        if(this._gameVersion !== '') {
            str += `&gameVersion=${this._gameVersion}`;
        }
        if(this._assertPath !== '') {
            str += `&assertPath=${this._assertPath}`;
        }
        if(this._coursewareId !== '') {
            str += `&coursewareId=${this._coursewareId}`;
        }
        if(this._versionCode !== '') {
            str += `&versionCode=${this._versionCode}`;
        }
        if(this._isLocal) {
            str += `&local=${this._isLocal}`;
        }
        if(this._courseWareLevel !== 0) {
            str += `&courseWareLevel=${this._courseWareLevel}`;
        }
        if(this._roomSessionId !== '') {
            str += `&roomSessionId=${this._roomSessionId}`;
        }
        if(this._coursewareUuid !== '') {
            str += `&coursewareUuid=${this._coursewareUuid}`;
        }

        switch (this._enviroment) {
            case SDKEnum.TYPE_ENVIRONMENT.LOCALHOST:
                str += '&enviroment=localhost';
                break;
            case SDKEnum.TYPE_ENVIRONMENT.TEST:
                str += '&enviroment=test';
                break;
            case SDKEnum.TYPE_ENVIRONMENT.UAT:
                str += '&enviroment=uat';
                break;
            case SDKEnum.TYPE_ENVIRONMENT.PRODUCTION:
                str += '&enviroment=production';
                break;
        }
        if(this._buType) {
            str += `&buType=${this._buType}`;
        }

        return str;
    }

    /**
     * 获取角色枚举
     * @param value
     */
    public getRoleByValue(value: string) {
        let role: SDKEnum.USER_ROLE;

        switch (value) {
            case 'student':
                role = SDKEnum.USER_ROLE.STUDENT;
                break;
            case 'teacher':
                role = SDKEnum.USER_ROLE.TEACHER;
                break;
            case 'watcher':
                role = SDKEnum.USER_ROLE.OBSERVER;
                break;
            case 'seller':
                role = SDKEnum.USER_ROLE.SELLER;
                break;
            case 'trainer':
                role = SDKEnum.USER_ROLE.TRAINER;
                break;
        }
        return role;
    }

    public reset(): void {
        this._isInit = false;
        this._usage = SDKEnum.GAME_TYPE.NORMAL;
        this._role = SDKEnum.USER_ROLE.NONE;
        this._parentUsage = SDKEnum.GAME_TYPE.NORMAL;
        this._courseWare = SDKEnum.COURSEWARE_TEYPE.ZMG;
        this._observerRole = SDKEnum.USER_ROLE.STUDENT;
        this._msgSendModle = SDKEnum.TYPE_MSG.TYPE_POST_MESSAGE;
        this._enviroment = SDKEnum.TYPE_ENVIRONMENT.NONE;
        this._replayType = SDKEnum.TYPE_REPLAY.CLASS;
        this._repair = SDKEnum.TYPE_REPAIR.NONE;
        this._buType = SDKEnum.TYPE_BU.KIDS;
        this._gameId = 0;
        this._lessonId = '';
        this._lessonUid = '0';
        this._userId = '';
        this._user_id = '';
        this._observerId = '';
        this._url = '';
        this._replayMobiles = [];
        this._sessionId = '0';
        this._appId = '0';
        this._isTrain = false;
        this._isLocal = false;
        this._isMix = false;
        this._isOld = false;
        this._gameOrigin = '';
        this._gameRoot = '';
        this._localVideo = false;
        this._isDebugInfo = true;
        this._sdkVersion = '';
        this._gameVersion = '';
        this._assertPath = '';
        this._coursewareId = '';
        this._versionCode = '';
        this._courseWareLevel = 0;
        this._roomSessionId = '';
        this._coursewareUuid = '';
    }

    /** 解析url 获取参数 */
    private getRequest(url: string) {
        const query = {};
        if (url.indexOf('?') !== -1) {
            let str = url.substr(1);
            str = str.replace('?', '&');
            const strs = str.split('&');
            for (let i = 0; i < strs.length; i++) {
                query[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1]);
            }
        }
        this._gameOrigin = window.location.href;
        if (this._gameOrigin.indexOf('?') !== -1) {
            this._gameOrigin = window.location.href.substr(
                0,
                this._gameOrigin.indexOf('?')
            );
        }
        if (this._gameOrigin.lastIndexOf('/') !== -1) {
            this._gameRoot = this._gameOrigin.substr(
                0,
                this._gameOrigin.lastIndexOf('/') + 1
            );
        }

        return query;
    }
}