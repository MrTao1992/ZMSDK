import SDKCommandBase from './SDKCommandBase';
import * as SDKLogicsCore from '../SDKLogics/SDKLogicsCore';
import * as DebugInfo from '../Utils/DebugInfo';
import SDKWebDashBoradController from '../SDKController/SDKWebDashBoradController';
import SDKContrllerManager from '../SDKController/SDKContrllerManager';
import * as SDKControllerConst from '../SDKConst/SDKControllerConst';

/**
 * 语音测评 课件所有语音题目
 */
export default class SDKVoiceAnswerSyncSyncCMD extends SDKCommandBase {
    public execute(data: any): void {
        super.execute(data);

        DebugInfo.info('SDKVoiceAnswerSyncSyncCMD:');
        let voiceAnswerState = SDKLogicsCore.voiceAnswerInfo.getVoiceAnswerStateById(this._packet.sendId);
        voiceAnswerState.isBegin = true;
        voiceAnswerState.progress = data.duration;
        voiceAnswerState.content = data.content;
        voiceAnswerState.toTalDuration = data.toTalDuration;
        voiceAnswerState.isSupport = true;
        if(data.isSuccess !== undefined) {
            voiceAnswerState.isSuccess = data.isSuccess;
        }

        if(SDKLogicsCore.parameterVo.isTeacher() || SDKLogicsCore.parameterVo.isOberverTeacher()) {
            let controller: SDKWebDashBoradController;
            controller = SDKContrllerManager.instance().getController(
                SDKControllerConst.WEB_DASHBORAD
            ) as SDKWebDashBoradController;
            if (controller) {
                controller.updateVoiceAnswer(this._packet.sendId);
            }
        }

        this.recylePacket();
    }
}