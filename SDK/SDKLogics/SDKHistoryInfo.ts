import SDKPacket from '../SDKNetwork/SDKPacket';
import SDKPackets from '../SDKNetwork/SDKPackets';

export default class SDKHistoryInfo {
    private _userIds: number[];
    private _userMsgs: any;
    private _packets: SDKPackets[];
    private _isParse: boolean;

    /** 临时存储的历史信息 */
    private _historyMsgs: any;

    constructor() {
        this.reset();
    }

    public get isParse(): boolean {
        return this._isParse;
    }

    public set isParse(value: boolean) {
        this._isParse = value;
    }

    public set historyMsgs(value: any) {
        this._historyMsgs = value;
    }

    public get historyMsgs(): any {
        return this._historyMsgs;
    }

    public set userMsgs(value: any) {
        this._userMsgs = value;
    }

    public get userMsgs(): any {
        return this._userMsgs;
    }

    public addPacket(userId: number, value: SDKPacket): void {
        if (this._userIds.indexOf(userId) === -1) {
            this._userIds.push(userId);
            this._packets.push(new SDKPackets());
        }

        const index = this._userIds.indexOf(userId);
        this._packets[index].addPacket(value);
    }

    public getPacketByIndex(userId: number, index: number): SDKPacket {
        if (this._userIds.indexOf(userId) === -1) {
            return null;
        }

        const userIndex = this._userIds.indexOf(userId);
        return this._packets[userIndex].getPacketByIndex(index);
    }

    public getLastPacket(userId): SDKPacket {
        if (this._userIds.indexOf(userId) === -1) {
            return null;
        }

        const userIndex = this._userIds.indexOf(userId);
        const packets = this._packets[userIndex];
        if (packets.getPacketsCount() === 0) {
            return null;
        }
        return packets.getPacketByIndex(packets.getPacketsCount() - 1);
    }

    public getPacketsCount(userId: number): number {
        if (this._userIds.indexOf(userId) === -1) {
            return 0;
        }

        const userIndex = this._userIds.indexOf(userId);
        return this._packets[userIndex].getPacketsCount();
    }

    public clear(): void {
        let index = 0,
            count = 0;

        count = this._packets.length;
        for (index = 0; index < count; index++) {
            this._packets[index].clear();
        }
        this._packets = [];
        this._userIds = [];
        this._userMsgs = {};
        this._historyMsgs = null;
    }

    public reset(): void {
        this._historyMsgs = null;
        this._packets = [];
        this._userIds = [];
        this._userMsgs = {};
        this._isParse = false;
    }
}
