import SDKCommandBase from "./SDKCommandBase";

/**
 * 处理ZML课件发送到课件的历史开始
 */
export default class SDKHistoryStartCMD extends SDKCommandBase{

    public execute(data : any):void{
        super.execute(data);

        console.log("SDKHistoryStartCMD......");

        this.recylePacket();
    }
}