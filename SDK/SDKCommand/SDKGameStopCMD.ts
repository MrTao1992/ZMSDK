import SDKCommandBase from './SDKCommandBase';
import SDKApp from '../SDKBase/SDKApp';
import * as ZMSDK from '../ZMSDK';
import * as SDKLogicsCore from '../SDKLogics/SDKLogicsCore';
import * as SDKEnum from '../SDKConst/SDKEnum';
import * as DebugInfo from '../Utils/DebugInfo';

/**
 * 处理ZML课件发送到课件的用户信息
 */
export default class SDKGameStopCMD extends SDKCommandBase {

    public execute(data: any): void {
        super.execute(data);

        DebugInfo.info('SDKGameStopCMD......');

        if (SDKLogicsCore.parameterVo.isGameReplay() ||
            SDKLogicsCore.parameterVo.isRepairPlay ||
            SDKLogicsCore.parameterVo.parentUsage == SDKEnum.GAME_TYPE.REPLAY) {
            SDKApp.instance().packetHandler.notifyCMD("gameReplayPlay", 2);
        }

        SDKApp.instance().thirdInterface.pause();

        this.recylePacket();
    }
}