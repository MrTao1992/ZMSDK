/**
 * ZMSDK：该类主要定义SDK的枚举类型
 */

/** 游戏类型 */
export enum GAME_TYPE {
    NORMAL = 0,
    PREVIEW, // 预览
    CLASS, // 教学
    REPLAY, // 回放
    SPLITSCREEN // 分屏   子ifreame的URL中使用
}

/** 用户类型 */
export enum USER_ROLE {
    NONE = 0, // 无角色
    STUDENT, // 学生
    TEACHER, // 老师
    OBSERVER, // 观察者
    SELLER, // 销售
    TRAINER // 培训师
}

/** 老师上课模式 */
export enum TEACHING_MODE {
    TYPE_TEACHING,
    TYPE_INSPECTION
}

/** 课件类型 */
export enum COURSEWARE_TEYPE {
    ZML,
    ZMG
}

/** 场景状态枚举 */
export enum TYPE_SCENE {
    /** 场景正在加载 */
    TYPE_LOADING = 0,
    /** 场景加载完毕 */
    TYPE_LOADED = 1,
    /** 老师控制游戏进程 */
    TYPE_PAUSE = 2
}

export enum TYPE_MSG {
    TYPE_POST_MESSAGE,
    YTPE_JSB_MESSAGE
}

export enum TYPE_DEVICE {
    TYPE_PC,
    TYPE_IPAD,
    TYPE_APAD,
    TYPE_IPHONE,
    TYPE_APHONE
}

export enum TYPE_ENVIRONMENT {
    NONE,
    LOCALHOST,
    TEST,
    UAT,
    PRODUCTION
}

export enum TYPE_REPLAY {
    CLASS,
    TRAIN
}

export enum MENU_TYPE {
    GAME = 'game',
    SPLIT = 'split',
}

export enum TYPE_REPAIR {
    NONE,
    RECORD, //录制模式
    PLAY    //播放模式
}

export enum TYPE_RECORD {
    GAME,    //录制游戏
    CORRECT, //录制正确答案
    ERROR,   //录制错误答案
    ANSWER,  //录制答案
    GUILD    //录制引导阶段
}

export enum TYPE_RECORD_STATE {
    PLAY,   //录制状态  播放
    PAUSE   //录制状态  暂停
}

export enum TYPE_REPAIR_PLAY {
    GAME,   //播放类型  游戏
    ANSWER  //播放类型  答案
}

export enum TYPE_REPAIR_DATA {
    UNLOAD, //数据加载状态 未加载
    LOADING,//数据加载状态 加载中
    LOADED  //数据加载状态 已完成
}

export enum TYPE_BU {
    ONEBYONE = '1', //1对1
    KIDS = '2',   //少儿
    AI = '4',     //小狸AI
    EXCELLENT = '5' //优课
}

export enum VOICE_EVALUATE {
    NONE = -1,
    BAD = 0,
    NOMAL = 1,
    GOOD = 2
}