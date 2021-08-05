import * as SDKLogicsCore from '../SDKLogics/SDKLogicsCore';

export default class SDKLessonInfo {
    private _lessonId: string;
    private _startTime: number;
    private _endTime: number;
    private _courseName: string;
    private _lessonUID: string;

    constructor() {
        this.reset();
    }

    public get lessonId(): string {
        return this._lessonId;
    }

    public set lessonId(value: string) {
        this._lessonId = value;
    }

    public get startTime(): number {
        return this._startTime;
    }

    public set startTime(value: number) {
        this._startTime = value;
    }

    public get endTime(): number {
        return this._endTime;
    }

    public set endTime(value: number) {
        this._endTime = value;
    }

    public get courseName(): string {
        return this._courseName;
    }

    public set courseName(value: string) {
        this._courseName = value;
    }

    public set lessonUID(value: string) {
        this._lessonUID = value;
    }

    public get lessonUID(): string {
        if (this._lessonUID === '0' || this._lessonUID === '') {
            return SDKLogicsCore.parameterVo.lessonUid;
        }
        return this._lessonUID;
    }

    public reset(): void {
        this._lessonId = '0';
        this._lessonUID = '0';
        this._courseName = '0';
        this._startTime = 0;
        this._endTime = 0;
    }
}
