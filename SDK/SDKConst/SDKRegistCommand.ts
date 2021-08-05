/**
 * SDKRegistCommand配置消息处理对象
 */
import SDKStopZmgCMD from '../SDKCommand/SDKStopZmgCMD';
import SDKUserInfoCMD from '../SDKCommand/SDKUserInfoCMD';
import SDKDispatcherToSubIframeCMD from '../SDKCommand/SDKDispatcherToSubIframeCMD';
import SDKGameStopCMD from '../SDKCommand/SDKGameStopCMD';
import SDKGameResumeCMD from '../SDKCommand/SDKGameResumeCMD';
import SDKControllerChangeCMD from '../SDKCommand/SDKControllerChangeCMD';
import SDKApp from '../SDKBase/SDKApp';
import SDKSetUsersInfoCMD from '../SDKCommand/SDKSetUsersInfoCMD';
import SDKGameReadyCMD from '../SDKCommand/SDKGameReadyCMD';
import SDKGameHistoryCMD from '../SDKCommand/SDKGameHistoryCMD';
import SDKLessonInfoCMD from '../SDKCommand/SDKLessonInfoCMD';
import SDKParseGameHistoryCMD from '../SDKCommand/SDKParseGameHistoryCMD';
import SDKSplitGameReady from '../SDKCommand/SDKSplitGameReady';
import SDKDisplayControllCMD from '../SDKCommand/SDKDisplayControllCMD';
import SDKRespondGameHistoryCMD from '../SDKCommand/SDKRespondGameHistoryCMD';
import SDKGetHistoryCMD from '../SDKCommand/SDKGetHistoryCMD';
import SDKTeachModleChangeCMD from '../SDKCommand/SDKTeachModleChangeCMD';
import SDKWatchHistoryRequestCMD from '../SDKCommand/SDKWatchHistoryRequestCMD';
import SDKTeachModleRequestCMD from '../SDKCommand/SDKTeachModleRequestCMD';
import SDKWatchControllerRequestCMD from '../SDKCommand/SDKWatchControllerRequestCMD';
import SDKNotifyWatchControllerCMD from '../SDKCommand/SDKNotifyWatchControllerCMD';
import SDKSyncTeacherRequestCMD from '../SDKCommand/SDKSyncTeacherRequestCMD';
import SDKSyncTeacherRepondCMD from '../SDKCommand/SDKSyncTeacherRepondCMD';
import SDKInitScenesCMD from '../SDKCommand/SDKInitScenesCMD';
import SDKSetSceneStateCMD from '../SDKCommand/SDKSetSceneStateCMD';
import SDKGetReplayDataRequestCMD from '../SDKCommand/SDKGetReplayDataRequestCMD';
import SDKParseReplayDataCMD from '../SDKCommand/SDKParseReplayDataCMD';
import SDKReplayReadyCMD from '../SDKCommand/SDKReplayReadyCMD';
import SDKReplayInfoCMD from '../SDKCommand/SDKReplayInfoCMD';
import SDKServerUsersCMD from '../SDKCommand/SDKServerUsersCMD';
import SDKTrainControllerChangeCMD from '../SDKCommand/SDKTrainControllerChangeCMD';
import SDKUserChangeInfoCMD from '../SDKCommand/SDKUserChangeInfoCMD';
import SDKSetUsersChangeInfoCMD from '../SDKCommand/SDKSetUsersChangeInfoCMD';
import SDKTrainUsersChangeCMD from '../SDKCommand/SDKTrainUsersChangeCMD';
import SDKGameScreenShotCMD from '../SDKCommand/SDKGameScreenShotCMD';
import SDKTeachSplitPageChangeCMD from '../SDKCommand/SDKTeachSplitPageChangeCMD';
import SDKTeachSplitPageRequestCMD from '../SDKCommand/SDKTeachSplitPageRequestCMD';
import SDKSetSubIframeInfoCMD from '../SDKCommand/SDKSetSubIframeInfoCMD';
import SDKGetGameConfigCMD from '../SDKCommand/SDKGetGameConfigCMD';
import SDKSetSubIframeSceneStateCMD from '../SDKCommand/SDKSetSubIframeSceneStateCMD';
import SDKRepairRecordStateCMD from '../SDKCommand/SDKRepairRecordStateCMD';
import SDKRepairAnswerTimeCMD from '../SDKCommand/SDKRepairAnswerTimeCMD';
import SDKRepairAnswerRespondCMD from '../SDKCommand/SDKRepairAnswerRespondCMD';
import SDKRepairNextSceneCMD from '../SDKCommand/SDKRepairNextSceneCMD';
import SDKRepairSetBaseInfoCMD from '../SDKCommand/SDKRepairSetBaseInfoCMD';
import SDKRepairChangeSceneCMD from '../SDKCommand/SDKRepairChangeSceneCMD';
import SDKRepairCommitAnswerCMD from '../SDKCommand/SDKRepairCommitAnswerCMD';
import SDKRepairSkipCMD from '../SDKCommand/SDKRepairSkipCMD';
import SDKRepairPlayStateCMD from '../SDKCommand/SDKRepairPlayStateCMD';
import SDKRepairGetSceneInfoCMD from '../SDKCommand/SDKRepairGetSceneInfoCMD';
import SDKRepairRespondSceneInfoCMD from '../SDKCommand/SDKRepairRespondSceneInfoCMD';
import SDKCommitAnswerCMD from '../SDKCommand/SDKCommitAnswerCMD';
import SDKRepairGetDataRequestCMD from '../SDKCommand/SDKRepairGetDataRequestCMD';
import SDKRepairPlayReadyCMD from '../SDKCommand/SDKRepairPlayReadyCMD';
import SDKRepairControllerChangeCMD from '../SDKCommand/SDKRepairControllerChangeCMD';
import SDKOnStageChangeCMD from '../SDKCommand/SDKOnStageChangeCMD';
import SDKRepairRerecordingSceneCMD from '../SDKCommand/SDKRepairRerecordingSceneCMD';
import SDKRepairSaveRecordSceneCMD from '../SDKCommand/SDKRepairSaveRecordSceneCMD';
import SDKRepairGoToSceneCMD from '../SDKCommand/SDKRepairGoToSceneCMD';
import SDKRepairSaveCMD from '../SDKCommand/SDKRepairSaveCMD';
import SDKSetAllUsersInfoCMD from '../SDKCommand/SDKSetAllUsersInfoCMD';
import SDKTrackDataCMD from '../SDKCommand/SDKTrackDataCMD';
import SDKSceneOnloadCMD from '../SDKCommand/SDKSceneOnloadCMD';
import SDKSceneOnstartCMD from '../SDKCommand/SDKSceneOnstartCMD';
import SDKDisplayBtnUICMD from '../SDKCommand/SDKDisplayBtnUICMD';
import SDKDisplayVedioBtnCMD from '../SDKCommand/SDKDisplayVedioBtnCMD';
import SDKVoiceAnswerListCMD from '../SDKCommand/SDKVoiceAnswerListCMD';
import SDKVoiceAnswerSpeechStartCMD from '../SDKCommand/SDKVoiceAnswerSpeechStartCMD';
import SDKVoiceAnswerBeginCMD from '../SDKCommand/SDKVoiceAnswerBeginCMD';
import SDKVoiceAnswerSyncCMD from '../SDKCommand/SDKVoiceAnswerSyncCMD';
import SDKVoiceAnswerEndCMD from '../SDKCommand/SDKVoiceAnswerEndCMD';
import SDKVoicePrivateCharstateCMD from '../SDKCommand/SDKVoicePrivateCharstateCMD';
import SDKVoiceAnswerUploadSuccessCMD from '../SDKCommand/SDKVoiceAnswerUploadSuccessCMD';
import SDKVoiceAnswerBeginSyncCMD from '../SDKCommand/SDKVoiceAnswerBeginSyncCMD';
import SDKVoiceAnswerSyncSyncCMD from '../SDKCommand/SDKVoiceAnswerSyncSyncCMD';
import SDKVoiceAnswerEndSyncCMD from '../SDKCommand/SDKVoiceAnswerEndSyncCMD';
import SDKVoiceAnswerUploadSuccessSyncCMD from '../SDKCommand/SDKVoiceAnswerUploadSuccessSyncCMD';
import SDKVoiceAnswerSpeechRequestCMD from '../SDKCommand/SDKVoiceAnswerSpeechRequestCMD';
import SDKVoiceAnswerSpeechRespondCMD from '../SDKCommand/SDKVoiceAnswerSpeechRespondCMD';
import SDKVoiceAnswerSettlementCMD from '../SDKCommand/SDKVoiceAnswerSettlementCMD';
import SDKVoiceAnswerSettlementSyncCMD from '../SDKCommand/SDKVoiceAnswerSettlementSyncCMD';
import SDKReportAddNewAnswerCMD from '../SDKCommand/SDKReportAddNewAnswerCMD';
import SDKReportClassCommitAnswerCMD from '../SDKCommand/SDKReportClassCommitAnswerCMD';
import SDKReportClassInteractionCMD from '../SDKCommand/SDKReportClassInteractionCMD';

/** 向ZML课件发送游戏准备 */
export const GAEM_READY: string = 'gameReady';

/** 课件给用户的信息 */
export const SET_USER_INFO: string = 'setUserInfo';
/** 课件给用户的信息 多个 */
export const SET_USERS_INFO: string = 'setUsersInfo';
/** 课件给的课程信息 */
export const SET_LESSON_INFO: string = 'setLessonInfo';
/** 课件给用户的整个课堂的所有信息*/
export const SET_ALL_USERS_INFO: string = 'setAllUsersInfo';
/** 保存课堂用户信息*/
export const SAVE_USERS_INFO: string = 'saveUsersInfo';
/** 课堂埋点基础数据*/
export const SET_TRACK_DATA: string = 'setTrackData';

/** zml壳 课件给的历史信息 */
export const GAME_HISTORY: string = 'history';
/** zml壳 处理课件的历史消息 ...内部派发 */
export const GAME_PARSE_HISTORY: string = 'parseHistory';

/** 向zmg课件请求历史记录信息 */
export const GET_GAME_HISTORY: string = 'getHistory';
/** zmg课件给的历史消息 */
export const RESPOND_GAME_HISTORY: string = 'respondHistory';

/** 控制权限的改变 */
export const CONTROLLER_CHANGE: string = 'controllerChange';
/** 教学模式的改变 */
export const TEACH_MODLE_CHANGE: string = 'teachModleChange';

/** 分屏页码改变*/
export const TEACH_SPLIT_PAGE_CHANGE: string = 'teachSplitPageChange';

/** 导航栏显示状态*/
export const GAME_NAVIGATION_STATE: string = 'gameNavigationState';

/** 游戏暂停 */
export const GAME_STOP: string = 'gameStop';
/** 游戏恢复 */
export const GAME_RESUME: string = 'gameResume';

/** 分屏iframe发送给老师端的游戏准备 */
export const SPLIT_GAME_READY: string = 'splitGameReady';
/** 老师向分屏派发消息 */
export const DISPATCHER_TO_SUBIFRAME: string = 'dispatcherTOSubIfreame';

// --监课模式--BEGIN--
/** 监课模式请求分屏页码*/
export const TEACH_SPLIT_PAGE_REQUEST: string = 'teachSplitPageRequest';
/** 监课模式请求教学模式 */
export const TEACH_MODLE_REQUEST: string = 'teachModleRequest';
/** 监课模式请求被监课的用户历史信息 */
export const WATCH_HISTORY_REQUEST: string = 'watchHistoryRequest';
/** 监课模式向老师请求权限 */
export const WATCH_CONTROLLER_REQUEST: string = 'watchControllerRequest';
/** 老师通知监课模式权限 */
export const NOTIFY_WATCH_CONTROLLER: string = 'notifyWatchController';
// --监课模式--END--

/** 学生刷新向老师拉取最新的状态,后端不记录下线的学生的数据 */
export const SYNC_TEACHER_REQUEST: string = 'syncTeacherRequest';
/** 学生刷新老师返回最新的状态,后端不记录下线的学生的数据 */
export const SYNC_TEACHER_RESPOND: string = 'syncTeacherRespond';

// --回放模式--BEGIN--
/** 拉取回放数据请求 */
export const GET_REPLAY_DATA_REQUEST: string = 'getReplayDataRequest';
/** 解析回放数据 */
export const PARSE_REPLAY_DATA: string = 'parseReplayData';
/** 回放准备完毕 */
export const REPLAY_READY: string = 'replayReady';
/** 同步回放信息 */
export const REPLAY_INFO: string = 'replayInfo';
/** 在线状态*/
export const REPLAY_ONLINE_STATUS: string = 'onlineStatus';
// --回放模式--END--

/** zmg系统通知切页停止 */
export const STOP_ZMG: string = 'stopZmg';
/** 服务器通知玩家信息，包括在线和离线的玩家 */
export const SERVER_USERS: string = 'serverUsers';
/** 切换白板页面 */
export const SHOW_PAGE_INDEX: string = 'showPageIndex';
export const GAME_SYNC_MOUSE: string = 'm';

// --培训课堂模式--BEGIN--
/** 培训课堂, 课堂所有玩家信息除了监课，(初始化和上下线) */
export const SET_USERS_CHANGE_INFO: string = 'setUsersChangeInfo';
/** 培训课堂,改变玩家角色信息 */
export const SET_USER_CHANGE_INFO: string = 'setUserChangeInfo';
/** 培训课堂, 权限转移 */
export const TRAIN_CONTROLLER_CHANGE: string = 'trainControllerChange';
/** 培训课堂, 角色上下台 */
export const TRAIN_USERS_CHANGE: string = 'trainUsersChange';
// --培训课堂模式--END--

/** 设置子iframe用户信息*/
export const SET_SUB_IFRAME_INFO: string = 'setSubIframeInfo';
/** 拉取游戏配置信息 */
export const GET_GAME_CONFIG: string = 'getGameConfig';
/** */
export const SET_SUB_IFRAME_SCENE_STATE: string = 'setSubIframeSceneState';

//////////// 本地化消息 只与端交互，不需要转发到服务器---
export const LOCAL_VIDEO_CONTROLL: string = 'videoctl';
export const LOCAL_STOP_ALL_MEDIA: string = 'stopAllVideoAudio';
export const LOCAL_AUDIO_CONTROLL: string = 'audioctl';
//////////// 本地化消息 只与端交互，不需要转发到服务器---

/////////// 视频同步消息
export const VIDEO_PROCESS: string = 'gameVideoProcess';
export const VDIEO_PROCESS_REQUEST: string = 'gameVideoProcessRequest';


/**学生提交答案 */
export const COMMIT_ANSWER: string = 'commitAnswer';
/**智能补课老师录播, 通知录制端页面信息*/
export const REPAIR_SCENE_INFO: string = 'repairSceneInfo';
/**智能补课老师录播, 控制权限改变 */
export const REPAIR_CONTROLLER_CHANGE: string = 'repairControllerChange';
/**智能补课老师录播, 录制状态 */
export const REPAIR_RECORD_STATE: string = 'repairRecordState';
/**智能补课老师录播, 设置答题时间*/
export const REPAIR_ANSWER_TIME: string = 'repairAnswerTime';
/**智能补课老师录播, 保存答题时间*/
export const REPAIR_ANSWER_RESPOND: string = 'repairAnswerRespond';
/**智能补课老师录播, 通知课件录播下一页*/
export const REPAIR_NEXT_SCENE: string = 'repairNextScene';
/**智能补课老师录播, 重新录制任意页*/
export const REPAIR_RERECODING_SCENE: string = 'repairRerecordingScene';
/**智能补课老师录播, 保存当前录制页状态 */
export const REPAIR_SAVE_RECORD_SCENE: string = 'repairSaveRecordScene';
/**智能补课老师录播，直接跳转到某一页,只能退出录制的时候在进来用 */
export const REPAIR_GOTO_SCENE: string = 'repairGotoScene';
/**智能补课老师录播，保存重录历史页 */
export const REPAIR_SAVE: string = 'repairSave';
/**智能补课老师录播，课件是否支持2期重录 */
export const REPAIR_SECEND_VERSION: string = 'repairSecendVersion';
/**智能补课学生上课, 设置基础URL信息*/
export const REPAIR_SET_BASE_INFO: string = 'setRepairBaseInfo';
/**智能补课学生上课, 准备播放*/
export const REPAIR_PLAY_READY: string = 'repairPlayReady';
/**智能补课学生上课, 课件翻页*/
export const REPAIR_CHANGE_SCENE: string = 'repairChangeScene';
/**智能补课学生上课, 提交答案*/
export const REPAIR_COMMIT_ANSWER: string = 'repairCommitAnswer';
/**智能补课学生上课 跳过作答*/
export const REPAIR_SKIP: string = 'repairSkip';
/**智能补课学生上课 播放状态*/
export const REPAIR_PLAY_STATE: string = 'repairPlayState';
/**智能补课学生上课 获取场景信息请求 */
export const REPAIR_GET_SCENE_INFO: string = 'repairGetSceneInfo';
/**智能补课学生上课 获取场景信息返回 */
export const REPAIR_RESPOND_SCENE_INFO: string = 'repairRespondSceneInfo';
/**智能补课学生上课  加载录播数据JSON*/
export const REPAIR_GET_DATA_REQUEST: string = 'repaireGetDataRequest';


/**玩家上台*/
export const ON_STAGE_CHANGE: string = 'onStageChange';
/**学生能否上台 */
export const ON_STAGE_ACCEPT: string = 'onStageAccept';
/**游戏加载完成*/
export const GAME_LOAD_COMPLETE: string = 'gameLoadComplete';
/**游戏开始加载*/
export const GAME_LOAD_START: string = 'gameLoadStart';

/**语音测评 课件通知端所有语音题目*/
export const VOICE_ANSWER_PAGE_TYPE_LIST: string = 'gameSpeechTitle';//'gamePageTypeList';
/**语音测评 课件通知端语音答题准备*/
export const VOICE_ANSWER_SPEECH_START: string = 'gameSpeechStart';
/**语音测评 学生端通知课件语音答题开始*/
export const VOICE_ANSWER_BEGIN: string = 'voiceAnswerBegin';
/**语音测评 学生端通知课件同步语言答题*/
export const VOICE_ANSWER_SYNC: string = 'voiceAnswerSync';
/**语音测评 学生端通知课件答题结算*/
export const VOICE_ANSWER_SETTLEMENT: string = 'voiceAnswerSettlement';
/**语音测评 学生端通知课件同步语言答题结束*/
export const VOICE_ANSWER_END: string = 'voiceAnswerEnd';
/**语音测评 学生端通知课件音频上传成功*/
export const VOICE_ANSWER_UPLOAD_SUCCESS: string = 'voiceAnswerUploadSuccess';
/**语音测评 老师端通知课件学生是否私聊 */
export const VOICE_PRIVATE_CHARSTATE: string = 'voicePrivateChartState';

/**语音测评 课件同步老师语音答题开始*/
export const VOICE_ANSWER_BEGIN_SYNC: string = 'voiceAnswerBeginSync';
/**语音测评 课件同步老师语言答题*/
export const VOICE_ANSWER_SYNC_SYNC: string = 'voiceAnswerSyncSync';
/**语音测评 课件同步老师语言答题结束*/
export const VOICE_ANSWER_END_SYNC: string = 'voiceAnswerEndSync';
/**语音测评 课件同步老师音频上传成功*/
export const VOICE_ANSWER_UPLOAD_SUCCESS_SYNC: string = 'voiceAnswerUploadSuccessSync';
/**语音测评 学生端通知课件答题结算*/
export const VOICE_ANSWER_SETTLEMEN_SYNC: string = 'voiceAnswerSettlementSync';

/**语音测评 老师请求语音答题状态(刷新)*/
export const VOICE_ANSWER_SPEECH_REQUEST: string = 'voiceAnswerSpeechRequest';
/**语音测评 学生放回老师语音答题状态(刷新)*/
export const VOICE_ANSWER_SPEECH_RESPOND: string = 'voiceAnswerSpeechRespond';

/**课程报告 学生答题总数加1*/
export const REPORT_ADD_NEW_ANSWER: string = 'reportAddNewAnswer';
/**课程报告 学生答题提交答案*/
export const REPORT_CLASS_COMMIT_ANSWER: string = 'reportClassCommitAnswer';
/**课程报告 学生答题交互时长*/
export const REPORT_CLASS_INTERACTION: string = 'reportClassInteraction';

//键盘事件
export const KEYBORD_UP: string = 'keyUp';
export const KEYBORD_DONW: string = 'keyDown';

/////////// 游戏调用SDK的接口
/** 显示后者隐藏切换控制权限按钮 */
export const DISPLAY_CONTROLL: string = 'displayControll';
export const SCENE_INIT: string = 'initScene';
export const SCENE_STATE_Change: string = 'changeSceneState';
export const SCENE_ONLOAD: string = 'sceneOnLoad';
export const SCENE_ONSTART: string = 'sceneOnStart';
export const DISPLAY_BTNUI: string = 'displayBtnUI';
export const DISPLAY_VIDEO_BTN: string = 'displayVedioBtn';

/**
 * 辅助ios 系统截取canvas 画面
 */
export const SCREENSHOT: string = 'gameScreenShot';
export const SCREENSHOT_DATA: string = 'gameScreenShotData';
export const SCREEN_SHOT_ANSWER_DATA: string = 'screenShotAnswerData';

/**log 通知PC端的异常日志信息 */
export const GAME_LOG: string = 'hdGameLog';

/**
 * 注册消息处理对象
 */
export function registCommands() {
    let packetHandler = SDKApp.instance().packetHandler;

    packetHandler.registerHandler(GAEM_READY, SDKGameReadyCMD);
    packetHandler.registerHandler(SET_USER_INFO, SDKUserInfoCMD);
    packetHandler.registerHandler(SET_USERS_INFO, SDKSetUsersInfoCMD);
    packetHandler.registerHandler(SET_ALL_USERS_INFO, SDKSetAllUsersInfoCMD);
    packetHandler.registerHandler(DISPATCHER_TO_SUBIFRAME, SDKDispatcherToSubIframeCMD);
    packetHandler.registerHandler(GAME_STOP, SDKGameStopCMD);
    packetHandler.registerHandler(GAME_RESUME, SDKGameResumeCMD);
    packetHandler.registerHandler(CONTROLLER_CHANGE, SDKControllerChangeCMD);
    packetHandler.registerHandler(GAME_HISTORY, SDKGameHistoryCMD);
    packetHandler.registerHandler(SET_LESSON_INFO, SDKLessonInfoCMD);
    packetHandler.registerHandler(GAME_PARSE_HISTORY, SDKParseGameHistoryCMD);
    packetHandler.registerHandler(SPLIT_GAME_READY, SDKSplitGameReady);
    packetHandler.registerHandler(RESPOND_GAME_HISTORY, SDKRespondGameHistoryCMD);
    packetHandler.registerHandler(GET_GAME_HISTORY, SDKGetHistoryCMD);
    packetHandler.registerHandler(TEACH_MODLE_CHANGE, SDKTeachModleChangeCMD);
    packetHandler.registerHandler(WATCH_HISTORY_REQUEST, SDKWatchHistoryRequestCMD);
    packetHandler.registerHandler(TEACH_MODLE_REQUEST, SDKTeachModleRequestCMD);
    packetHandler.registerHandler(WATCH_CONTROLLER_REQUEST, SDKWatchControllerRequestCMD);
    packetHandler.registerHandler(NOTIFY_WATCH_CONTROLLER, SDKNotifyWatchControllerCMD);
    packetHandler.registerHandler(SYNC_TEACHER_REQUEST, SDKSyncTeacherRequestCMD);
    packetHandler.registerHandler(SYNC_TEACHER_RESPOND, SDKSyncTeacherRepondCMD);
    packetHandler.registerHandler(GET_REPLAY_DATA_REQUEST, SDKGetReplayDataRequestCMD);
    packetHandler.registerHandler(PARSE_REPLAY_DATA, SDKParseReplayDataCMD);
    packetHandler.registerHandler(REPLAY_READY, SDKReplayReadyCMD);
    packetHandler.registerHandler(REPLAY_INFO, SDKReplayInfoCMD);
    packetHandler.registerHandler(STOP_ZMG, SDKStopZmgCMD);
    packetHandler.registerHandler(SERVER_USERS, SDKServerUsersCMD);
    packetHandler.registerHandler(SET_USER_CHANGE_INFO, SDKUserChangeInfoCMD);
    packetHandler.registerHandler(SET_USERS_CHANGE_INFO, SDKSetUsersChangeInfoCMD);
    packetHandler.registerHandler(TRAIN_CONTROLLER_CHANGE, SDKTrainControllerChangeCMD);
    packetHandler.registerHandler(TRAIN_USERS_CHANGE, SDKTrainUsersChangeCMD);
    packetHandler.registerHandler(TEACH_SPLIT_PAGE_CHANGE, SDKTeachSplitPageChangeCMD);
    packetHandler.registerHandler(TEACH_SPLIT_PAGE_REQUEST, SDKTeachSplitPageRequestCMD);
    packetHandler.registerHandler(SET_SUB_IFRAME_INFO, SDKSetSubIframeInfoCMD);
    packetHandler.registerHandler(GET_GAME_CONFIG, SDKGetGameConfigCMD);
    packetHandler.registerHandler(SET_SUB_IFRAME_SCENE_STATE, SDKSetSubIframeSceneStateCMD);
    packetHandler.registerHandler(COMMIT_ANSWER, SDKCommitAnswerCMD);
    packetHandler.registerHandler(REPAIR_RECORD_STATE, SDKRepairRecordStateCMD);
    packetHandler.registerHandler(REPAIR_ANSWER_TIME, SDKRepairAnswerTimeCMD);
    packetHandler.registerHandler(REPAIR_ANSWER_RESPOND, SDKRepairAnswerRespondCMD);
    packetHandler.registerHandler(REPAIR_NEXT_SCENE, SDKRepairNextSceneCMD);
    packetHandler.registerHandler(REPAIR_RERECODING_SCENE, SDKRepairRerecordingSceneCMD);
    packetHandler.registerHandler(REPAIR_SAVE_RECORD_SCENE, SDKRepairSaveRecordSceneCMD);
    packetHandler.registerHandler(REPAIR_GOTO_SCENE, SDKRepairGoToSceneCMD);
    packetHandler.registerHandler(REPAIR_SAVE, SDKRepairSaveCMD);
    packetHandler.registerHandler(REPAIR_SET_BASE_INFO, SDKRepairSetBaseInfoCMD);
    packetHandler.registerHandler(REPAIR_CHANGE_SCENE, SDKRepairChangeSceneCMD);
    packetHandler.registerHandler(REPAIR_COMMIT_ANSWER, SDKRepairCommitAnswerCMD);
    packetHandler.registerHandler(REPAIR_SKIP, SDKRepairSkipCMD);
    packetHandler.registerHandler(REPAIR_PLAY_STATE, SDKRepairPlayStateCMD);
    packetHandler.registerHandler(REPAIR_GET_SCENE_INFO, SDKRepairGetSceneInfoCMD);
    packetHandler.registerHandler(REPAIR_RESPOND_SCENE_INFO, SDKRepairRespondSceneInfoCMD);
    packetHandler.registerHandler(REPAIR_GET_DATA_REQUEST, SDKRepairGetDataRequestCMD);
    packetHandler.registerHandler(REPAIR_PLAY_READY, SDKRepairPlayReadyCMD);
    packetHandler.registerHandler(REPAIR_CONTROLLER_CHANGE, SDKRepairControllerChangeCMD);
    packetHandler.registerHandler(ON_STAGE_CHANGE, SDKOnStageChangeCMD);
    packetHandler.registerHandler(SET_TRACK_DATA, SDKTrackDataCMD);
    packetHandler.registerHandler(VOICE_ANSWER_PAGE_TYPE_LIST, SDKVoiceAnswerListCMD);
    packetHandler.registerHandler(VOICE_ANSWER_SPEECH_START, SDKVoiceAnswerSpeechStartCMD);
    packetHandler.registerHandler(VOICE_ANSWER_BEGIN, SDKVoiceAnswerBeginCMD);
    packetHandler.registerHandler(VOICE_ANSWER_SYNC, SDKVoiceAnswerSyncCMD);
    packetHandler.registerHandler(VOICE_ANSWER_END, SDKVoiceAnswerEndCMD);
    packetHandler.registerHandler(VOICE_ANSWER_UPLOAD_SUCCESS, SDKVoiceAnswerUploadSuccessCMD);
    packetHandler.registerHandler(VOICE_PRIVATE_CHARSTATE, SDKVoicePrivateCharstateCMD);
    packetHandler.registerHandler(VOICE_ANSWER_BEGIN_SYNC, SDKVoiceAnswerBeginSyncCMD);
    packetHandler.registerHandler(VOICE_ANSWER_SYNC_SYNC, SDKVoiceAnswerSyncSyncCMD);
    packetHandler.registerHandler(VOICE_ANSWER_END_SYNC, SDKVoiceAnswerEndSyncCMD);
    packetHandler.registerHandler(VOICE_ANSWER_UPLOAD_SUCCESS_SYNC, SDKVoiceAnswerUploadSuccessSyncCMD);
    packetHandler.registerHandler(VOICE_ANSWER_SPEECH_REQUEST, SDKVoiceAnswerSpeechRequestCMD);
    packetHandler.registerHandler(VOICE_ANSWER_SPEECH_RESPOND, SDKVoiceAnswerSpeechRespondCMD);
    packetHandler.registerHandler(VOICE_ANSWER_SETTLEMENT, SDKVoiceAnswerSettlementCMD);
    packetHandler.registerHandler(VOICE_ANSWER_SETTLEMEN_SYNC, SDKVoiceAnswerSettlementSyncCMD);
    packetHandler.registerHandler(REPORT_ADD_NEW_ANSWER, SDKReportAddNewAnswerCMD);
    packetHandler.registerHandler(REPORT_CLASS_COMMIT_ANSWER, SDKReportClassCommitAnswerCMD);
    packetHandler.registerHandler(REPORT_CLASS_INTERACTION, SDKReportClassInteractionCMD);

    /////////// 游戏调用SDK的接口
    packetHandler.registerHandler(DISPLAY_CONTROLL, SDKDisplayControllCMD);
    packetHandler.registerHandler(SCENE_INIT, SDKInitScenesCMD);
    packetHandler.registerHandler(SCENE_STATE_Change, SDKSetSceneStateCMD);
    packetHandler.registerHandler(SCREENSHOT, SDKGameScreenShotCMD);
    packetHandler.registerHandler(SCENE_ONLOAD, SDKSceneOnloadCMD);
    packetHandler.registerHandler(SCENE_ONSTART, SDKSceneOnstartCMD);
    packetHandler.registerHandler(DISPLAY_BTNUI, SDKDisplayBtnUICMD);
    packetHandler.registerHandler(DISPLAY_VIDEO_BTN, SDKDisplayVedioBtnCMD);
}

/**系统发送过来的消息事件
 * SDK要做数据格式转换
 * 该事件必须执行
 */
export const EVENTS_LIST: string[] = [
    GAEM_READY,
    SPLIT_GAME_READY,
    REPLAY_READY,
    SET_USER_INFO,
    SET_USERS_INFO,
    SET_ALL_USERS_INFO,
    GAME_HISTORY,
    RESPOND_GAME_HISTORY,
    GET_GAME_HISTORY,
    SET_LESSON_INFO,
    CONTROLLER_CHANGE,
    TEACH_MODLE_CHANGE,
    TEACH_SPLIT_PAGE_CHANGE,
    REPLAY_INFO,
    STOP_ZMG,
    LOCAL_VIDEO_CONTROLL,
    LOCAL_STOP_ALL_MEDIA,
    LOCAL_AUDIO_CONTROLL,
    SHOW_PAGE_INDEX,
    SET_USER_CHANGE_INFO,
    SET_USERS_CHANGE_INFO,
    TRAIN_USERS_CHANGE,
    SCREENSHOT,
    SCREENSHOT_DATA,
    SCENE_STATE_Change,
    GET_GAME_CONFIG,
    REPAIR_SCENE_INFO,
    REPAIR_CONTROLLER_CHANGE,
    REPAIR_RECORD_STATE,
    REPAIR_ANSWER_TIME,
    REPAIR_ANSWER_RESPOND,
    REPAIR_NEXT_SCENE,
    REPAIR_SET_BASE_INFO,
    REPAIR_CHANGE_SCENE,
    REPAIR_SKIP,
    REPAIR_PLAY_STATE,
    REPAIR_GET_SCENE_INFO,
    REPAIR_RESPOND_SCENE_INFO,
    REPAIR_PLAY_READY,
    REPAIR_SAVE_RECORD_SCENE,
    REPAIR_RERECODING_SCENE,
    REPAIR_GOTO_SCENE,
    REPAIR_SAVE,
    REPAIR_SECEND_VERSION,
    ON_STAGE_CHANGE,
    ON_STAGE_ACCEPT,
    GAME_LOAD_COMPLETE,
    GAME_LOAD_START,
    SAVE_USERS_INFO,
    SCREEN_SHOT_ANSWER_DATA,
    SET_TRACK_DATA,
    GAME_NAVIGATION_STATE,
    VOICE_ANSWER_PAGE_TYPE_LIST,
    VOICE_ANSWER_BEGIN,
    VOICE_ANSWER_SYNC,
    VOICE_ANSWER_END,
    VOICE_ANSWER_UPLOAD_SUCCESS,
    VOICE_PRIVATE_CHARSTATE,
    VOICE_ANSWER_SETTLEMENT
];

/**
 *学生数据同步老师, 老师段渲染而不是老师端分屏子iframe渲染
 */
export const EVENTS_SYNC_TEACHER: string[] = [
    VOICE_ANSWER_SPEECH_START,
    VOICE_ANSWER_BEGIN_SYNC,
    VOICE_ANSWER_SYNC_SYNC,
    VOICE_ANSWER_END_SYNC,
    VOICE_ANSWER_UPLOAD_SUCCESS_SYNC,
    VOICE_ANSWER_SETTLEMEN_SYNC
]

/**
 * 不用保存的消息
 */
export const EVENTS_NO_SAVE: string[] = [
    GAEM_READY,
    SPLIT_GAME_READY,
    SET_USER_INFO,
    SET_USERS_INFO,
    SET_ALL_USERS_INFO,
    GAME_HISTORY,
    GET_GAME_HISTORY,
    RESPOND_GAME_HISTORY,
    SET_LESSON_INFO,
    TEACH_MODLE_CHANGE,
    TEACH_SPLIT_PAGE_CHANGE,
    REPLAY_READY,
    REPLAY_INFO,
    GAME_SYNC_MOUSE,
    SCREENSHOT,
    SCREENSHOT_DATA,
    REPAIR_SCENE_INFO,
    REPAIR_CONTROLLER_CHANGE,
    REPAIR_RECORD_STATE,
    REPAIR_ANSWER_TIME,
    REPAIR_ANSWER_RESPOND,
    REPAIR_NEXT_SCENE,
    ON_STAGE_CHANGE,
    ON_STAGE_ACCEPT,
    GAME_LOAD_COMPLETE,
    GAME_LOAD_START,
    SAVE_USERS_INFO,
    SCREEN_SHOT_ANSWER_DATA,
    SET_TRACK_DATA,
    VOICE_ANSWER_BEGIN,
    VOICE_ANSWER_SYNC,
    VOICE_ANSWER_END,
    VOICE_ANSWER_UPLOAD_SUCCESS,
    VOICE_PRIVATE_CHARSTATE
]

/**
 * 向控制端请求的验证消息
 */
export const EVENT_CHECK: string[] = [
    TEACH_MODLE_REQUEST,
    TEACH_SPLIT_PAGE_REQUEST,
    WATCH_CONTROLLER_REQUEST,
    NOTIFY_WATCH_CONTROLLER,
    SYNC_TEACHER_REQUEST,
    SYNC_TEACHER_RESPOND,
    VIDEO_PROCESS,
    VDIEO_PROCESS_REQUEST,
    VOICE_ANSWER_SPEECH_REQUEST,
    VOICE_ANSWER_SPEECH_RESPOND
];

/**
 *不注册对应CMD的消息列表
 */
export const EVENT_NO_EXCUTE: string[] = [
    LOCAL_VIDEO_CONTROLL,
    LOCAL_STOP_ALL_MEDIA,
    LOCAL_AUDIO_CONTROLL,
    SHOW_PAGE_INDEX,
    SCREENSHOT_DATA,
    REPAIR_SCENE_INFO,
    KEYBORD_UP,
    KEYBORD_DONW,
    ON_STAGE_ACCEPT,
    GAME_LOAD_COMPLETE,
    GAME_LOAD_START,
    GAME_LOG,
    REPAIR_SECEND_VERSION,
    SAVE_USERS_INFO,
    SCREEN_SHOT_ANSWER_DATA,
    REPLAY_ONLINE_STATUS
]

/**
 * 只对端发送消息
 */
export const EVENT_TO_CLIENT: string[] = [
    SCREEN_SHOT_ANSWER_DATA
]


/**
 * 转发到本地客户端的信令
 */
export const EVENTS_TO_LOCAL_CLIENT: string[] = [
    LOCAL_VIDEO_CONTROLL,
    LOCAL_STOP_ALL_MEDIA,
    LOCAL_AUDIO_CONTROLL,
];
