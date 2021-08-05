/** 事件类型 */
export enum EVENT_TYPE {
    TYPE_COUNT = 0,
    TYPE_TIME = 1
}

// 上课模式前缀
export const PREVIEW: string = 'preview_';
export const STUDY: string = 'study_';
export const WATCH: string = 'watch_';
export const REPLAY: string = 'replay_';

// 课件类型前缀
export const ZMG: string = 'zmg_';
export const ZMG2: string = 'ezmg_';
export const ZML: string = 'zml_';

///////////////////////////////////////////////////// 事件埋点
/** 打开zmg课件 */
export const OPEN: string = 'open';
/** 关闭zmg课件 */
export const CLOSE: string = 'close';
/** 上翻页课件 */
export const LASTPAGE: string = 'lastpage';
/** 下翻页课件 */
export const NEXTPAGE: string = 'nextpage';
/** 点击重做 */
export const CLICK_REPRACTICE: string = 'click_repractice';
/** 切换分屏 */
export const CLICK_SPLIT: string = 'click_split';
/** 切回主屏 */
export const CLICK_MAIN: string = 'click_main';
/** 切换老师操作 */
export const CLICK_TEACHER_CONTROL: string = 'click_teachercontrol';
/** 切换自主操作 */
export const CLICK_FREE_CONTROL: string = 'click_freecontrol';
/** 点击播放音效 */
export const CLICK_AUDIO: string = 'click_audio';
/** 进入游戏场景 */
export const CLICK_ENTER_GAME: string = 'click_entergame';
/** 离开游戏场景 */
export const CLICK_LEAVE_GAME: string = 'click_leavegame';
/** 进入游戏关卡 */
export const CLICK_ENTER_LEVEL: string = 'click_enterlevel';
/** 离开游戏关卡 */
export const CLICK_LEAVE_LEVEL: string = 'click_leavelevel';
/** 视频播放准备开始 */
export const VIDEO_READY_START: string = 'video_readyStart';
/** 视频播放准备时间 */
export const VIDEO_READY: string = 'video_ready';
/** 视频播放卡顿 */
export const video_DELAY_START: string = 'video_delayStart';
/** 视频播放卡顿时间 */
export const VIDEO_DELAY: string = 'video_delay';
/** 视频播放 */
export const VIDEO_PLAY: string = 'video_Play';
/** 视频重播*/
export const CLICK_VIDEO_REPLAY: string = 'click_video_replay';
/** 录播视频录制数据异常 */
export const VIDEO_REPAIR_ERROR: string = 'video_repair_error';
/**分屏子屏刷新 */
export const SPLIT_SCREEN_REFRESH: string = 'split_refresh';
/**分屏左切页 */
export const SPLIT_SCRREN_PRE_PAGE: string = 'split_prePage';
/**分屏右切页 */
export const SPLIT_SCRREN_NEXT_PAGE: string = 'split_nextPage';
/**分屏点击放大按钮 */
export const SPLIT_SCRREN_CLICK_TOMAX: string = 'split_toMax';
/**分屏点击缩小按钮 */
export const SPLIT_SCRREN_CLICK_TOMIN: string = 'split_toMin';
/**分屏双击放大按钮 */
export const SPLIT_SCRREN_DOUBLE_TOMAX: string = 'split_doubleToMax';
/**分屏双击缩小按钮 */
export const SPLIT_SCRREN_DOUBLE_TOMIN: string = 'split_doubleToMin';
/**分屏全屏左切页 */
export const SPLIT_SCRREN_FULL_PRE_PAGE: string = 'split_full_prePage';
/**分屏全屏右切页 */
export const SPLIT_SCRREN_FULL_NEXT_PAGE: string = 'split_full_nextPage';
/**分屏最大显示窗口数1 */
export const SPLIT_SHOW_MAX_ONE: string = 'split_showMaxOne';
/**分屏最大显示窗口数1 */
export const SPLIT_SHOW_MAX_TWO: string = 'split_showMaxTwo';
/**分屏最大显示窗口数1 */
export const SPLIT_SHOW_MAX_FOUR: string = 'split_showMaxFour';
/**语音测评点击 切换语音面板按钮*/
export const VOICE_CLICK_SWITCH: string = 'voice_clickSwitch';
/**语音测评点击 点击音频播放按钮*/
export const VOICE_CLICK_PLAY_AUDIO: string = 'voice_clickPlayAudio';
/**语音测评点击 点击音频暂停按钮*/
export const VOICE_CLICK_PLAY_PAUSE: string = 'voice_clickPlayPause';
/**语音测评点击 点击音频进度按钮*/
export const VOICE_CLICK_CHANGE_PROGRESS: string = 'voice_clickChangeProgress';

////////////////////////////////////////////////////////////////// 页面埋点
export const PAGE: string = 'page';
