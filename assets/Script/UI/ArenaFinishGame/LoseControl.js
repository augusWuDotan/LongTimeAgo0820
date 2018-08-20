
cc.Class({
    extends: cc.Component,

    properties: {
        //動畫
        LoseAnim:{
            default:null,
            type:cc.Node,
        },
        //獎勵 道具
        content:{
            default:null,
            type:cc.Label,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {},

    init(){
        //失敗動畫
        this.LoseAnim.getComponent(cc.Animation).play('Lose');  
    },


    // start () {    },

    // update (dt) {},
});
