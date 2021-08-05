import SDKControllerBase from '../SDKController/SDKControllerBase';
import * as SDKENUM from '../SDKConst/SDKEnum';
import * as SDKLogicsCore from '../SDKLogics/SDKLogicsCore';
import * as SDKRegistCommand from '../SDKConst/SDKRegistCommand';
import SDKPacket from '../SDKNetwork/SDKPacket';
import {
    DomDropList,
    setDefaultStyle,
    setObserverStyle
} from './SDKControlUI';
import * as SDKRecordEventConst from '../SDKConst/SDKRecordEventConst';
import SDKApp from '../SDKBase/SDKApp';
import SDKUIBaseView from './SDKUIBaseView';
import * as SDKEnum from "../SDKConst/SDKEnum";
import SDKStudentsView from './SDKStudentsView';
import { SDKVoiceAnswerCountDownView } from './SDKVoiceAnswerView';

export default class SDKWebDashBoardView extends SDKUIBaseView {
    /** 鼠标形态 */
    protected _mouseName: string;
    /** 教学模式 */
    protected _teachingMode: SDKENUM.TEACHING_MODE;
    /** 控制者id */
    protected _controllerId: string;
    protected _isShowControllUI: boolean;
    protected _studentsView: SDKStudentsView;
    protected _dropList: DomDropList;
    protected _countDownView : SDKVoiceAnswerCountDownView;

    constructor(controller: SDKControllerBase) {
        super(controller);

        this.setController(this._controllerId);
        this.teachModleChange(SDKLogicsCore.controllState.teachingMode);
    }

    public updateSplitFrames(): void {
        if (this._studentsView) {
            this._studentsView.updateStudents();
        }
    }

    public setController(controllerId: string): void {
        this._controllerId = controllerId;
        if (this._controllerId === '-1') {
            this._components.controll.setStatus('student');
        } else {
            this._components.controll.setStatus('teacher');
        }

        this.updateUIState(controllerId);
        this.updateChangeSceneState();
        this.updateMouseState();
    }

    public splitGameReady(userId: string): void {
        this._studentsView && this._studentsView.splitGameReady(userId);
    }

    public dispatcherSubIframe(packet: SDKPacket) {
        if (this._studentsView) {
            this._studentsView.dispatcherToStudents(packet, this._controllerId);
        }
    }

    public notifySubIframe(packet: SDKPacket, userId: string) {
        if (this._studentsView) {
            this._studentsView.dispatcherToStudent(packet, userId);
        }
    }

    public updateUsers(): void {
        if (this._teachingMode === SDKENUM.TEACHING_MODE.TYPE_INSPECTION) {
            this.updateSplitFrames();
        }
    }

    public deleteUsers(userIds: string[]): void {
        if (this._studentsView) {
            this._studentsView.deleteStudentView(userIds);
        }
    }

    public displayControll(isShow: boolean): void {
        this._isShowControllUI = isShow;
        if (isShow) {
            this._components.controll.show();
            this._components.videoReplay.hide();
        } else {
            this._components.controll.hide();
            this._components.videoReplay.show();
        }
    }

    public teachModleChange(teacherModle: SDKENUM.TEACHING_MODE) {
        if (teacherModle === SDKENUM.TEACHING_MODE.TYPE_TEACHING) {
            this._components.split.setStatus('full');
            this.teahcerModle();
        } else if (teacherModle === SDKENUM.TEACHING_MODE.TYPE_INSPECTION) {
            this._components.split.setStatus('split');
            this.spliteModle();
        }
        this.updateMouseState();
    }

    public teachSplitPageChange(pageIndex: number, isFull: boolean, pageMaxSize: number) {
        if (this._teachingMode === SDKENUM.TEACHING_MODE.TYPE_INSPECTION) {
            this._studentsView && this._studentsView.setPageIndex(pageIndex, isFull, pageMaxSize);
        } else {
            if (pageMaxSize) {
                SDKLogicsCore.gameConfig.splitPageNumber = pageMaxSize;
            }
        }
    }

    public updatePageState(): void {
        if (
            SDKLogicsCore.controllState.isFullOwn() ||
            SDKLogicsCore.controllState.isOberverFullOwn() ||
            SDKLogicsCore.controllState.isReplayFullOwn()
        ) {
            this.updateChangePageState();
        }
    }

    public displayWebDashBoardView(isShow: boolean) {
        if (isShow) {
            this._menuContainer.style.display = 'block';
            if (this._teachingMode === SDKENUM.TEACHING_MODE.TYPE_TEACHING) {
                this._studentsView.hideStudentsView();
            } else {
                this._studentsView.showStudentsView();
            }
        } else {
            this._menuContainer.style.display = 'none';
            this._studentsView.hideStudentsView();
            this._studentsView.deleteAll();
            this.teachModleChange(SDKENUM.TEACHING_MODE.TYPE_TEACHING);
        }
    }

    public updateViewStyle(): void {
        let index = 0;
        let count = 0;
        const elements = (window as any).publicStyle.childNodes;

        count = elements.length;
        for (index; index < count; index++) {
            if (elements[index] && elements[index].parentNode) {
                const str = elements[index].data;
                if (str.indexOf('controllCenter') !== -1) {
                    elements[index].parentNode.removeChild(elements[index]);
                    break;
                }
            }
        }
        if (SDKLogicsCore.parameterVo.isTeacher()) {
            setDefaultStyle();
        } else if (
            SDKLogicsCore.parameterVo.isOberverTeacher() ||
            SDKLogicsCore.parameterVo.isGameReplay()
        ) {
            setObserverStyle();
        }
    }

    public updateVoiceAnswer(userId: string){
        if(this._teachingMode == SDKENUM.TEACHING_MODE.TYPE_INSPECTION) {
            this._studentsView.updateVoiceAnswer(userId);
        }
    }

    public reset(): void {
        super.reset();

        this._mouseName = 'auto';
        this._isShowControllUI = true;
        this._controllerId = SDKLogicsCore.controllState.controllerId;
        this._teachingMode = SDKENUM.TEACHING_MODE.TYPE_TEACHING;
    }

    public destroyIframes() {
        this._studentsView && this._studentsView.destroy();
    }

    public destroy(): void {
        super.destroy();
    }

    protected onTeacherModle(): void {
        this.teahcerModle();

        this._controller.dispatcherCMD(
            SDKRegistCommand.TEACH_MODLE_CHANGE,
            this._teachingMode,
            false
        );

        SDKApp.instance().recordTransceiver.send(
            SDKRecordEventConst.CLICK_MAIN
        );
    }

    protected teahcerModle(): void {
        if (this._teachingMode === SDKENUM.TEACHING_MODE.TYPE_TEACHING) {
            return;
        }
        this._teachingMode = SDKENUM.TEACHING_MODE.TYPE_TEACHING;
        SDKLogicsCore.controllState.teachingMode = this._teachingMode;
        this._studentsView && this._studentsView.hideStudentsView();
        this.initMenuContent(SDKEnum.MENU_TYPE.GAME);

        this.updateChangeSceneState();
        this.displayControll(this._isShowControllUI);
    }

    protected onSplitModle(): void {
        this.spliteModle();

        this._controller.dispatcherCMD(
            SDKRegistCommand.TEACH_MODLE_CHANGE,
            this._teachingMode,
            false
        );


        SDKApp.instance().recordTransceiver.send(
            SDKRecordEventConst.CLICK_SPLIT
        );
        this.sendSplitMaxChange(SDKLogicsCore.gameConfig.splitPageNumber);
    }

    protected spliteModle(): void {
        if (this._teachingMode === SDKENUM.TEACHING_MODE.TYPE_INSPECTION) {
            return;
        }
        this._teachingMode = SDKENUM.TEACHING_MODE.TYPE_INSPECTION;
        SDKLogicsCore.controllState.teachingMode = this._teachingMode;

        this.initMenuContent(SDKEnum.MENU_TYPE.SPLIT);
        this.updateSplitFrames();
    }

    protected initStyle() {
        if (SDKLogicsCore.parameterVo.isTeacher()) {
            setDefaultStyle();
        } else if (
            SDKLogicsCore.parameterVo.isOberverTeacher() ||
            SDKLogicsCore.parameterVo.isGameReplay()
        ) {
            setObserverStyle();
        }
    }

    protected initMenuContaner(): void {
        super.initMenuContaner();

        this._studentsView = new SDKStudentsView();
        this._studentsView.dropListCallBack = this.displayDroplist.bind(this);
        document.body.appendChild(this._studentsView.container);
    }

    protected initMenuData(): void {
        this._menuShowItems[SDKEnum.MENU_TYPE.GAME] = [
            'prev',
            'next',
            'prevCheck',
            'nextCheck',
            'split',
            'controll',
            'play',
            'videoReplay'
        ];
        this._menuHideItems[SDKEnum.MENU_TYPE.GAME] = ['prevCheck', 'nextCheck', 'play', 'videoReplay'];

        this._menuShowItems[SDKEnum.MENU_TYPE.SPLIT] = ['split', 'prevCheck', 'nextCheck'];
        this._menuHideItems[SDKEnum.MENU_TYPE.SPLIT] = ['prevCheck', 'nextCheck'];
    }

    protected initMenuContent(menuName: string) {
        super.initMenuContent(menuName);
        let self = this;
        let arr: Array<string> = [
            '分屏数量:4',
            '分屏数量:2',
            '分屏数量:1'
        ]
        if (!this._dropList && SDKLogicsCore.parameterVo.role == SDKEnum.USER_ROLE.TEACHER) {
            if (SDKLogicsCore.parameterVo.usage == SDKEnum.GAME_TYPE.CLASS) {
                this._dropList = new DomDropList(arr, this._menuContainer);
                this._dropList.onClick = self.onSpliteReform.bind(self);
            }
        }
        if (this._dropList) {
            this._dropList.hide();
            if (menuName == SDKEnum.MENU_TYPE.SPLIT) {
                this._dropList.show();
            }
        }
        if (SDKLogicsCore.voiceAnswerInfo.isVoiceAnswer() && !this._countDownView) {
            if(SDKLogicsCore.parameterVo.isTeacher()) {
                this._countDownView = new SDKVoiceAnswerCountDownView(document.body);
            }
        }
        this._countDownView && this._countDownView.hide();
    }

    protected displayDroplist(isShow: boolean) {
        if (this._dropList) {
            if (isShow && this._teachingMode === SDKENUM.TEACHING_MODE.TYPE_INSPECTION) {
                this._dropList.show();
            } else {
                this._dropList.hide();
            }
        }
    }

    protected initClickEvent(): void {
        super.initClickEvent();

        let self = this;

        this._studentsView && this._studentsView.initMenuContent(this._components);
        if (this._components.controll) {
            this._components.controll.onClick = self.onControllClick.bind(self);
        }
        if (this._components.split) {
            this._components.split.onClick = self.onSplitClick.bind(self);
        }
    }

    protected onPrePageClick() {
        let self = this;

        if (
            SDKLogicsCore.sceneState.state ===
            SDKENUM.TYPE_SCENE.TYPE_LOADING &&
            SDKLogicsCore.sceneState.curIndex === 0
        ) {
            // 切换课件，恢复历史记录的时候 ，在跳转场景的过程中，
            // 防止在第一个场景在跳转到目标场景的过程中点击切换按钮
            return;
        }
        self._controller.dispatcherHandle('gamePrevScene', null, true);
        self.destroyIframes();

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

        if (
            SDKLogicsCore.sceneState.state ===
            SDKENUM.TYPE_SCENE.TYPE_LOADING &&
            SDKLogicsCore.sceneState.curIndex === 0
        ) {
            return;
        }
        self._controller.dispatcherHandle('gameNextScene', null, true);
        self.destroyIframes();

        const logInfo = {
            nextSceneIndex: SDKLogicsCore.sceneState.curIndex + 1
        };
        SDKApp.instance().recordTransceiver.send(
            SDKRecordEventConst.NEXTPAGE,
            logInfo
        );
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

    protected onSplitClick() {
        let self = this;

        if (self._components.split.status === 'full') {
            self.onTeacherModle();
        } else {
            self.onSplitModle();
        }
    }

    protected onSpliteReform(e, select: number) {
        let self = this;
        let arr = [4, 2, 1];
        self._studentsView && self._studentsView.changePageMaxSize(arr[select]);
        this.sendSplitMaxChange(arr[select]);
    }

    protected sendSplitMaxChange(value: number) {
        if (value == 1) {
            SDKApp.instance().newRecordTransceiver.send(SDKRecordEventConst.SPLIT_SHOW_MAX_ONE);
        } else if (value == 2) {
            SDKApp.instance().newRecordTransceiver.send(SDKRecordEventConst.SPLIT_SHOW_MAX_TWO);
        } else {
            SDKApp.instance().newRecordTransceiver.send(SDKRecordEventConst.SPLIT_SHOW_MAX_FOUR);
        }
    }

    protected onMouseOver() {
        let seft = this;

        seft._mouseName = document.body.style.cursor;
        seft._controller.dispatcherHandle('gameMouseLeave', null, false);
    }

    protected onMouseOut() {
        if (this._teachingMode === SDKENUM.TEACHING_MODE.TYPE_TEACHING) {
            this._controller.dispatcherHandle(
                'gameMouseEnter',
                this._mouseName,
                false
            );
        }
    }

    private onTeacherControll(): void {
        if (this._controllerId === SDKLogicsCore.parameterVo.userId) {
            return;
        }
        this._controllerId = SDKLogicsCore.parameterVo.userId;
        this._controller.dispatcherCMD(
            SDKRegistCommand.CONTROLLER_CHANGE,
            this._controllerId,
            false
        );

        this.updateChangeSceneState();

        SDKApp.instance().recordTransceiver.send(
            SDKRecordEventConst.CLICK_TEACHER_CONTROL
        );
    }

    private onFreeControll(): void {
        if (this._controllerId === '-1') {
            return;
        }
        this._controllerId = '-1';
        this._controller.dispatcherCMD(
            SDKRegistCommand.CONTROLLER_CHANGE,
            this._controllerId,
            false
        );

        this.updateChangeSceneState();

        SDKApp.instance().recordTransceiver.send(
            SDKRecordEventConst.CLICK_FREE_CONTROL
        );
    }

    private updateChangeSceneState(): void {
        if (
            SDKENUM.TEACHING_MODE.TYPE_TEACHING === this._teachingMode &&
            (SDKLogicsCore.controllState.isFullOwn() ||
                SDKLogicsCore.controllState.isOberverFullOwn() ||
                SDKLogicsCore.controllState.isReplayFullOwn())
        ) {
            this._components.prev.show();
            this._components.next.show();
            this.updateChangePageState();
        } else {
            this._components.prev.hide();
            this._components.next.hide();
        }
    }
}