import * as SDKEnum from '../SDKConst/SDKEnum';
import * as SDKLogicsCore from '../SDKLogics/SDKLogicsCore';

interface SpeechTitleVo {
    titleNum: number,
    answerTime: number,
    answerFeedBackTime: number
}

interface VoiceAnswerVo {
    // pageNum: number,
    // pageType: number,
    // quizTime: number,
    // speechTitle: SpeechTitleVo

    answerFeedBackTime: number,
    answerTime: number,
    pageNum: number,
    titleNum: number
    titleType: "speech"
}

interface VoiceAnswerContent {
    Id: string,
    languageMode: string,
    textTypeCode: string,
    textContent: string,
    answerTime: number,
    answerFeedBackTime: number,
    identificationIndex: number,
    speechNum: number,
    keyWords: string,
    textcode: string,
    playStudentAudio: boolean
}

export interface VoiceAnswerState {
    userId: string,
    isBegin: boolean,
    toTalDuration: number,
    progress: number,
    content: string,
    isEnd: boolean,
    voiceUrl: string,
    fluent: SDKEnum.VOICE_EVALUATE,
    accuracy: SDKEnum.VOICE_EVALUATE,
    score: number,
    voiceTime: number,
    uploadSuccess: boolean,
    isPrivateChat: boolean,
    isSupport: boolean,
    isSuccess: boolean,
    isSettlementSuc:boolean,
    isSettlement:boolean
}

export default class SDKVoiceAnswerInfo {
    private _voiceAnswerList: Array<VoiceAnswerVo>;
    private _voiceAnswerContent: VoiceAnswerContent;
    private _countDownEnd: number;
    private _voiceAnswerStates: Array<VoiceAnswerState>;

    constructor() {
        this._voiceAnswerList = [];
        this._voiceAnswerStates = [];
        this.reset();
    }

    public set voiceAnswerList(value: any) {
        this._voiceAnswerList = value;
    }

    public set voiceAnswerContent(value: any) {
        this._voiceAnswerContent = value;
    }

    public get voiceAnswerContent(): any {
        return this._voiceAnswerContent;
    }

    public set countDownEnd(value: number) {
        this._countDownEnd = value;
    }

    public get countDownEnd(): number {
        return this._countDownEnd;
    }

    public getKeywords(): Array<string> {
        if (this._voiceAnswerContent) {
            return this._voiceAnswerContent.keyWords.split(/[#|]/);
        } else {
            return [];
        }
    }

    public getVoiceAnswerStateById(userId: string): VoiceAnswerState {
        let index = 0;
        let count = 0;

        count = this._voiceAnswerStates.length;
        for (index = 0; index < count; index++) {
            if (this._voiceAnswerStates[index].userId == userId) {
                return this._voiceAnswerStates[index];
            }
        }
        let obj: VoiceAnswerState = {
            userId: userId,
            isBegin: false,
            toTalDuration: 0,
            progress: 0,
            content: '',
            isEnd: false,
            voiceUrl: '',
            fluent: SDKEnum.VOICE_EVALUATE.NONE,
            accuracy: SDKEnum.VOICE_EVALUATE.NONE,
            score: 0,
            voiceTime: 0,
            uploadSuccess: false,
            isPrivateChat: false,
            isSupport: false,
            isSuccess: true,
            isSettlementSuc: true,
            isSettlement: false
        }
        this._voiceAnswerStates.push(obj);
        return obj;
    }

    public isVoiceAnswer(): boolean {
        let index: number = 0;
        let count: number = 0;

        count = this._voiceAnswerList.length;
        for (index = 0; index < count; index++) {
            if (this._voiceAnswerList[index].pageNum == SDKLogicsCore.sceneState.curIndex) {
                if (this._voiceAnswerList[index].titleNum > 0) {
                    return true;
                }
            }
        }
        return false;
    }

    public getAnswertTime(): number {
        let index: number = 0;
        let count: number = 0;

        count = this._voiceAnswerList.length;
        for (index = 0; index < count; index++) {
            if (this._voiceAnswerList[index].pageNum == SDKLogicsCore.sceneState.curIndex) {
                return this._voiceAnswerList[index].answerTime;
            }
        }
        return 0;
    }

    public isAnswerBegin(): boolean {
        let index: number = 0;
        let count: number = 0;

        count = this._voiceAnswerStates.length;
        for (index = 0; index < count; index++) {
            if (this._voiceAnswerStates[index].isBegin) {
                return true;
            }
        }
        return false;
    }

    public resetVoiceAnswerStatesById(userId: string) {
        this._voiceAnswerStates.forEach(element => {
            if(element.userId == userId) {
                element.isBegin = false;
                element.isEnd = false;
                element.accuracy = SDKEnum.VOICE_EVALUATE.NONE;
                element.fluent = SDKEnum.VOICE_EVALUATE.NONE;
                element.content = '';
                element.progress = 0;
                element.score = 0;
                element.toTalDuration = 0;
                element.uploadSuccess = false;
                element.voiceUrl = '';
                element.isSuccess = true;
                element.isSettlementSuc = true;
                element.isSettlement = false;
                return;
            }
        });
    }

    public reset(): void {
        this._voiceAnswerContent = null;
        this._countDownEnd = -1;
        this._voiceAnswerStates.forEach(element => {
            element.isBegin = false;
            element.isEnd = false;
            element.accuracy = SDKEnum.VOICE_EVALUATE.NONE;
            element.fluent = SDKEnum.VOICE_EVALUATE.NONE;
            element.content = '';
            element.progress = 0;
            element.score = 0;
            element.toTalDuration = 0;
            element.uploadSuccess = false;
            element.voiceUrl = '';
            element.isSuccess = true;
            element.isSettlementSuc = true;
            element.isSettlement = false;
        });
    }
}