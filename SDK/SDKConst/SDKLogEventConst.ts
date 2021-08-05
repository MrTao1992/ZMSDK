/////////////////////////////课件向端发送的埋点//////////////////
/** 课件dom加载完毕 */
export const CTR_DOM_READY: string = 'ctrDomReady';
/** 课件引擎初始话错误 */
export const CTR_ENGINE_INIT_ERROR: string = 'ctrEngineInitError';
/** 课件引擎初始化成功 */
export const CTR_ENGINE_INITED: string = 'ctrEngineInited';
/** 课件视频播放 */
export const CTR_VIDEO_PLAY: string = 'ctrVideoPlay';
/** 初始化webGl */
export const CTR_WEBGL_INIT: string = 'ctrWebGLInit';
/** 初始化webGl失败 */
export const CTR_WEBGL_INIT_ERROR: string = 'ctrWebGLInitError';

/////////////////////////////课件流程埋点///////////////////////////
/**课件脚本加载初始化完成 */
export const JS_INIT_COMPLETE: string = 'jsInitComplete';
export const FIRST_SCENE_LOAD_START: string = 'firstSceneLoadStart';
export const FIRST_SCENE_LOAD_COMPLETE: string = 'firstSceneLoadCompelte';

/////////////////////////////端向课件初始化接口埋点事件////////////////
/**初始化自己信息 */
export const INIT_SET_USER_INFO: string = 'initSetUserInfo';
/**初始化整个课堂学生信息 */
export const INIT_SET_USERS_INFO: string = 'initSetUsersInfo';
/**初始化课堂信息*/
export const INIT_LESSON_INFO: string = 'initLessonInfo';
/**初始化整个课堂所有学生信息 */
export const INIT_SET_ALL_USERS_INFO: string = 'initSetAllUsersInfo';
/**初始化课堂埋点信息 */
export const INIT_SET_TRACK_DATA: string = 'initSetTrackData';