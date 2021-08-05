import SDKControllerBase from './SDKControllerBase';
import SDKWebDashBoardView from '../SDKView/SDKWebDashBoardView';
import SDKPacket from '../SDKNetwork/SDKPacket';
import SDKPcDashBoardView from '../SDKView/SDKPcDashBoardView';
import * as SDKLogicsCore from '../SDKLogics/SDKLogicsCore';
import * as SDKENUM from '../SDKConst/SDKEnum';
import SDKRepairView from "../SDKView/SDKRepairView";
import * as SDKUiDisplayConst from '../SDKConst/SDKUiDisplayConst';

export default class SDKWebDashBoradController extends SDKControllerBase {
    private _SDKWebDashBoardView: SDKWebDashBoardView;
    private _SDKPcDashBoardView: SDKPcDashBoardView;
    private _SDKRepairView: SDKRepairView;

    constructor() {
        super();
    }

    protected constructorViews(): void {
        super.constructorViews();

        if (SDKLogicsCore.parameterVo.isRepairRecord) {
            this._SDKRepairView = new SDKRepairView(this);
            this._views.push(this._SDKRepairView);
            return;
        }

        if (SDKLogicsCore.parameterVo.isTeacher() ||
            SDKLogicsCore.parameterVo.isOberverTeacher() ||
            SDKLogicsCore.parameterVo.isReplayTeacher()) {
            this._SDKWebDashBoardView = new SDKWebDashBoardView(this);
            this._views.push(this._SDKWebDashBoardView);
        } else if (SDKLogicsCore.parameterVo.isGamePreview()) {
            this._SDKPcDashBoardView = new SDKPcDashBoardView(this);
            this._views.push(this._SDKPcDashBoardView);
        }
    }

    /**
     * 更新权限
     * @param controllerId 权限id
     */
    public setController(controllerId: string): void {
        if (this._SDKWebDashBoardView) {
            this._SDKWebDashBoardView.setController(controllerId);
        }
        if (this._SDKRepairView) {
            this._SDKRepairView.setController(controllerId);
        }
    }

    /**
     * class模式
     * 向子iframe派发消息,
     * @param packet
     */
    public dispatcherSubIframe(packet: SDKPacket) {
        if (this._SDKWebDashBoardView) {
            this._SDKWebDashBoardView.dispatcherSubIframe(packet);
        }
    }

    /**
     * replay模式
     * 向子iframe派发消息
     * @param packet
     * @param userId
     */
    public notifySubIframe(packet: SDKPacket, userId: string) {
        if (this._SDKWebDashBoardView) {
            this._SDKWebDashBoardView.notifySubIframe(packet, userId);
        }
    }

    /**
     * 子iframe通知初始化准备好了
     * @param userId 学生id
     */
    public splitGameReady(userId: string): void {
        if (this._SDKWebDashBoardView) {
            this._SDKWebDashBoardView.splitGameReady(userId);
        }
    }

    /**
     * 用户信息更新
     */
    public updateUsers(): void {
        if (this._SDKWebDashBoardView) {
            this._SDKWebDashBoardView.updateUsers();
        }
    }

    /**
     * 移除users
     * @param
     */
    public deleteUsers(userIds: string[]): void {
        if (this._SDKWebDashBoardView) {
            this._SDKWebDashBoardView.deleteUsers(userIds);
        }
    }

    /**
     * 显示或者隐藏老师切换控制权限
     */
    public displayControll(isShow: boolean): void {
        if (this._SDKWebDashBoardView) {
            this._SDKWebDashBoardView.displayControll(isShow);
        }
        if (this._SDKRepairView) {
            this._SDKRepairView.displayControll(isShow);
        }
    }

    public teachModleChange(teacherModle: SDKENUM.TEACHING_MODE) {
        if (this._SDKWebDashBoardView) {
            this._SDKWebDashBoardView.teachModleChange(teacherModle);
        }
    }

    public teachSplitPageChange(pageIndex: number, isFull: boolean, pageMaxSize: number) {
        if (!this._SDKWebDashBoardView) {
            return;
        }
        this._SDKWebDashBoardView.teachSplitPageChange(pageIndex, isFull, pageMaxSize);
    }

    public updatePageState(): void {
        if (this._SDKWebDashBoardView) {
            this._SDKWebDashBoardView.updatePageState();
        }
        if (this._SDKPcDashBoardView) {
            this._SDKPcDashBoardView.updateChangePageState();
        }
        if (this._SDKRepairView) {
            this._SDKRepairView.updatePageState();
        }
    }

    /**
     * 控制视图显示状态
     */
    public displayWebDashBoardView() {
        const isShow =
            SDKLogicsCore.parameterVo.isTeacher() ||
            SDKLogicsCore.parameterVo.isOberverTeacher() ||
            SDKLogicsCore.parameterVo.isReplayTeacher();
        if (isShow && !this._SDKWebDashBoardView) {
            this._SDKWebDashBoardView = new SDKWebDashBoardView(this);
            this._views.push(this._SDKWebDashBoardView);
        }
        if (this._SDKWebDashBoardView) {
            this._SDKWebDashBoardView.displayWebDashBoardView(isShow);
        }
    }

    /**
     * 更新视图样式
     */
    public updateViewStyle(): void {
        if (this._SDKWebDashBoardView) {
            this._SDKWebDashBoardView.updateViewStyle();
        }

        if (this._SDKRepairView) {
            this._SDKRepairView.updateViewStyle();
        }
    }

    public showUI(key: string = SDKUiDisplayConst.CONTROLL) {
        if (this._SDKWebDashBoardView) {
            this._SDKWebDashBoardView.showUI(key);
        }
        if (this._SDKRepairView) {
            this._SDKRepairView.showUI(key);
        }
    }

    public hideUI(key: string = SDKUiDisplayConst.CONTROLL) {
        if (this._SDKWebDashBoardView) {
            this._SDKWebDashBoardView.hideUI(key);
        }
        if (this._SDKRepairView) {
            this._SDKRepairView.hideUI(key);
        }
    }

    public displayUI(keys: any[] = []): any {
        if (this._SDKWebDashBoardView) {
            this._SDKWebDashBoardView.displayUI(keys);
        }
        if (this._SDKRepairView) {
            this._SDKRepairView.displayUI(keys);
        }
        if (this._SDKPcDashBoardView) {
            this._SDKPcDashBoardView.displayUI(keys);
        }
    }

    public setOpacity(value: number): void {
        if (this._SDKWebDashBoardView) {
            this._SDKWebDashBoardView.setOpacity(value);
        }
        if (this._SDKRepairView) {
            this._SDKRepairView.setOpacity(value);
        }
    }

    public setVideoState(value: boolean) {
        if (this._SDKWebDashBoardView) {
            this._SDKWebDashBoardView.setVideoState(value);
        }
        if (this._SDKPcDashBoardView) {
            this._SDKPcDashBoardView.setVideoState(value);
        }
    }

    public setVideoReplay(value: boolean) {
        if (this._SDKWebDashBoardView) {
            this._SDKWebDashBoardView.setVideoReplay(value);
        }
        if (this._SDKPcDashBoardView) {
            this._SDKPcDashBoardView.setVideoReplay(value);
        }
    }

    /**
     * 更新语音测评
     */
    public updateVoiceAnswer(userId: string) {
        if (this._SDKWebDashBoardView) {
            this._SDKWebDashBoardView.updateVoiceAnswer(userId);
        }
    }

    public reset(): void {
        super.reset();
    }

    public destroy(): void {
        super.destroy();

        this._SDKPcDashBoardView = null;
        this._SDKWebDashBoardView = null;
        this._SDKRepairView = null;
    }
}