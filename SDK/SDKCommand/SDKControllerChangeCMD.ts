import SDKCommandBase from './SDKCommandBase';
import * as SDKLogicsCore from '../SDKLogics/SDKLogicsCore';
import SDKPacket from '../SDKNetwork/SDKPacket';
import SDKPacketPool from '../SDKNetwork/SDKPacketPool';
import SDKApp from '../SDKBase/SDKApp';
import SDKUserInfo from '../SDKLogics/SDKUserInfo';
import SDKWebDashBoradController from '../SDKController/SDKWebDashBoradController';
import SDKContrllerManager from '../SDKController/SDKContrllerManager';
import * as SDKControllerConst from '../SDKConst/SDKControllerConst';
import * as DebugInfo from '../Utils/DebugInfo';
import ScreenShot from '../Utils/ScreenShot';
import * as SDKRegistCommand from '../SDKConst/SDKRegistCommand';

/**
 * 控制权限的改变
 */
export default class SDKControllerChangeCMD extends SDKCommandBase {
    public execute(data: any): void {
        super.execute(data);

        DebugInfo.info('SDKControllerChangeCMD..........', data);
        this.printScreen(data);
        this.addNewAnswer(data);
        this.update(data);

        this.recylePacket();
    }

    private printScreen(controllId): void {
        if(!SDKLogicsCore.gameConfig.printScreen) {
            return;
        }
        if (!SDKLogicsCore.parameterVo.isGameClass() ||
            SDKLogicsCore.parameterVo.isRepair ||
            SDKLogicsCore.parameterVo.isGameTrain()) {
            return;
        }
        if (SDKLogicsCore.parameterVo.isStudent() &&
            SDKLogicsCore.controllState.controllerId === '-1' &&
            controllId !== '' &&
            controllId === SDKLogicsCore.userInfos.getTeacherId()) {
            let screenShot: ScreenShot = new ScreenShot();
            screenShot.printScreen((img) => {
                let data = {
                    lessonUid: SDKLogicsCore.lessonInfo.lessonUID,
                    coursewareId: SDKLogicsCore.parameterVo.gameId,
                    coursewareVersion: '',
                    pageId: SDKLogicsCore.sceneState.curIndex,
                    coursewareType: 1,
                    imgData: img
                };
                SDKApp.instance().transceiver.sendMsg(SDKRegistCommand.SCREEN_SHOT_ANSWER_DATA, data, false);
            }, 0.8);
        }
    }

    private addNewAnswer(controllId) {
        if (!SDKLogicsCore.parameterVo.isGameClass() ||
            SDKLogicsCore.parameterVo.isRepair ||
            SDKLogicsCore.parameterVo.isGameTrain()) {
            return;
        }
        if (SDKLogicsCore.parameterVo.isStudent() &&
            SDKLogicsCore.controllState.controllerId === SDKLogicsCore.userInfos.getTeacherId() &&
            controllId === '-1') {
            SDKLogicsCore.sceneState.interaction = new Date().getTime();
            let answers: any = SDKLogicsCore.sceneState.getAnswerByIndex(SDKLogicsCore.sceneState.curIndex);
            if (answers.length > 0) {
                setTimeout(()=>{
                    SDKApp.instance().transceiver.sendMsg(
                        SDKRegistCommand.REPORT_ADD_NEW_ANSWER,
                        { sceneIndex: SDKLogicsCore.sceneState.curIndex },
                        false);
                },30);
            }
        }

        if (SDKLogicsCore.parameterVo.isStudent() &&
            SDKLogicsCore.controllState.controllerId === '-1' &&
            controllId !== '' &&
            controllId === SDKLogicsCore.userInfos.getTeacherId()) {
            let answers: any = SDKLogicsCore.sceneState.getAnswerByIndex(SDKLogicsCore.sceneState.curIndex);
            if (answers.length > 0) {
                SDKApp.instance().transceiver.sendMsg(
                    SDKRegistCommand.REPORT_CLASS_INTERACTION,
                    {
                        sceneIndex: SDKLogicsCore.sceneState.curIndex,
                        duration: Math.floor((new Date().getTime() - SDKLogicsCore.sceneState.interaction) / 1000)
                    },
                    false);
            }
        }
    }

    private update(data) {
        SDKLogicsCore.voiceAnswerInfo.reset();
        SDKLogicsCore.controllState.controllerId = data;
        if (SDKLogicsCore.parameterVo.isOberverTeacher() || SDKLogicsCore.parameterVo.isReplayTeacher()) {
            // 监课或者回放，老师改变教学模式
            let controller: SDKWebDashBoradController;
            controller = SDKContrllerManager.instance().getController(SDKControllerConst.WEB_DASHBORAD) as SDKWebDashBoradController;
            if (controller) {
                controller.setController(data);
            }
        }

        let packet: SDKPacket;
        packet = SDKPacketPool.Acquire(this._packet.name);
        this._packet.clone(packet);
        packet.name = 'gameControllerChange';
        SDKApp.instance().transceiver.packetHandler.dispatcherCMD(packet);

        if (SDKLogicsCore.controllState.isSyncTeacher) {
            // 老师收回控制权限，控制者的界面同步到其他人那里
            if (
                SDKLogicsCore.parameterVo.isTeacher() &&
                SDKLogicsCore.controllState.controllerId !== '-1' &&
                SDKLogicsCore.controllState.controllerId !== '' &&
                SDKLogicsCore.controllState.controllerId ===
                SDKLogicsCore.parameterVo.userId
            ) {
                //避免学生截图数据异常
                setTimeout(() => {
                    this.syncToOther(SDKLogicsCore.parameterVo.userId);
                }, 100);
            }
        }
        SDKLogicsCore.controllState.isSyncTeacher = true;
    }

    private syncToOther(controllerId: string): void {
        let userInfo: SDKUserInfo;
        let packet: SDKPacket;

        userInfo = SDKLogicsCore.userInfos.getUserInfoById(controllerId);
        if (!userInfo) {
            return;
        }

        packet = userInfo.getLastMainPacket();
        if (!packet) {
            return;
        }

        if (packet.name !== 'gameChangeScene') {
            this.checkChangeScene(packet);
            SDKApp.instance().transceiver.sendPacket(packet);
        } else {
            const sceneName: string = packet.data;

            SDKApp.instance().transceiver.sendPacket(packet);
            this.initScene(sceneName);
        }
    }

    private checkChangeScene(packet: SDKPacket): void {
        let tempPacket: SDKPacket;

        tempPacket = SDKPacketPool.Acquire(packet.name);
        packet.clone(tempPacket);
        tempPacket.name = 'gameChangeScene';
        tempPacket.sendId = SDKLogicsCore.parameterVo.userId;
        tempPacket.data = packet.secene;

        SDKApp.instance().transceiver.sendPacket(tempPacket);
    }

    private initScene(sceneName: string): void {
        let tempPacket: SDKPacket;

        tempPacket = SDKPacketPool.Acquire('gameSceneReset');
        tempPacket.sendId = SDKLogicsCore.parameterVo.userId;
        tempPacket.isMainFrame = false;
        tempPacket.data = sceneName;

        SDKApp.instance().transceiver.sendPacket(tempPacket);
    }
}
