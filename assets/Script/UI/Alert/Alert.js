

cc.Class({
    extends: cc.Component,

    properties: {
        //離開的方法
        LeaveFunc: {
            default: null,
            visible: false
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.btn = this.node.getChildByName('bg').getChildByName('ok_btn');
        this.message = this.node.getChildByName('bg').getChildByName('message');
        this.btn.on(cc.Node.EventType.TOUCH_START, this.onTouchDown, this);
        this.btn.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.btn.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    },

    start () {},

    onDestroy() {
        this.btn.off(cc.Node.EventType.TOUCH_START);
        this.btn.off(cc.Node.EventType.TOUCH_END);
        this.btn.off(cc.Node.EventType.TOUCH_CANCEL);
    },

    ClickOK(){
        if(this.LeaveFunc)this.LeaveFunc();//如果有設定 離開必須呼叫的方法 就執行
        this.message.getComponent(cc.Label).string = '';
        this.node.setPosition(-960,540);
    },

    //初始化 提示alert
    initTipAlert(msg){
        this.message.getComponent(cc.Label).string = msg;
    },

    initErrorAlert(msg){
        this.message.getComponent(cc.Label).string = msg;
    },

    //
    onTouchDown(event){
        event.target.setScale(1.8,1.8);
    },
    //
    onTouchEnd(event){
        event.target.setScale(2,2);
        console.log('ClickOK');
        this.ClickOK();
    },
    //
    onTouchCancel(event){
        event.target.setScale(2,2);
    },
    

    // update (dt) {},
});
