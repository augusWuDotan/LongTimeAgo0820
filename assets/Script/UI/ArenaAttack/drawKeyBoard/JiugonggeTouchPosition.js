var self;
var touchPositonCallback;
cc.Class({
    extends: cc.Component,

    properties: {
        //顯示 已經連線的 dot
        ShowDot: {
            default: null,
            type: cc.Node
        },

        mTouchRects: null,//矩形陣列
        touchP: null,//點擊座標 type =  cc.Vec2
        touchLastRectIndex: null,//上一個觸摸座標(有比對到才設置) 對應的rect index
        touchRectIndex: null,//本次觸摸座標(有比對到才設置) 對應的rect index
        touchIndexSet: null,//連線index的集合
    },

    // LIFE-CYCLE CALLBACKS:


    onLoad() {
        self = this;

        // 註冊觸摸事件
        // if "this" is component and the "memberFunction" declared in CCClass.
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchDown, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchUp, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchUp, this);

        //control show dot
        if (!this.showDot) {
            this.showDot = this.ShowDot.getComponent('JiugonggeShowDot');
            console.log(this.showDot);
        } else {
            console.log('this.showDot init error');
        }
    },

    //賦予滑動比對資料 //初始化
    init(mTouchRects) {
        this.mTouchRects = mTouchRects;
    },

    //機器人行為
    setBot(AnswerLinePoint) {
        console.log('setBot: ' + AnswerLinePoint);
        this.isBot = true;
        this.AnswerLinePoint = AnswerLinePoint;
        this.currentPointIndex = 1;
        this.currentLinePercent = 0;//每一節線

        //
        var ctx = this.getComponent(cc.Graphics);
        ctx.clear();
        var point = this.getPoint(this.AnswerLinePoint[0]);
        ctx.moveTo(point.x, point.y);
       
        this.scheduleOnce(function delay(params) {
            console.log(AnswerLinePoint);
             //--設定顯示的圖像--
            this.showDot.addDot(this.mTouchRects[this.AnswerLinePoint[0]].center, this.mTouchRects[this.AnswerLinePoint[0]].width);
            this.schedule(this.updateDrawLine, 0.0075);//機器人畫線的速度
        }, 1);
    },


    updateDrawLine() {
        this.currentLinePercent += 0.02;

        var previousPoint = this.getPoint(this.AnswerLinePoint[this.currentPointIndex - 1]);//開始 點
        var nextPoint = this.getPoint(this.AnswerLinePoint[this.currentPointIndex]);//下一個 點

        var currentPointX = previousPoint.x + ((nextPoint.x - previousPoint.x) * this.currentLinePercent);
        var currentPointY = previousPoint.y + ((nextPoint.y - previousPoint.y) * this.currentLinePercent);

        var ctx = this.getComponent(cc.Graphics);
        ctx.lineTo(currentPointX, currentPointY);
        ctx.stroke();

        if (this.currentLinePercent >= 1) {
            //--設定顯示的圖像--
            this.showDot.addDot(this.mTouchRects[this.AnswerLinePoint[this.currentPointIndex]].center, this.mTouchRects[this.AnswerLinePoint[this.currentPointIndex]].width);
            //
            this.currentPointIndex += 1;//下一個點

            if (this.currentPointIndex < this.AnswerLinePoint.length) {
                this.currentLinePercent = 0;//
                //todo 建立點
            } else {
                this.callbackAnwserArray(this.AnswerLinePoint);//回傳答案
                this.unschedule(this.updateDrawLine);
            }
        }
    },

    getPoint(index) {
        if (!this.mTouchRects) return;
        if (this.mTouchRects.length < index + 1) return;
        //
        let p = this.mTouchRects[index].center;
        return p;
    },

    //設定會傳
    setCal(cal) {
        touchPositonCallback = cal;
    },

    //清除
    unsubscribe() {
        this.isBot = false;
        var mGraphics = this.getComponent(cc.Graphics);
        mGraphics.clear();
        // if(this.touchIndexSet)this.touchIndexSet = null;//清除繪製的線
        if (this.showDot) this.showDot.clearAllDot();//--清除圖像--
    },

    /**
     * 檢查連接集合
     */
    doCheckIndexSet(index) {
        let isHave = false;
        //
        this.touchIndexSet.forEach(element => {
            console.log("search")
            console.log(index)
            console.log(element)
            if (element === index) {
                // console.log("have")
                isHave = true;
            }
        });
        //不包含 就加入
        if (!isHave) {
            console.log("add line")
            this.touchIndexSet.push(index);
        }

        console.log("現在有幾條線：" + (this.touchIndexSet.length - 1))
    },

    // 实例方法
    print: function () {
        cc.log(this.text);
    },

    start() {

    },

    update(dt) {
        if (this.isBot) return;//機器人行為 自動
        //更新指標
        if (!this.isUpdate) return;
        if (!this.mTouchRects) return;

        let i = 0;
        let mIndex = -1;
        var rectSet = this.mTouchRects;
        //建置繪製區域
        var mGraphics = this.getComponent(cc.Graphics);
        // touchIndexSet 選擇到得點 , mTouchRects 9個範圍 , touchP 目前的點
        //確認是否有在拖曳的點
        if (this.touchP) {
            //有
            //清空畫屏
            mGraphics.clear();
            //先連接已經有選擇到得點
            this.touchIndexSet.forEach(element => {
                let index = element;
                //如果該範圍是空 不做動作
                if (!rectSet[index]) return
                //取出該範圍中心點
                let p = rectSet[index].center;
                //如果這是第一個點 i == 0 使用 moveTo
                if (i === 0) {
                    //如果這是第一個點 i == 0 使用 moveTo
                    console.log("繪製moveTo x1");
                    mGraphics.moveTo(p.x, p.y);
                } else {
                    //如果這不是第一個點 i != 0 使用 lineTo 繪製路徑
                    console.log("繪製lineTo x1");
                    mGraphics.lineTo(p.x, p.y);
                    mGraphics.moveTo(p.x, p.y);
                }
                console.log("繪製第 " + i + "條");
                //
                mIndex = i;
                i++;
            });
            //繪製好已經選擇的點 繪製變動的點
            if (mIndex > -1) {
                console.log("繪製touchP x1");
                mGraphics.lineTo(this.touchP.x, this.touchP.y);
                //填充路徑
                mGraphics.stroke();
            } else {
                console.log("繪製touchP x2");
                let p = rectSet[0].center;
                // mGraphics.moveTo(p.x, p.y);
                // mGraphics.lineTo(this.touchP.x, this.touchP.y);
            }

        } else {
            //清空畫屏 
            mGraphics.clear();
            if (this.touchIndexSet) {
                //先連接已經有選擇到得點
                this.touchIndexSet.forEach(element => {
                    let index = element;
                    //如果該範圍是空 不做動作
                    if (!rectSet[index]) return
                    //取出該範圍中心點
                    let p = rectSet[index].center;
                    //如果這是第一個點 i == 0 使用 moveTo
                    if (i === 0) {
                        //如果這是第一個點 i == 0 使用 moveTo
                        mGraphics.moveTo(p.x, p.y);
                    } else {
                        //如果這不是第一個點 i != 0 使用 lineTo 繪製路徑
                        mGraphics.lineTo(p.x, p.y);
                    }
                    console.log("繪製第 " + i + "條");
                    //
                    i++;
                });
                //填充路徑
                mGraphics.stroke();
            }
        }
    },

    /**
     * 回傳答案
     */
    callbackAnwserArray(array) {
        if (touchPositonCallback) touchPositonCallback(array);//回傳答案
        else {
            console.log('no call back')
        }
    },

    //觸摸下壓
    onTouchDown(event) {
        if (this.isBot) return;//機器人行為 自動
        //
        this.isUpdate = true;
        //new
        this.touchP = null;
        this.touchRectIndex = null;
        //
        var newVec2 = this.node.convertToNodeSpace(cc.v2(event.getLocation().x, event.getLocation().y));
        if (newVec2) {
            console.log("np onTouchDown x : " + newVec2.x + ", y : " + newVec2.y);
        }

        //init touchindex set
        this.touchIndexSet = [];
        //--清除圖像--
        this.showDot.clearAllDot();
        //  
        this.touchP = newVec2;
        //
        let isTouch = this.checkTouch(newVec2);
        console.log("是否點擊到設置範圍：" + isTouch);

        //如果第一個觸摸都沒有在哪一個範圍上 執行this
        if (!isTouch) {
            this.touchRectIndex = null;
        }
    },

    //觸摸釋放
    onTouchUp(event) {
        if (this.isBot) return;//機器人行為 自動
        //
        if (this.touchP) {
            var newVec2 = this.node.convertToNodeSpace(cc.v2(event.getLocation().x, event.getLocation().y));
            if (newVec2) {
                console.log("np onTouchDown x : " + newVec2.x + ", y : " + newVec2.y);
            }
            //釋放拖曳點
            this.touchP = null;
            let isTouch = this.checkTouch(newVec2);

            //close update
            this.isUpdate = false;

            //建置繪製區域
            var mGraphics = this.getComponent(cc.Graphics);
            var rectSet = this.mTouchRects;
            //清空畫屏 最後一次繪製
            mGraphics.clear();
            if (this.touchIndexSet) {
                //先連接已經有選擇到得點
                this.touchIndexSet.forEach(element => {
                    let index = element;
                    //如果該範圍是空 不做動作
                    if (!rectSet[index]) return
                    //取出該範圍中心點
                    let p = rectSet[index].center;
                    //如果這是第一個點 i == 0 使用 moveTo
                    if (i === 0) {
                        //如果這是第一個點 i == 0 使用 moveTo
                        mGraphics.moveTo(p.x, p.y);
                    } else {
                        //如果這不是第一個點 i != 0 使用 lineTo 繪製路徑
                        mGraphics.lineTo(p.x, p.y);
                    }
                    console.log("繪製第 " + i + "條");
                    //
                    i++;
                });
                //填充路徑
                mGraphics.stroke();
            }


            //結果處理
            //篩選掉null
            // console.log(this.touchIndexSet);//篩選前
            this.touchIndexSet = this.touchIndexSet.filter(function (value) {
                return value != null;
            });
            // console.log(this.touchIndexSet);//篩選後

            //顯示處理
            let str = "";
            this.touchIndexSet.forEach(element => {
                if (str === "") {
                    str = element;
                } else {
                    str += "," + element;
                }
            });
            console.log("最後結果： " + str);
            /**
             * 
             * 釋放儲存資源
             */
            if (this.touchIndexSet.length === 1) {
                this.touchIndexSet = null;
                //--清除圖像--
                this.showDot.clearAllDot();
            }
            if (this.touchIndexSet.length > 1) this.callbackAnwserArray(this.touchIndexSet);//回傳答案
        }
    },

    //移動
    onTouchMove(event) {
        if (this.isBot) return;//機器人行為 自動
        //
        if (this.touchP) {
            var newVec2 = this.node.convertToNodeSpace(cc.v2(event.getLocation().x, event.getLocation().y));
            if (newVec2) {
                console.log("np onTouchDown x : " + newVec2.x + ", y : " + newVec2.y);
            }
            this.touchP = newVec2;
            let isTouch = this.checkTouch(newVec2);
        }
    },
    // 
    checkTouch(point) {
        if (this.isBot) return;//機器人行為 自動
        //比對是否有在範圍內
        let isTouch = false;
        let index = 0;
        var mGraphics = this.getComponent(cc.Graphics);
        this.mTouchRects.forEach(element => {
            if (element.contains(point)) {
                console.log("比對到");
                isTouch = true;

                if (this.touchRectIndex && !(this.touchRectIndex === index)) {
                    let index_ = this.touchRectIndex;
                    this.touchLastRectIndex = index_;
                    this.touchRectIndex = null;
                    console.log("上一個觸摸座標index：" + this.touchLastRectIndex);

                    //設定線起始座標
                    mGraphics.moveTo(element.center.x, element.center.y);
                }
                //設定觸摸的最後一個比對index
                this.touchRectIndex = index;

                //--設定顯示的圖像--
                this.showDot.addDot(element.center, element.width);
            }
            index++;
        });
        //檢查是否要增加到連接的項目內 需判斷不是null
        this.doCheckIndexSet(this.touchRectIndex)
        // if(this.touchRectIndex)this.doCheckIndexSet(this.touchRectIndex)

        console.log("本次觸摸座標index：" + this.touchRectIndex);
        return isTouch;
    },

    checkPsiton(rect) {
        if (element.contains(point)) {
            isTouch = true;
            if (this.touchRectIndex && !(this.touchRectIndex === index)) {
                let index_ = this.touchRectIndex;
                this.touchLastRectIndex = index_;
                this.touchRectIndex = null;
                console.log("上一個觸摸座標index：" + this.touchLastRectIndex);
                //設定線座標

            }
            //設定觸摸的最後一個比對index
            this.touchRectIndex = index;

        }
        index++;
    },



});



