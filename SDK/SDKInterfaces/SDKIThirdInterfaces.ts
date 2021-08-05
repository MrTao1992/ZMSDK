
export interface SDKIThirdInterfaces {
    /**
     * 游戏暂停
     */
    pause();

    /**
     * 游戏恢复
     */
    resume();

    /**
     * 本地存储添加数据
     */
    localStorageSetItem(key: string, value: any);

    /**
     * 本地存储获取数据
     */
    localStorageGetItem(key: string): any;

    /**
     * 本地存储删除数据
     */
    localStorageDeleteItem(key: string);

    /**
     * 是否本地编辑状态
     */
    islocalEditor(): boolean;

    /**
     * 获取当前场景名称
     */
    getSceneName(): string;

    /**
     * 获取当前场景
     */
    getScene(): any;

    /**
     * 加载场景
     * @param name 场景名称
     */
    loadScene(name: string);


    /**
     * 获取XMLHttpRequest
     */
    getXMLHttpRequest(): any;

    /**
     * 资源加载
     */
    load(url: string, callBack?: (err, content) => void);

    /**
     * 引擎是否初始化完成
     */
    gameInitialized(): boolean;

    /**
     * 游戏canvas名称
     */
    gameCanvasName(): string;

    /**
     * 监听游戏每帧渲染前事件
     * @param callBack 
     */
    onGameBeforeDraw(callBack: () => void, target):()=>void;

    /**
     * 移除游戏每帧渲染前事件
     */
    offGameBeforeDraw(callBack: () => void, target);

    /**
     *监听游戏每帧渲染后事件
     * @param callBack 
     * @param target 事件处理对象
     */
    onGameAfterDraw(callBack: () => void, target):()=>void;

    /**
     * 移除游戏每帧渲染后事件
     * @param callBack 
     * @param target 事件处理对象
     */
    offGameAfterDraw(callBack: () => void, target);

    /**
     * 显示鼠标(指针)
     */
    showSystemMouse();

    /**
     * 是否是手型鼠标
     */
    isHandMouse(): boolean;

    /**
     * 视频播放原生元素
     */
    videoElement(): HTMLVideoElement;

    /**
     * 是否是zmg1.0
     */
    isZMG1(): Boolean;

    /**
     * 是否是zmg2.0
     */
    isZMG2(): Boolean;

    /**
     * 截图
     */
    screenShot(callBack:(img: string)=>void);

    /**
     * 默认样式
     */
    defaultStyle(): string

    /**
     * 观看样式
     */
    observerStyle(): string
}