import SDKCommandBase from './SDKCommandBase';
import SDKApp from '../SDKBase/SDKApp';
import * as SDKLogicsCore from '../SDKLogics/SDKLogicsCore';
import * as SDKEnum from '../SDKConst/SDKEnum';
import * as DebugInfo from '../Utils/DebugInfo';

/**
 * 处理ZML课件发送到课件的用户信息
 */
export default class SDKGameResumeCMD extends SDKCommandBase {
    public execute(data: any): void {
        super.execute(data);

        DebugInfo.info('SDKGameResumeCMD......');

        SDKApp.instance().thirdInterface.resume();
        if (SDKLogicsCore.parameterVo.isGameReplay() ||
            SDKLogicsCore.parameterVo.isRepairPlay ||
            SDKLogicsCore.parameterVo.parentUsage == SDKEnum.GAME_TYPE.REPLAY) {
            SDKApp.instance().packetHandler.notifyCMD("gameReplayPlay", 1);
        }

        this.recylePacket();
    }
}