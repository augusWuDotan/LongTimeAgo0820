var self;
var ProspectiveHeartCall;//
cc.Class({
    extends: cc.Component,

    properties: {
        //動畫管理
        ProspectiveHeartAnim: {
            default: null,
            type: cc.Animation
        },
        //集氣背景
        ProspectiveHeartGasBackground: {
            default: null,
            type: cc.Node
        },
        //顯示音效
        show_audio: {
            default: null,
            url: cc.AudioClip
        },
        //點擊音效
        click_audio: {
            default: null,
            url: cc.AudioClip
        },
        //點擊音效
        shot_audio: {
            default: null,
            url: cc.AudioClip
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad() {},

    // start () {},

    // update (dt) {},

    //初始化數據
    init(isBot) {
        self = this;
        this.isBot = isBot;
        this.scaleIncreaseRate = 0.1;
        this.scaleTo = 0;//設置的集氣背景倍數  
        this.canClick = true;

        //btn
        this.btn = this.node.getChildByName('ProspectiveHeart');
        if (this.btn) {
            console.log(this.btn.getComponent(cc.Button).clickEvents);
            console.log(this.btn.getComponents(cc.Button));
            var btn1 = this.btn.getComponent(cc.Button);
            // var btn2 = this.btn.getComponents(cc.Button)[1];
            if (this.isBot) {
                let interval = 0.15;
                let repeat = Math.floor(cc.random0To1() * 21 + 10);
                let delay = 1;
                var index = 0;
                this.schedule(function () {
                    index++;
                    btn1.clickEvents[0].emit(['1']);

                    if (index === repeat && repeat !== 30) {
                        this.setProspectiveHeartGasFinishAction();//結束
                    }
                }, interval, repeat, delay);

                this.scheduleOnce(function () {
                    var scale1Action = cc.scaleTo(interval / 2, 0.75, 0.75);
                    var scale2Action = cc.scaleTo(interval / 2, 1, 1);
                    var action = cc.repeat(
                        cc.sequence(
                            scale1Action,
                            scale2Action
                        ), repeat - 1);
                    this.btn.runAction(action);
                }, delay);
            }
            // 
        }
    },

    changbtnSprite() {

    },

    //
    setAttackCallback(cal) {
        ProspectiveHeartCall = cal;
    },

    //準新出現
    ProspectiveHeartAnimationShow() {
        this.canClick = true;
        cc.audioEngine.playEffect(this.show_audio, false, 0.6);
        this.ProspectiveHeartAnim.playAdditive(this.ProspectiveHeartAnim._clips[2].name);
    },

    //準新出現監聽結束
    ProspectiveHeartAnimationShowFinish() {
        this.ProspectiveHeartAnimationPlay();//準新開始
        this.ProspectiveHeartGasAnimationPlay();//集氣動畫開始
    },

    //準新消失
    ProspectiveHeartAnimationClose() {
        cc.audioEngine.playEffect(this.shot_audio, false, 0.6);
        this.ProspectiveHeartAnim.playAdditive(this.ProspectiveHeartAnim._clips[3].name);
    },

    //準新消失監聽結束
    ProspectiveHeartAnimationCloseFinish() {
        //null
        var state = this.ProspectiveHeartAnim.getAnimationState(this.ProspectiveHeartAnim._clips[1].name);
        this.ProspectiveHeartAnim.stop(this.ProspectiveHeartAnim._clips[0].name);
        if (state._isPlaying || state._isPaused) {
            this.ProspectiveHeartAnim.stop(this.ProspectiveHeartAnim._clips[1].name);
        }
        //
        this.node.destroy();//清除節點
    },

    //準心動畫播放
    ProspectiveHeartAnimationPlay() {
        this.ProspectiveHeartAnim.playAdditive(this.ProspectiveHeartAnim._clips[0].name);
    },

    //準心動畫暫停
    ProspectiveHeartAnimationPause() {
        this.ProspectiveHeartAnim.pause(this.ProspectiveHeartAnim._clips[0].name);
    },

    //準心動畫停止
    ProspectiveHeartAnimationStop() {
        this.ProspectiveHeartAnim.stop(this.ProspectiveHeartAnim._clips[0].name);
    },

    //集氣動畫播放
    ProspectiveHeartGasAnimationPlay() {
        this.ProspectiveHeartAnim.playAdditive(this.ProspectiveHeartAnim._clips[1].name);
    },

    //準心動畫暫停
    ProspectiveHeartGasAnimationPause() {
        this.ProspectiveHeartAnim.pause(this.ProspectiveHeartAnim._clips[1].name);
    },

    //準心動畫停止
    ProspectiveHeartGasAnimationStop() {
        this.ProspectiveHeartAnim.stop(this.ProspectiveHeartAnim._clips[1].name);
    },

    /**
     * 準新點擊監聽
     * @param {*} event 回傳點擊node
     * @param {*} p 設定點擊遞增數率
     */
    ProspectiveHeartClickListener(event, p) {
        if (!this.canClick) return;
        //接受點擊，停止準新動畫進行
        var state = this.ProspectiveHeartAnim.getAnimationState(this.ProspectiveHeartAnim._clips[0].name);
        if (state._isPlaying) {
            this.ProspectiveHeartAnimationPause();
            console.log(state._isPaused);
        }

        //集氣動畫 //如果縮放比例小於3 則執行 
        //如果集氣動畫沒影播放
        console.log(this.scaleTo)
        if (this.scaleTo < 3) {
            if (!this.ProspectiveHeartAnim.getAnimationState(this.ProspectiveHeartAnim._clips[1].name)._isPlaying) {
                this.ProspectiveHeartGasAnimationPlay();//集氣動畫
            }
            //播放點及音效
            cc.audioEngine.playEffect(this.click_audio, false, 0.6);

            this.ProspectiveHeartGasBackground.stopAllActions();
            // var ProspectiveHeartGasBackgroundScale = this.ProspectiveHeartGasBackground.scale;
            this.scaleTo += this.scaleIncreaseRate;//調整為scale
            var actionTo = cc.scaleTo(0.5, this.scaleTo);
            this.ProspectiveHeartGasBackground.runAction(actionTo);
        } else {
            //>= 3 結束
            self.setProspectiveHeartGasFinishAction();
        }

        //如果今天是在暫停的狀態下，可以重新打開
        if (state._isPaused && !this.isBot) {
            this.ProspectiveHeartAnim.unscheduleAllCallbacks();
            this.ProspectiveHeartAnim.scheduleOnce(function () {
                console.log('resume 動畫繼續執行');
                this.resume(this._clips[0].name);
            }, 1);
        }
    },

    //攻擊結束
    setProspectiveHeartGasFinishAction() {
        this.canClick = false;
        //
        this.ProspectiveHeartGasBackground.stopAllActions();
        self.nowScale = this.ProspectiveHeartGasBackground.scale;//scale 
        console.log('self.nowScale: ' + self.nowScale);//列印現在的大小

        var Action1 = cc.repeat(
            cc.sequence(
                cc.scaleTo(0.5, (self.nowScale - 0.2)),
                cc.scaleTo(0.5, (self.nowScale + 0.2))
            ), 15);

        var Action3 = cc.scaleTo(2, (self.nowScale + 1.5));

        var Action4 = cc.scaleTo(2, 0);

        //攻擊結尾的監聽
        var attack1 = cc.callFunc(function (target) {
            //攻擊結尾音效
        }, this.ProspectiveHeartGasBackground);

        //結束的監聽
        var finished = cc.callFunc(function (target) {

            //受傷音效

            //callback
            var mScale = Math.floor(self.scaleTo * 10) / 10;//小數點一位
            ProspectiveHeartCall('ProspectiveHeart', 'Gas', mScale);//回傳 集氣的增值

            //縮小到0
            this.scale = 0;
            self.scaleTo = 0;
            self.ProspectiveHeartAnimationClose();//停止所有動畫 準心、集氣

        }, this.ProspectiveHeartGasBackground);
        //
        var Action0 = cc.speed(
            cc.sequence(
                Action1, Action3, attack1, Action4, finished
            ), 40);

        //音效攻擊


        //執行動畫
        this.ProspectiveHeartGasBackground.runAction(Action0);
    }


});
