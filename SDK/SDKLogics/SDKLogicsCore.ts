import SDKParameterVo from './SDKParameterVo';
import SDKUserInfos from './SDKUserInfos';
import SDKControllState from './SDKControllState';
import SDKHistoryInfo from './SDKHistoryInfo';
import SDKSceneState from './SDKSceneState';
import SDKLessonInfo from './SDKLessonInfo';
import SDKUserInfo from './SDKUserInfo';
import SDKReplayInfo from './SDKReplayInfo';
import SDKGameConfig from './SDKGameConfig';
import SDKRepairInfo from "./SDKRepairInfo";
import SDKTrackVo from './SDKTrackVo';
import SDKVoiceAnswerInfo from './SDKVoiceAnswerInfo';

export function setMainInfo(value: SDKUserInfo): void {
    mainInfo = value;
}

export let gameConfig : SDKGameConfig = new SDKGameConfig();
export let parameterVo: SDKParameterVo = new SDKParameterVo();
export let userInfos: SDKUserInfos = new SDKUserInfos();
export let serverUsers: SDKUserInfos = new SDKUserInfos();
export let allUsers: SDKUserInfos = new SDKUserInfos();
export let controllState: SDKControllState = new SDKControllState();
export let historyInfo: SDKHistoryInfo = new SDKHistoryInfo();
export let sceneState: SDKSceneState = new SDKSceneState();
export let lessonInfo: SDKLessonInfo = new SDKLessonInfo();
export let ReplayInfo: SDKReplayInfo = new SDKReplayInfo();
export var repairInfo : SDKRepairInfo = new SDKRepairInfo();
export var trackInfo : SDKTrackVo = new SDKTrackVo();
export var voiceAnswerInfo: SDKVoiceAnswerInfo = new SDKVoiceAnswerInfo();
export var mainInfo : SDKUserInfo = null;