// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

cc.Class({
    extends: cc.Component,

    properties: {
        skillContainer: {
            default: null,
            type: cc.Node
        },
        selectedLight: {
            default: null,
            type: cc.Node
        },
        skill: {
            default: null,
            type: cc.Node
        },
        skillCostLabel: {
            default: null,
            type: cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.selectedLight.active = false;
        this.eventTouch(this.node);
    },

    onDisable () {
        this.eventTouchOff(this.node);
    },

    // start () {},

    // update (dt) {},

    setSkillContainer (spriteFrame) {
        this.skillContainer.getComponent(cc.Sprite).spriteFrame = spriteFrame;
    },

    setSkill (spriteFrame) {
        this.skill.getComponent(cc.Sprite).spriteFrame = spriteFrame;
    },

    setPrice (price) {
        this.skillCostLabel.getComponent(cc.Label).string = price;
    },

    changeState (isSelected) {
        if (isSelected) {
            this.selectedLight.active = true;
            this.skill.setScale(1.2, 1.2);
        } else {
            this.selectedLight.active = false;
            this.skill.setScale(1, 1);
        }
    },

    eventTouch(node){
        var self = this;
        node.on(cc.Node.EventType.TOUCH_START, function () {
            self.skillContainer.setScale(0.7, 0.7);
        }, this);
        node.on(cc.Node.EventType.TOUCH_END, function () {
            self.skillContainer.setScale(0.76, 0.76);
        }, this);
        node.on(cc.Node.EventType.TOUCH_CANCEL, function () {
            self.skillContainer.setScale(0.76, 0.76);
        }, this);
    },

    eventTouchOff(node){
        node.off(cc.Node.EventType.TOUCH_START);
        node.off(cc.Node.EventType.TOUCH_END);
        node.off(cc.Node.EventType.TOUCH_CANCEL);
    }
});
