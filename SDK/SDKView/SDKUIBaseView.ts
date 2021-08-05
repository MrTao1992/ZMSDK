import SDKControllerBase from '../SDKController/SDKControllerBase';
import SDKBaseView from './SDKBaseView';
import {
    DOMButton,
    DOMCheckbox,
    SDKControllerUIComponents,
    setDefaultStyle,
    SDKControllerUIComponent
} from './SDKControlUI';
import * as SDKRecordEventConst from '../SDKConst/SDKRecordEventConst';
import SDKApp from '../SDKBase/SDKApp';
import * as SDKLogicsCore from '../SDKLogics/SDKLogicsCore';
import * as SDKEnum from "../SDKConst/SDKEnum";
import * as DebugInfo from "../Utils/DebugInfo";
import * as SDKUiDisplayConst from '../SDKConst/SDKUiDisplayConst';

/**
 * 视图基础类
 */
export default class SDKUIBaseView extends SDKBaseView {
    /** 菜单栏 */
    protected _menuContainer: any;
    /** 组件集合*/
    protected _components: any;

    protected _menuShowItems: { [key: string]: Array<string> };
    protected _menuHideItems: { [key: string]: Array<string> };

    protected _displayKeys: { [key: string]: boolean };

    constructor(controller: SDKControllerBase) {
        super(controller);

        this.initUI();
    }

    public reset() {
        super.reset();
        this._components = {};
        this._menuShowItems = <{ [key: string]: Array<string> }>{};
        this._menuHideItems = <{ [key: string]: Array<string> }>{};
        this._displayKeys = <{ [key: string]: boolean }>{};
    }

    public showUI(key: string = SDKUiDisplayConst.CONTROLL) {
        if (this._menuContainer) {
            this._displayKeys[key] = true;
            this._menuContainer.style.display = 'block';
        }
    }

    public hideUI(key: string = SDKUiDisplayConst.CONTROLL) {
        if (this._menuContainer) {
            this._displayKeys[key] = false;
            if (this.checkDisplayHide()) {
                this._menuContainer.style.display = 'none';
            } else {
                this._menuContainer.style.display = 'block';
            }
        }
    }

    public displayUI(showKeys: any[] = [], isShow: boolean = true) {
        let index = 0;
        let count = 0;
        let btnKeys = Object.keys(this._components);
        count = btnKeys.length;
        for (index = 0; index < count; index++) {
            let item = this._components[btnKeys[index]];
            if (item && showKeys.indexOf(btnKeys[index]) != -1) {
                if (isShow) {
                    item.show();
                } else {
                    item.hide();
                }
            }
        }
    }

    public setOpacity(value: number): void {
        this._menuContainer.style.opacity = value;
    }

    public updateChangePageState(): void {
        if (SDKLogicsCore.sceneState.isFirstScene()) {
            this._components.prev && this._components.prev.hide();
        } else {
            this._components.prev && this._components.prev.show();
        }

        if (SDKLogicsCore.sceneState.isLastScene()) {
            this._components.next && this._components.next.hide();
        } else {
            this._components.next && this._components.next.show();
        }
    }

    public setVideoState(value: boolean) {
        if (value) {
            this._components.play && this._components.play.show();
        } else {
            this._components.play && this._components.play.hide();
        }
    }

    public setVideoReplay(value: boolean) {
        if (value) {
            this._components.videoReplay && this._components.videoReplay.show();
        } else {
            this._components.videoReplay && this._components.videoReplay.hide();
        }
    }

    protected initUI(): void {
        this.initRem();
        this.initStyle();
        this.initMenuContaner();
        this.initMenuData();
        this.initMenuContent(SDKEnum.MENU_TYPE.GAME);
        this.initResizeEvent();
    }

    /**
     * 计算REM
     */
    protected initRem() {
        const rem =
            window.innerWidth / window.innerHeight > 1.83
                ? window.innerHeight / 10.8
                : window.innerWidth / 19.2;
        document.getElementsByTagName('html')[0].style.fontSize = rem + 'px';
    }

    /**
     * 监听窗口大小改变
     */
    protected initResizeEvent() {
        window.onresize = evt => {
            this.initRem();
        }
    }

    /**
     * 设置样式
     */
    protected initStyle() {
        setDefaultStyle();
    }

    /**
     * 创建菜单容器
     */
    protected initMenuContaner(): void {
        this._menuContainer = document.createElement('div');
        this._menuContainer.setAttribute('id', 'controllCenter');
        document.body.appendChild(this._menuContainer);
    }

    /**
     * 初始化菜单数据
     */
    protected initMenuData(): void {
        this._menuShowItems[SDKEnum.MENU_TYPE.GAME] = [
            'prev',
            'next',
            'videoReplay',
            'play',
        ];
        this._menuHideItems[SDKEnum.MENU_TYPE.GAME] = ['videoReplay', 'play'];
    }

    /**
     * 初始化菜单内容
     */
    protected initMenuContent(menuName: string): void {
        let self = this;

        Array.prototype.forEach.call(
            this._menuContainer.childNodes,
            (element) => {
                element.style.display = 'none';
            }
        );

        if (!this._menuShowItems[menuName] || !this._menuHideItems[menuName]) {
            DebugInfo.error("menuItem undefined...", menuName);
            return;
        }

        let componentList = this._menuShowItems[menuName];
        let componentHideList = this._menuHideItems[menuName];

        for (const item of componentList) {
            const comp = SDKControllerUIComponents[item];
            if (this._components[item]) {
                this._components[item].show();
                continue;
            }
            if (comp.type === 'button') {
                this.createButton(this._menuContainer, comp);
            } else if (comp.type === 'checkbox') {
                this.createCheckbox(this._menuContainer, comp);
            }
        }

        for (const item of componentHideList) {
            const comp = SDKControllerUIComponents[item];
            if (this._components[item]) {
                this._components[item].hide();
                continue;
            }
            if (comp.type === 'button') {
                this.createButton(this._menuContainer, comp, true);
            } else if (comp.type === 'checkbox') {
                this.createCheckbox(this._menuContainer, comp, true);
            }
        }
        this.initClickEvent();
    }

    protected initClickEvent() {
        let self = this;

        if (self._components.prev) {
            self._components.prev.onClick = self.onPrePageClick.bind(self);
        }
        if (self._components.next) {
            self._components.next.onClick = self.onNextPageClick.bind(self);
        }
        if (self._components.videoReplay) {
            self._components.videoReplay.onClick = self.onVideoReplay.bind(self);
        }

        //webpack打包报无法迭代
        // for (const item of self._components) {
        //     if (self._components[item]) {
        //         self._components[item].onMouseOver = self.onMouseOver.bind(self);
        //         self._components[item].onMouseOut = self.onMouseOut.bind(self);
        //     }
        // }

        for (const item in self._components) {
            if (self._components[item]) {
                self._components[item].onMouseOver = self.onMouseOver.bind(self);
                self._components[item].onMouseOut = self.onMouseOut.bind(self);
            }
        }
    }

    protected onPrePageClick() {
        let self = this;

        self._controller.dispatcherHandle('gamePrevScene', null, true);
        const logInfo = {
            preSceneIndex: SDKLogicsCore.sceneState.curIndex - 1
        };
        SDKApp.instance().recordTransceiver.send(
            SDKRecordEventConst.LASTPAGE,
            logInfo
        );
    }

    protected onNextPageClick() {
        let self = this;

        self._controller.dispatcherHandle('gameNextScene', null, true);
        const logInfo = {
            nextSceneIndex: SDKLogicsCore.sceneState.curIndex + 1
        };
        SDKApp.instance().recordTransceiver.send(
            SDKRecordEventConst.NEXTPAGE,
            logInfo
        );
    }

    protected onVideoReplay() {
        let self = this;

        self._controller.dispatcherCMD('gameVideoReplay', null, true);
        SDKApp.instance().recordTransceiver.send(
            SDKRecordEventConst.CLICK_VIDEO_REPLAY,
            {}
        );
    }

    protected onMouseOver() {

    }

    protected onMouseOut() {

    }

    // 这个className对应的是样式类，请一定要对号入座
    protected createButton(container: any, comp: SDKControllerUIComponent, notShow?: boolean) {
        const button = new DOMButton(comp, this);
        if (notShow) {
            button.hide();
        }
        this._components[comp.name] = button;
        container.appendChild(button.domElem);
    }

    protected createCheckbox(container: any, comp: SDKControllerUIComponent, notShow?: boolean) {
        const checkbox = new DOMCheckbox(comp, this);
        if (notShow) {
            checkbox.hide();
        }
        this._components[comp.name] = checkbox;
        container.appendChild(checkbox.domElem);
    }

    protected updateMouseState() {
        if (SDKLogicsCore.controllState.isInspection()) {
            SDKApp.instance().thirdInterface.showSystemMouse();
        }
    }

    protected updateUIState(controllerId: string) {
        this.showUI();
        if (controllerId != '-1' && SDKLogicsCore.parameterVo.isTeacher()) {
            if (SDKLogicsCore.parameterVo.userId != controllerId) {
                this.hideUI();
            }
        } else if (controllerId != '-1' && SDKLogicsCore.parameterVo.isOberverTeacher()) {
            if (SDKLogicsCore.parameterVo.observerId != controllerId) {
                this.hideUI();
            }
        } else if (controllerId != '-1' && SDKLogicsCore.parameterVo.isReplayTeacher()) {
            if (SDKLogicsCore.parameterVo.replayId != controllerId) {
                this.hideUI();
            }
        }
    }

    protected checkDisplayShow(): boolean {
        for (const key in this._displayKeys) {
            if (this._displayKeys.hasOwnProperty(key)) {
                if (this._displayKeys[key] === true) {
                    return true;
                }
            }
        }
        return false;
    }

    protected checkDisplayHide(): boolean {
        for (const key in this._displayKeys) {
            if (this._displayKeys.hasOwnProperty(key)) {
                if (this._displayKeys[key] !== false) {
                    return false;
                }
            }
        }
        return true;
    }
}