import SDKControllerBase from '../SDKController/SDKControllerBase';
import {setObserverStyle} from './SDKControlUI';
import SDKUIBaseView from './SDKUIBaseView';
import * as SDKEnum from "../SDKConst/SDKEnum";

/**
 * 回放视图
 */
export default class SDKReplayView extends SDKUIBaseView {
    protected _isOnline: boolean;

    constructor(controller: SDKControllerBase) {
        super(controller);
    }

    public reset(): void {
        super.reset();
        this._isOnline = true;
    }

    /**
     * 更新用户在线状态
     * @param isOnline 是否在线
     */
    public updateOnlineState(isOnline: boolean) {
        this._isOnline = isOnline;

        if (isOnline) {
            this._components.offline.hide();
        } else {
            this._components.offline.show();
        }
    }

    protected initStyle() {
        setObserverStyle();
    }

    protected initMenuContaner(): void {
        this._menuContainer = document.createElement('div');
        this._menuContainer.setAttribute('id', 'extraContainer');
        document.body.appendChild(this._menuContainer);
    }

    protected initMenuData(): void {
        this._menuShowItems[SDKEnum.MENU_TYPE.GAME] = ['offline'];
        this._menuHideItems[SDKEnum.MENU_TYPE.GAME] = ['offline'];
    }
}