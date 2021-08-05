export default class SDKTrackVo {
    private _appVersion: string;
    private _deviceId: string;
    private _coursewareId: string;

    public get appVersion(): string {
        return this._appVersion;
    }

    public set appVersion(value: string) {
        this._appVersion = value;
    }

    public get deviceId(): string {
        return this._deviceId;
    }

    public set deviceId(value: string) {
        this._deviceId = value;
    }

    public get coursewareId(): string {
        return this._coursewareId;
    }

    public set coursewareId(value: string) {
        this._coursewareId = value;
    }

    constructor() {
        this.reset();
    }

    public reset(): void {
        this._appVersion = '0';
        this._deviceId = '0';
        this._coursewareId = '0';
    }
}