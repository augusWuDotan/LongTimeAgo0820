
var self;
cc.Class({
    extends: cc.Component,

    properties: {
        item_press_sp: {
            default: null,
            type: cc.SpriteFrame
        },
        item_normal_sp: {
            default: null,
            type: cc.SpriteFrame
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() { },

    start() {
    },

    //
    init() {
        self = this;
        this.currentSelectNode = null;//選擇到的框
        //
        this.normalScale = 1;
        this.pressScale = 0.9;
        this.selectScale = 1.15;
        this.selectPressScale = 1.15;
        //
        this.item1 = this.node.getChildByName('item1');
        this.item2 = this.node.getChildByName('item2');
        this.item3 = this.node.getChildByName('item3');
        this.item4 = this.node.getChildByName('item4');
        this.item5 = this.node.getChildByName('item5');
        //
        this.rememberSetting = [];//記錄設定

        [this.item1, this.item2, this.item3, this.item4, this.item5].forEach(item => {
            this.initTouchListener(item);
        });

        //預設第一個
        this.currentSelectNode = this.item1;
        this.currentSelectNode.scale = this.selectScale;
        this.currentSelectNode.getComponent(cc.Sprite).spriteFrame = this.item_press_sp;

    },

    setProps(props) {

    },

    setProp(info, proContent) {
        if (!this.currentSelectNode) return { 'success': false, 'result': '你尚未选择放置位置' };

        console.log('this.rememberSetting:' + this.rememberSetting);

        //紀錄現在有哪些已經設定 model = { Name : 'xxxx' , info : {} };
        var ModelIndex = this.rememberSetting.findIndex(function (model) {
            return model.Name == self.currentSelectNode.name;
        });
        console.log('ModelIndex:' + ModelIndex);
        if (ModelIndex >= 0) {
            //存在
            proContent.MakeUpProps(this.rememberSetting[ModelIndex].info);//呼叫加一
        }


        if (info.PropsPrototype_Img != '' && info.PropsPrototype_Img != null) {
            cc.loader.load({ url: info.PropsPrototype_Img, type: 'png' }, function (error, texture) {
                if (error != null) {
                    self.onError(error);
                } else {
                    //紀錄
                    if (ModelIndex >= 0) {
                        //存在
                        self.rememberSetting[ModelIndex].info = info;
                        console.log('存在 this.rememberSetting:' + self.rememberSetting);
                    } else {
                        var model = { 'Name': self.currentSelectNode.name, 'info': info };
                        self.rememberSetting.push(model);
                        console.log('不存在 this.rememberSetting:' + self.rememberSetting);
                    }
                    //上圖
                    console.log(texture);
                    var containNode = self.currentSelectNode;
                    var propSize = texture.getContentSize();
                    var scale = ((containNode.width / (propSize.width * 1.1)) > (containNode.height / (propSize.height * 1.1)) ? (containNode.height / (propSize.height * 1.1)) : (containNode.width / (propSize.width * 1.1)));
                    var spriteFrame = new cc.SpriteFrame(texture);
                    self.currentSelectNode.getChildByName('prop').scale = scale;
                    self.currentSelectNode.getChildByName('prop').getComponent(cc.Sprite).spriteFrame = spriteFrame;
                }
            });
            return { 'success': true, 'result': '道具设定成功' };
        } else {
            return { 'success': false, 'result': '道具图为空' };
        }
    },

    //初始化 監聽事件
    initTouchListener(item) {

        item.on(cc.Node.EventType.TOUCH_START, function (event) {
            console.log('TOUCH_START');
            //
            if (event.target === self.currentSelectNode) {
                console.log('touch same tab1');
                event.target.scale = self.selectPressScale;
            }
            else {
                event.target.scale = self.pressScale;
            }

        }, this);
        item.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            console.log('TOUCH_CANCEL');
            if (event.target === self.currentSelectNode) {
                event.target.scale = self.selectScale;
                console.log('touch same tab2-1');
            }
            else {
                event.target.scale = self.normalScale;
            }

        }, this);
        item.on(cc.Node.EventType.TOUCH_END, function (event) {
            console.log('TOUCH_END');
            if (event.target === self.currentSelectNode) {
                event.target.scale = self.normalScale;
                event.target.getComponent(cc.Sprite).spriteFrame = self.item_normal_sp;
                self.currentSelectNode = null;
            }
            else {
                console.log(self.currentSelectNode);
                console.log(event.target);
                if (self.currentSelectNode) {
                    self.currentSelectNode.scale = self.normalScale;
                    self.currentSelectNode.getComponent(cc.Sprite).spriteFrame = self.item_normal_sp;
                }
                self.currentSelectNode = event.target;
                event.target.scale = self.selectScale;
                event.target.getComponent(cc.Sprite).spriteFrame = self.item_press_sp;
            }
        }, this);
    },

    // update (dt) {},

    onDisable() {
        // this.item1.off(cc.Node.EventType.TOUCH_START);
        // this.item1.off(cc.Node.EventType.TOUCH_CANCEL);
        // this.item1.off(cc.Node.EventType.TOUCH_END);
        // this.item2.off(cc.Node.EventType.TOUCH_START);
        // this.item2.off(cc.Node.EventType.TOUCH_CANCEL);
        // this.item2.off(cc.Node.EventType.TOUCH_END);
        // this.item3.off(cc.Node.EventType.TOUCH_START);
        // this.item3.off(cc.Node.EventType.TOUCH_CANCEL);
        // this.item3.off(cc.Node.EventType.TOUCH_END);
        // this.item4.off(cc.Node.EventType.TOUCH_START);
        // this.item4.off(cc.Node.EventType.TOUCH_CANCEL);
        // this.item4.off(cc.Node.EventType.TOUCH_END);
        // this.item5.off(cc.Node.EventType.TOUCH_START);
        // this.item5.off(cc.Node.EventType.TOUCH_CANCEL);
        // this.item5.off(cc.Node.EventType.TOUCH_END);
    },
});
