var self;
var JiugonggeCallBack;
cc.Class({
    extends: cc.Component,

    properties: {
        itemRoles: 3,//縱向,行數
        itemColumns: 3,//橫向,列數
        AnwserLinePointIndexs: [],//教學的線
        JiugonggeNode: {
            default: null,
            type: cc.Node
        },
        //顯示
        show_audio: {
            default: null,
            url: cc.AudioClip
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        self = this;
        this.JiugonggeAnimation = null;
        console.log('OnLoad');
    },

    /**
     * 設定callback
     */
    setAttackCallback(cal) {
        console.log('Jiugongge setCal');
        JiugonggeCallBack = cal;
    },

    /**
     * //回傳 繪製的答案
     * @param {*} isCorrect 是否正確 true or false
     */
    JiugonggeCal(array) {
        var isCorrect = true;
        var index = 0;
        array.forEach(e => {
            console.log(e);
            console.log(self.AnwserLinePointIndexs[index]);
            if (e != self.AnwserLinePointIndexs[index]) {
                isCorrect = false;
            }
            index++;
        });
        if (JiugonggeCallBack) JiugonggeCallBack('Jiugongge', 'Line', isCorrect);
    },

    /**
     * 初始化九宮格
     * @param {*} Roles 行數
     * @param {*} Columns 列數
     * @param {*} LinePointIndexs 輔助線的index
     */
    init(Roles, Columns, LinePointIndexs,isBot) {
        this.isBot = isBot; 
        console.log('init');
        if (Roles) this.itemRoles = Roles;
        if (Columns) this.itemColumns = Columns;
        if (LinePointIndexs) {
            this.AnwserLinePointIndexs = LinePointIndexs;//教學線
        } else {
            //debug
            this.AnwserLinePointIndexs = [0, 1, 2, 4, 6, 7, 8];
        }

        // //建置初始參數
        this.mTouchRects = [];//可點擊範圍陣列
        this.winHeight = this.node.height;//可繪製高度
        this.winWigth = this.node.width;//可繪製寬度
        console.log("可繪製高度:" + this.winHeight + ",可繪製寬度:" + this.winWigth);

        //建立可以繪製的範圍
        this.executeDrawAreaPath();
    },

    //建立可以繪製的範圍
    executeDrawAreaPath() {
        //
        //建置繪製資訊
        // var rects = [];
        //繪製
        var itemCount = this.itemRoles * this.itemColumns;//繪製 ?*? = ?
        console.log("z_繪製幾格:" + itemCount)
        /*
        這裡我打算繪製圓 
        所以要先算出繪製範圍rect
        */
        var rectItemHeight = this.winHeight / this.itemColumns;// 總高/列數 = 列高
        var rectItemWeight = this.winWigth / this.itemRoles;// 總寬/行數 = 行寬
        console.log("z_寬:" + rectItemWeight + ",z_高:" + rectItemHeight);
        var circleRadius = rectItemHeight > rectItemWeight ? rectItemWeight / 2 : rectItemHeight / 2;//半徑圓弧
        console.log("z_circleRadius:" + circleRadius);
        for (let i = 0; i < this.itemColumns; i++) {
            for (let j = 0; j < this.itemRoles; j++) {
                let column = i;//0,1,2
                let roles = j;//0,1,2
                // console.log(column + "列," + roles + "行");
                //x =  [0,1,2]*rectItemWeight
                let x = roles * rectItemWeight;
                //y = 總高 - [0,1,2]* rectItemHeight
                let y = this.winHeight - (column + 1) * rectItemHeight;
                // console.log("X座標 :" + x + ", Y座標 :" + y);
                //建立矩形範圍物件
                let r = new cc.Rect(x, y, rectItemWeight, rectItemHeight);
                // console.log("矩形X座標 :" + r.x + ", 矩形Y座標 :" + r.y);
                //矩形中心點座標
                // console.log("x座標center :" + r.center.x + ", y座標center :" + r.center.y);
                //
                let nr = new cc.Rect(r.center.x - (circleRadius / 2), r.center.y - (circleRadius / 2), circleRadius, circleRadius);
                this.mTouchRects.push(nr);//加載集合
                // console.log("矩形集合長度：" + this.mTouchRects.length);//
            }
        }

        //繪製集合
        this.mTouchRects.forEach(element => {
            console.log("z_圖形中心點座標 x :" + element.center.x + ",z_圖形中心點座標 y :" + element.center.y);
        });

        //激活子節點 手滑區 
        this.JiugonggeTouchPosition = this.node.getChildByName('JiugonggeTouchPosition').getComponent('JiugonggeTouchPosition');
        if (this.JiugonggeTouchPosition) {
            // console.log(this.JiugonggeBack);
            this.JiugonggeTouchPosition.init(this.mTouchRects);
            if(this.isBot) this.JiugonggeTouchPosition.setBot(this.AnwserLinePointIndexs);
            if (JiugonggeCallBack) this.JiugonggeTouchPosition.setCal(this.JiugonggeCal);
        } else {
            console.log('this.JiugonggeTouchPosition init error');
        }

        //激活子節點 繪製 背景 
        this.JiugonggeBack = this.node.getChildByName('JiugonggeBack').getComponent('JiugonggeBack');
        if (this.JiugonggeBack) {
            // console.log(this.JiugonggeBack);
            this.DrawBack(circleRadius);
        } else {
            console.log('this.JiugonggeBack init error');
        }

        //激活子節點 繪製 教學線
        this.JiugonggeShowDirectLine = this.node.getChildByName('JiugonggeDirectLine').getComponent('JiugonggeShowDirectLine');
        if (this.JiugonggeShowDirectLine) {
            console.log(this.JiugonggeShowDirectLine);
            this.DrawDirectTeachLine();
        } else {
            console.log('this.JiugonggeShowDirectLine init error');
        }

    },

    //清除
    unsubscribe() {
        if (this.JiugonggeTouchPosition) this.JiugonggeTouchPosition.unsubscribe();//清除繪製資訊
        if (this.JiugonggeBack) this.JiugonggeBack.unsubscribe();//清除背景資訊
        if (this.JiugonggeShowDirectLine) this.JiugonggeShowDirectLine.unsubscribe();//清除教學線資訊
        if (this.AnwserLinePointIndexs) this.AnwserLinePointIndexs = null;//清除輔助線index
    },

    //繪製背景
    DrawBack(circleRadius) {
        //線的顏色
        var CircleLineColor = new cc.Color(255, 255, 255, 200);
        //DrawBack
        this.JiugonggeBack.DrawBack(this.mTouchRects, circleRadius, CircleLineColor);
    },

    //繪製教學線
    DrawDirectTeachLine() {
        //線的顏色
        var CircleLineColor = new cc.Color(67, 31, 213, 183);
        //DrawBack
        this.JiugonggeShowDirectLine.showDirectTeachLineList(this.AnwserLinePointIndexs, this.mTouchRects, CircleLineColor);
    },

    //打開九宮格
    JiugonggeAnimationShow() {
        console.log('JiugonggeAnimationShow');
        if (!this.JiugonggeAnimation) {
            this.JiugonggeAnimation = this.JiugonggeNode.getComponent(cc.Animation)
            if (this.JiugonggeAnimation) {
                console.log('this.JiugonggeAnimation init');
            } else {
                return;
            }
        } else {
            console.log('this.JiugonggeAnimation exist');
        }
        //
        this.JiugonggeAnimation.play(this.JiugonggeAnimation._clips[0].name);
        //音效
        cc.audioEngine.playEffect(this.show_audio, false, 0.5);
    },
    //監聽 打開九宮格 結束
    JiugonggeAnimationShowFinish() {
        console.log('JiugonggeAnimationShowFinish');
    },

    //關閉九宮格
    JiugonggeAnimationClose() {
        if (!this.JiugonggeAnimation) {
            this.JiugonggeAnimation = this.JiugonggeNode.getComponent(cc.Animation)
            if (this.JiugonggeAnimation) {
                console.log('this.JiugonggeAnimation init');
            } else {
                return;
            }
        } else {
            console.log('this.JiugonggeAnimation exist');
        }
        //
        this.JiugonggeAnimation.play(this.JiugonggeAnimation._clips[1].name);
    },
    //監聽 關閉九宮格 結束
    JiugonggeAnimationCloseFinish() {
        console.log('JiugonggeAnimationCloseFinish');      
    },

    //強制關閉
    FinishControl(){
        this.JiugonggeAnimationClose();//
        this.unsubscribe();//
    },

    start() {

    },

    // update (dt) {},
});
