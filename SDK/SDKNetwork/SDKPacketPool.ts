/**
 * SDKPacketPool：
 * SDKPacket对象池
 */

import SDKPacket from './SDKPacket';
import SDKRecord from './SDKRecord';
import SDKPageRecord from './SDKPageRecord';
import SDKMousePacket from "./SDKMousePacket";

let _packets: SDKPacket[] = [];
let _records: SDKRecord[] = [];
let _pageRecords: SDKPageRecord[] = [];
let _mousePackets: Array<SDKMousePacket> = [];

export default class SDKPacketPool {
    public static Acquire(name: string): SDKPacket {
        let packet: SDKPacket;

        if (_packets.length > 0) {
            packet = _packets.pop();
            packet.name = name;
        } else {
            packet = new SDKPacket(name);
        }
        return packet;
    }

    public static Clone(packet: SDKPacket, action: string): SDKPacket {
        let tempPacket: SDKPacket;
        tempPacket = SDKPacketPool.Acquire(action);
        packet.clone(tempPacket);
        tempPacket.action = action;
        return tempPacket;
    }

    public static Release(value: SDKPacket): void {
        if (!value || value.name === '') {
            return;
        }
        value.reset();
        _packets.push(value);
    }

    public static AcquireRecord(name: string): SDKRecord {
        let record: SDKRecord;

        if (_records.length > 0) {
            record = _records.pop();
            record.event_id = name;
        } else {
            record = new SDKRecord(name);
        }
        return record;
    }

    public static ReleaseRecord(value: SDKRecord): void {
        if (!value || value.event_id === '') {
            return;
        }
        value.reset();
        _records.push(value);
    }

    public static AcquirePageRecord(name: string): SDKPageRecord {
        let record: SDKPageRecord;

        if (_pageRecords.length > 0) {
            record = _pageRecords.pop();
            record.page_name = name;
        } else {
            record = new SDKPageRecord(name);
        }
        return record;
    }

    public static AcquireMousePacket(name: string): SDKMousePacket {
        let packet: SDKMousePacket;

        if (_mousePackets.length > 0) {
            packet = _mousePackets.pop();
            packet.name = name;
        } else {
            packet = new SDKMousePacket(name);
        }
        return packet;
    }

    public static ReleaseMousePacket(value: SDKMousePacket): void {
        if (!value || value.name == "") {
            return;
        }
        value.reset();
        _mousePackets.push(value);
    }

    public static ReleasePageRecord(value: SDKPageRecord): void {
        if (!value || value.page_name === '') {
            return;
        }
        value.reset();
        _pageRecords.push(value);
    }

    public static Destroy(): void {
        SDKPacketPool.releasePool(_packets);
        _packets = null;

        SDKPacketPool.releasePool(_records);
        _records = null;

        SDKPacketPool.releasePool(_pageRecords);
        _pageRecords = null;
    }

    private static releasePool(pool): void {
        let index = 0,
            count = 0;

        count = pool.length;
        for (index = 0; index < count; index++) {
            pool[index] = null;
        }
    }
}
