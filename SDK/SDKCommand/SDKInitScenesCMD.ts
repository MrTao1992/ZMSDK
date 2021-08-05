import SDKCommandBase from './SDKCommandBase';
import * as SDKLogicsCore from '../SDKLogics/SDKLogicsCore';

/**
 * 初始化场景
 */
export default class SDKInitScenesCMD extends SDKCommandBase {
    public execute(data: any): void {
        super.execute(data);

        SDKLogicsCore.sceneState.secnes = data[0];
        if(data.length > 1) {
            SDKLogicsCore.sceneState.answers = data[1];
        }
        // if (SDKLogicsCore.parameterVo.isRepair) {
        //     SDKLogicsCore.sceneState.answers = data[1];
        // }

        this.recylePacket();
    }
}
