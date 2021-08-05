import SDKCommandBase from './SDKCommandBase';
import * as SDKLogicsCore from '../SDKLogics/SDKLogicsCore';
import SDKPacket from '../SDKNetwork/SDKPacket';
import SDKApp from '../SDKBase/SDKApp';
import SDKPacketPool from '../SDKNetwork/SDKPacketPool';
import * as DebugInfo from '../Utils/DebugInfo';

/**
 *  老师返回最新的状态
 */
export default class SDKSyncTeacherRepondCMD extends SDKCommandBase {
    public execute(data: any): void {
        super.execute(data);

        DebugInfo.info('SDKSyncTeacherRepondCMD......', data);

        if (SDKLogicsCore.parameterVo.isStudent()) {
            let packet: SDKPacket;

            SDKLogicsCore.controllState.controllerId = data.controllerId;
            packet = SDKApp.instance().transceiver.messageToPacket(
                data.mainFrame
            );
            if (!packet) {
                return;
            }

            if (packet.name !== 'gameChangeScene') {
                this.checkChangeScene(packet);
                if (data.controllerId !== '' && data.controllerId !== '-1') {
                    SDKApp.instance().packetHandler.dispatcherCMD(packet);
                }
            } else {
                const sceneName: string = packet.data;
                SDKApp.instance().packetHandler.dispatcherCMD(packet);
                this.initScene(sceneName);
            }
        }

        this.recylePacket();
    }

    private checkChangeScene(packet: SDKPacket): void {
        let tempPacket: SDKPacket;

        tempPacket = SDKPacketPool.Acquire(packet.name);
        packet.clone(tempPacket);
        tempPacket.name = 'gameChangeScene';
        tempPacket.sendId = SDKLogicsCore.parameterVo.userId;
        tempPacket.data = packet.secene;

        SDKApp.instance().packetHandler.dispatcherCMD(tempPacket);
    }

    private initScene(sceneName: string): void {
        let tempPacket: SDKPacket;

        tempPacket = SDKPacketPool.Acquire('gameSceneReset');
        tempPacket.sendId = SDKLogicsCore.parameterVo.userId;
        tempPacket.isMainFrame = false;
        tempPacket.data = sceneName;

        SDKApp.instance().packetHandler.dispatcherCMD(tempPacket);
    }
}
