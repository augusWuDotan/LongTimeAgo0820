var self;
cc.Class({
    extends: cc.Component,

    properties: {
        //武器物件
        skillItem: {
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
        var data = this.debugData();//
        this.GridLayout = this.node.getChildByName('GridLayout');
        this.leftArrow = this.node.getChildByName('leftArrow');
        this.rightArrow = this.node.getChildByName('rightArrow');

        this.pageCount = 6;//武器 每一頁只有6件
        this.page = Math.ceil(data.length / this.pageCount);//計算 共幾頁 //ex: 11 =>  Math.ceil(11/2 = 5.5 => 6)

        this.currentPage = 0;//現在的頁數index
        this.pageData = [];
        for (let i = 0; i < this.page; i++) {
            var skillModel = {
                'index': i,
                'data': []
            }
            if (data[i * this.pageCount]) skillModel.data.push(data[i * this.pageCount]);
            if (data[i * this.pageCount + 1]) skillModel.data.push(data[i * this.pageCount + 1]);
            if (data[i * this.pageCount + 2]) skillModel.data.push(data[i * this.pageCount + 2]);
            if (data[i * this.pageCount + 3]) skillModel.data.push(data[i * this.pageCount + 3]);
            if (data[i * this.pageCount + 4]) skillModel.data.push(data[i * this.pageCount + 4]);
            if (data[i * this.pageCount + 5]) skillModel.data.push(data[i * this.pageCount + 5]);

            this.pageData.push(skillModel);
        }
        console.log(this.pageData);

        if (this.leftArrow) this.leftArrow.active = false;//第一頁 不用左滑
        this.addItem(this.currentPage);//建立第一頁的資訊
    },

    addItem(page) {
        //
        var skillData = this.pageData[page];
        this.GridLayout.removeAllChildren();
        var pageIndex = 0;
        skillData.data.forEach(skill => {
            //Equipment_Name 
            var Item = cc.instantiate(this.skillItem);
            this.GridLayout.addChild(Item);
            Item.setPosition(cc.p(0, 0));
            Item.getComponent('GridItem').init('skill', skill, page, pageIndex, this.selectFuc);

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
        self.PackLayer.showDetail('skill', childNode.getComponent('GridItem').info);
    },

    // update (dt) {},

    //送出設定 OK btn
    updadteSetting() {
        this.AlertTipLayer = cc.find('AlertTipeLayer');
        if(this.currentSelectNode){
            console.log('updadteSetting');
            var self = this;
            this.AlertTipLayer.getComponent('Alert').LeaveFunc = function () {
                self.AlertTipLayer.getComponent('Alert').LeaveFunc = null;
                self.updateValue();
            };//設定執行方法
            this.AlertTipLayer.getComponent('Alert').initErrorAlert('是否装备 ' + self.currentSelectNode.getComponent('GridItem').info.SkillPrototype_Name + ' 技能？');
            this.AlertTipLayer.setPosition(960, 540);
        }else{
            this.AlertTipLayer.getComponent('Alert').initErrorAlert('您尚未选择技能');
            this.AlertTipLayer.setPosition(960, 540);
        }
        
    },

    //
    updateValue() {
        console.log('送出技能設定');
        //todo 送出 請求 api

        //道具欄顯示
       var useSkillSuccess =  this.PackLayer.ElfTantLayer.setSkill(this.currentSelectNode.getComponent('GridItem').info);
       
       this.PackLayer.goneTipLayer();
       this.scheduleOnce(function () {
           self.AlertTipLayer.getComponent('Alert').initErrorAlert(useSkillSuccess.result);
           self.AlertTipLayer.setPosition(960, 540);
       },0.2);

    },



    debugData() {
        return [
            {
              "SkillPrototype_ID": 6,
              "SkillPrototype_Name": "乾坤一掷",
              "SkillPrototype_Sign": "6,4,2",
              "Damage": 110,
              "SkillPrototype_Img": "https://apprecorder.blob.core.chinacloudapi.cn/dragonfighter/Skill/10.png",
              "MpCost": 10,
              "Price": 1000,
              "Description": "给予对象1.1倍的伤害，自身命中率降低3%",
              "Crystal_ID": 1,
              "Limit_Lv": 1
            },
            {
              "SkillPrototype_ID": 8,
              "SkillPrototype_Name": "破山击",
              "SkillPrototype_Sign": "0,3,7,5,2",
              "Damage": 107,
              "SkillPrototype_Img": "https://apprecorder.blob.core.chinacloudapi.cn/dragonfighter/Skill/09.png",
              "MpCost": 10,
              "Price": 1000,
              "Description": "给予对象1.07倍的伤害，自身减少防御力和精神力5%",
              "Crystal_ID": 1,
              "Limit_Lv": 1
            },
            {
              "SkillPrototype_ID": 18,
              "SkillPrototype_Name": "乾坤一掷",
              "SkillPrototype_Sign": "6,4,2",
              "Damage": 120,
              "SkillPrototype_Img": "https://apprecorder.blob.core.chinacloudapi.cn/dragonfighter/Skill/10.png",
              "MpCost": 20,
              "Price": 2000,
              "Description": "给予对象1.2倍的伤害，自身命中率降低6%",
              "Crystal_ID": 1,
              "Limit_Lv": 10
            },
            {
              "SkillPrototype_ID": 59,
              "SkillPrototype_Name": "正气护体",
              "SkillPrototype_Sign": "0,4,8",
              "Damage": 0,
              "SkillPrototype_Img": "https://apprecorder.blob.core.chinacloudapi.cn/dragonfighter/Skill/light3.png",
              "MpCost": 200,
              "Price": 12000,
              "Description": "",
              "Crystal_ID": 2,
              "Limit_Lv": 1
            },
            {
              "SkillPrototype_ID": 54,
              "SkillPrototype_Name": "闪电术",
              "SkillPrototype_Sign": "0,3,6,4,2",
              "Damage": 0,
              "SkillPrototype_Img": "https://apprecorder.blob.core.chinacloudapi.cn/dragonfighter/Skill/%E9%9B%B7%E5%B0%8F.png",
              "MpCost": 40,
              "Price": 2000,
              "Description": "",
              "Crystal_ID": 2,
              "Limit_Lv": 1
            },
            {
              "SkillPrototype_ID": 55,
              "SkillPrototype_Name": "闪电术",
              "SkillPrototype_Sign": "0,3,6,4,2",
              "Damage": 0,
              "SkillPrototype_Img": "https://apprecorder.blob.core.chinacloudapi.cn/dragonfighter/Skill/%E9%9B%B7%E5%B0%8F.png",
              "MpCost": 80,
              "Price": 4000,
              "Description": "",
              "Crystal_ID": 2,
              "Limit_Lv": 1
            },
            {
              "SkillPrototype_ID": 64,
              "SkillPrototype_Name": "森林之泉",
              "SkillPrototype_Sign": "0,4,7,8",
              "Damage": 0,
              "SkillPrototype_Img": "https://apprecorder.blob.core.chinacloudapi.cn/dragonfighter/Skill/%E8%8D%89%E4%B8%AD.png",
              "MpCost": 200,
              "Price": 10000,
              "Description": "回复自身血量15%，持续3回合",
              "Crystal_ID": 3,
              "Limit_Lv": 40
            },
            {
              "SkillPrototype_ID": 86,
              "SkillPrototype_Name": "盘根错节",
              "SkillPrototype_Sign": "0,1,2,5",
              "Damage": 480,
              "SkillPrototype_Img": "https://apprecorder.blob.core.chinacloudapi.cn/dragonfighter/Skill/%E8%8D%89%E5%B0%8F.png",
              "MpCost": 200,
              "Price": 10000,
              "Description": "",
              "Crystal_ID": 3,
              "Limit_Lv": 40
            },
            {
              "SkillPrototype_ID": 98,
              "SkillPrototype_Name": "森林之泉",
              "SkillPrototype_Sign": "0,4,7,8",
              "Damage": 0,
              "SkillPrototype_Img": "https://apprecorder.blob.core.chinacloudapi.cn/dragonfighter/Skill/%E8%8D%89%E4%B8%AD.png",
              "MpCost": 240,
              "Price": 12000,
              "Description": "回复自身血量20%，持续3回合",
              "Crystal_ID": 3,
              "Limit_Lv": 50
            },
            {
              "SkillPrototype_ID": 74,
              "SkillPrototype_Name": "冰冻术",
              "SkillPrototype_Sign": "1,4,7,2",
              "Damage": 380,
              "SkillPrototype_Img": "https://apprecorder.blob.core.chinacloudapi.cn/dragonfighter/Skill/%E5%86%B0%E4%B8%AD.png",
              "MpCost": 160,
              "Price": 8000,
              "Description": "造成水属性伤害，对方敏捷降低40%，持续2回合",
              "Crystal_ID": 4,
              "Limit_Lv": 30
            },
            {
              "SkillPrototype_ID": 75,
              "SkillPrototype_Name": "冰冻术",
              "SkillPrototype_Sign": "1,4,7,2",
              "Damage": 480,
              "SkillPrototype_Img": "https://apprecorder.blob.core.chinacloudapi.cn/dragonfighter/Skill/%E5%86%B0%E4%B8%AD.png",
              "MpCost": 200,
              "Price": 10000,
              "Description": "造成水属性伤害，对方敏捷降低50%，持续2回合",
              "Crystal_ID": 4,
              "Limit_Lv": 40
            },
            {
              "SkillPrototype_ID": 100,
              "SkillPrototype_Name": "冰冻术",
              "SkillPrototype_Sign": "1,4,7,2",
              "Damage": 600,
              "SkillPrototype_Img": "https://apprecorder.blob.core.chinacloudapi.cn/dragonfighter/Skill/%E5%86%B0%E4%B8%AD.png",
              "MpCost": 240,
              "Price": 12000,
              "Description": "造成水属性伤害，对方敏捷降低60%，持续2回合",
              "Crystal_ID": 4,
              "Limit_Lv": 50
            },
            {
              "SkillPrototype_ID": 77,
              "SkillPrototype_Name": "火球术",
              "SkillPrototype_Sign": "4,5,6",
              "Damage": 300,
              "SkillPrototype_Img": "https://apprecorder.blob.core.chinacloudapi.cn/dragonfighter/Skill/%E7%81%AB%E5%B0%8F.png",
              "MpCost": 120,
              "Price": 6000,
              "Description": "给予对象火属性魔法伤害",
              "Crystal_ID": 5,
              "Limit_Lv": 20
            },
            {
              "SkillPrototype_ID": 78,
              "SkillPrototype_Name": "三昧真火",
              "SkillPrototype_Sign": "4,1,5",
              "Damage": 430,
              "SkillPrototype_Img": "https://apprecorder.blob.core.chinacloudapi.cn/dragonfighter/Skill/%E7%81%AB%E4%B8%AD.png",
              "MpCost": 160,
              "Price": 8000,
              "Description": "造成火属性伤害，烧伤敌人5%血量，持续5回合",
              "Crystal_ID": 5,
              "Limit_Lv": 30
            },
            {
              "SkillPrototype_ID": 89,
              "SkillPrototype_Name": "火球术",
              "SkillPrototype_Sign": "4,5,6",
              "Damage": 380,
              "SkillPrototype_Img": "https://apprecorder.blob.core.chinacloudapi.cn/dragonfighter/Skill/%E7%81%AB%E5%B0%8F.png",
              "MpCost": 160,
              "Price": 8000,
              "Description": "给予对象火属性魔法伤害",
              "Crystal_ID": 5,
              "Limit_Lv": 30
            },
            {
              "SkillPrototype_ID": 68,
              "SkillPrototype_Name": "落石术",
              "SkillPrototype_Sign": "0,3,6,7,8,5",
              "Damage": 430,
              "SkillPrototype_Img": "https://apprecorder.blob.core.chinacloudapi.cn/dragonfighter/Skill/%E7%9F%B3%E5%B0%8F.png",
              "MpCost": 160,
              "Price": 8000,
              "Description": "造成土属性伤害，减少对方命中50%，持续2回合",
              "Crystal_ID": 6,
              "Limit_Lv": 30
            },
            {
              "SkillPrototype_ID": 69,
              "SkillPrototype_Name": "落石术",
              "SkillPrototype_Sign": "0,3,6,7,8,5",
              "Damage": 530,
              "SkillPrototype_Img": "https://apprecorder.blob.core.chinacloudapi.cn/dragonfighter/Skill/%E7%9F%B3%E5%B0%8F.png",
              "MpCost": 200,
              "Price": 10000,
              "Description": "造成土属性伤害，减少对方命中60%，持续2回合",
              "Crystal_ID": 6,
              "Limit_Lv": 40
            },
            {
              "SkillPrototype_ID": 94,
              "SkillPrototype_Name": "落石术",
              "SkillPrototype_Sign": "0,3,6,7,8,5",
              "Damage": 650,
              "SkillPrototype_Img": "https://apprecorder.blob.core.chinacloudapi.cn/dragonfighter/Skill/%E7%9F%B3%E5%B0%8F.png",
              "MpCost": 240,
              "Price": 12000,
              "Description": "造成土属性伤害，减少对方命中70%，持续2回合",
              "Crystal_ID": 6,
              "Limit_Lv": 50
            }
          ];
    },
});
