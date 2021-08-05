import * as SDKLogicsCore from '../SDKLogics/SDKLogicsCore';
import SDKUserInfo from '../SDKLogics/SDKUserInfo';
import * as SDKENUM from '../SDKConst/SDKEnum';
import SDKStudentView from './SDKStudentView';
import * as DebugInfo from '../Utils/DebugInfo';
import SDKPacket from '../SDKNetwork/SDKPacket';
import SDKApp from '../SDKBase/SDKApp';
import * as SDKRegistCommand from '../SDKConst/SDKRegistCommand';
import * as SDKRecordEventConst from '../SDKConst/SDKRecordEventConst';

export default class SDKStudentsView {
    public PAGE_COUNT: number = 4;
    protected _container: any;
    protected _components: any;
    protected _pageContainer: any;
    protected _pageCodes: any[];

    protected _userIds: string[];
    protected _studentViews: SDKStudentView[];

    protected _curPage: number;
    protected _totalPage: number;
    protected _isFirstInit: boolean;
    protected _isFull: boolean;

    protected _dropListCallBack:Function;

    constructor() {
        this.reset();
        this.initContainer();
    }

    public get container(): any {
        return this._container;
    }

    public set dropListCallBack(value: Function) {
        this._dropListCallBack = value;
    }

    public reset() {
        this._curPage = 0;
        this._totalPage = 1;
        this._userIds = [];
        this._studentViews = [];
        this._pageCodes = [];
        this._isFirstInit = true;
        this._isFull = false;
    }

    public destroy() {
        this.removePageNode();
        this.removeStudentsView();
        this.reset();
    }

    public updateStudents(): void {
        let index = 0;
        let count = 0;
        let userInfo: SDKUserInfo;

        count = SDKLogicsCore.userInfos.getCount();
        for (index = 0; index < count; index++) {
            userInfo = SDKLogicsCore.userInfos.getUserInfoByIndex(index);
            if (userInfo.role !== SDKENUM.USER_ROLE.STUDENT) {
                continue;
            }
            if (this._userIds.indexOf(userInfo.userId) !== -1) {
                continue;
            }
            this._userIds.push(userInfo.userId);
        }
        this._userIds.sort();
        this.updatePageState();
        this.updateStudentsView();
        this._dropListCallBack && this._dropListCallBack(this._userIds.length > 1);
    }

    public updateStudentsView(): void {
        let index = 0;
        let count = 0;
        let userId = '';
        let startIndex = 0;
        let userInfo: SDKUserInfo;
        let stuView: SDKStudentView;

        startIndex = this._curPage * this.PAGE_COUNT;
        count = Math.max(Math.min(this._userIds.length, this.PAGE_COUNT), this._studentViews.length);
        for (index = 0; index < count; index++) {
            if (index >= this._studentViews.length) {
                stuView = new SDKStudentView();
                stuView.scaleFun = this.scaleView.bind(this);
                this._studentViews.push(stuView);
                this._container.insertBefore(stuView.container, this._pageContainer);
            } else {
                stuView = this._studentViews[index];
            }
            if (index + startIndex < this._userIds.length) {
                userId = this._userIds[index + startIndex];
                userInfo = SDKLogicsCore.userInfos.getUserInfoById(userId);
                stuView.updateUserInfo(userInfo);
                stuView.isActive = true;
            } else {
                stuView.isActive = false;
            }
        }
        this.showStudentsView();
        if (!this._isFirstInit) {
            this.synchronizeIframes();
        }
    }

    public showStudentsView(): void {
        let index = 0;
        let count = 0;

        count = this._studentViews.length;
        for (index = 0; index < count; index++) {
            this._studentViews[index].show();
        }
        document.body.className = '';
        document.body.classList.add('inspliting');
        this._container.style.display = 'block';
        let showCount = this._isFull ? this.PAGE_COUNT : this._studentViews.length;
        document.body.classList.add(`split${showCount}`);
    }

    public hideStudentsView(): void {
        let index = 0;
        let count = 0;

        count = this._studentViews.length;
        for (index = 0; index < count; index++) {
            this._studentViews[index].hide(true);
            this._studentViews[index].setScaleState(false);
        }
        this._container.style.display = 'none';
        document.body.classList.remove('inspliting');
        document.body.classList.remove(`split${this._studentViews.length}`);

        this._curPage = 0;
        this._isFull = false;
    }

    /**
     * 移除users
     * @param
     */
    public deleteStudentView(userIds: string[]): void {
        let index = 0;
        let count = 0;
        let flag = -1;
        let studentView: SDKStudentView;

        count = userIds.length;
        for (index = 0; index < count; index++) {
            flag = this._userIds.indexOf(userIds[index]);
            if (flag !== -1) {
                this._userIds.splice(flag, 1);
                studentView = this.getStudentViewById(userIds[index]);
                if (studentView) {
                    studentView.isActive = false;
                    studentView.hide();
                }
            }
        }
    }

    public deleteAll(): void {
        this.deleteStudentView(this._userIds);
    }

    public dispatcherToStudents(packet: SDKPacket, controllerId: string) {
        let index = 0;
        let count = 0;
        let studentView: SDKStudentView;

        count = this._studentViews.length;
        for (index = 0; index < count; index++) {
            studentView = this._studentViews[index];
            if (controllerId === '-1') {
                if (packet.sendId === studentView.userId) {
                    studentView.sendPacket(packet);
                }
            } else if (controllerId !== '') {
                studentView.sendPacket(packet);
            }
        }
    }

    public dispatcherToStudent(packet: SDKPacket, sendId: string) {
        let studentView: SDKStudentView;

        studentView = this.getStudentViewById(sendId);
        studentView && studentView.sendPacket(packet);
    }

    public synchronizePacket(userInfo: SDKUserInfo): void {
        let studentView: SDKStudentView;

        studentView = this.getStudentViewById(userInfo.userId);
        if (studentView) {
            studentView.synchronizePacket();
        } else {
            DebugInfo.warn('SDKStudentView userInfo change exit........', userInfo.userId, this._studentViews);
        }
    }

    public splitGameReady(userId: string) {
        let userInfo: SDKUserInfo;

        userInfo = SDKLogicsCore.userInfos.getUserInfoById(userId);
        if (!userInfo) {
            DebugInfo.error('userInfo为空........');
            return;
        }
        userInfo.isSplitReady = true;

        let stuView = this.getStudentViewById(userId);
        if (stuView) {
            stuView.isInit = true;
        }

        if (
            !(
                SDKLogicsCore.parameterVo.isTeacher() ||
                SDKLogicsCore.parameterVo.isOberverTeacher()
            )
        ) {
            return;
        }


        this.synchronizePacket(userInfo);
        this._isFirstInit = false;
    }

    public setPageIndex(pageIndex: number, isFull: boolean, pageMaxSize?: number): void {
        if (this._curPage === pageIndex && this._isFull === isFull) {
            if (pageMaxSize && pageMaxSize == SDKLogicsCore.gameConfig.splitPageNumber) {
                return;
            } else if (!pageMaxSize) {
                return;
            }
        }
        this._isFull = isFull;
        this._curPage = pageIndex;
        if (pageMaxSize) {
            if(SDKLogicsCore.gameConfig.splitPageNumber != pageMaxSize) {
                SDKLogicsCore.gameConfig.splitPageNumber = pageMaxSize;
                this.deleteSurplusStudentViews();
            }
        }
        this.updatePageState();
        this.updateStudentsView();
        this.updateStudentsState(isFull);
    }


    public updateVoiceAnswer(userId: string) {
        let studentView = this.getStudentViewById(userId);
        if(studentView) {
            studentView.updateVoiceAnswer();
        }
    }

    public changePageMaxSize(pageMaxSize: number) {
        if (pageMaxSize == SDKLogicsCore.gameConfig.splitPageNumber) {
            return;
        }
        SDKLogicsCore.gameConfig.splitPageNumber = pageMaxSize;
        this.deleteSurplusStudentViews();
        this.updateStudents();
        this.dispatcherCMD(SDKRegistCommand.TEACH_SPLIT_PAGE_CHANGE);
    }

    protected deleteSurplusStudentViews() {
        let pageMaxSize = SDKLogicsCore.gameConfig.splitPageNumber;
        while (this._studentViews.length > pageMaxSize) {
            let studentView: SDKStudentView;
            studentView = this._studentViews.pop();
            if (studentView) {
                this._container.removeChild(studentView.container);
                studentView.destory();
            }
        }
    }

    protected synchronizeIframes(): void {
        let index = 0;
        let count = 0;
        let studentView: SDKStudentView;

        count = this._studentViews.length;
        for (index = 0; index < count; index++) {
            studentView = this._studentViews[index];
            studentView.synchronizePacket();
        }
    }

    protected getStudentViewById(userId: string): SDKStudentView {
        let index = 0;
        let count = 0;
        let studentView: SDKStudentView;

        count = this._studentViews.length;
        for (index = 0; index < count; index++) {
            studentView = this._studentViews[index];
            if (studentView.userId == userId) {
                return studentView;
            }
        }
        return null;
    }

    protected getStudentViewIndex(userId: string): number {
        let index = 0;
        let count = 0;
        let studentView: SDKStudentView;

        count = this._studentViews.length;
        for (index = 0; index < count; index++) {
            studentView = this._studentViews[index];
            if (studentView.userId == userId) {
                return index;
            }
        }
        return -1;
    }

    protected removeStudentsView() {
        let index = 0;
        let count = 0;
        let studentView: SDKStudentView;

        count = this._studentViews.length;
        for (index = 0; index < count; index++) {
            studentView = this._studentViews[index];
            this._container.removeChild(studentView.container);
            studentView.destory();
        }
        this._studentViews = [];
    }

    protected initContainer(): void {
        this._container = document.createElement('div');
        this._container.setAttribute('id', 'childIframes');
        this._container.style.display = 'none';
        this._container.style.backgroundColor = '#20222A';

        this._pageContainer = document.createElement('div');
        this._pageContainer.setAttribute('id', 'pageContainer');
        this._container.appendChild(this._pageContainer);
        this.initPageCode();
    }

    public initMenuContent(components: any): void {
        let self = this;

        this._components = components;
        if (components.prevCheck) {
            components.prevCheck.onClick = self.onPrevPage.bind(self);
        }
        if (components.nextCheck) {
            components.nextCheck.onClick = self.onNextPage.bind(self);
        }
    }

    protected updatePageState(): void {
        this.PAGE_COUNT = this._isFull ? 1 : SDKLogicsCore.gameConfig.splitPageNumber;
        if (this._userIds.length == 0) {
            this._totalPage = 1;
        } else {
            this._totalPage = Math.ceil(this._userIds.length / this.PAGE_COUNT);
        }
        if (this._curPage >= this._totalPage) {
            this._curPage = this._totalPage - 1;
        }
        if (this._curPage < 0) {
            this._curPage = 0;
        }

        if (this._curPage > 0) {
            this._components.prevCheck.show();
        } else {
            this._components.prevCheck.hide();
        }

        if (this._curPage < this._totalPage - 1) {
            this._components.nextCheck.show();
        } else {
            this._components.nextCheck.hide();
        }

        SDKLogicsCore.controllState.splitPage = this._curPage;
        SDKLogicsCore.controllState.isSplitFull = this._isFull;
        this.dispatcherCMD(SDKRegistCommand.TEACH_SPLIT_PAGE_CHANGE);
        this.initPageCode();
    }

    protected onNextPage(): void {
        this._curPage++;
        this.updatePageState();
        this.updateStudentsView();

        let eventId;
        if (this._isFull) {
            eventId = SDKRecordEventConst.SPLIT_SCRREN_FULL_NEXT_PAGE;
        } else {
            eventId = SDKRecordEventConst.SPLIT_SCRREN_NEXT_PAGE;
        }

        SDKApp.instance().newRecordTransceiver.send(
            eventId,
            { pageIndex: this._curPage }
        );
    }

    protected onPrevPage(): void {
        this._curPage--;
        this.updatePageState();
        this.updateStudentsView();

        let eventId;
        if (this._isFull) {
            eventId = SDKRecordEventConst.SPLIT_SCRREN_FULL_PRE_PAGE;
        } else {
            eventId = SDKRecordEventConst.SPLIT_SCRREN_PRE_PAGE;
        }

        SDKApp.instance().newRecordTransceiver.send(
            eventId,
            { pageIndex: this._curPage }
        );
    }

    protected dispatcherCMD(name: string) {
        if (SDKLogicsCore.parameterVo.isTeacher()) {
            SDKApp.instance().transceiver.sendMsg(
                name, 
                { pageIndex: this._curPage, isFull: this._isFull, pageMaxSize: SDKLogicsCore.gameConfig.splitPageNumber }, 
                false
            );
        }
    }

    protected initPageCode(): void {
        let index = 0;
        let count = 0;
        let node: any;

        this._pageContainer.style.display = this._totalPage <= 1 ? 'none' : 'block';
        if (this._totalPage == 1) {
            return;
        }

        count = Math.max(this._totalPage, this._pageCodes.length);
        for (index = 0; index < count; index++) {
            if (index >= this._totalPage && index < this._pageCodes.length) {
                node = this._pageCodes[index];
                node.style.display = 'none';
                continue;
            }

            if (index < this._pageCodes.length) {
                node = this._pageCodes[index];
            } else {
                node = document.createElement('div');
                node.setAttribute('id', 'pageNode' + (index + 1));
                this._pageCodes.push(node);
                this._pageContainer.appendChild(node);
            }
            node.style.display = 'block';
            if (index == this._curPage) {
                node.className = 'pageCodeRed';
            } else {
                node.className = 'pageCodeGray';
            }
        }
        //this._pageContainer.style['margin-left'] = (-(this._totalPage * 8 + 4) / 2 - 16) + 'px';
        this._pageContainer.style['margin-left'] = -((this._totalPage - 1) * 8 + this._totalPage * 4 + 10) / 2 + 'px';
    }

    protected removePageNode(){
        let index = 0;
        let count = 0;
        let node: any;

        count = this._pageCodes.length;
        for (index = 0; index < count; index++) {
            node = this._pageCodes[index];
            this._pageContainer.removeChild(node);
        }
        this._pageCodes = [];
    }

    protected scaleView(userId: string, isFull): void {
        // if (this._studentViews.length <= 1) {
        //     return;
        // }
        let curIndex = this.getStudentViewIndex(userId);
        if (curIndex == -1) {
            return;
        }
        let pageIndex;
        if (isFull) {
            pageIndex = this._curPage * this.PAGE_COUNT + curIndex;
        } else {
            pageIndex = Math.floor(this._curPage / SDKLogicsCore.gameConfig.splitPageNumber);
        }

        this.setPageIndex(pageIndex, isFull);
    }

    protected updateStudentsState(isFull: boolean): void {
        let index = 0;
        let count = 0;

        count = this._studentViews.length;
        for (index = 0; index < count; index++) {
            if (isFull) {
                if (index == 0) {
                    this._studentViews[index].setScaleState(isFull);
                }
            } else {
                this._studentViews[index].setScaleState(isFull);
            }
        }
    }
}