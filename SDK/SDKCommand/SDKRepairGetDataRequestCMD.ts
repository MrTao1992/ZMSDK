import SDKCommandBase from "./SDKCommandBase";
import * as DebugInfo from "../Utils/DebugInfo";
import SDKRepairInfo from "../SDKLogics/SDKRepairInfo";
import * as SDKLogicsCore from "../SDKLogics/SDKLogicsCore";
import * as SDKEnum from "../SDKConst/SDKEnum";
import * as ZMSDK from "../ZMSDK";
import * as SDKRegistCommand from "../SDKConst/SDKRegistCommand";
import SDKRepairUrlInfo from "../SDKLogics/SDKRepairUrlInfo";
import SDKPacket from "../SDKNetwork/SDKPacket";
import SDKApp from "../SDKBase/SDKApp";

/**
 *智能补课学生上课  加载录播数据JSON
 */
export default class SDKRepairGetDataRequestCMD extends SDKCommandBase {

    private NO_EXCUTE = [
        'showPageIndex',
        'gameChangeScene',
        'gamePrevScene',
        'gameNextScene',
        'commitAnswer',
    ];

    private _total: number;
    private _current: number;

    public execute(data: any): void {
        super.execute(data);

        DebugInfo.info("SDKRepairGetDataRequestCMD......", data);
        let repairInfo: SDKRepairInfo = SDKLogicsCore.repairInfo;
        if (repairInfo.sceneIndex != data) {
            DebugInfo.info("请求的sceneIndex不对", repairInfo.sceneIndex, data);
            return;
        }

        switch (repairInfo.dataState) {
            case SDKEnum.TYPE_REPAIR_DATA.UNLOAD:
                this.loadDatas(data);
                break;
            case SDKEnum.TYPE_REPAIR_DATA.LOADING:
                break;
            case SDKEnum.TYPE_REPAIR_DATA.LOADED:
                this.loadComplete();
                break;
        }

        this.recylePacket();
    }

    private loadDatas(sceneIndex): void {
        let rootUrl;
        let url, urls;
        let index = 0, count = 0;
        let repairInfo: SDKRepairInfo;

        repairInfo = SDKLogicsCore.repairInfo;
        let urlInfo: SDKRepairUrlInfo = repairInfo.getRepairUrlInfo(sceneIndex);
        if (!urlInfo) {
            DebugInfo.error("url配置信息不对...", sceneIndex);
            return;
        }
        repairInfo.clearPacket();

        //rootUrl = repairInfo.URLConfig['bucket'];
        urls = urlInfo.getLoadUrls();
        this._total = urls.length;
        if (this._total == 0) {
            this.loadComplete();
            return;
        }
        SDKLogicsCore.repairInfo.dataState = SDKEnum.TYPE_REPAIR_DATA.LOADING;

        this._current = 0;
        count = this._total;
        for (index = 0; index < count; index++) {
            //url = rootUrl + '/' + urls[index].value;
            url = urls[index].value;
            this.loadData(urls[index].key, url + '?' + new Date().getTime());
        }
    }

    private loadData(key: string, url: string): void {
        SDKApp.instance().thirdInterface.load(url, (err, content) => {
            if (err) {
                DebugInfo.error('加载失败', key, err);
            } else {
                DebugInfo.info("加载成功......", url);
                this.parseGameData([key, content]);
            }
            this._current++;
            if (this._current == this._total) {
                this.loadComplete();
            }
        });
    }

    private parseGameData(data) {
        let index = 0, count = 0;
        let name: string = data[0];
        let content: Object = data[1];
        let packet: SDKPacket;
        let repairInfo: SDKRepairInfo = SDKLogicsCore.repairInfo;

        if (!content) {
            DebugInfo.error("回放数据异常......");
            return;
        }
        repairInfo.totalTime = content["duration"];
        let messages = content["events"];
        if (!messages) {
            return;
        }

        let curTime: number = 0;
        count = messages.length;
        for (index = 0; index < count; index++) {
            packet = this.parseMsg(messages[index][1]);
            packet.relativeTime = curTime + messages[index][0];
            curTime = packet.relativeTime;
            if (this.NO_EXCUTE.indexOf(packet.name) == -1) {
                repairInfo.addPacket(name, packet);
            }
        }
    }

    private loadComplete(): void {
        SDKLogicsCore.repairInfo.dataState = SDKEnum.TYPE_REPAIR_DATA.LOADED;
        SDKApp.instance().transceiver.sendMsg(
            SDKRegistCommand.REPAIR_PLAY_READY,
            { "chapterId": SDKLogicsCore.repairInfo.sceneIndex },
            false);
    }

    private parseMsg(data: Object): SDKPacket {
        let packet: SDKPacket;

        packet = SDKApp.instance().transceiver.messageToPacket(data);
        return packet;
    }
}