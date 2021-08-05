import SDKPacket from './SDKPacket';
import SDKPacketPool from './SDKPacketPool';

export default class SDKPackets {
    protected _packets: SDKPacket[];

    constructor() {
        this.reset();
    }

    public addPacket(value: SDKPacket): void {
        this._packets.push(value);
    }

    public getPacketByIndex(index: number): SDKPacket {
        if (index >= this._packets.length || index < 0) {
            return null;
        }
        return this._packets[index];
    }

    public getPacketsCount(): number {
        return this._packets.length;
    }

    public clear(): void {
        let index = 0,
            count = 0;

        count = this._packets.length;
        for (index = 0; index < count; index++) {
            SDKPacketPool.Release(this._packets[index]);
        }
        this._packets = [];
    }

    public reset(): void {
        this._packets = [];
    }
}