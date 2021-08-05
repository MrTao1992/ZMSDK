import SDKCommandBase from './SDKCommandBase';
import * as SDKRegistCommand from '../SDKConst/SDKRegistCommand';
import SDKApp from '../SDKBase/SDKApp';
import SDKPacketPool from '../SDKNetwork/SDKPacketPool';
import * as SDKLogicsCore from '../SDKLogics/SDKLogicsCore';
import * as DebugInfo from '../Utils/DebugInfo';

/**
 * 处理ZML课件发送到游戏的历史记录信息....用来做断点恢复
 */

export default class SDKGameHistoryCMD extends SDKCommandBase {
    public execute(data: any): void {
        super.execute(data);

        if (!SDKLogicsCore.parameterVo.isZML()) {
            return;
        }

        DebugInfo.info('SDKGameHistoryCMD.....', data);

        SDKLogicsCore.historyInfo.historyMsgs = data;

        // 通知历史记录恢复
        const packet = SDKPacketPool.Acquire(
            SDKRegistCommand.GAME_PARSE_HISTORY
        );
        SDKApp.instance().packetHandler.dispatcherCMD(packet);

        this.recylePacket();
    }
}
