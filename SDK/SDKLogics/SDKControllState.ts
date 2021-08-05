import * as SDKENUM from '../SDKConst/SDKEnum';
import * as SDKLogicsCore from './SDKLogicsCore';

export default class SDKControllState {
    /** 教学模式 */
    protected _teachingMode: SDKENUM.TEACHING_MODE;
    /** 分屏页码*/
    protected _splitPage: number;
    /** 分屏全屏*/
    protected _isSplitFull: boolean;
    /** 控制者id */
    protected _controllerId: string;
    /** 是否同步老师 */
    protected _isSyncTeacher: boolean;
    /** 记录学生上台前的教学模式*/
    protected _oldTeachingMode: SDKENUM.TEACHING_MODE;
    /** 记录初始化上台状态*/
    protected _onStageState: object;

    constructor() {
        this.reset();
    }

    public get controllerId(): string {
        return this._controllerId;
    }

    public set controllerId(value: string) {
        this._controllerId = value;
    }

    public set teachingMode(value: SDKENUM.TEACHING_MODE) {
        this._teachingMode = value;
    }

    public get teachingMode(): SDKENUM.TEACHING_MODE {
        return this._teachingMode;
    }

    public set oldTeachingMode(value: SDKENUM.TEACHING_MODE) {
        this._oldTeachingMode = value;
    }

    public get oldTeachingMode(): SDKENUM.TEACHING_MODE {
        return this._oldTeachingMode;
    }

    public get isSyncTeacher(): boolean {
        return this._isSyncTeacher;
    }

    public set isSyncTeacher(value: boolean) {
        this._isSyncTeacher = value;
    }

    public isTeaching(): boolean {
        return this._teachingMode == SDKENUM.TEACHING_MODE.TYPE_TEACHING;
    }

    public isInspection(): boolean {
        return this._teachingMode == SDKENUM.TEACHING_MODE.TYPE_INSPECTION;
    }

    public set onStageState(value: object) {
        this._onStageState = value;
    }

    public get onStageState(): object {
        return this._onStageState;
    }

    /**
     * 自己是否是控制者
     */
    public isOwn(): boolean {
        // -1表示 所有的人都是控制者。。。都可以自由的玩游戏
        if (!SDKLogicsCore.parameterVo.isGameClass()) {
            return false;
        }
        if (
            !SDKLogicsCore.parameterVo.isStudent() &&
            !SDKLogicsCore.parameterVo.isTeacher()
        ) {
            return false;
        }

        return (
            this._controllerId === SDKLogicsCore.parameterVo.userId ||
            this._controllerId === '-1'
        );
    }

    /**
     * 自己是否是完全控制着。。。只能有且只有自己一个人操作
     */
    public isFullOwn(): boolean {
        if (!SDKLogicsCore.parameterVo.isGameClass()) {
            return false;
        }
        if (
            !SDKLogicsCore.parameterVo.isStudent() &&
            !SDKLogicsCore.parameterVo.isTeacher()
        ) {
            return false;
        }

        return this._controllerId === SDKLogicsCore.parameterVo.userId;
    }

    public isObserverOwn(): boolean {
        if (!SDKLogicsCore.parameterVo.isGameObserver()) {
            return false;
        }
        return (
            this._controllerId === SDKLogicsCore.parameterVo.observerId ||
            this._controllerId === '-1'
        );
    }

    public isOberverFullOwn(): boolean {
        if (!SDKLogicsCore.parameterVo.isGameObserver()) {
            return false;
        }
        return this._controllerId === SDKLogicsCore.parameterVo.observerId;
    }

    public isReplayOwn(): boolean {
        if (!SDKLogicsCore.parameterVo.isGameReplay()) {
            return false;
        }
        return (
            this._controllerId === SDKLogicsCore.parameterVo.replayId ||
            this._controllerId === '-1'
        );
    }

    public isReplayFullOwn(): boolean {
        if (!SDKLogicsCore.parameterVo.isGameReplay()) {
            return false;
        }
        return this._controllerId === SDKLogicsCore.parameterVo.replayId;
    }

    public set splitPage(value: number) {
        this._splitPage = value;
    }

    public get splitPage(): number {
        return this._splitPage;
    }

    public set isSplitFull(value: boolean) {
        this._isSplitFull = value;
    }

    public get isSplitFull(): boolean {
        return this._isSplitFull;
    }

    public reset(): void {
        this._controllerId = '';
        this._isSyncTeacher = true;
        this._onStageState = null;
        this._isSplitFull = false;
        this._splitPage = 0;
        this._teachingMode = SDKENUM.TEACHING_MODE.TYPE_TEACHING;
        this._oldTeachingMode = SDKENUM.TEACHING_MODE.TYPE_TEACHING;
    }
}