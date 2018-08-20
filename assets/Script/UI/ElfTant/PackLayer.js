
cc.Class({
    extends: cc.Component,

    properties: {
        //-----normal | press的背景
        TabPressSp: {
            default: null,
            type: cc.SpriteFrame
        },
        TabNormalSp: {
            default: null,
            type: cc.SpriteFrame
        },
        //----- mark icon

        //屬性頁 component
        ElfTantLayer: {
            default: null,
            serializable: false
        },

        //ContentState 目前正在看哪一個功能頁
        ContentState: 'attribute',
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
    },

    init() {
        this.normalScale = 0.7;
        this.pressScale = 0.6;
        this.selectScale = 1;
        this.selectPressScale = 0.9;
        //pack - tab 
        this.attributeTab = this.node.getChildByName('attributeTab');
        this.equipmentTab = this.node.getChildByName('equipmentTab');
        this.weaponTab = this.node.getChildByName('weaponTab');
        this.propTab = this.node.getChildByName('propTab');
        this.skillTab = this.node.getChildByName('skillTab');
        //pack - content
        this.attributeContent = this.node.getChildByName('attributeContent');
        this.equipmentContent = this.node.getChildByName('equipmentContent');
        this.weaponContent = this.node.getChildByName('weaponContent');
        this.propContent = this.node.getChildByName('propContent');
        this.skillContent = this.node.getChildByName('skillContent');
        //scale
        this.attributeTab.scale = this.normalScale;
        this.equipmentTab.scale = this.normalScale;
        this.weaponTab.scale = this.normalScale;
        this.propTab.scale = this.normalScale;
        this.skillTab.scale = this.normalScale;

        this.tabs = [this.attributeTab, this.equipmentTab, this.weaponTab, this.propTab, this.skillTab];

        if (this.currentTabNode) {
            //回覆初始設定
            this.currentTabNode.getComponent(cc.Sprite).spriteFrame = this.TabNormalSp;
            this.currentTabNode.scale = this.normalScale;
            this.changeContent(this.currentTabNode.name, 'attributeTab');
        } else {
            this.changeContent('', 'attributeTab');
            //註冊監聽tab
            this.tabs.forEach(node => {
                this.initTabTouch(node);
            });
            this.isListenTouch = true;
        }
        this.currentTabNode = this.attributeTab;//觸摸和離開都是同一個按鍵 //預設
        this.currentTabNode.getComponent(cc.Sprite).spriteFrame = this.TabPressSp;
        this.currentTabNode.scale = this.selectScale;

        //init attr
        if (this.attributeContent) {
            console.log('attributeContent init');
            this.attributeContent.getComponent('attributeContent').PackLayer = this;
            this.attributeContent.getComponent('attributeContent').initAttribute(20, 100, 100, 100, 100, 100, 500, 200, '1-3', 100, 900);
            if (this.ElfTantLayer) this.ElfTantLayer.changeVisiableState(this.ContentState);
        }
        //init equi
        if (this.equipmentContent) {
            console.log('attributeContent init');
            this.equipmentContent.getComponent('equipmentContent').PackLayer = this;
            this.equipmentContent.getComponent('equipmentContent').init();
        }
        //init weapon
        if (this.weaponContent) {
            console.log('weaponContent init');
            this.weaponContent.getComponent('weaponContent').PackLayer = this;
            this.weaponContent.getComponent('weaponContent').init();
        }
        //init prop
        if (this.propContent) {
            console.log('propContent init');
            this.propContent.getComponent('propContent').PackLayer = this;
            this.propContent.getComponent('propContent').init();
        }

         //init skill
         if (this.skillContent) {
            console.log('skillContent init');
            this.skillContent.getComponent('skillContent').PackLayer = this;
            this.skillContent.getComponent('skillContent').init();
        }
    },

    initTabTouch(node) {
        var self = this;

        node.on(cc.Node.EventType.TOUCH_START, function (event) {
            console.log('TOUCH_START');
            //
            if (event.target === self.currentTabNode) {
                console.log('touch same tab1');
                event.target.scale = self.selectPressScale;
            }
            else {
                event.target.scale = self.pressScale;
            }

        }, this);
        node.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            console.log('TOUCH_CANCEL');
            if (event.target === self.currentTabNode) {
                event.target.scale = self.selectScale;
                console.log('touch same tab2-1');
            }
            else {
                event.target.scale = self.normalScale;
            }

        }, this);
        node.on(cc.Node.EventType.TOUCH_END, function (event) {
            console.log('TOUCH_END');
            if (event.target === self.currentTabNode) {
                event.target.scale += 0.1;
                console.log('touch same tab2-2');
            }
            else {
                //changeContent
                var currentNode = self.currentTabNode;
                self.changeContent(currentNode.name, event.target.name);
                //changeState
                console.log('self.normalScale:' + self.normalScale);
                console.log('self.selectScale:' + self.selectScale);

                self.currentTabNode.scale = self.normalScale;

                self.currentTabNode.getComponent(cc.Sprite).spriteFrame = self.TabNormalSp;
                self.currentTabNode = event.target;
                self.currentTabNode.getComponent(cc.Sprite).spriteFrame = self.TabPressSp;
                event.target.scale = self.selectScale;
                console.log('event.target.scale:' + event.target.scale);
            }
        }, this);
    },


    destroyTabTouch(node) {
        node.on(cc.Node.EventType.TOUCH_START);
        node.on(cc.Node.EventType.TOUCH_CANCEL);
        node.on(cc.Node.EventType.TOUCH_END);
    },

    //更換 pack 內的  gridLayout
    changeContent(currentNodeName, selectNodeName) {
        var self = this;

        switch (currentNodeName) {
            case 'attributeTab':
                self.attributeContent.active = false;
                self.attributeContent.setPosition(cc.p(1500, 1300));
                break;
            case 'equipmentTab':
                self.equipmentContent.active = false;
                self.equipmentContent.setPosition(cc.p(1500, 650));
                break;
            case 'weaponTab':
                self.weaponContent.active = false;
                self.weaponContent.setPosition(cc.p(1500, 0));
                break;
            case 'propTab':
                self.propContent.active = false;
                self.propContent.setPosition(cc.p(1500, -650));
                break;
            case 'skillTab':
                self.skillContent.active = false;
                self.skillContent.setPosition(cc.p(1500, -1300));
                break;

            default:

                break;
        }

        switch (selectNodeName) {
            case 'attributeTab':
                self.attributeContent.active = true;
                self.attributeContent.setPosition(cc.p(0, 0));
                self.ContentState = 'attribute';//變更選擇狀態
                break;
            case 'equipmentTab':
                self.equipmentContent.active = true;
                self.equipmentContent.setPosition(cc.p(0, 0));
                self.ContentState = 'equipment';
                break;
            case 'weaponTab':
                self.weaponContent.active = true;
                self.weaponContent.setPosition(cc.p(0, 0));
                self.ContentState = 'weapon';
                break;
            case 'propTab':
                self.propContent.active = true;
                self.propContent.setPosition(cc.p(0, 0));
                self.ContentState = 'prop';
                break;
            case 'skillTab':
                self.skillContent.active = true;
                self.skillContent.setPosition(cc.p(0, 0));
                self.ContentState = 'skill';
                break;

            default:
                break;
        }

        //更改顯示組件
        if (this.ElfTantLayer) this.ElfTantLayer.changeVisiableState(this.ContentState);
        //提示框消失
        this.goneTipLayer();
    },

    /**
    * 顯示備註 tipLayer
    * 
    */
    showDetail(type, result) {
        if (!this.TipLayer) this.TipLayer = this.node.getChildByName('TipLayer');
        this.TipLayer.getComponent('TipLayer').init(type, result);
        //-300 //-625
        this.showTipLayer();
    },

    showTipLayer() {
        if (!this.TipLayer) this.TipLayer = this.node.getChildByName('TipLayer');
        if (this.TipLayer.getPosition().x != -625) {
            var moveAction = cc.moveTo(0.4, cc.p(-625, 0));
            this.TipLayer.stopAllActions();
            this.TipLayer.runAction(moveAction);
        }
    },

    goneTipLayer() {
        if (!this.TipLayer) this.TipLayer = this.node.getChildByName('TipLayer');
        if (this.TipLayer.getPosition().x != -300) {
            var moveAction = cc.moveTo(0.4, cc.p(-300, 0));
            this.TipLayer.stopAllActions();
            this.TipLayer.runAction(moveAction);
        }
    },

    //-----道具設定


    //確認鍵
    buttonOK() {
        var self = this;
        switch (self.ContentState) {
            case 'attribute':
                self.attributeContent.getComponent('attributeContent').updadteSetting();
                break;
            case 'equipment':
                self.equipmentContent.getComponent('equipmentContent').updadteSetting();
                break;
            case 'weapon':
                self.weaponContent.getComponent('weaponContent').updadteSetting();
                break;
            case 'prop':
                self.propContent.getComponent('propContent').updadteSetting();
                break;
            case 'skill':
                self.skillContent.getComponent('skillContent').updadteSetting();
                break;
            default:
                break;
        }
    },

    

    start() {

    },




    // update (dt) {},
});
