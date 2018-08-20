var self;
var jsbUtils = require('jsbUtils');
cc.Class({
    extends: cc.Component,

    properties: {
        //競技場item 
        ArenaFramePrefab: {
            default: null,
            type: cc.Prefab
        },
        //content [放 競技場item 的地方]
        ArenaListContent: {
            default: null,
            type: cc.Node
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        self = this;
        cc.director.preloadScene("Main", function () {
            cc.log('Main scene preloaded');
        });
        //todo 取得memberID 預設3
        this.memberId = 2;
        this.ArenaResult = Object.create(null);;//競技場的種類
        //漸顯
        this.node.opacity = 0;
        var FadeInAction = cc.fadeIn(1.0);
        this.node.runAction(FadeInAction);
        //提醒
        this.AlertTipLayer = cc.find('AlertTipeLayer');
        //socketIO
        this.socketControl = cc.find('SocketControl');
        if (this.socketControl) {
            console.log('是否已經連接' + this.socketControl.getComponent('SocketIoCtrl').getConnect());

            if (!this.socketControl.getComponent('SocketIoCtrl').getConnect()) {
                this.socketControl.getComponent('SocketIoCtrl').initSocketControl();
            }
            this.socketControl.getComponent('SocketIoCtrl').setArenaCallBack(this.ArenaCallBack);
            this.socketControl.getComponent('SocketIoCtrl').doArenaList(this.memberId);

            cc.game.addPersistRootNode(this.socketControl);//儲存為永久節點
        }
        //競技場的資料
        this.ArenaData = cc.find('ArenaData');
        if (this.ArenaData) {
            console.log('this.ArenaData is init');
            cc.game.addPersistRootNode(this.ArenaData);//儲存為永久節點
            this.ArenaDataComponent = this.ArenaData.getComponent('ArenaData');
            this.ArenaDataComponent.setMemberID(2);//設定玩的角色
            this.ArenaDataComponent.isBot = false;//設定是否開啟機器人
        }

        //背景音控制
        this.AudioControl = cc.find('AudioControl');
        if (this.AudioControl) {
            console.log('this.AudioControl is init');
            cc.game.addPersistRootNode(this.AudioControl);//儲存為永久節點
            //todo ArenaList 背景音樂
            this.AudioControl.getComponent('AudioControl').PlayArenaList();
        }
    },

    addArenaItem() {
        if (!this.ArenaFramePrefab) {
            console.log('have not prefab');
            return;
        }
        var ArenaList = this.ArenaResult.result_content;
        if (ArenaList) {
            //
            this.ArenaListContent.removeAllChildren();
            for (let i = 0; i < ArenaList.length; i++) {
                var ArenaFrameItem = cc.instantiate(this.ArenaFramePrefab);
                ArenaFrameItem.setPosition(cc.p(0, 0));
                this.ArenaListContent.addChild(ArenaFrameItem);

                if (i === 0) ArenaFrameItem.getComponent('ArenaFrame').init(this.ArenaItemCallBack, ArenaList[i].Arena_ID, 1, true);
                else if (i === 1) ArenaFrameItem.getComponent('ArenaFrame').init(this.ArenaItemCallBack, ArenaList[i].Arena_ID, 2, true);
                else ArenaFrameItem.getComponent('ArenaFrame').init(this.ArenaItemCallBack, ArenaList[i].Arena_ID, 3, true);

                ArenaFrameItem.getComponent('ArenaFrame').ArenaItemTitle.string = ArenaList[i].Arena_Name;
                ArenaFrameItem.getComponent('ArenaFrame').TenDigitsLabel.string = 1;
                ArenaFrameItem.getComponent('ArenaFrame').DigitsLabel.string = 8;
                ArenaFrameItem.getComponent('ArenaFrame').OpenTimesOne.string = 'PM 2:00 - 8:00';
                ArenaFrameItem.getComponent('ArenaFrame').OpenTimesTwo.string = 'PM 2:00 - 8:00';
                ArenaFrameItem.getComponent('ArenaFrame').OpenTimesThree.string = 'PM 2:00 - 8:00';
                //設置HSL 
                if (i === 0) ArenaFrameItem.getComponent('ArenaFrame').ArenaFrame.getComponent('Sprite_HSL').setRender(0, -1, 0);
                else if (i === 1) ArenaFrameItem.getComponent('ArenaFrame').ArenaFrame.getComponent('Sprite_HSL').setRender(0, 0, 0);
                else ArenaFrameItem.getComponent('ArenaFrame').ArenaFrame.getComponent('Sprite_HSL').setRender(180, 0, 0);
            }
        }

    },

    //競技場項目選擇
    ArenaItemCallBack(ArenaID) {
        console.log(ArenaID);
        if (self.ArenaDataComponent) {
            console.log('-ArenaID');
            self.ArenaDataComponent.setArenaId(ArenaID);
            console.log(self.ArenaDataComponent.getArenaId());
            console.log('ArenaID-');
        }
        //
        self.goRank();
    },

    onDestroy() {

    },

    ArenaCallBack(ComponentName, functionName, resultData) {
        //確定有資料或是null
        if (!ComponentName) return;
        if (!functionName) return;
        if (!resultData) return;

        switch (ComponentName) {
            case 'socket':
                self.SocketCallBack(functionName, resultData);
                break;

            default:
                break;
        }
    },

    SocketCallBack(functionName, resultData) {
        switch (functionName) {
            case 'disconnect':
                // this.AlertTipLayer.getComponent('Alert').LeaveFunc = function(){};//設定執行方法
                this.AlertTipLayer.getComponent('Alert').initErrorAlert('連線中斷'+resultData);
                this.AlertTipLayer.setPosition(960, 540);
                break;
            case 'ArenaListCallback':
                self.ArenaResult = resultData;
                console.log('-----arena SocketCallBack - ArenaListCallback-----');
                console.log(self.ArenaResult);
                console.log('Socket Id:' + self.socketControl.getComponent('SocketIoCtrl').getSocketId())
                self.addArenaItem();
                console.log('-----');
                break;
            default:
                break;
        }
    },

    //
    goRank() {
        if (this.socketControl) {
            this.scheduleOnce(function (params) {
                cc.director.loadScene("ArenaRankAreaScene");
            }, 0.5);
        }
    },

    //
    Back() {
        this.scheduleOnce(function (params) {
            cc.director.loadScene("Main");
        }, 0.5);
    },



    //shop
    goShop() {
        console.log('goSHop');
        // cc.director.loadScene("ArenaRankAreaScene");

    }



    // start() {},

    // update (dt) {},
});
