var self;
var ArenaConfig = require('ArenaConfig');
cc.Class({
    extends: cc.Component,

    properties: {
        Status: {
            default: null,
            type: cc.Label
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        self = this;
        //todo 取得memberID 預設3
        this.memberId = 2;
        this.ArenaResult = Object.create(null);;//競技場的種類

        //漸顯
        this.node.opacity = 0;
        var action = cc.fadeIn(1.0);
        this.node.runAction(action);

        //輸入框 EditBox
        this.EditBox = this.node.getChildByName('menu').getChildByName('url').getChildByName('edit').getComponent(cc.EditBox);
        this.EditBox.string = ArenaConfig.SocketIO_URL;
        console.log(this.EditBox);

        //競技場item
        this.ArenaItem = cc.find('ArenaItem');

         //背景音控制
         this.AudioControl = cc.find('AudioControl');
         if (this.AudioControl) {
             console.log('this.AudioControl is init');
             cc.game.addPersistRootNode(this.AudioControl);//儲存為永久節點
         }
        
        //執行連接socketIO
        this.socketControl = cc.find('SocketControl');
        if (this.socketControl) {
            // console.log(this.socketControl);
            this.socketControl.getComponent('SocketIoCtrl').setArenaCallBack(this.ArenaCallBack);
            // this.socketControl.getComponent('SocketIoCtrl').initSocketControl();
            // this.socketControl.getComponent('SocketIoCtrl').doArenaList(this.memberId);
            cc.game.addPersistRootNode(this.socketControl);//儲存為永久節點
        }
        //競技場的資料
        this.ArenaData = cc.find('ArenaData');
        if (this.ArenaData) {
            console.log('this.ArenaData is init');
            cc.game.addPersistRootNode(this.ArenaData);//儲存為永久節點
            this.ArenaDataComponent = this.ArenaData.getComponent('ArenaData');
            // this.ArenaDataComponent.setMemberID(2);
        }


        //機器人答題正確概率
        this.per = this.node.getChildByName('menu').getChildByName('BotCorrectPer').getChildByName('per');
        this.per.getComponent(cc.Label).string = Math.floor(this.ArenaDataComponent.BotCorrectPer * 100);

        //預設角色 2
        this.ArenaDataComponent.setMemberID(2);
        this.ArenaDataComponent.isBot = true;
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
            case 'error':
                self.Status.string = resultData;
                break;
            //connect
            case 'connect':
                self.Status.string = '開始取得競技場列表';
                self.socketControl.getComponent('SocketIoCtrl').doArenaList(self.ArenaDataComponent.getMemberID());
                break;
            case 'ArenaListCallback':
                self.addArenaItem(resultData.result_content);
                break;
            case 'ConncetCallback':
                self.Status.string = '準備進入配對';
                self.scheduleOnce(function delay(params) {
                    this.loadScene();
                }, 2);
                break;
            default:
                break;
        }
    },

    addArenaItem(ArenaList) {
        var ArenaListLayer = this.node.getChildByName('menu').getChildByName('ArenaListLayer');
        ArenaListLayer.removeAllChildren();
        ArenaList.forEach(Arena => {
            var Arena_ID = Arena.Arena_ID;
            var Arena_Name = Arena.Arena_Name;

            //
            var Arena_Item = cc.instantiate(this.ArenaItem);
            var button = Arena_Item.addComponent(cc.Button);
            var label = Arena_Item.getChildByName('label').getComponent(cc.Label);
            ArenaListLayer.addChild(Arena_Item);
            Arena_Item.setPosition(cc.p(0, 0));

            //
            var clickEventHandler = new cc.Component.EventHandler();
            clickEventHandler.target = this.node; //这个 node 节点是你的事件处理代码组件所属的节点
            clickEventHandler.component = "MenuControl";//这个是代码文件名
            clickEventHandler.handler = "ClickArena";
            clickEventHandler.customEventData = Arena_ID.toString();
            button.clickEvents.push(clickEventHandler);

            //縮放
            button.transition = cc.Button.Transition.SCALE;
            button.zoomScale = 0.85;
            //
            label.string = Arena_Name;
        });

    },

    ClickArena(event, customEventData) {
        console.log(customEventData);
        self.Status.string = '連結 ArenaID:' + customEventData + ' 競技場';
        var Arena_ID = parseInt(customEventData);
        var debugToken = '';
        this.ArenaDataComponent.setArenaId(Arena_ID);
        self.socketControl.getComponent('SocketIoCtrl').doConnect(self.ArenaDataComponent.getMemberID(), this.ArenaDataComponent.getArenaId(), false, debugToken);
    },

    //
    loadScene() {
        this.scheduleOnce(function(){
            cc.director.loadScene("FightArena");
        },0.3);     
    },

    goLearn(){
        this.scheduleOnce(function(){
            cc.director.loadScene("learn");
        },0.3);
    },

    back(){
        this.scheduleOnce(function(){
            cc.director.loadScene("Main");
        },0.3);
    },

    RoleButtonClicked: function (toggle, index) {
        // console.log(index);
        switch (parseInt(index)) {
            case 0://2
                this.ArenaDataComponent.setMemberID(2);
                break;
            case 1://3
                this.ArenaDataComponent.setMemberID(3);
                break;
            default:
                break;
        }
        // console.log(this.ArenaDataComponent.getMemberID());
    },

    MachineButtonClicked: function (toggle, index) {
        // console.log(index);
        switch (parseInt(index)) {
            case 0://yes
                this.ArenaDataComponent.isBot = true;
                break;
            case 1://false
                this.ArenaDataComponent.isBot = false;
                break;
            default:
                break;
        }
        console.log(this.ArenaDataComponent.isBot);
    },

    minusPer() {
        this.ArenaDataComponent.BotCorrectPer -= 0.01;
        if(this.ArenaDataComponent.BotCorrectPer<=0.1) this.ArenaDataComponent.BotCorrectPer = 0.1;
        this.per.getComponent(cc.Label).string = Math.floor(this.ArenaDataComponent.BotCorrectPer * 100);
    },

    plusPer() {
        this.ArenaDataComponent.BotCorrectPer += 0.01;
        if(this.ArenaDataComponent.BotCorrectPer>=1) this.ArenaDataComponent.BotCorrectPer = 1;
        this.per.getComponent(cc.Label).string = Math.floor(this.ArenaDataComponent.BotCorrectPer * 100);
    },

    //設定socketUrl
    setSocketUrl() {
        ArenaConfig.SocketIO_URL = this.EditBox.string;
        // console.log(ArenaConfig.SocketIO_URL);
    },

    //開始連接
    startConnect() {
        this.Status.string = '開始連接';
        this.socketControl.getComponent('SocketIoCtrl').initSocketControl();
    },



    // start() {},

    // update (dt) {},
});
