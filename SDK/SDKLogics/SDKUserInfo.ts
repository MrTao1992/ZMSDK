import * as SDKEnum from '../SDKConst/SDKEnum';
import SDKPacket from '../SDKNetwork/SDKPacket';
import SDKPacketPool from '../SDKNetwork/SDKPacketPool';

export default class SDKUserInfo {
    private _userId: string;
    private _name: string;
    private _avatar: string;
    private _watchMobile: string;
    private _role: SDKEnum.USER_ROLE;
    private _replayMobiles: string[];
    private _packets: SDKPacket[];
    private _historyCount: number;

    private MAX: number = 200;
    private _isActive: boolean;
    private _isSplitReady: boolean;
    private _isClear: boolean;
    private _isHistoryReq: boolean;
    private _isHistoryRes: boolean;

    constructor() {
        this.reset();
    }

    public clear(): void {
        let index = 0,
            count = 0;

        count =
            this._packets.length > this.MAX ? this.MAX : this._packets.length;
        for (index = 0; index < count; index++) {
            SDKPacketPool.Release(this._packets[index]);
        }
        if (count > 0) {
            this._packets.splice(0, count);
        }
    }

    public get userId(): string {
        return this._userId;
    }

    public set userId(value: string) {
        this._userId = value;
    }

    public get name(): string {
        return this._name;
    }

    public set name(value: string) {
        this._name = value;
    }

    public get avatar(): string {
        return this._avatar;
    }

    public set avatar(value: string) {
        this._avatar = value;
    }

    public get role(): SDKEnum.USER_ROLE {
        return this._role;
    }

    public set role(value: SDKEnum.USER_ROLE) {
        this._role = value;
    }

    public get isActive(): boolean {
        return this._isActive;
    }

    public set isActive(value: boolean) {
        this._isActive = value;
    }

    public get isSplitReady(): boolean {
        return this._isSplitReady;
    }

    public set isSplitReady(value: boolean) {
        this._isSplitReady = value;
    }

    /** 被监测的对象 */
    public set watchMobile(value: string) {
        this._watchMobile = value;
    }

    /** 被监测的对象 */
    public get watchMobile(): string {
        return this._watchMobile;
    }

    public get historyCount(): number {
        return this._historyCount;
    }

    public set historyCount(value: number) {
        this._historyCount = value;
    }

    public get isHistoryReq(): boolean {
        return this._isHistoryReq;
    }

    public set isHistoryReq(value: boolean) {
        this._isHistoryReq = value;
    }

    public get isHistoryRes(): boolean {
        return this._isHistoryRes;
    }

    public set isHistoryRes(value: boolean) {
        this._isHistoryRes = value;
    }

    /**
     * 添加回放的学生id
     * @param userId 学生id
     */
    public addReplayMobile(userId: string): void {
        if (this._replayMobiles.indexOf(userId) === -1) {
            this._replayMobiles.push(userId);
        }
    }

    public getReplayMobileByIndex(index: number): string {
        if (index < this._replayMobiles.length) {
            return this._replayMobiles[index];
        }
    }

    public get replayCount(): number {
        return this._replayMobiles.length;
    }

    public addPacket(value: SDKPacket): void {
        if (value.isMainFrame && this._packets.length >= this.MAX) {
            if (!this._isClear) {
                this._isClear = true;
                setTimeout(() => {
                    this.clear();
                    this._isClear = false;
                }, 100);
            }
        }
        this._packets.push(value);
    }

    public getPacketByIndex(index: number): SDKPacket {
        if (index >= this._packets.length) {
            return null;
        }
        return this._packets[index];
    }

    /**
     * 获取最后一个主状态
     */
    public getLastMainPacket(): SDKPacket {
        let index = 0,
            count = 0;

        count = this._packets.length;
        for (index = count - 1; index >= 0; index--) {
            if (this._packets[index].isMainFrame) {
                return this._packets[index];
            }
        }
        return null;
    }

    /**
     * 获取最后一个主状态的下标
     */
    public getLastMainIndex(): number {
        let index = 0,
            count = 0;

        count = this._packets.length;
        for (index = count - 1; index >= 0; index--) {
            if (this._packets[index].isMainFrame) {
                return index;
            }
        }
        return -1;
    }

    public count(): number {
        return this._packets.length;
    }

    public reset(): void {
        this._userId = '';
        this._watchMobile = '';
        this._name = '';
        this._avatar = '';
        this._packets = [];
        this._isActive = false;
        this._isSplitReady = false;
        this._historyCount = 0;
        this._replayMobiles = [];
        this._role = SDKEnum.USER_ROLE.NONE;
        this._isClear = false;
        this._isHistoryReq = false;
        this._isHistoryRes = false;
    }
}
