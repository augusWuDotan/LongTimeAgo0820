var self;
cc.Class({
    extends: cc.Component,

    properties: {
        //
        DotPrefab: {
            default: null,
            type: cc.Prefab
        },
        //
        line_audio: {
            default: null,
            url: cc.AudioClip
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        self = this;
        this.childPositionArray = [];
    },


    /**
     * 新增圖像 add icon
     * @param {*} p 中心點 
     * @param {*} pwh 父矩形長寬 
     * @param {*} wh  圖像長寬
     */
    addDot(p, wh) {
        //檢查是否重複新增子結點
        console.log('test p :' + p);
        if (this.checkShowPositionIsRepeat(p)) {
            console.log("重複");
            return;
        }
        //複製 預製體
        var Prop = cc.instantiate(this.DotPrefab);
        // 将新增的节点添加到 Canvas 节点下面
        this.node.addChild(Prop);
        //設定座標
        Prop.setPosition(cc.p(p.x, p.y));
        //設定層級
        Prop.setLocalZOrder(1);
        //設定長寬
        Prop.width = wh / 2;
        Prop.height = wh / 2;
        //儲存已經顯示的點
        this.childPositionArray.push(p);
        console.log(this.childPositionArray);

        //音效
        if (this.line_audio) cc.audioEngine.playEffect(this.line_audio, false, 0.5);
    },

    /**
     * 清除所有dot
     */
    clearAllDot() {
        this.node.destroyAllChildren();
        this.childPositionArray.length = 0;
        console.log(this.childPositionArray);
    },

    //檢查是否有已經顯示的點
    checkShowPositionIsRepeat(position) {
        var isRepeat = false;
        this.childPositionArray.forEach(Vec2 => {
            //
            if (Vec2.x == position.x && Vec2.y == position.y) {
                // console.log('重複');
                isRepeat = true;
            }
        });
        return isRepeat;
    },


    start() {

    },

    // update (dt) {},
});
