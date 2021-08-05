import SDKControllerBase from "../SDKController/SDKControllerBase";
import * as SDKENUM from "../SDKConst/SDKEnum";
import * as SDKLogicsCore from "../SDKLogics/SDKLogicsCore";
import * as SDKRegistCommand from "../SDKConst/SDKRegistCommand";
import {setDefaultStyle, setObserverStyle } from "./SDKControlUI";
import * as SDKRecordEventConst from "../SDKConst/SDKRecordEventConst";
import SDKApp from "../SDKBase/SDKApp";
import * as DebugInfo from "../Utils/DebugInfo";
import SDKUIBaseView from "./SDKUIBaseView";

export default class SDKRepairView extends SDKUIBaseView {

    /**鼠标形态 */
    protected _mouseName: string;
    /**控制者id */
    protected _controllerId: string;
    protected _isShowControllUI: boolean;

    constructor(controller: SDKControllerBase) {
        super(controller);

        this.setController(this._controllerId);
    }

    public reset(): void {
        super.reset();

        this._mouseName = 'auto';
        this._isShowControllUI = true;
        this._controllerId = SDKLogicsCore.controllState.controllerId;
    }

    /**设置权限 历史恢复使用*/
    public setController(controllerId: string): void {
        this._controllerId = controllerId;
        if (this._controllerId == SDKLogicsCore.parameterVo.userId) {
            this._components["controll"].setStatus("teacher");
        } else {
            this._components["controll"].setStatus("student");
        }
        this.updateChangeSceneState();
    }

    public updateChangePageState(): void {
        // if (SDKLogicsCore.sceneState.isFirstScene()) {
        //     this._components["prev"].hide();
        // } else {
        //     this._components["prev"].show();
        // }

        if (SDKLogicsCore.sceneState.isLastScene()) {
            this._components["next"].hide();
        } else {
            this._components["next"].show();
        }
    }

    /**
     * 显示或者隐藏老师切换控制权限
     */
    public displayControll(isShow: boolean): void {
        this._isShowControllUI = isShow;
        if (isShow) {
            this._components["controll"].show();
        } else {
            this._components["controll"].hide();
        }
    }

    public updatePageState(): void {
        if (SDKLogicsCore.controllState.isFullOwn()) {
            this.updateChangePageState();
        }
    }

    public updateViewStyle(): void {
        let index = 0, count = 0;
        let elements = (window as any).publicStyle.childNodes;

        count = elements.length;
        for (index; index < count; index++) {
            if (elements[index] && elements[index].parentNode) {
                let str = elements[index].data;
                if (str.indexOf("controllCenter") != -1) {
                    elements[index].parentNode.removeChild(elements[index]);
                    break;
                }
            }
        }

        if (SDKLogicsCore.repairInfo.isRecordPalying()) {
            setDefaultStyle();
        } else {
            setObserverStyle();
            if (SDKApp.instance().thirdInterface.isHandMouse()) {
                SDKApp.instance().thirdInterface.showSystemMouse();
                this._mouseName = document.body.style.cursor;
                DebugInfo.info("mouseState:",document.body.style.cursor);
            }
        }

        this._components['controll'].domElem.style.right = '0.15rem';
    }

    /**
     * 初始化菜单数据
     */
    protected initMenuData(): void {
        this._menuShowItems[SDKENUM.MENU_TYPE.GAME] = [
            'prev',
            'next',
            'controll'
        ];
        this._menuHideItems[SDKENUM.MENU_TYPE.GAME] = ['prev'];
    }

    protected initClickEvent(): void {
        super.initClickEvent();

        let self = this;
        if (this._components.controll) {
            this._components.controll.onClick = self.onControllClick.bind(self);
        }
    }

    protected onNextPageClick() {
        let self = this;

        if (SDKLogicsCore.sceneState.state == SDKENUM.TYPE_SCENE.TYPE_LOADING &&
            SDKLogicsCore.sceneState.curIndex == 0) {
            return;
        }
        self._controller.dispatcherHandle("gameNextScene", null, true);
    }

    protected onControllClick() {
        let self = this;

        if (
            SDKLogicsCore.sceneState.state ===
            SDKENUM.TYPE_SCENE.TYPE_LOADING
        ) {
            return;
        }
        if (self._components.controll.status === 'teacher') {
            self.onTeacherControll();
        } else {
            self.onFreeControll();
        }
    }

    protected onMouseOver(): void {
        this._mouseName = document.body.style.cursor;
        this._controller.dispatcherHandle("gameMouseLeave", null, false);
    }

    protected onMouseOut(): void {
        this._controller.dispatcherHandle("gameMouseEnter", this._mouseName, false);
    }

    private onTeacherControll(): void {
        if (this._controllerId == SDKLogicsCore.parameterVo.userId) {
            return;
        }
        this._controllerId = SDKLogicsCore.parameterVo.userId;
        this._controller.dispatcherCMD(SDKRegistCommand.CONTROLLER_CHANGE, this._controllerId, false);
        this._controller.dispatcherCMD(SDKRegistCommand.REPAIR_CONTROLLER_CHANGE, this._controllerId, false);
        this.updateChangeSceneState();
        SDKApp.instance().recordTransceiver.send(SDKRecordEventConst.CLICK_TEACHER_CONTROL);
    }

    private onFreeControll(): void {
        if (this._controllerId == '-1') {
            return;
        }
        this._controllerId = '-1';
        this._controller.dispatcherCMD(SDKRegistCommand.CONTROLLER_CHANGE, this._controllerId, false);
        this._controller.dispatcherCMD(SDKRegistCommand.REPAIR_CONTROLLER_CHANGE, this._controllerId, false);
        this.updateChangeSceneState();
        SDKApp.instance().recordTransceiver.send(SDKRecordEventConst.CLICK_FREE_CONTROL);
    }

    private updateChangeSceneState(): void {
        if (SDKLogicsCore.controllState.isFullOwn()) {
            //this._components["prev"].show();
            this._components["next"].show();
            this.updateChangePageState();
        } else {
            //this._components["prev"].hide();
            this._components["next"].hide();
        }

        if (SDKLogicsCore.repairInfo.recordType != SDKENUM.TYPE_RECORD.GAME) {
            this._components["next"].hide();
            this._components["controll"].setEnable(false);
        } else {
            this._components["next"].show();
            this.updateChangePageState();
            if (SDKLogicsCore.repairInfo.isControllerChange) {
                this._components["controll"].setEnable(false);
            } else {
                this._components["controll"].setEnable(true);
            }
        }
    }
}