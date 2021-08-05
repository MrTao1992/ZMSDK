import SDKControllerBase from './SDKControllerBase';

export default class SDKContrllerManager {
    public static instance(): SDKContrllerManager {
        if (!SDKContrllerManager._instance) {
            SDKContrllerManager._instance = new SDKContrllerManager();
        }
        return SDKContrllerManager._instance;
    }
    private static _instance: SDKContrllerManager;

    private _controllers: { [name: string]: SDKControllerBase };

    constructor() {
        if (SDKContrllerManager._instance) {
            throw console.error('the object is had already!');
        }
        this._controllers = {};
        SDKContrllerManager._instance = this;
    }

    public addController(name: string, controller: SDKControllerBase): void {
        this._controllers[name] = controller;
    }

    public getController(name: string): SDKControllerBase {
        return this._controllers[name];
    }

    public removeController(name: string): void {
        let controler: SDKControllerBase;

        controler = this._controllers[name];
        if (controler) {
            controler.destroy();
            this._controllers[name] = null;
            delete this._controllers[name];
        }
    }

    public update(dt: number) {
        for (const key in this._controllers) {
            if (this._controllers.hasOwnProperty(key)) {
                let controler = this._controllers[key];
                controler && controler.update(dt);
            }
        }
    }
}
