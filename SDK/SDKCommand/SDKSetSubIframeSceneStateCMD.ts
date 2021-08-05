import SDKCommandBase from './SDKCommandBase';
import SDKApp from '../SDKBase/SDKApp';
import SDKPacket from '../SDKNetwork/SDKPacket';
import SDKPacketPool from '../SDKNetwork/SDKPacketPool';

/**
 * 设置子iframe的场景信息
 */
export default class SDKSetSubIframeSceneStateCMD extends SDKCommandBase {
    public execute(data: any): void {
        super.execute(data);

        let packet: SDKPacket;
        packet = SDKPacketPool.Acquire(this._packet.name);
        this._packet.clone(packet);
        packet.name = 'gameVideoReset';

        SDKApp.instance().transceiver.packetHandler.dispatcherCMD(packet);

        this.recylePacket();
    }
}