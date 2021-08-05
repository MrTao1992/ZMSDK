import SDKCommandBase from './SDKCommandBase';
import * as SDKLogicsCore from '../SDKLogics/SDKLogicsCore';
import * as DebugInfo from '../Utils/DebugInfo';
import SDKWebDashBoradController from '../SDKController/SDKWebDashBoradController';
import SDKContrllerManager from '../SDKController/SDKContrllerManager';
import * as SDKControllerConst from '../SDKConst/SDKControllerConst';


/**
 * 语音测评 课件所有语音题目
 */
export default class SDKVoiceAnswerUploadSuccessSyncCMD extends SDKCommandBase {
    public execute(data: any): void {
        super.execute(data);

        DebugInfo.info('SDKVoiceAnswerUploadSuccessSyncCMD:');
        let voiceAnswerState = SDKLogicsCore.voiceAnswerInfo.getVoiceAnswerStateById(this._packet.sendId);
        voiceAnswerState.uploadSuccess = true;
        if (data.voiceUrl && data.voiceUrl != '') {
            voiceAnswerState.voiceUrl = data.voiceUrl;
        }

        if (SDKLogicsCore.parameterVo.isTeacher() || SDKLogicsCore.parameterVo.isOberverTeacher()) {
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
