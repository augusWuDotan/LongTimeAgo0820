var self;
cc.Class({
    extends: cc.Component,

    properties: {
        //移動速度
        moveSpeed: 0,
        //高度
        screenHeight: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.opacity = 0;
        var action = cc.fadeIn(0.5);
        this.node.runAction(action);
    },

    init(str) {
        this.node.getChildByName('label').getComponent(cc.Label).string = str;
    },

    //
    setSpeed(sp) {
        this.moveSpeed = sp;
    },

    //結束
    setDestoyAction(){
        var finished = cc.callFunc(this.finished, this);
        var seq = cc.sequence(cc.fadeOut(0.5),finished);
        this.node.runAction(seq);  
    },

    finished(){
        this.node.destroy();//
    },

    start() {

    },

    update(dt) {
        //一直往上移動
        var oldPosition = this.node.getPosition();
        this.node.setPosition(oldPosition.x, (oldPosition.y + parseFloat(this.moveSpeed * dt)));
        // //超出顯示範圍的回收
        if (this.node.getPosition().y > ((this.screenHeight / 2) - (this.node.height*2))) {
            //node高度已經大於組件高度
            this.setDestoyAction();
        }
    },
});
