import SDKCommandBase from './SDKCommandBase';
import * as SDKLogicsCore from '../SDKLogics/SDKLogicsCore';
import * as DebugInfo from '../Utils/DebugInfo';
import SDKWebDashBoradController from '../SDKController/SDKWebDashBoradController';
import SDKContrllerManager from '../SDKController/SDKContrllerManager';
import * as SDKControllerConst from '../SDKConst/SDKControllerConst';

/**
 * 语音测评 课件所有语音题目
 */
export default class SDKVoiceAnswerBeginSyncCMD extends SDKCommandBase {
    public execute(data: any): void {
        super.execute(data);

        DebugInfo.info('SDKVoiceAnswerBeginSyncCMD:');
        let voiceAnswerState = SDKLogicsCore.voiceAnswerInfo.getVoiceAnswerStateById(this._packet.sendId);
        SDKLogicsCore.voiceAnswerInfo.resetVoiceAnswerStatesById(this._packet.sendId);
        SDKLogicsCore.voiceAnswerInfo.voiceAnswerContent = data.voiceAnswerContent;
        voiceAnswerState.isBegin = true;
        voiceAnswerState.content = '';
        voiceAnswerState.progress = 0;
        voiceAnswerState.toTalDuration = data.toTalDuration;
        voiceAnswerState.isSupport = true;
        voiceAnswerState.isSuccess = true;
        voiceAnswerState.isSettlementSuc = true;
        if(SDKLogicsCore.voiceAnswerInfo.countDownEnd == -1) {
            SDKLogicsCore.voiceAnswerInfo.countDownEnd = new Date().getTime() + voiceAnswerState.toTalDuration*1000;
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