
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        //null
    },

    /**
     * //繪製背景
     * @param {*} TouchRects 背景圓的矩形範圍陣列
     * @param {*} circleRadius 圓弧長度
     * @param {*} color 圓線的顏色
     */
    DrawBack(TouchRects, circleRadius, color) {
        this.mTouchRects = TouchRects;
        if (!this.mGraphics) this.mGraphics = this.getComponent(cc.Graphics);
        if (color) this.mGraphics.strokeColor = color;
        this.mGraphics.clear();//先清除現有環境

        //建置繪製區域//繪製集合
        this.mTouchRects.forEach(element => {
            // console.log("矩形資訊：" + element.center);//
            // mGraphics.roundRect(element.x,element.y,element.width,element.height,5);
            this.mGraphics.circle(element.center.x, element.center.y, circleRadius / 10)
            console.log("圖形中心點座標 x :" + element.center.x + ", 圖形中心點座標 y :" + element.center.y);
        });

        //顯示繪製
        this.mGraphics.stroke();
    },

    //清除
    unsubscribe() {

    },


    start() {

    },

    update(dt) {


    },

});


