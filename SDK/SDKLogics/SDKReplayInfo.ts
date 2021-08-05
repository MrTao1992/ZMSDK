import SDKPacket from '../SDKNetwork/SDKPacket';
import SDKPackets from '../SDKNetwork/SDKPackets';

export default class SDKReplayInfo {
    private _total: number;
    private _duration: number;
    private _isPlay: boolean;
    private _startTime: number;
    private _speed: number;
    private _packets: { [key: string]: SDKPackets };

    constructor() {
        this.reset();
    }

    public get duration(): number {
        return this._duration;
    }

    public set duration(value: number) {
        this._duration = value;
    }

    public get total(): number {
        return this._total;
    }

    public set total(value: number) {
        this._total = value;
    }

    public get isPlay(): boolean {
        return this._isPlay;
    }

    public set isPlay(value: boolean) {
        this._isPlay = value;
    }

    public get startTime(): number {
        return this._startTime;
    }

    public set startTime(value: number) {
        this._startTime = value;
    }

    public curTime(): number {
        return this._startTime + this._duration;
    }

    public set speed(value: number) {
        this._speed = value;
    }

    public get speed(): number {
        return this._speed;
    }

    public addPacket(userId: string, value: SDKPacket): void {
        if (!this._packets[userId + '_' + value.id]) {
            this._packets[userId + '_' + value.id] = new SDKPackets();
        }
        this._packets[userId + '_' + value.id].addPacket(value);
    }

    /**
     * 获取回放起始包下标
     * @param gameId
     * @param userId
     * @param time
     */
    public getReplayStartIndex(
        gameId: number,
        userId: string,
        time: number
    ): number {
        let packet: SDKPacket;
        let packets: SDKPackets;
        let startIndex: number;

        if (!this._packets[userId + '_' + gameId]) {
            return -1;
        }
        packets = this._packets[userId + '_' + gameId];

        startIndex = 0;
        let index = 0,
            count = 0;
        count = packets.getPacketsCount();
        for (index = 0; index < count; index++) {
            packet = packets.getPacketByIndex(index);
            if (
                packet.isMainFrame &&
                packet.relativeTime <= time
            ) {
                startIndex = index;
            } else if (packet.relativeTime > time) {
                break;
            }
        }
        return startIndex;
    }

    /**
     * 获取回放包根据index
     * @param gameId
     * @param userId
     * @param index
     */
    public getReplayPacketByIndex(
        gameId: number,
        userId: string,
        index: number
    ): SDKPacket {
        if (!this._packets[userId + '_' + gameId]) {
            return null;
        }

        return this._packets[userId + '_' + gameId].getPacketByIndex(index);
    }

    public getPacketsCount(userId: string, gameId: number): number {
        if (this._packets[userId + '_' + gameId]) {
            return this._packets[userId + '_' + gameId].getPacketsCount();
        }
        return 0;
    }

    public clear(): void {
        this._packets = {};
    }

    public reset(): void {
        this._total = 0;
        this._duration = 0;
        this._isPlay = false;
        this._startTime = 0;
        this._packets = {};
        this._speed = 1;
    }
}
