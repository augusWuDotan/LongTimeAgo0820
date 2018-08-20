var self;
cc.Class({
    extends: cc.Component,

    properties: {
        Content: {
            default: null,
            type: cc.Node
        },
        //bg
        bg: {
            default: null,
            type: cc.Sprite
        },

        //-----地圖
        zone1: {
            default: null,
            type: cc.SpriteFrame
        },
        zone2: {
            default: null,
            type: cc.SpriteFrame
        },
        zone3: {
            default: null,
            type: cc.SpriteFrame
        },
        zone4: {
            default: null,
            type: cc.SpriteFrame
        },
        zone5: {
            default: null,
            type: cc.SpriteFrame
        },
        zone6: {
            default: null,
            type: cc.SpriteFrame
        },
        zone7: {
            default: null,
            type: cc.SpriteFrame
        },
        zone8: {
            default: null,
            type: cc.SpriteFrame
        },
        zone9: {
            default: null,
            type: cc.SpriteFrame
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        self = this;
        this.LevelStorys = [];
        this.LevelItem1 = cc.find('LevelItem1');//單數
        this.LevelItem2 = cc.find('LevelItem2');//雙數
        this.LevelItem3 = cc.find('LevelItem3');//單數最後
        this.LevelItem4 = cc.find('LevelItem4');//雙數最後
        this.ScrollView = this.node.getChildByName('ScrollView');
        this.dataNode = cc.find("DataNode");
        if (this.dataNode) this.levelType = this.dataNode.getComponent('DataNode').levelType;
        if (this.dataNode) this.token = this.dataNode.getComponent('DataNode').token;
        console.log(this.levelType);
        if (!this.levelType) this.levelType = 1;

        //
        this.learnLayer = this.node.parent.getChildByName('learnLayer');
        this.learnLayer.getComponent('learnLayer').setReady();
        //
        this.initBackground(this.levelType);
        this.getLevelData(this.levelType);
    },

    start() {

    },


    back() {
        this.scheduleOnce(function main() {
            cc.director.loadScene("Main");
        }, 0.1);
    },

    goLearn() {
        this.node.active = false;
        this.learnLayer.setPosition(cc.p(0, 0));
        this.learnLayer.getComponent('learnLayer').init();
    },

    getLevelData(levelType) {

        var httpRequest = require('XMLHttpRequest');
        var request = new httpRequest();
        request.getStory(this.token, levelType, function (json, error) {
            if (error != null) {
                self.onError(error);
            } else {
                console.log(JSON.stringify(json));
                if (json.result_status == false) {
                    var message = json.result_message;
                    console.error(message);
                } else {
                    console.log(JSON.stringify(json.result_content));
                    self.LevelStorys = json.result_content;
                    self.initStory(self.LevelStorys)
                }
            }
        });
    },

    initStory(LevelStorys) {

        var nextLockLevelindex = 1;//下一個解鎖index

        var index = 0;
        LevelStorys.forEach(story => {
            //
            var Item;
            var actionType = story.ActionType;
            var isLock = true;//關卡是否鎖
            var starNum = 0;
            var isFinal = false;

            //
            if (index < nextLockLevelindex) {
                isLock = false;
            }

            //
            if (index != (LevelStorys.length - 1)) {
                if (index == 0) {
                    Item = cc.instantiate(this.LevelItem1);//第一個
                } else {
                    if (index % 2 == 0) {
                        //單數
                        Item = cc.instantiate(this.LevelItem1);
                    } else {
                        //雙數
                        Item = cc.instantiate(this.LevelItem2);
                    }
                }
            } else {
                //final
                if (index % 2 == 0) {
                    //單數
                    Item = cc.instantiate(this.LevelItem3);
                } else {
                    //雙數
                    Item = cc.instantiate(this.LevelItem4);
                }
                isFinal = true;
            }
            //
            if (Item) {
                this.Content.addChild(Item);
                Item.setPosition(cc.p(0, 0));
                Item.getComponent('LevelItem').init(index, actionType, isLock, starNum, isFinal, nextLockLevelindex, story);
                Item.getComponent('LevelItem').breakthroughLevel = this.breakthroughLevel;
                Item.getComponent('LevelItem').breakthroughFinalLevel = this.breakthroughFinalLevel;
                Item.getComponent('LevelItem').ClickCallFunction = this.ClickCallFunction;
                //
                if (index == (LevelStorys.length - 1)) {
                    this.scheduleOnce(function scrollto() {
                        self.doScroll(nextLockLevelindex);
                    }, 0.5);
                }
            }
            //
            index++;
        });
    },

    doScroll(index) {
        //計算偏移量
        var max = 19;
        // var scrollIndex = (nextLockLevelindex + 2 >= max) ? max - 2 : nextLockLevelindex-1;
        var scrollIndex = index - 1;
        var leftOffset = 30 - 960 + 192.5;//30 左邊的偏移 //960畫面一半寬 //192.5 level 中心點和左邊際的距離
        console.log('scrollIndex:' + scrollIndex);
        console.log('leftOffset:' + leftOffset);
        var ranx = (425) * (scrollIndex) + leftOffset + (10 * (scrollIndex - 1));
        console.log(ranx);
        self.ScrollView.getComponent(cc.ScrollView).scrollToOffset(cc.p(ranx, 0), 0.5);
    },

    //破 index 關 呼叫下一關開啟
    breakthroughLevel(index) {
        console.log('破' + index + '關');
        console.log(self.Content.children);
        var length = self.Content.children.length;
        var NextLockLevelindex = (index + 2);
        if (NextLockLevelindex > (length - 1)) NextLockLevelindex = -1;
        self.Content.children.forEach(node => {
            node.getComponent('LevelItem').setNextLockLevelindex(NextLockLevelindex);
        });
        self.Content.children[index + 1].getComponent('LevelItem').Unlock();
    },

    //破最後一關
    breakthroughFinalLevel() {
        console.log('破最後一關')
    },

    //點擊執行關卡內容
    ClickCallFunction(ItemIndex, LevelItem) {
        console.log('點擊的index:' + ItemIndex);
        self.ItemIndex = ItemIndex;
        self.LevelItem = LevelItem;
        self.showAlertDialog('');
        self.doScroll(self.ItemIndex + 1);
    },

    //依據關卡變更背景
    initBackground(type) {

        switch (type) {
            case 1:
                this.bg.spriteFrame = this.zone1;
                break;
            case 2:
                this.bg.spriteFrame = this.zone2;
                break;
            case 3:
                this.bg.spriteFrame = this.zone3;
                break;
            case 4:
                this.bg.spriteFrame = this.zone4;
                break;
            case 5:
                this.bg.spriteFrame = this.zone5;
                break;
            case 6:
                this.bg.spriteFrame = this.zone6;
                break;
            case 7:
                this.bg.spriteFrame = this.zone7;
                break;
            case 8:
                this.bg.spriteFrame = this.zone8;
                break;
            case 9:
                this.bg.spriteFrame = this.zone9;
                break;
        }
    },

    showAlertDialog(AlertType) {
        if (!this.AlertDialog) {
            this.AlertDialog = this.node.getChildByName('AlertDialog');

            //逃跑
            this.level_runaway_btn = this.AlertDialog.getChildByName('Dialogbg').getChildByName('level_runaway_btn');
            var runaway_clickEventHandler = new cc.Component.EventHandler();
            runaway_clickEventHandler.target = this.node; //这个 node 节点是你的事件处理代码组件所属的节点
            runaway_clickEventHandler.component = "LevelLayer";//这个是代码文件名
            runaway_clickEventHandler.handler = "CloseAlertDialog";
            var runaway_button = this.level_runaway_btn.addComponent(cc.Button);
            runaway_button.transition = cc.Button.Transition.SCALE;
            runaway_button.duration = 0.1;
            runaway_button.zoomScale = 0.85;
            runaway_button.clickEvents.push(runaway_clickEventHandler);

            //戰鬥
            this.level_fight_btn = this.AlertDialog.getChildByName('Dialogbg').getChildByName('level_fight_btn');
            var fight_clickEventHandler = new cc.Component.EventHandler();
            fight_clickEventHandler.target = this.node; //这个 node 节点是你的事件处理代码组件所属的节点
            fight_clickEventHandler.component = "LevelLayer";//这个是代码文件名
            fight_clickEventHandler.handler = "DoFightAction";
            var fight_button = this.level_fight_btn.addComponent(cc.Button);
            fight_button.transition = cc.Button.Transition.SCALE;
            fight_button.duration = 0.1;
            fight_button.zoomScale = 0.85;
            fight_button.clickEvents.push(fight_clickEventHandler);
        }
        //show
        this.AlertDialog.setPosition(cc.p(0, 0));
    },

    //
    CloseAlertDialog() {
        if (!this.AlertDialog) this.AlertDialog = this.node.getChildByName('AlertDialog');
        this.AlertDialog.setPosition(cc.p(1920, 0));
    },

    //
    DoFightAction() {
        this.CloseAlertDialog();
        if (this.LevelItem) this.LevelItem.StartNext(Math.floor(Math.random() * 2 + 2));
    }
    // update (dt) {},
});
