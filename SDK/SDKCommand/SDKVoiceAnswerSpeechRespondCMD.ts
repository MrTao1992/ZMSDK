import SDKCommandBase from './SDKCommandBase';
import * as SDKLogicsCore from '../SDKLogics/SDKLogicsCore';
import * as DebugInfo from '../Utils/DebugInfo';
import SDKWebDashBoradController from '../SDKController/SDKWebDashBoradController';
import SDKContrllerManager from '../SDKController/SDKContrllerManager';
import * as SDKControllerConst from '../SDKConst/SDKControllerConst';

/**
 * 语音测评 课件所有语音题目
 */
export default class SDKVoiceAnswerSpeechRespondCMD extends SDKCommandBase {
    public execute(data: any): void {
        super.execute(data);

        DebugInfo.info('SDKVoiceAnswerSpeechRespondCMD:');
        if(SDKLogicsCore.parameterVo.isTeacher()) {
            SDKLogicsCore.voiceAnswerInfo.countDownEnd = data.countDownEnd;
            SDKLogicsCore.voiceAnswerInfo.voiceAnswerContent = data.voiceAnswerContent;
            let voiceAnswerState = SDKLogicsCore.voiceAnswerInfo.getVoiceAnswerStateById(data.voiceAnswerState.userId);
            for (const key in data.voiceAnswerState) {
                if (data.voiceAnswerState.hasOwnProperty(key) && voiceAnswerState.hasOwnProperty(key)) {
                    voiceAnswerState[key] = data.voiceAnswerState[key];
                }
            }
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
