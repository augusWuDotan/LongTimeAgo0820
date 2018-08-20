

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    /**
     * 初始化 進度條 繪製 寶藏資訊
     * @param {*} treasures 寶藏資訊
     */
    init(treasures) {

        //
        this.TreasureItem = cc.find('TreasureItem');
        //
        this.ProgressBar = this.node.getChildByName('ProgressBar').getComponent(cc.ProgressBar);
        this.ProgressBar.progress = 0;
        //
        this.treasures = treasures;
        this.treasureNodes = [];
        this.addTreasures();

        //debug
        this.scheduleOnce(function (params) {
            this.setWinScore(400, [2]);
        }, 0.5);

    },

    //建立 預設寶箱畫面
    addTreasures() {
        this.treasures = [
            {
                'id': 2,
                'win': 50,
            },
            {
                'id': 3,
                'win': 100
            },
            {
                'id': 4,
                'win': 200
            },
            {
                'id': 5,
                'win': 400
            }

        ];
        //裝載的容器
        var content = this.node.getChildByName('ProgressBar').getChildByName('content');
        //容器寬度
        var ContentWidth = content.width;
        //最大值
        this.maxWinScore = this.treasures[this.treasures.length - 1].win;
        //
        var index = 0;
        this.treasures.forEach(treasure => {
            var Item = cc.instantiate(this.TreasureItem);
            let x = ContentWidth * (treasure.win / this.maxWinScore);
            let y = 0;
            content.addChild(Item);
            Item.setPosition(cc.p(x, y));
            this.treasureNodes.push(Item);
            //設定寶箱類型
            if (index < (this.treasures.length - 1)) {
                if (index == 0) Item.getComponent('TreasureItem').init(treasure.id, 1, false);
                else Item.getComponent('TreasureItem').init(treasure.id, 1, false);
            }
            else {
                Item.getComponent('TreasureItem').init(treasure.id, 2, false);
            }
            index++;
        });
    },

    //寶箱點擊 [isReady can be ]
    TreasureCallBack(event) {
        console.log(event.target);
        // if(event.target.parent.getComponent('TreasureItem').treasureType == 1)
        // event.target.parent.getComponent('TreasureItem').Box.spriteFrame = event.target.parent.getComponent('TreasureItem').WoodenBox_open;
        // else 
        // event.target.parent.getComponent('TreasureItem').Box.spriteFrame = event.target.parent.getComponent('TreasureItem').GoldBox_open;
        if (!event.target.parent.getComponent('TreasureItem').isOpen && event.target.parent.getComponent('TreasureItem').isReady) {
            event.target.parent.getComponent('TreasureItem').setOpen();
        } else {
            console.log('已經開啟過 或是還不能開啟');
        }

    },

    /**
     * 設定已經開啟或是還沒開啟
     * @param {*} WinScore 戰力職
     * @param {*} treasure_open 已經開啟的陣列
     */
    setWinScore(WinScore, treasure_open) {
        var self = this;

        this.nowProgress = Math.floor(WinScore / this.maxWinScore * 100) / 100;
        if (this.nowProgress > 1) this.nowProgress = 1;
        //
        var treasureIndex = 0;
        // this.treasures.forEach(treasure => {
        //     if (WinScore >= treasure.win) {
        //         //具有打開的權利

        //         //檢查是否已經打開
        //         var index = treasure_open.findIndex(num => num == treasure.id);
        //         if (index >= 0) this.treasureNodes[treasureIndex].getComponent('TreasureItem').setOpen();
        //         else this.treasureNodes[treasureIndex].getComponent('TreasureItem').setReady();

        //     } else {
        //         //沒有打開的權利

        //     }
        //     treasureIndex++;
        // });

        let speed = 0.001;
        var showProgress = function progress(params) {
            self.ProgressBar.progress += speed;

            if ((self.maxWinScore * self.ProgressBar.progress) > self.treasures[treasureIndex].win) {
                var index = treasure_open.findIndex(num => num == self.treasures[treasureIndex].id);
                if (index >= 0) self.treasureNodes[treasureIndex].getComponent('TreasureItem').setOpen();
                else self.treasureNodes[treasureIndex].getComponent('TreasureItem').setReady();
                treasureIndex++;
            }
            //
            if (self.ProgressBar.progress > self.nowProgress) {
                self.ProgressBar.progress = self.nowProgress;
                this.unschedule(showProgress);
            }
        };

        this.schedule(showProgress, 0.003);

    },


    onLoad() { },

    start() {

    },

    // update (dt) {},
});
