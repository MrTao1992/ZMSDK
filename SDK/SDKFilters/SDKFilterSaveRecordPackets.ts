import * as SDKLogicsCore from '../SDKLogics/SDKLogicsCore';
import SDKPacket from '../SDKNetwork/SDKPacket';
import * as SDKEnum from '../SDKConst/SDKEnum';
import SDKPacketPool from '../SDKNetwork/SDKPacketPool';
import SDKPackets from '../SDKNetwork/SDKPackets';
import SDKApp from '../SDKBase/SDKApp';
import * as DebugInfo from '../Utils/DebugInfo';

/**
 * 缓存录播课切换场景缓存数据包
 */
export default class SDKFilterSaveRecordPackets {

    public static FILTER_ACTION: Array<string> = [
        'gameChangeScene',
        'gamePrevScene',
        'gameNextScene'
    ];

    public static save(packet: SDKPacket): void {
        let repairInfo = SDKLogicsCore.repairInfo;

        if (!SDKLogicsCore.parameterVo.isRepairRecord) {
            return;
        }

        if (repairInfo.recordState == SDKEnum.TYPE_RECORD_STATE.PLAY) {
            SDKFilterSaveRecordPackets.dispatcher(packet.secene);
            return;
        }

        if (!packet.isMainFrame) {
            return;
        }

        if (SDKFilterSaveRecordPackets.FILTER_ACTION.indexOf(packet.name) != -1) {
            return;
        }

        let seceneName = packet.secene;
        let index = SDKLogicsCore.sceneState.getSceneIndexByName(seceneName);
        if (index == -1) {
            return;
        }
        let tempPacket = SDKPacketPool.Acquire(packet.name);
        packet.clone(tempPacket);
        repairInfo.addStoragePackets(index, tempPacket);

        DebugInfo.info('录播缓存数据包',tempPacket,index);
    }

    public static dispatcher(name: string): void {
        let packet: SDKPacket;
        let tempPacket: SDKPacket;
        let packets: SDKPackets;
        let repairInfo = SDKLogicsCore.repairInfo;

        let index = SDKLogicsCore.sceneState.getSceneIndexByName(name);
        if (index == -1) {
            return;
        }
        packets = repairInfo.getStoragePacketsByIndex(index);

        if (packets) {
            DebugInfo.info('录播要补发的数据包',packets,index);

            let indexA = 0;
            let count = packets.getPacketsCount();
            for (indexA = count - 1; indexA >= 0; indexA--) {
                packet = packets.getPacketByIndex(indexA);
                tempPacket = SDKPacketPool.Acquire(packet.name);
                packet.clone(tempPacket);
                break;
            }
            repairInfo.releaseAllStoragePackets();

            if (tempPacket) {
                DebugInfo.info('录播切场景补发关键帧', tempPacket.name);
                SDKApp.instance().transceiver.sendPacket(tempPacket);
            }
        }
    }
}