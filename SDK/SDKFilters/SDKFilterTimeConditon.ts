export default class SDKFilterTimeConditon {

    public static instance(): SDKFilterTimeConditon {
        if (!SDKFilterTimeConditon._instance) {
            SDKFilterTimeConditon._instance = new SDKFilterTimeConditon();
        }
        return SDKFilterTimeConditon._instance;
    }
    private static _instance: SDKFilterTimeConditon;

    constructor() {
        if (SDKFilterTimeConditon._instance) {
            throw console.error('this object is had already!');
        }
        SDKFilterTimeConditon._instance = this;
        this.initData();
    }

    protected _state = {}
    protected _cmds = {}
    protected initData(){
        this._cmds = {
            'voiceAnswerSyncSync': 100
        }
    }

    public isCanSend(action: string): boolean {
        if (!this._cmds[action]) {
            return true;
        } else {
            let time = this._state[action];
            let curTime = new Date().getTime();
            if(!time || curTime - time >= this._cmds[action]) {
                this._state[action] = curTime;
                return true;
            }
        }
        return false;
    }
}