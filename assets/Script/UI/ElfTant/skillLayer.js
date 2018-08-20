
var self = this;
cc.Class({
    extends: cc.Component,

    properties: {
        //star bg level
        star1: {
            default: null,
            type: cc.SpriteFrame
        },
        star2: {
            default: null,
            type: cc.SpriteFrame
        },
        star3: {
            default: null,
            type: cc.SpriteFrame
        },
        star4: {
            default: null,
            type: cc.SpriteFrame
        },
        star5: {
            default: null,
            type: cc.SpriteFrame
        },

        //
        skill_press_sp: {
            default: null,
            type: cc.SpriteFrame
        },
        skill_normal_sp: {
            default: null,
            type: cc.SpriteFrame
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        // this.init();
    },


    init(titleLevel) {
        self = this;
        this.currentSelectNode = null;//選擇到的技能框
        //
        var AdjustmentGap = 0.4
        this.normalScale = 1 + AdjustmentGap;
        this.pressScale = 0.9 + AdjustmentGap;
        this.selectScale = 1.25 + AdjustmentGap;
        this.selectPressScale = 1.25 + AdjustmentGap;
        this.rememberSetting = [];//記錄技能設定
        //
        this.star = this.node.getChildByName('star');
        this.skill1 = this.node.getChildByName('star').getChildByName('skill1');
        this.skill2 = this.node.getChildByName('star').getChildByName('skill2');
        this.skill3 = this.node.getChildByName('star').getChildByName('skill3');
        this.skill4 = this.node.getChildByName('star').getChildByName('skill4');
        this.skill5 = this.node.getChildByName('star').getChildByName('skill5');
        //
        switch (titleLevel) {
            case 1:
                this.star.getComponent(cc.Sprite).spriteFrame = this.star1;
                break;
            case 2:
                this.star.getComponent(cc.Sprite).spriteFrame = this.star2;
                break;
            case 3:
                this.star.getComponent(cc.Sprite).spriteFrame = this.star3;
                break;
            case 4:
                this.star.getComponent(cc.Sprite).spriteFrame = this.star4;
                break;
            case 5:
                this.star.getComponent(cc.Sprite).spriteFrame = this.star5;
                break;


            default:
                break;
        }
        //
        [this.skill1, this.skill2, this.skill3, this.skill4, this.skill5].forEach(skill => {
            this.initTouchListener(skill);
        });

        //預設第一個
        this.currentSelectNode = this.skill1;
        this.currentSelectNode.scale = self.selectScale;
        this.currentSelectNode.getComponent(cc.Sprite).spriteFrame = self.skill_press_sp;

    },

    setSkills(skills) {

    },

    setSkill(info) {
        if (!this.currentSelectNode) return { 'success': false, 'result': '你尚未选择技能装备位置' };

        console.log('this.rememberSetting:' + this.rememberSetting);

        //紀錄現在有哪些已經設定 model = { Name : 'xxxx' , info : {} };
        var ModelIndex = this.rememberSetting.findIndex(function (model) {
            return model.Name == self.currentSelectNode.name;
        });
        console.log('ModelIndex:' + ModelIndex);

        var skillIndex = this.rememberSetting.findIndex(function (skill) {
            return skill.info.SkillPrototype_ID == info.SkillPrototype_ID;
        });

        if (skillIndex >= 0) return { 'success': false, 'result': '不可重复设定相同技能' };


        if (info.SkillPrototype_Img != '' && info.SkillPrototype_Img != null) {
            cc.loader.load({ url: info.SkillPrototype_Img, type: 'png' }, function (error, texture) {
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
                    var iconSize = texture.getContentSize();
                    var scale = ((containNode.width / (iconSize.width * 1.2)) > (containNode.height / (iconSize.height * 1.2)) ? (containNode.height / (iconSize.height * 1.2)) : (containNode.width / (iconSize.width * 1.2)));
                    var spriteFrame = new cc.SpriteFrame(texture);
                    self.currentSelectNode.getChildByName('icon').scale = scale;
                    self.currentSelectNode.getChildByName('icon').getComponent(cc.Sprite).spriteFrame = spriteFrame;
                }
            });
            return { 'success': true, 'result': '技能设定成功' };
        } else {
            return { 'success': false, 'result': '技能图为空' };;
        }
    },

    //初始化 監聽事件
    initTouchListener(skill) {

        skill.on(cc.Node.EventType.TOUCH_START, function (event) {
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
        skill.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            console.log('TOUCH_CANCEL');
            if (event.target === self.currentSelectNode) {
                event.target.scale = self.selectScale;
                console.log('touch same tab2-1');
            }
            else {
                event.target.scale = self.normalScale;
            }

        }, this);
        skill.on(cc.Node.EventType.TOUCH_END, function (event) {
            console.log('TOUCH_END');
            if (event.target === self.currentSelectNode) {
                event.target.scale = self.normalScale;
                event.target.getComponent(cc.Sprite).spriteFrame = self.skill_normal_sp;
                self.currentSelectNode = null;
            }
            else {
                console.log(self.currentSelectNode);
                console.log(event.target);
                if (self.currentSelectNode) {
                    self.currentSelectNode.scale = self.normalScale;
                    self.currentSelectNode.getComponent(cc.Sprite).spriteFrame = self.skill_normal_sp;
                }
                self.currentSelectNode = event.target;
                event.target.scale = self.selectScale;
                event.target.getComponent(cc.Sprite).spriteFrame = self.skill_press_sp;
            }
        }, this);
    },


    // update (dt) {},

    onDisable() {
        // this.skill1.off(cc.Node.EventType.TOUCH_START);
        // this.skill1.off(cc.Node.EventType.TOUCH_CANCEL);
        // this.skill1.off(cc.Node.EventType.TOUCH_END);
        // this.skill2.off(cc.Node.EventType.TOUCH_START);
        // this.skill2.off(cc.Node.EventType.TOUCH_CANCEL);
        // this.skill2.off(cc.Node.EventType.TOUCH_END);
        // this.skill3.off(cc.Node.EventType.TOUCH_START);
        // this.skill3.off(cc.Node.EventType.TOUCH_CANCEL);
        // this.skill3.off(cc.Node.EventType.TOUCH_END);
        // this.skill4.off(cc.Node.EventType.TOUCH_START);
        // this.skill4.off(cc.Node.EventType.TOUCH_CANCEL);
        // this.skill4.off(cc.Node.EventType.TOUCH_END);
        // this.skill5.off(cc.Node.EventType.TOUCH_START);
        // this.skill5.off(cc.Node.EventType.TOUCH_CANCEL);
        // this.skill5.off(cc.Node.EventType.TOUCH_END);
    },

    // update (dt) {},
});
