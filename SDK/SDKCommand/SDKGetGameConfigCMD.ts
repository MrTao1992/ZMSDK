import SDKCommandBase from './SDKCommandBase';
import * as SDKLogicsCore from '../SDKLogics/SDKLogicsCore';
import * as DebugInfo from '../Utils/DebugInfo';
import * as SDKConfigConst from '../SDKConst/SDKConfigConst';
import SDKGameConfig from '../SDKLogics/SDKGameConfig';
import SDKApp from '../SDKBase/SDKApp';

/**
 * 加载游戏配置信息
 */
export default class SDKGetGameConfigCMD extends SDKCommandBase {
    public execute(data: any): void {
        super.execute(data);

        DebugInfo.info('SDKGetGameConfigCMD......');
        this.loadConfig();
    }

    private loadConfig() {
        let url: string;

        url = SDKConfigConst.GAEM_CONFIG_URL + '?' + new Date().getTime();

        SDKApp.instance().thirdInterface.load(url, (err, content) => {
            if (err) {
                console.log(err);
            } else {
                DebugInfo.info('加载成功......', url);
                this.parseConfigData(content);
            }
        });
    }

    private parseConfigData(gameConfig): void {
        let config: SDKGameConfig;

        config = SDKLogicsCore.gameConfig;
        for (const key in gameConfig) {
            if (gameConfig.hasOwnProperty(key) && config.hasOwnProperty(key)) {
                config[key] = gameConfig[key];
            }
        }
    }
}