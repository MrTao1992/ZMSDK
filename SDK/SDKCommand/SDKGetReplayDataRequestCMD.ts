import SDKCommandBase from './SDKCommandBase';
import * as SDKLogicsCore from '../SDKLogics/SDKLogicsCore';
import * as SDKConfigConst from '../SDKConst/SDKConfigConst';
import * as SDKRegistCommand from '../SDKConst/SDKRegistCommand';
import SDKApp from '../SDKBase/SDKApp';
import SDKUserInfo from '../SDKLogics/SDKUserInfo';
import * as SDKEnum from '../SDKConst/SDKEnum';
import SDKWebDashBoradController from '../SDKController/SDKWebDashBoradController';
import SDKContrllerManager from '../SDKController/SDKContrllerManager';
import * as SDKControllerConst from '../SDKConst/SDKControllerConst';
import * as DebugInfo from '../Utils/DebugInfo';

/**
 * 拉取回放数据请求
 */
export default class SDKGetReplayDataRequestCMD extends SDKCommandBase {
    private _isComplete: number = 0;
    private _total: number = 0;
    private _noReplay: string[];

    public execute(data: any): void {
        super.execute(data);

        DebugInfo.info('SDKGetReplayDataRequestCMD......');

        const replayMobiles: string[] = SDKLogicsCore.parameterVo.replayMobiles;

        // 加载找师回放课堂角色id
        if (
            SDKLogicsCore.parameterVo.replayType === SDKEnum.TYPE_REPLAY.TRAIN
        ) {
            this.loadClassMobiles(replayMobiles);
        } else {
            this.loadDatas();
        }

        this.recylePacket();
    }

    private loadDatas(): void {
        let index = 0,
            count = 0;
        const replayMobiles: string[] = SDKLogicsCore.parameterVo.replayMobiles;

        if (SDKLogicsCore.parameterVo.isReplayTeacher()) {
            SDKLogicsCore.controllState.controllerId =
                SDKLogicsCore.parameterVo.replayId;

            let controller: SDKWebDashBoradController;
            controller = SDKContrllerManager.instance().getController(
                SDKControllerConst.WEB_DASHBORAD
            ) as SDKWebDashBoradController;
            if (controller) {
                controller.setController(
                    SDKLogicsCore.controllState.controllerId
                );
            }
        }

        this.parseUsers(replayMobiles);

        count = replayMobiles.length;
        this._total = count;
        for (index = 0; index < count; index++) {
            this.loadData(replayMobiles[index]);
        }
    }

    private loadClassMobiles(replayMobiles: string[]): void {
        let url: string;

        url =
            SDKConfigConst.REPLAY_DATA_URL +
            SDKLogicsCore.parameterVo.lessonUid +
            '/trainTeacher' +
            '/replayMobile.json';

        SDKApp.instance().thirdInterface.load(url, (err, content) => {
            if (err) {
                console.log(err);
            } else {
                DebugInfo.info('加载成功......', url);
                const mobiles = content;
                let index = 0,
                    count = 0;
                count = mobiles.length;
                for (index; index < count; index++) {
                    if (replayMobiles.indexOf(mobiles[index]) === -1) {
                        replayMobiles.push(mobiles[index]);
                    }
                }
                this.loadDatas();
            }
        });
    }

    private loadData(userId: string) {
        let url: string;

        url =
            SDKConfigConst.REPLAY_DATA_URL +
            SDKLogicsCore.parameterVo.lessonUid +
            '/' +
            userId +
            '/' +
            'gameEvents.json';

        SDKApp.instance().thirdInterface.load(url, (err, content) => {
            if (err) {
                console.log(err);
                if (this._noReplay === undefined) {
                    this._noReplay = [];
                }
                this._noReplay.push(userId);
            } else {
                DebugInfo.info('加载成功......', url);
                SDKApp.instance().packetHandler.notifyCMD(
                    SDKRegistCommand.PARSE_REPLAY_DATA,
                    [userId, content]
                );
            }

            this._isComplete++;
            if (this._isComplete === this._total) {
                this.filterUsers();
                SDKApp.instance().transceiver.sendMsg(
                    SDKRegistCommand.REPLAY_READY,
                    null,
                    false
                );
            }
        });
    }

    private filterUsers(): void {
        let index, count;
        let userId;
        let replayMobiles: string[];

        replayMobiles = SDKLogicsCore.parameterVo.replayMobiles;

        if (!this._noReplay) {
            return;
        }

        count = replayMobiles.length;
        for (index = count - 1; index >= 0; index--) {
            userId = replayMobiles[index];
            if (this._noReplay.indexOf(userId) !== -1) {
                replayMobiles.splice(index, 1);
                SDKLogicsCore.userInfos.removeUserById(userId);
            }
        }
    }

    private parseUsers(replayMobiles: string[]): void {
        let index = 0,
            count = 0;
        let userId: string;
        let userInfo: SDKUserInfo;

        if (replayMobiles.length <= 1) {
            return;
        }

        SDKLogicsCore.userInfos.ClearUsersFlag();

        count = replayMobiles.length;
        for (index = 0; index < count; index++) {
            userId = replayMobiles[index];
            if (!SDKLogicsCore.userInfos.isHasUserById(userId)) {
                userInfo = new SDKUserInfo();
                userInfo.userId = userId;
                if (userId === SDKLogicsCore.parameterVo.userId) {
                    if (SDKLogicsCore.parameterVo.isReplayTeacher()) {
                        userInfo.role = SDKEnum.USER_ROLE.TEACHER;
                    } else {
                        userInfo.role = SDKEnum.USER_ROLE.STUDENT;
                    }
                } else {
                    userInfo.role = SDKEnum.USER_ROLE.STUDENT;
                }
                SDKLogicsCore.userInfos.addUserInfo(userInfo);
            } else {
                userInfo = SDKLogicsCore.userInfos.getUserInfoById(userId);
            }
            userInfo.isActive = true;
        }
    }
}
