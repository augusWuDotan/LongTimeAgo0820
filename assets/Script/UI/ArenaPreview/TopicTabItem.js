var self;
var TouchCallBack;
cc.Class({
    extends: cc.Component,

    properties: {
        Correct:{
            default:null,
            type:cc.SpriteFrame
        },
        Wrong:{
            default:null,
            type:cc.SpriteFrame
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {},

    init(cal,TopicNum,isCorrect){
        self = this;
        TouchCallBack = cal;
        this.Index = TopicNum;
        this.node.getChildByName('TopicNum').getComponent(cc.Label).string = (TopicNum+1);

        var path = '';
        if (isCorrect) {
            self.node.getChildByName('bg').getComponent(cc.Sprite).spriteFrame = this.Correct;
        } else {
            self.node.getChildByName('bg').getComponent(cc.Sprite).spriteFrame = this.Wrong;
        }
    },
    //點擊
    Click(){
        if(this.node.scale != 1) return;//代表已經選擇
        if(TouchCallBack)TouchCallBack(this.Index);
        //變大

        this.node.scale = 1.3;
    },

    // update (dt) {},
});
