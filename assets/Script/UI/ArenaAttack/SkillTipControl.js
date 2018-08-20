
var self;
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:


    onLoad() { },

    setSkillTip(RoleName, SkillName) {
        //預設
        this.node.opacity = 0;

        //設置頭像
        // var avatar = cc.instantiate(AvatarNode);
        // this.node.getChildByName('AvatarNode').addChild(avatar);
        // avatar.setPosition(cc.p(0, 0));

        //設置技能名
        this.node.getChildByName('SkillLabel').getComponent(cc.Label).string = RoleName + '\n发动了 ' + SkillName;

        //漸顯
        var fadeinAction = cc.fadeIn(0.2);
        this.node.runAction(fadeinAction);
    },

    //狀態提示
    setStatusDescription(StatusDescription) {

        //設置頭像
        // var avatar = cc.instantiate(AvatarNode);
        // this.node.getChildByName('AvatarNode').addChild(avatar);
        // avatar.setPosition(cc.p(0, 0));

        //設置技能名
        this.node.getChildByName('SkillLabel').getComponent(cc.Label).string = StatusDescription;

        //漸顯
        var fadeinAction = cc.fadeIn(0.2);
        this.node.runAction(fadeinAction);

        //自動消失
        this.scheduleOnce(function delay(params) {
            this.node.destroy();
        },4);
    },

    //閃避提示
    setDodgeDescription(StatusDescription) {

        //設置頭像
        // var avatar = cc.instantiate(AvatarNode);
        // this.node.getChildByName('AvatarNode').addChild(avatar);
        // avatar.setPosition(cc.p(0, 0));

        //設置技能名
        this.node.getChildByName('SkillLabel').getComponent(cc.Label).string = StatusDescription;

        //漸顯
        var fadeinAction = cc.fadeIn(0.2);
        this.node.runAction(fadeinAction);

        //自動消失
        this.scheduleOnce(function delay(params) {
            this.node.destroy();
        },2);
    },



    //針對使用道具的提示
    setPropStatusDescription(StatusDescription) {

        //設置頭像
        // var avatar = cc.instantiate(AvatarNode);
        // this.node.getChildByName('AvatarNode').addChild(avatar);
        // avatar.setPosition(cc.p(0, 0));

        //設置技能名
        this.node.getChildByName('SkillLabel').getComponent(cc.Label).string = StatusDescription;

        //漸顯
        var fadeinAction = cc.fadeIn(0.2);
        this.node.runAction(fadeinAction);

        //自動消失
        this.scheduleOnce(function delay(params) {
            this.node.destroy();
        },1);
    },


    start() {

    },

    // update (dt) {},
});
