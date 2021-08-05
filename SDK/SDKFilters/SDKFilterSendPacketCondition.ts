import SDKPacket from '../SDKNetwork/SDKPacket';
import * as SDKLogicsCore from '../SDKLogics/SDKLogicsCore';
import * as SDKRegistCommand from '../SDKConst/SDKRegistCommand';
import * as DebugInfo from '../Utils/DebugInfo';

export default class SDKFilterSendPacketCondition {

    /**
     * 能否发送数据包
     * @param packet 数据包
     */
    public static isCanSend(packet: SDKPacket): boolean {
        if (packet === undefined || packet.name === '') {
            DebugInfo.error('send packet is error:', packet);
            return false;
        }

        if (
            !SDKLogicsCore.parameterVo.isGameClass() &&
            !SDKLogicsCore.parameterVo.isSplitScreen() &&
            !SDKLogicsCore.parameterVo.isGameReplay()
        ) {
            DebugInfo.error(
                '发送消息错误：不是上课模式,也不是分屏模式,请检测发送消息的逻辑代码'
            );
            return false;
        }

        if (
            !SDKLogicsCore.controllState.isOwn() &&
            SDKRegistCommand.EVENTS_LIST.indexOf(packet.name) === -1 &&
            SDKRegistCommand.EVENT_CHECK.indexOf(packet.name) === -1
        ) {
            if (!SDKLogicsCore.controllState.isOwn()) {
                DebugInfo.error(
                    '发送消息错误：自己没有操作权限.当前权限ID:',
                    SDKLogicsCore.controllState.controllerId
                );
            } else {
                DebugInfo.error(
                    '发送消息错误：不是SDKRegistCommand.EVENTS_LIST里的系统消息:',
                    packet.name
                );
            }
            return false;
        }

        return true;
    }
}