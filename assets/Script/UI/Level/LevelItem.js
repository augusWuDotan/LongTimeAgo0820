
cc.Class({
    extends: cc.Component,

    properties: {
        //開啟下一個關卡方法
        breakthroughLevel: null,
        //最後一關方法
        breakthroughFinalLevel: null,
        //點擊方法
        ClickCallFunction: null,

        //----- ContentBg sprite
        actionContentBg: {
            default: null,
            type: cc.SpriteFrame
        },
        monsterContentBg: {
            default: null,
            type: cc.SpriteFrame
        },
        bossContentBg: {
            default: null,
            type: cc.SpriteFrame
        },

        //----- badge sprite
        badgeShow: {
            default: null,
            type: cc.SpriteFrame
        },
        badgeClose: {
            default: null,
            type: cc.SpriteFrame
        },

        //----- star sprite
        starShow: {
            default: null,
            type: cc.SpriteFrame
        },
        starClose: {
            default: null,
            type: cc.SpriteFrame
        },

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },


    /**
     * 初始化
     * @param {*} itemIndex 索引
     * @param {*} actionType 事件判斷 action | monster | boss
     * @param {*} islock 是否鎖關卡
     * @param {*} starNum 現在的星星數
     * @param {*} isFinal 是否最後一個
     * @param {*} nextLockLevelindex 下一個被鎖的關卡
     */
    init(itemIndex, actionType, islock, starNum, isFinal, nextLockLevelindex,info) {
        var self = this;
        this.canClick = true;
        this.itemIndex = itemIndex;
        this.actionType = actionType;
        this.islock = islock;
        this.starNum = starNum;
        this.isFinal = isFinal;
        this.nextLockLevelindex = nextLockLevelindex;
        this.info = info;

        //判斷背景
        this.level = this.node.getChildByName('level');
        switch (actionType) {
            case 'Event':
                self.level.getComponent(cc.Sprite).spriteFrame = self.actionContentBg;
                break;
            case 'Normal':
                self.level.getComponent(cc.Sprite).spriteFrame = self.monsterContentBg;
                break;
            case 'Boss':
                self.level.getComponent(cc.Sprite).spriteFrame = self.bossContentBg;
                break;
            default:
                break;
        }

        //第幾關卡
        this.levelLabel = this.level.getChildByName('levelLebel');
        if(this.actionType != 'Event')this.levelLabel.getComponent(cc.Label).string = info.StorySubAction_Number;
        else this.levelLabel.getComponent(cc.Label).string = '';

        //是否鎖
        this.level_lock = this.level.getChildByName('level_lock');
        this.level_lock.active = this.islock;

        //星星
        //防呆 最小0 最大3
        if (this.starNum > 3) {
            this.starNum = 3;
        } else if (this.starNum < 0) {
            this.starNum = 0;
        } else {
            //null
        }
        this.star1 = this.level.getChildByName('star1');
        this.star2 = this.level.getChildByName('star2');
        this.star3 = this.level.getChildByName('star3');
        this.showStar();

        //badge
        this.dot1 = this.node.getChildByName('dot1');
        this.dot2 = this.node.getChildByName('dot2');
        if (!this.isFinal) {
            if (!this.islock) {
                if ((this.itemIndex + 1) == this.nextLockLevelindex) {
                    //下一個關卡還沒解鎖
                    this.dot1.getComponent(cc.Sprite).spriteFrame = this.badgeClose;
                    this.dot2.getComponent(cc.Sprite).spriteFrame = this.badgeClose;
                } else {
                    this.dot1.getComponent(cc.Sprite).spriteFrame = this.badgeShow;
                    this.dot2.getComponent(cc.Sprite).spriteFrame = this.badgeShow;
                }
            } else {
                //鎖
                this.dot1.getComponent(cc.Sprite).spriteFrame = this.badgeClose;
                this.dot2.getComponent(cc.Sprite).spriteFrame = this.badgeClose;
            }
        }

        //click action
        if (!this.islock) {
            var clickEventHandler = new cc.Component.EventHandler();
            clickEventHandler.target = this.node; //这个 node 节点是你的事件处理代码组件所属的节点
            clickEventHandler.component = "LevelItem";//这个是代码文件名
            clickEventHandler.handler = "Click";
            clickEventHandler.customEventData = this.itemIndex + '';

            var button = this.level.addComponent(cc.Button);
            button.transition = cc.Button.Transition.SCALE;
            button.duration = 0.1;
            button.zoomScale = 0.85;
            button.clickEvents.push(clickEventHandler);
        }

    },

    //
    showStar() {
        
        var self = this;
        switch (this.starNum) {
            case 0:
                self.star1.getComponent(cc.Sprite).spriteFrame = self.starClose;
                self.star2.getComponent(cc.Sprite).spriteFrame = self.starClose;
                self.star3.getComponent(cc.Sprite).spriteFrame = self.starClose;
                break;
            case 1:
                self.star1.getComponent(cc.Sprite).spriteFrame = self.starShow;
                self.star2.getComponent(cc.Sprite).spriteFrame = self.starClose;
                self.star3.getComponent(cc.Sprite).spriteFrame = self.starClose;
                break;
            case 2:
                self.star1.getComponent(cc.Sprite).spriteFrame = self.starShow;
                self.star2.getComponent(cc.Sprite).spriteFrame = self.starShow;
                self.star3.getComponent(cc.Sprite).spriteFrame = self.starClose;
                break;
            case 3:
                self.star1.getComponent(cc.Sprite).spriteFrame = self.starShow;
                self.star2.getComponent(cc.Sprite).spriteFrame = self.starShow;
                self.star3.getComponent(cc.Sprite).spriteFrame = self.starShow;
                break;
            default:
                self.star1.getComponent(cc.Sprite).spriteFrame = self.starClose;
                self.star2.getComponent(cc.Sprite).spriteFrame = self.starClose;
                self.star3.getComponent(cc.Sprite).spriteFrame = self.starClose;
                break;
        }

        if(this.actionType == 'Event'){
            this.star1.active = false;
            this.star2.active = false;
            this.star3.active = false;
        }
    },


    /**
     *  //呼叫下一關解鎖
     * @param {*} starNum 破關的星星數
     */
    StartNext(starNum) {
        var self = this;
        var timeIndex = 0;

        var starCcaleAction = cc.sequence(
            cc.scaleTo(0.3, 1.2, 1.2),
            cc.scaleTo(0.1, 1, 1)
        );
        var badgeCcaleAction = cc.sequence(
            cc.scaleTo(0.2, 1.4, 1.4),
            cc.scaleTo(0.1, 1.2, 1.2)
        );

        function AnimationBadge() {
            //
            if (self.isFinal) {
                //最後一關
                if (self.breakthroughFinalLevel) self.breakthroughFinalLevel();
                self.canClick = true;
            } else {
                //攜帶這一關的index
                if ((self.itemIndex + 1) == self.nextLockLevelindex) {
                    if (self.breakthroughLevel) {
                        var badgeRepeat = 2;

                        self.schedule(function () {
                            if (timeIndex == 0) {
                                self.dot1.getComponent(cc.Sprite).spriteFrame = self.badgeShow;
                                self.dot1.runAction(badgeCcaleAction);
                            } else if (timeIndex == 1) {
                                self.dot2.getComponent(cc.Sprite).spriteFrame = self.badgeShow;
                                self.dot2.runAction(badgeCcaleAction);
                            } else {
                                self.breakthroughLevel(self.itemIndex);//
                            }
                            console.log(timeIndex);
                            timeIndex++;
                            //
                            if (badgeRepeat == timeIndex) {
                                self.canClick = true;
                            }
                        }, 0.4, badgeRepeat, 0.5);
                    }
                } else {
                    console.log('下一關不用解鎖');
                    self.canClick = true;
                }
            }
        };

            function AnimationStar() {
                //星星
                console.log('starNum:' + starNum);
                console.log('this.starNum:' + self.starNum);
                if (starNum < 4 && starNum >= 0) {
                    if (starNum > self.starNum) {
                        var starRepeat = starNum - self.starNum;
                        var currentStarNum = self.starNum;
                        var starIndex = 0;
                        self.schedule(function () {
                            if (starIndex > 0) {
                                if ((starIndex + currentStarNum) == 1) {
                                    self.star1.getComponent(cc.Sprite).spriteFrame = self.starShow;
                                    self.star1.runAction(starCcaleAction);
                                } else if ((starIndex + currentStarNum) == 2) {
                                    self.star2.getComponent(cc.Sprite).spriteFrame = self.starShow;
                                    self.star2.runAction(starCcaleAction);
                                } else if ((starIndex + currentStarNum) == 3) {
                                    self.star3.getComponent(cc.Sprite).spriteFrame = self.starShow;
                                    self.star3.runAction(starCcaleAction);
                                }
                            }
                            starIndex++;

                            //
                            if (starIndex == starRepeat) {
                                AnimationBadge();
                            }
                        }, 0.4, starRepeat, 0.1);
                    } else {
                        //null
                        AnimationBadge();
                    }
                    self.starNum = starNum;
                }
            };
            
            if(this.actionType == 'Event'){
                AnimationBadge();
            }else{
                AnimationStar();
            }
            

    },

    //更換下一個解鎖關卡
    setNextLockLevelindex(nextLockLevelindex) {
        //解開點擊
        this.canClick = true;
        //變更下一個解鎖關卡
        this.nextLockLevelindex = nextLockLevelindex;
    },

    //解鎖
    Unlock() {
        var self = this;
        this.islock = false;
        this.starNum = 0;

        //是否鎖
        this.level_lock = this.level.getChildByName('level_lock');
        // this.level_lock.active = this.islock;
        this.level_lock.getComponent(cc.Animation).playAdditive('unLock');

        //星星
        this.star1.getComponent(cc.Sprite).spriteFrame = this.starClose;
        this.star2.getComponent(cc.Sprite).spriteFrame = this.starClose;
        this.star3.getComponent(cc.Sprite).spriteFrame = this.starClose;

        //click action
        if (!this.islock) {
            var clickEventHandler = new cc.Component.EventHandler();
            clickEventHandler.target = this.node; //这个 node 节点是你的事件处理代码组件所属的节点
            clickEventHandler.component = "LevelItem";//这个是代码文件名
            clickEventHandler.handler = "Click";
            clickEventHandler.customEventData = this.itemIndex + '';

            var button = this.level.addComponent(cc.Button);
            button.transition = cc.Button.Transition.SCALE;
            button.duration = 0.1;
            button.zoomScale = 0.85;
            button.clickEvents.push(clickEventHandler);
        }
    },

    unLockAnimFinish(){
        console.log('test')
    },


    //點擊事件
    Click() {
        console.log('Click');
        console.log('this.canClick:' + this.canClick);
        if (!this.canClick) return;
        // this.canClick = false;
        if (this.ClickCallFunction && !this.islock) this.ClickCallFunction(this.itemIndex, this);
    }
    //

    // update (dt) {},
});
