import SDKControllerBase from '../SDKController/SDKControllerBase';

/**
 * 视图基础类
 */
export default class SDKBaseView {
    protected _controller: SDKControllerBase;

    constructor(controller: SDKControllerBase) {
        this._controller = controller;
        this.reset();
    }

    public reset(): void {}

    public destroy(): void {
        this._controller = null;
    }
}
