var self;
cc.Class({
    extends: cc.Component,

    properties: {
        //武器物件
        PropItem: {
            default: null,
            type: cc.Prefab
        },
        //pack頁 component
        PackLayer: {
            default: null,
            serializable: false
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() { },

    start() {

    },

    //初始化
    init() {
        self = this;
        this.data = this.debugData();//
        this.GridLayout = this.node.getChildByName('GridLayout');
        this.leftArrow = this.node.getChildByName('leftArrow');
        this.rightArrow = this.node.getChildByName('rightArrow');

        this.pageCount = 6;//武器 每一頁只有6件
        this.page = Math.ceil(this.data.length / this.pageCount);//計算 共幾頁 //ex: 11 =>  Math.ceil(11/2 = 5.5 => 6)

        this.currentPage = 0;//現在的頁數index
        this.pageData = [];
        for (let i = 0; i < this.page; i++) {
            var propModel = {
                'index': i,
                'data': []
            }
            if (this.data[i * this.pageCount]) propModel.data.push(this.data[i * this.pageCount]);
            if (this.data[i * this.pageCount + 1]) propModel.data.push(this.data[i * this.pageCount + 1]);
            if (this.data[i * this.pageCount + 2]) propModel.data.push(this.data[i * this.pageCount + 2]);
            if (this.data[i * this.pageCount + 3]) propModel.data.push(this.data[i * this.pageCount + 3]);
            if (this.data[i * this.pageCount + 4]) propModel.data.push(this.data[i * this.pageCount + 4]);
            if (this.data[i * this.pageCount + 5]) propModel.data.push(this.data[i * this.pageCount + 5]);

            this.pageData.push(propModel);
        }
        console.log(this.pageData);

        if (this.leftArrow) this.leftArrow.active = false;//第一頁 不用左滑
        this.addItem(this.currentPage);//建立第一頁的資訊

        this.initTouch();
    },

    addItem(page) {
        //
        var propData = this.pageData[page];
        this.GridLayout.removeAllChildren();
        var pageIndex = 0;
        propData.data.forEach(prop => {
            //Equipment_Name 
            var Item = cc.instantiate(this.PropItem);
            this.GridLayout.addChild(Item);
            Item.setPosition(cc.p(0, 0));
            Item.getComponent('GridItem').init('prop', prop, page, pageIndex, this.selectFuc);

            //檢查有沒有已經選中的節點
            console.log(self.currentSelectNode);

            if (self.currentSelectNode) {
                console.log(self.currentSelectNode.getComponent('GridItem').page);
                console.log(self.currentSelectNode.getComponent('GridItem').pageIndex);
                if (self.currentSelectNode.getComponent('GridItem').page == page && pageIndex == self.currentSelectNode.getComponent('GridItem').pageIndex) {
                    console.log(true);
                    Item.getChildByName('Container').getChildByName('SelectedLight').active = true;
                    Item.getChildByName('Container').getChildByName('goodphoto').scale = 1.2;
                }
            }
            pageIndex++;
        });


    },

    //左滑
    leftArrowClick() {
        if (this.rightArrow) this.rightArrow.active = true;//非最後一頁 可以右滑
        this.currentPage--;
        if (this.currentPage == 0) {
            if (this.leftArrow) this.leftArrow.active = false;//第一頁 不用左滑
        }
        this.addItem(this.currentPage);
    },

    //右滑
    rightArrowClick() {
        if (this.leftArrow) this.leftArrow.active = true;//不是第一頁 可以左滑
        this.currentPage++;
        if (this.currentPage == (this.pageData.length - 1)) {
            if (this.rightArrow) this.rightArrow.active = false;//最後一頁 不用右滑
        }
        this.addItem(this.currentPage);
    },

    //子結點選取方法
    selectFuc(childNode) {
        console.log(self.currentSelectNode);
        if (self.currentSelectNode) {
            self.currentSelectNode.getChildByName('Container').getChildByName('SelectedLight').active = false;
            self.currentSelectNode.getChildByName('Container').getChildByName('goodphoto').scale = 1;
        }
        self.currentSelectNode = childNode;
        self.currentSelectNode.getChildByName('Container').getChildByName('SelectedLight').active = true;
        self.currentSelectNode.getChildByName('Container').getChildByName('goodphoto').scale = 1.2;
        console.log(childNode);

        //顯示detail
        self.PackLayer.showDetail('prop', childNode.getComponent('GridItem').info);
    },

    // update (dt) {},

    //送出設定 OK btn
    updadteSetting() {
        this.AlertTipLayer = cc.find('AlertTipeLayer');
        var self = this;
        if (this.currentSelectNode) {
            console.log('updadteSetting');
            if (self.currentSelectNode.getComponent('GridItem').info.BattleOnly) {
                if (self.currentSelectNode.getComponent('GridItem').info.PropsType_count >= 1) {
                    //正常設定
                    this.AlertTipLayer.getComponent('Alert').LeaveFunc = function () {
                        self.AlertTipLayer.getComponent('Alert').LeaveFunc = null;
                        self.updateValue();
                    };//設定執行方法
                    this.AlertTipLayer.getComponent('Alert').initErrorAlert('是否设定为竞技场使用?');
                    this.AlertTipLayer.setPosition(960, 540);
                } else {
                    //數量不足
                    this.AlertTipLayer.getComponent('Alert').initErrorAlert('数量不足');
                    this.AlertTipLayer.setPosition(960, 540);
                }
            } else {
                //非、競技場使用
                this.AlertTipLayer.getComponent('Alert').initErrorAlert('该道具无法在竞技场使用');
                this.AlertTipLayer.setPosition(960, 540);
            }
        } else {
            //尚未選擇道具
            this.AlertTipLayer.getComponent('Alert').initErrorAlert('您尚未选择道具');
            this.AlertTipLayer.setPosition(960, 540);
        }
    },

    initTouch(){
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            console.log(event);
        }, this.node);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            
        }, self.node);
        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            console.log(event);
        }, this.node);
    },

    //
    updateValue() {
        console.log('送出道具設定');
        //todo 送出 請求 api

        //道具-1
        console.log(self.pageData[self.currentPage].data);
        console.log(this.currentSelectNode.getComponent('GridItem').info);

        var infoIndex = self.pageData[self.currentPage].data.findIndex(function (info) {
            return info.PropsPrototype_ID == self.currentSelectNode.getComponent('GridItem').info.PropsPrototype_ID;
        });

        console.log('infoIndex:' + infoIndex);
        if (infoIndex >= 0) {
            this.pageData[this.currentPage].data[infoIndex].PropsType_count--;
            this.currentSelectNode.getComponent('GridItem').useProp(this.pageData[this.currentPage].data[infoIndex].PropsType_count);
        }

        //道具欄顯示
        var usePropSuccess = this.PackLayer.ElfTantLayer.setProp(this.currentSelectNode.getComponent('GridItem').info, this);

        this.PackLayer.goneTipLayer();
        this.scheduleOnce(function () {
            if (!usePropSuccess.success) {
                self.pageData[self.currentPage].data[infoIndex].PropsType_count++;
                self.currentSelectNode.getComponent('GridItem').useProp(self.pageData[self.currentPage].data[infoIndex].PropsType_count);
            }
            self.AlertTipLayer.getComponent('Alert').initErrorAlert(usePropSuccess.result);
            self.AlertTipLayer.setPosition(960, 540);
        }, 0.2);

    },

    //退回設定
    MakeUpProps(info) {
        console.log('MakeUpProps');
        console.log(JSON.stringify(info));

        var infoIndex = this.data.findIndex(function (model) {
            return model.PropsPrototype_ID == info.PropsPrototype_ID;
        });

        console.log('infoIndex:' + infoIndex);
        if (infoIndex >= 0) {
            //找出他的頁數
            var infoPage = Math.floor(infoIndex / this.pageCount);
            var index = infoIndex % this.pageCount;
            console.log('infoPage:' + infoPage);
            console.log('index:' + index);
            this.pageData[infoPage].data[index].PropsType_count++;//物品+1
            if (infoPage == this.currentPage) {
                //馬上刷新
                this.addItem(this.currentPage);
                console.log('update addItem');
            } else {
                console.log('no update addItem');
            }
        } else {
            console.log('無法退回，找不到該物品');
        }
    },

    debugData() {
        return [
            {
                "PropsPrototype_ID": 1,
                "PropsPrototype_Name": "红色药水",
                "PropsType_ID": 1,
                "PropsType_Name": "藥水",
                "PropsPrototype_Lv": 1,
                "Description": "恢復血量约100点(依角色恢復值增减)",
                "BattleOnly": true,
                "CallScript": "AddHP(100,'point',0)",
                "PropsPrototype_Img": "https://apprecorder.blob.core.chinacloudapi.cn/dragonfighter/Props/Red%20potion.png",
                "Price": 100,
                "PropsType_count": 14
            },
            {
                "PropsPrototype_ID": 4,
                "PropsPrototype_Name": "橙色药水",
                "PropsType_ID": 1,
                "PropsType_Name": "藥水",
                "PropsPrototype_Lv": 10,
                "Description": "恢復血量约200点(依角色恢復值增减)",
                "BattleOnly": true,
                "CallScript": "AddHP(200,'point',0)",
                "PropsPrototype_Img": "https://apprecorder.blob.core.chinacloudapi.cn/dragonfighter/Props/Orange%20potion.png",
                "Price": 250,
                "PropsType_count": 10
            },
            {
                "PropsPrototype_ID": 5,
                "PropsPrototype_Name": "白色药水",
                "PropsType_ID": 1,
                "PropsType_Name": "藥水",
                "PropsPrototype_Lv": 20,
                "Description": "恢復血量约300点(依角色恢復值增减)",
                "BattleOnly": true,
                "CallScript": "AddHP(300,'point',0)",
                "PropsPrototype_Img": "https://apprecorder.blob.core.chinacloudapi.cn/dragonfighter/Props/White%20potion.png",
                "Price": 500,
                "PropsType_count": 3
            },
            {
                "PropsPrototype_ID": 6,
                "PropsPrototype_Name": "蓝色药水",
                "PropsType_ID": 1,
                "PropsType_Name": "藥水",
                "PropsPrototype_Lv": 1,
                "Description": "恢復魔量100点",
                "BattleOnly": true,
                "CallScript": "AddMP(100,'point',0)",
                "PropsPrototype_Img": "https://apprecorder.blob.core.chinacloudapi.cn/dragonfighter/Props/Blue%20potion.png",
                "Price": 200,
                "PropsType_count": 32
            },
            {
                "PropsPrototype_ID": 7,
                "PropsPrototype_Name": "高级蓝色药水",
                "PropsType_ID": 1,
                "PropsType_Name": "藥水",
                "PropsPrototype_Lv": 10,
                "Description": "恢復魔量200点",
                "BattleOnly": true,
                "CallScript": "AddMP(200,'point',0)",
                "PropsPrototype_Img": "https://apprecorder.blob.core.chinacloudapi.cn/dragonfighter/Props/Senior%20blue%20potion.png",
                "Price": 400,
                "PropsType_count": 12
            },
            {
                "PropsPrototype_ID": 8,
                "PropsPrototype_Name": "洗鍊药水",
                "PropsType_ID": 1,
                "PropsType_Name": "藥水",
                "PropsPrototype_Lv": 1,
                "Description": "重置角色配点点数",
                "BattleOnly": false,
                "CallScript": "ResetPoint()",
                "PropsPrototype_Img": "https://apprecorder.blob.core.chinacloudapi.cn/dragonfighter/Props/Chain%20washing%20potion.png",
                "Price": 10,
                "PropsType_count": 11
            },
            {
                "PropsPrototype_ID": 18,
                "PropsPrototype_Name": "初级防御增强卷轴",
                "PropsType_ID": 4,
                "PropsType_Name": "卷軸",
                "PropsPrototype_Lv": 1,
                "Description": "使用后，该场战斗持续增加自身防御10%",
                "BattleOnly": true,
                "CallScript": "AddDef(10,'percent',30)",
                "PropsPrototype_Img": "https://apprecorder.blob.core.chinacloudapi.cn/dragonfighter/Props/Primary%20defense%20enhanced%20reel.png",
                "Price": 2000,
                "PropsType_count": 13
            },
            {
                "PropsPrototype_ID": 19,
                "PropsPrototype_Name": "初级敏捷增强卷轴",
                "PropsType_ID": 4,
                "PropsType_Name": "卷軸",
                "PropsPrototype_Lv": 1,
                "Description": "使用后，该场战斗持续增加自身敏捷10%",
                "BattleOnly": true,
                "CallScript": "AddAgi(10,'percent',30)",
                "PropsPrototype_Img": "https://apprecorder.blob.core.chinacloudapi.cn/dragonfighter/Props/Junior%20Agile%20Enhancement%20Scroll.png",
                "Price": 2000,
                "PropsType_count": 1
            },
            {
                "PropsPrototype_ID": 20,
                "PropsPrototype_Name": "初级攻击增强卷轴",
                "PropsType_ID": 4,
                "PropsType_Name": "卷軸",
                "PropsPrototype_Lv": 1,
                "Description": "使用后，该场战斗持续增加自身攻击10%",
                "BattleOnly": true,
                "CallScript": "AddAtk(10,'percent',30)",
                "PropsPrototype_Img": "https://apprecorder.blob.core.chinacloudapi.cn/dragonfighter/Props/Primary%20attack%20enhancement%20scroll.png",
                "Price": 2000,
                "PropsType_count": 21
            },
            {
                "PropsPrototype_ID": 21,
                "PropsPrototype_Name": "初级精神增强卷轴",
                "PropsType_ID": 4,
                "PropsType_Name": "卷軸",
                "PropsPrototype_Lv": 1,
                "Description": "使用后，该场战斗持续增加自身精神10%",
                "BattleOnly": true,
                "CallScript": "AddInt(10,'percent',30)",
                "PropsPrototype_Img": "https://apprecorder.blob.core.chinacloudapi.cn/dragonfighter/Props/Primary%20spirit%20enhanced%20scroll.png",
                "Price": 2000,
                "PropsType_count": 41
            }
        ];
    },
});
