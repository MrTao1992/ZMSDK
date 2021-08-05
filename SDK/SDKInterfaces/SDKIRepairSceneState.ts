import SDKPacket from "../SDKNetwork/SDKPacket";
import * as SDKEnum from "../SDKConst/SDKEnum";

export interface SDKIRepairSceneState {
    sceneIndex: number;
    recordPacket: SDKPacket;
    recordType: SDKEnum.TYPE_RECORD;
    recordState: SDKEnum.TYPE_RECORD_STATE;
    recordAnswerTime: number;
    isGuideAnswer: boolean;
    isControllerChange: boolean;
}