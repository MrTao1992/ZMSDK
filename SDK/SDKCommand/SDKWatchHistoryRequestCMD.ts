import SDKCommandBase from './SDKCommandBase';
import * as SDKLogicsCore from '../SDKLogics/SDKLogicsCore';
import SDKUserInfo from '../SDKLogics/SDKUserInfo';
import * as ZMSDK from '../ZMSDK';
import * as SDKRegistCommand from '../SDKConst/SDKRegistCommand';
import * as DebugInfo from '../Utils/DebugInfo';
import SDKApp from '../SDKBase/SDKApp';

/**
 * 监课模式请求被监课的用户历史信息
 */
export default class SDKWatchHistoryRequestCMD extends SDKCommandBase {
    public execute(data: any): void {
        super.execute(data);

        let index = 0,
            count = 0;
        let userInfo: SDKUserInfo;

        DebugInfo.info('SDKWatchHistoryRequestCMD......');

        if (!SDKLogicsCore.parameterVo.isGameObserver()) {
            return;
        }

        if (SDKLogicsCore.parameterVo.observerId === '') {
            return;
        }

        const teacherId = SDKLogicsCore.userInfos.getTeacherId();

        // 监课模式请求历史记录信息
        count = SDKLogicsCore.userInfos.getCount();
        for (index = 0; index < count; index++) {
            userInfo = SDKLogicsCore.userInfos.getUserInfoByIndex(index);
            if (userInfo.isActive) {
                if (
                    SDKLogicsCore.parameterVo.observerId === teacherId ||
                    SDKLogicsCore.parameterVo.observerId === userInfo.userId
                ) {
                    SDKApp.instance().transceiver.sendMsg(
                        SDKRegistCommand.GET_GAME_HISTORY,
                        userInfo.userId,
                        false
                    );
                }
            }
        }
    }
}
