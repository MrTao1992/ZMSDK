import SDKControllerBase from '../SDKController/SDKControllerBase';
import SDKUIBaseView from './SDKUIBaseView';

/**
 * 单机版本的控制台
 */
export default class SDKPcDashBoardView extends SDKUIBaseView {

    constructor(controller: SDKControllerBase) {
        super(controller);
    }

    protected initMenuContent(menuName: string): void {
        super.initMenuContent(menuName);

        this.updateChangePageState();
    }
}