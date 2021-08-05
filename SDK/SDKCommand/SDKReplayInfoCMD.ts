import SDKCommandBase from './SDKCommandBase';
import * as SDKLogicsCore from '../SDKLogics/SDKLogicsCore';
import SDKReplayController from '../SDKController/SDKReplayController';
import SDKContrllerManager from '../SDKController/SDKContrllerManager';
import * as SDKControllerConst from '../SDKConst/SDKControllerConst';
import * as DebugInfo from '../Utils/DebugInfo';

/**
 * 同步回放信息
 */
export default class SDKReplayInfoCMD extends SDKCommandBase {
    public execute(data: any): void {
        super.execute(data);

        DebugInfo.info('SDKReplayInfoCMD......');

        SDKLogicsCore.ReplayInfo.isPlay = data.playOrPause;
        SDKLogicsCore.ReplayInfo.startTime = data.relativeTime;
        SDKLogicsCore.ReplayInfo.duration = 0;
        if(data['speed']) {
            SDKLogicsCore.ReplayInfo.speed = data['speed'];
        }

        let replayController: SDKReplayController;
        replayController = SDKContrllerManager.instance().getController(
            SDKControllerConst.REPLAY
        ) as SDKReplayController;
        if (replayController) {
            if (SDKLogicsCore.ReplayInfo.isPlay) {
                replayController.play();
            } else {
                replayController.stop();
            }
        }

        this.recylePacket();
    }
}