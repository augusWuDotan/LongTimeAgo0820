var self;
var ArenaCallback;
cc.Class({
    extends: cc.Component,

    properties: {

        //闇五芒星背景
        AttackBg: {
            default: null,
            type: cc.Node
        },
        //五芒星
        PentagramLayerPrefab: {
            default: null,
            type: cc.Prefab
        },
        //準心
        ProspectiveHeartLayerPrefab: {
            default: null,
            type: cc.Prefab
        },
        //九宮格
        JiugonggeLayerPrefab: {
            default: null,
            type: cc.Prefab
        },
        //競技場管理器 便於呼叫管理器方法
        ArenaGameControl: {
            default: null,
            serializable: false
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

    },

    start() { },

    /**
     * 
     * @param {*} Background_ID //角色層級顯示id
     * @param {*} Skills //技能陣列
     */
    init(Background_ID, Skills, isBot) {
        this.AttackBg.active = false;//背景關閉
        this.isBot = isBot;
        self = this;
        this.Skills = Skills;
        this.Background_ID = Background_ID;
        this.AttackSort = -1;//攻擊 sort

    },

    setArenaCallback(cal) {
        ArenaCallback = cal;
    },

    /**
    * 五芒星[顯示]
    */
    ExecutePentagramControl() {
        this.AttackBg.active = true;//背景打開
        this.PentagramLayer = cc.instantiate(this.PentagramLayerPrefab);
        this.node.addChild(this.PentagramLayer);
        this.PentagramLayer.setLocalZOrder(2);//設定排序 
        this.PentagramControl = this.PentagramLayer.getChildByName("Pentagram").getComponent('PentagramControl');
        if (this.PentagramControl) console.log('this.PentagramControl init');
        this.PentagramControl.AttackControl = this;
        this.PentagramControl.ArenaGameControl = this.ArenaGameControl;
        this.PentagramControl.setPentagramControlCallback(this.AttackCallBack);
        this.PentagramControl.setAttackType(this.Skills, this.Background_ID, this.isBot);//設定初始屬性
        this.PentagramControl.ShowAnim();
    },

    /**
     * 監聽攻擊控制五芒星的顯示完畢
     * AttackControlShowFinished
     */
    ExecutePentagramControlListenFinish() {
        if (ArenaCallback) ArenaCallback('AttackControl', 'AttackControlShowFinished');
    },

    /**
    * 五芒星[結束]
    */
    ExecutePentagramControlFinish() {
        this.PentagramControl.CloseAnim();
    },

    /**
     * 準心[顯示]
     */
    ExecuteProspectiveHeartControl() {
        this.AttackBg.active = false;//背景關閉
        this.ProspectiveHeartLayer = cc.instantiate(this.ProspectiveHeartLayerPrefab);
        this.node.addChild(this.ProspectiveHeartLayer);
        this.ProspectiveHeartLayer.setLocalZOrder(3);//設定排序 
        this.ProspectiveHeartControl = this.ProspectiveHeartLayer.getComponent('ProspectiveHeartControl');
        if (this.ProspectiveHeartControl) console.log('this.ProspectiveHeartControl init');
        this.ProspectiveHeartControl.init(this.isBot);
        this.ProspectiveHeartControl.setAttackCallback(this.AttackCallBack);//設定callback
        this.ProspectiveHeartControl.ProspectiveHeartAnimationShow();//顯示
    },
    /**
     * 準心[結束]
     */
    ExecuteProspectiveHeartFinish() {
        this.ProspectiveHeartControl.setProspectiveHeartGasFinishAction();
    },

    /**
    * 九宮格[顯示]
    */
    ExecuteJiugonggeLayerControl(index) {

        this.JiugonggeLayer = cc.instantiate(this.JiugonggeLayerPrefab);
        this.node.addChild(this.JiugonggeLayer);
        this.JiugonggeLayer.setLocalZOrder(4);//設定排序 
        this.JiugonggeControl = this.JiugonggeLayer.getComponent('JiugonggeControl');
        if (this.JiugonggeControl) console.log('this.JiugonggeControl init');
        this.JiugonggeControl.setAttackCallback(this.AttackCallBack);
        var skills = this.Skills.filter(skill => skill.Sort === index);
        var pointArrayy = skills[0].SkillPrototype_Sign.split(",").map(Number);
        console.log(pointArrayy);
        this.JiugonggeControl.init(3, 3, pointArrayy, this.isBot);//
        this.JiugonggeControl.JiugonggeAnimationShow();//
    },
    /**
     * 九宮格[結束]
     */
    ExecuteJiugonggeLayerFinish() {
        this.JiugonggeControl.FinishControl();
    },


    /**
     * 攻擊控件回傳 「正式」
     * @param {*} NodeName 節點命名
     * @param {*} functionName 方法命名
     * @param {*} result 回傳內容
     */
    AttackCallBack(NodeName, functionName, result) {
        console.log('NodeName: ' + NodeName);
        console.log('functionName: ' + functionName);
        console.log('result: ' + result);
        if (NodeName === 'Pentagram') {
            console.log('五芒星');
            self.PentagramListener(functionName, result);
        } else if (NodeName === 'ProspectiveHeart') {
            console.log('準心');
            self.ProspectiveHeartListener(functionName, result);

        } else if (NodeName === 'Jiugongge') {
            console.log('九宮格');
            self.JiugonggeListener(functionName, result);
        } else {
            console.log('比對不到 NodeName：' + NodeName);
        }
    },

    /**
     * 五芒星監聽內容
     * @param {*} functionName 回傳的function
     * @param {*} result 
     */
    PentagramListener(functionName, result) {
        console.log('PentagramListener functionName: ' + functionName);
        console.log('PentagramListener result: ' + result);
        this.scheduleOnce(function delay() {
            switch (functionName) {
                case 'PentagramAttackButtonShow':
                    self.ExecutePentagramControlListenFinish();//監聽五芒星結束
                    break
                case 'ClickListener':
                    self.AttackSort = result;//紀錄使用型別
                    console.log('self.AttackSort :' + self.AttackSort);
                    if (result == 0) {
                        console.log('建立準心');
                        self.ExecuteProspectiveHeartControl();
                    } else if (result > 0 && result < 6) {
                        console.log('打開九宮格');
                        self.ExecuteJiugonggeLayerControl(result);
                    } else {
                        //null
                        self.AttackSort = -1;
                        self.AttackBg.active = false;//背景關閉
                    }
                    break;

                default:
                    break;
            }
        }, 0.5);
    },

    /**
     * 準心監聽監聽內容
     * @param {*} functionName 回傳的function
     * @param {*} result 
     */
    ProspectiveHeartListener(functionName, result) {
        console.log('ProspectiveHeartListener functionName: ' + functionName);
        console.log('ProspectiveHeartListener result: ' + result);
        console.log('self.AttackSort :' + self.AttackSort);
        switch (functionName) {
            case 'Gas':
                var model = { 'type': self.AttackSort, 'ProspectiveHeart': result, 'Jiugongge': null, 'useTime': this.ArenaGameControl.getScheduleTime(), 'Volume': 0 };
                console.log(model);
                if (ArenaCallback) ArenaCallback('AttackControl', 'AttackListener', model);
                break;

            default:
                break;
        }
    },

    /**
    * 九宮格監聽監聽內容
    * @param {*} functionName 回傳的function
    * @param {*} result 
    */
    JiugonggeListener(functionName, result) {
        console.log('JiugonggeListener functionName: ' + functionName);
        console.log('JiugonggeListener result: ' + result);
        console.log('self.AttackSort :' + self.AttackSort);
        this.scheduleOnce(function delay() {
            switch (functionName) {
                case 'Line':
                    var skills = this.Skills.find(skill => skill.Sort === self.AttackSort);
                    var model = { 'type': self.AttackSort, 'ProspectiveHeart': null, 'Jiugongge': result, 'useTime': this.ArenaGameControl.getScheduleTime(), 'Volume': skills.MpCost };
                    console.log(model);
                    if (ArenaCallback) ArenaCallback('AttackControl', 'AttackListener', model)
                    self.AttackBg.active = false;//背景關閉
                    self.JiugonggeControl.FinishControl();
                    break;

                default:
                    break;
            }
        }, 0.2);
    },

    /**
     * 當計時時間到的時候，可以直接把當下的狀態給回覆
     * 
     * 五芒星選擇 : 
     * [時間到] 收回攻擊控制，向伺服器呼叫錯失攻擊機會
     * [時間未到] 依據選擇的攻擊方式，顯示對應的 攻擊控制 [準心、九宮格]
     * 準心 : 
     * [時間到] 收回攻擊控制，向伺服器呼叫當下的攻擊狀況 [type = 0 , 加成 = 0 - 3]
     * [時間未到] 依據點擊的次數，放大加成的動畫效果。可以點擊至時間到
     * 當加乘效果 scale >= 3 ， 向伺服器呼叫當下的攻擊狀況 [type = 0 , 加成 = 3]
     * 九宮格 : 
     * [時間到] 收回攻擊控制，向伺服器呼叫當下的攻擊狀況 [type = 1-5 , 錯誤]
     * [時間未到] 可以繼續使用 連線功能。當連好線，直接送出當下結果。 [type = 1-5 , 正確或是錯誤]
     */
    finishAttackControl() {
        console.log(this.node);
        // this.node.children

        if (this.node.getChildByName('PentagramLayer')) {
            console.log('PentagramLayer');
            var model = { 'type': self.AttackSort, 'ProspectiveHeart': null, 'Jiugongge': null };
            self.ExecutePentagramControlFinish();//解除五芒星
            if (ArenaCallback) ArenaCallback('AttackControl', 'AttackListener', model)
        } else if (this.node.getChildByName('ProspectiveHeartLayer')) {
            console.log('ProspectiveHeartLayer');
            self.ExecuteProspectiveHeartFinish();
        } else if (this.node.getChildByName('JiugonggeLayer')) {
            console.log('JiugonggeLayer');
            self.ExecuteJiugonggeLayerFinish();
            var model = { 'type': self.AttackSort, 'ProspectiveHeart': null, 'Jiugongge': false };
            if (ArenaCallback) ArenaCallback('AttackControl', 'AttackListener', model)
        }

        this.AttackBg.active = false;//背景關閉
        
        this.scheduleOnce(function delay(params) {
            if (this.node.children.length > 1) {
                this.node.children.forEach(child => {
                    if(child.name != 'bg'){
                        child.removeFromParent();    
                    }
                });
            }
        }, 2);
    },


    // update (dt) {},
});
