import SDKCommandBase from './SDKCommandBase';
import * as SDKRegistCommand from '../SDKConst/SDKRegistCommand';
import * as SDKLogicsCore from '../SDKLogics/SDKLogicsCore';
import * as DebugInfo from '../Utils/DebugInfo';
import * as SDKEnum from '../SDKConst/SDKEnum';
import SDKApp from '../SDKBase/SDKApp';

/**
 * 监课者刷新重新进入游戏的时候向老师请求老师的教学模式
 */
export default class SDKTeachSplitPageRequestCMD extends SDKCommandBase {
    public execute(data: any): void {
        super.execute(data);

        DebugInfo.info('SDKTeachSplitPageRequestCMD......');

        if (SDKLogicsCore.parameterVo.isTeacher()) {
            if (SDKLogicsCore.controllState.teachingMode == SDKEnum.TEACHING_MODE.TYPE_INSPECTION) {
                SDKApp.instance().transceiver.sendMsg(
                    SDKRegistCommand.TEACH_SPLIT_PAGE_CHANGE,
                    {
                        pageIndex: SDKLogicsCore.controllState.splitPage,
                        isFull: SDKLogicsCore.controllState.isSplitFull,
                        pageMaxSize: SDKLogicsCore.gameConfig.splitPageNumber
                    },
                    false
                );
            }
        }
        this.recylePacket();
    }
}