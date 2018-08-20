var self;
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

    },

    //繪製教學線
    showDirectTeachLineList(AnwserLinePointIndexs, TouchRects,color) {
        // console.log(AnwserLinePointIndexs);
        // console.log(TouchRects);
        //初始化繪製物件
        if(!this.mGraphics)this.mGraphics = this.getComponent(cc.Graphics);
        //清除繪製紀錄
        this.mGraphics.clear();
        //
        var i = 0;
        AnwserLinePointIndexs.forEach(element => {
            //繪製哪一個 touchList [index] 範圍
            let index = element;
            let p = TouchRects[index].center;
            //
            if (i == 0) {
                //第一個點
                this.mGraphics.moveTo(p.x, p.y);
            } else {
                this.mGraphics.lineTo(p.x, p.y);
            }
            //
            i++;
        });
        //填充
        this.mGraphics.stroke();
    },

     //清除
     unsubscribe(){
       
    },

    start() {

    },

    // update (dt) {},
});
