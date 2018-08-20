var self;
cc.Class({
    extends: cc.Component,

    properties: {
        //套裝物件
        armorItem: {
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
        this.defaultArmor = this.debugData()[0];//預設第一個是正在使用的裝備
        this.GridLayout = this.node.getChildByName('GridLayout');
        this.leftArrow = this.node.getChildByName('leftArrow');
        this.rightArrow = this.node.getChildByName('rightArrow');
        if(!this.InEquipmentIndex)this.InEquipmentIndex = { 'page': 0, 'pageIndex': 0 };//裝備中 預設 page : 0 , pageIndex : 0
        this.pageCount = 2;//套裝 每一頁只有2件
        this.page = Math.ceil(data.length / this.pageCount);//計算 共幾頁 //ex: 11 =>  Math.ceil(11/2 = 5.5 => 6)

        this.currentPage = 0;//現在的頁數index
        this.pageData = [];
        for (let i = 0; i < this.page; i++) {
            var armorModel = {
                'index': i,
                'data': []
            }
            if (data[i * this.pageCount]) armorModel.data.push(data[i * this.pageCount]);
            if (data[i * this.pageCount + 1]) armorModel.data.push(data[i * this.pageCount + 1]);
            this.pageData.push(armorModel);
        }
        console.log(this.pageData);

        if (this.leftArrow) this.leftArrow.active = false;//第一頁 不用左滑
        this.addItem(this.currentPage);//建立第一頁的資訊
    },

    addItem(page) {
        //
        var armorData = this.pageData[page];
        this.GridLayout.removeAllChildren();
        var pageIndex = 0;
        armorData.data.forEach(armor => {

            //Equipment_Name 
            var Item = cc.instantiate(this.armorItem);
            this.GridLayout.addChild(Item);
            Item.setPosition(cc.p(0, 0));
            //
            if (this.InEquipmentIndex.page == page && this.InEquipmentIndex.pageIndex == pageIndex) {
                Item.getComponent('GridItem').init('armor', armor, page, pageIndex, this.selectFuc, true);
            } else {
                Item.getComponent('GridItem').init('armor', armor, page, pageIndex, this.selectFuc, false);
            }


            //檢查有沒有已經選中的節點
            console.log(self.currentSelectNode);
            self.currentSelectNode = null;
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
        self.PackLayer.showDetail('attr', childNode.getComponent('GridItem').info);
    },

    // update (dt) {},

    //送出設定 OK btn
    updadteSetting() {
        this.AlertTipLayer = cc.find('AlertTipeLayer');

        if (this.currentSelectNode) {
            console.log('updadteSetting');
            var self = this;
            this.AlertTipLayer.getComponent('Alert').LeaveFunc = function () {
                self.AlertTipLayer.getComponent('Alert').LeaveFunc = null;
                self.updateValue();
            };//設定執行方法
            this.AlertTipLayer.getComponent('Alert').initErrorAlert('是否装备\n' + self.currentSelectNode.getComponent('GridItem').info.Equipment_Name + '？');
            this.AlertTipLayer.setPosition(960, 540);
        } else {
            this.AlertTipLayer.getComponent('Alert').initErrorAlert('您尚未选择套装');
            this.AlertTipLayer.setPosition(960, 540);
        }
    },

    //
    updateValue() {
        console.log('送出套裝設定');
        //todo 送出 請求 api

        //
        var currentEquipmentPage = this.InEquipmentIndex.page;
        var currentEquipmentPageIndex = this.InEquipmentIndex.pageIndex;
        this.InEquipmentIndex = { 'page': this.currentSelectNode.getComponent('GridItem').page, 'pageIndex': this.currentSelectNode.getComponent('GridItem').pageIndex };
        if(this.currentPage == currentEquipmentPage){
            this.addItem(this.currentPage);
        }else{
            this.currentSelectNode.getComponent('GridItem').changeEquipmentState();
            this.scheduleOnce(function () {
                self.AlertTipLayer.getComponent('Alert').initErrorAlert('成功装备套装');
                self.AlertTipLayer.setPosition(960, 540);
            }, 0.2);
        }
        this.PackLayer.goneTipLayer();
    },



    debugData() {
        return [

            {
                "EquipmentPrototype_ID": 39,
                "Equipment_Name": "普通的 一階重裝",
                "EquipmentLevel_ID": 1,
                "Crystal": 1,
                "Equipment_Type": 6,
                "Equipment_Class": "Armor",
                "EquipmentType_Image": "https://apprecorder.blob.core.chinacloudapi.cn/dragonfighter/Equipment/heavy_01.png",
                "Price": 30,
                "EquipmentElement": [
                    {
                        "ElementNum": 2,
                        "ElementID": "Def",
                        "ElementName": "防禦",
                        "ElementValue": 73
                    },
                    {
                        "ElementNum": 8,
                        "ElementID": "HP",
                        "ElementName": "血量",
                        "ElementValue": 302
                    },
                    {
                        "ElementNum": 11,
                        "ElementID": "DodgeRate",
                        "ElementName": "閃避",
                        "ElementValue": -7
                    },
                    {
                        "ElementNum": 12,
                        "ElementID": "HitRate",
                        "ElementName": "命中",
                        "ElementValue": -7
                    }
                ],
                "RandomElementModels": [],
                "LimitModels": {
                    "Limit_Lv": 1,
                    "Limit_Con": 0,
                    "Limit_Str": 0,
                    "Limit_Vit": 0,
                    "Limit_Spd": 0,
                    "Limit_Int": 0
                },
                "KeyCode": "8+0xv0czUoW7SZFXkrfdVIrn0O7nqKJcfXHsMIAT7+85Hpuv/7KkMKZfUWgtZ7w/qLfJ/GWw7jg+Mw8PIBBWoRB7hexi6ruuurWvgvie218+k000vcCNW5wUNIJ7V46UMfHsvyTDHLZe3cy0tfYs2KspqGzPWbRC/sm7T06eXHFS9Vm+0DKduNrOL5WQFW3SlZQyUSdrWxlldbyTv9WguPlgA9/q+eXPdlhOY5ovjo+M8/3U3u28TZ38WzmUypQyzZOuAYNzTR6eJ2UdAAUHmwpF+LUSGvFmsbiHqFrc62nU3+mJ284Eo/Q5XgLrDD9Q1udLrSQE6GmCrAcZyeYPDZurX2WwUJYOb9zhebhW4UDmaXSEbu2Q7rCeccDGlKhzBoKI/iLJlrAzjFW6sVsnYMGvlfhQ8iaBRAB7ViziMIjXZ+5lDSPRFnxtkduHySBYy36o4lNNOlTnrmD97P7NFB43tbdB55ywFD3hTwz/FzqlljuUKNJ1JDPvOr62dZSeXKzuy1ohmRElTDBXex8QNBYM0qWwFBqVnlZaRvrm/vuF5DnNqxK79P1YtbVY8nH0e90fGaE5oNi/8h2RMNgZZTev7MZuGbXI3DOxH8z8jyeEcyjSXLtuWS+ryf2znChNTyvbT+xbOqv2lGs4kBTmU5HSRhtH3qLIsSoo7ZxmmQFJKy85IZUQNoA97R99/fekiM2zfuhRnlYhO4/BrFkClrRmp2JJE3cJECsXGhXExndZRNk2Tq2VqSnO/E34DsbwSeRCZxXf9S2zTJjY/OobBThcR4rG3nSBq3PXNlA1VyDrDTEbPewtwtj/7HXZApsTf6ImEr4AyWxrNI7SSYJ5JpLPKAHncwRZAUwwcyVnElyCkP97zSvzd/zTaHIgpBINrfAv0O62+LWa+bu3KcFd/V9UtWShG+7b/fJmaNmNFFKR8HljY8c/3MSgtjuXByibrTQHAyrE9Ig87DX86TYcNTMiKMwUNnlGw6VOPeI1ZBlHh21pM+8mStHFh4eftYN1",
                "SoldOut": false
            },
            {
                "EquipmentPrototype_ID": 39,
                "Equipment_Name": "普通的 一階重裝",
                "EquipmentLevel_ID": 1,
                "Crystal": 1,
                "Equipment_Type": 6,
                "Equipment_Class": "Armor",
                "EquipmentType_Image": "https://apprecorder.blob.core.chinacloudapi.cn/dragonfighter/Equipment/heavy_01.png",
                "Price": 30,
                "EquipmentElement": [
                    {
                        "ElementNum": 2,
                        "ElementID": "Def",
                        "ElementName": "防禦",
                        "ElementValue": 63
                    },
                    {
                        "ElementNum": 8,
                        "ElementID": "HP",
                        "ElementName": "血量",
                        "ElementValue": 331
                    },
                    {
                        "ElementNum": 11,
                        "ElementID": "DodgeRate",
                        "ElementName": "閃避",
                        "ElementValue": -8
                    },
                    {
                        "ElementNum": 12,
                        "ElementID": "HitRate",
                        "ElementName": "命中",
                        "ElementValue": -6
                    }
                ],
                "RandomElementModels": [],
                "LimitModels": {
                    "Limit_Lv": 1,
                    "Limit_Con": 0,
                    "Limit_Str": 0,
                    "Limit_Vit": 0,
                    "Limit_Spd": 0,
                    "Limit_Int": 0
                },
                "KeyCode": "8+0xv0czUoW7SZFXkrfdVIrn0O7nqKJcfXHsMIAT7+85Hpuv/7KkMKZfUWgtZ7w/qLfJ/GWw7jg+Mw8PIBBWoRB7hexi6ruuurWvgvie218+k000vcCNW5wUNIJ7V46UMfHsvyTDHLZe3cy0tfYs2KspqGzPWbRC/sm7T06eXHFS9Vm+0DKduNrOL5WQFW3SlZQyUSdrWxlldbyTv9WguPlgA9/q+eXPdlhOY5ovjo+M8/3U3u28TZ38WzmUypQyzZOuAYNzTR6eJ2UdAAUHmwpF+LUSGvFmsbiHqFrc62nU3+mJ284Eo/Q5XgLrDD9Q1udLrSQE6GmCrAcZyeYPDZurX2WwUJYOb9zhebhW4UDmaXSEbu2Q7rCeccDGlKhzBoKI/iLJlrAzjFW6sVsnYMGvlfhQ8iaBRAB7ViziMIjXZ+5lDSPRFnxtkduHySBYy36o4lNNOlTnrmD97P7NFB43tbdB55ywEukXYu9zhcpMMvKLIhQ6gFQJiFi6XjCEJfyYxsD/uvvlphqAHIYMw4xfM8/8+iXc2zDeemHHd/JWqpj8WebzTTKDnxju22IRGUJvcVf2Of2fbBp8+e5cx7nZQCiwm06S3m/mF8R+cgVVsmILcYp1pbZZ62+mSmBI9ZkUQr5tDEMKrOup8zktal6v4qllvjRln26e1IDWCeJrNCGzpNjqexrd0cGM4nNGod6NPvx/SiNQG82Fho4Iaxox94UhgzvFjreQmVmHInblBWlRImIrDK2VTA6EIrCsgRWNhbFQyZN4bdVh7qA3jdhZLBxBxonc8CSVQEAWjzqrVq36x/AkdkAIJjYJZ+yvBovNshWIt+dUscJkCN4qUm8jOHa6boYqEWrPx14DOSQVc1PQMNRZQt2reDm+76L/htWMDNMY7z+oqpw8TZ/BALdF06qjUwqrsuXpeiVt515wXxdQPkflH/1P0eZTJVxEN8hJAacOozpr2cae4UAFABXhJ5GwwlWI+bH+squPfDB1ZfZk92uCLEdbplTgGZTj",
                "SoldOut": false
            },
            {
                "EquipmentPrototype_ID": 45,
                "Equipment_Name": "普通的 火之三階重裝",
                "EquipmentLevel_ID": 1,
                "Crystal": 5,
                "Equipment_Type": 6,
                "Equipment_Class": "Armor",
                "EquipmentType_Image": "https://apprecorder.blob.core.chinacloudapi.cn/dragonfighter/Equipment/heavy_03.png",
                "Price": 1080,
                "EquipmentElement": [
                    {
                        "ElementNum": 2,
                        "ElementID": "Def",
                        "ElementName": "防禦",
                        "ElementValue": 81
                    },
                    {
                        "ElementNum": 8,
                        "ElementID": "HP",
                        "ElementName": "血量",
                        "ElementValue": 318
                    },
                    {
                        "ElementNum": 11,
                        "ElementID": "DodgeRate",
                        "ElementName": "閃避",
                        "ElementValue": -8
                    },
                    {
                        "ElementNum": 12,
                        "ElementID": "HitRate",
                        "ElementName": "命中",
                        "ElementValue": -8
                    }
                ],
                "RandomElementModels": [],
                "LimitModels": {
                    "Limit_Lv": 6,
                    "Limit_Con": 0,
                    "Limit_Str": 15,
                    "Limit_Vit": 5,
                    "Limit_Spd": 5,
                    "Limit_Int": 0
                },
                "KeyCode": "8+0xv0czUoW7SZFXkrfdVIrn0O7nqKJccrq05sj5BQbLPU48Y2uPzR7hUZN/bz30CKG1w+9HaYvr/nVx/xn1g66SGwgSEJcbGz/pcfdXeailW/m1eDnIJZ54RCakk0jpayh5lfadlFskBOg6iVHIjO01hvWeAHTPNUsWDhUyIBu02Sz74xabduVPjeW0K4xCtfWjb7u4MldLVDuy1rRkAo7OVVcisLleEkok7iaVxjQM5nV3weS25WppT0CejBHcnJc72GA30Qk/QAw2udHgsGPcCyzMJOf6myKVmSqy9vYGAvOGl+EOnGjV4j57DrKhz6Wyayhljntz2prI/vwPezq/wlamQIefmiLN9dmjlY0j+cD64cLBe8LMyi46ufi44jw36+bo78wQ37H8ahy07XOpMXhrBJG9Sbqd/ouY1zcbvaIlCTkJ5gLIYuHGRDZMOznQUPJ/2I3BwPo5wesKwoHEvkTrqeHI41P7EbzsNQuRID4RmghrLS5+4uGkLQtxIh+Gj5rzuXkJL6ddD1E2RUgyK8Y25BbfJDlL/A9HJsAj/34sRe9TuWw78IniFDIPbMF90/wA1Hri/0CV67GKLvfNLU2xJgCJByXGJ4MDPEenZUkXCfSlFRhMUF25wsJ0Frg/SRBCjpYkcF3FlvkpAWOyo0VfFnsi1cjyxZSdq3kNS+jxx0LJkFesvuSIremUC5f0j4Nxd6TShxMdH2GQMDN9AuxiTf4hy4Qa7auLX2zVJ8/mXrblgDQCzu6oBXpdXxHIZeKxz+dx9SVlD2y596sUsELRQ9SzgQsKS7RcbDGscgVpeOEsPMkx1JKIsh4YKFYq8A31Lx9uZSVXGg9+D2AOLRCd5MvNRsiaIWGZkD5E8l68jHFfYuatX/Wi2JaSlC0dTZ0kXuF+NxAonCoj0QU8QyPzlg+MvJqgE1y0huplcpBxoHvpmc+B1xj+pxjm5PvejECPMJ25hCLVMj08SqXNU0ZKg9tKeDswljyWbTYnAPrerEhwHjmeoF5+h7se/oHYmpoMTls=",
                "SoldOut": false
            },
            {
                "EquipmentPrototype_ID": 45,
                "Equipment_Name": "普通的 三階重裝",
                "EquipmentLevel_ID": 1,
                "Crystal": 1,
                "Equipment_Type": 6,
                "Equipment_Class": "Armor",
                "EquipmentType_Image": "https://apprecorder.blob.core.chinacloudapi.cn/dragonfighter/Equipment/heavy_03.png",
                "Price": 1080,
                "EquipmentElement": [
                    {
                        "ElementNum": 2,
                        "ElementID": "Def",
                        "ElementName": "防禦",
                        "ElementValue": 67
                    },
                    {
                        "ElementNum": 8,
                        "ElementID": "HP",
                        "ElementName": "血量",
                        "ElementValue": 404
                    },
                    {
                        "ElementNum": 11,
                        "ElementID": "DodgeRate",
                        "ElementName": "閃避",
                        "ElementValue": -8
                    },
                    {
                        "ElementNum": 12,
                        "ElementID": "HitRate",
                        "ElementName": "命中",
                        "ElementValue": -8
                    }
                ],
                "RandomElementModels": [],
                "LimitModels": {
                    "Limit_Lv": 6,
                    "Limit_Con": 0,
                    "Limit_Str": 15,
                    "Limit_Vit": 5,
                    "Limit_Spd": 5,
                    "Limit_Int": 0
                },
                "KeyCode": "8+0xv0czUoW7SZFXkrfdVIrn0O7nqKJccrq05sj5BQbLPU48Y2uPzR7hUZN/bz30CKG1w+\n2018-08-08T04:41:19.764Z - normal: Simulator: 9HaYvTF3kI3CAFD8y0MvK7QhSEFN/6FWGi+SJWzPL/7oSsbqOk7SF01WGiQ0ZfTx+rTglaWdCC1VkzSd+HvPr3grYbDhTM90JOIMds6ZvhXhuzot1g1gnAQY3y+dQAcwLvCXwVK8HPJYVTQhtUqHJKJ1EWp7oLl2FTL5UtOcpIEo9HH3BRbCERH8SvfCTyCk+3B800JQei0RBiVLFkDpX13Te9MwTEGdg8bnRo783VcLgU0w/1W+XbCSnk4oX/ykMf72/2pGwTtR7g1CADRQQliDlDMoalDlOUhTh1NToNyisH7pqh+gHVb3WNsJIbSqd5TnMmQ3W4idZqvtnwvXbrlf7gpP8Tb0w0c3DQIHBrkDK9E6g5KY0tdp0tBmoCBlTREJYNnmVPlnwlpavC2u456io0J3/8dMrtdepoXrpvrnQ/g1GzjBAeuyzqN4M25E2wPc269DkgOibzKr/LcGud6xI/ulSzRReHb/N4hBGqr3a91jfegM93ShbeGZNirHgTPHo0CSoPSQkcblHODNEYbT+7OCHNFx+5bBv1NXSZ6DZ/8P78U40wpSZnc9SQjZUF5nVNWG1WHycSpOzOrvPZAqxo5JxMQqgOXLcL7Zc5tyAXfslGYxHaDqt2JekQ7OwW6mfhve9NNd9FQm4CRTVvlO8z8tab5m01ZjUJnUbBVZieYUP9oq3CvVj7fozaAWk/b67O1Q+c1by1BrRrx/ZMtmUpZ1Xeir+B7YdEnZnBk3NR5bndPBMPauT9gummR2QdxYVUB0+BjtEfO02Ai1uDjOO1aBAIz88lb+vMnO43emG3DLjIRcggpC0J4sVVEQ+0yG/XMWh4TqtEIgxwPpsz0AEeyFUoQniqs4Jf1WFtgvMloAdMqbMLr2d5i9h4L+rDycFv0vx//UmkQQhHfKoBnyohEg4sHcJHTuV7jc83pvPniY2LmUZ59i2c",
                "SoldOut": false
            },
            {
                "EquipmentPrototype_ID": 45,
                "Equipment_Name": "普通的 火之三階重裝",
                "EquipmentLevel_ID": 1,
                "Crystal": 5,
                "Equipment_Type": 6,
                "Equipment_Class": "Armor",
                "EquipmentType_Image": "https://apprecorder.blob.core.chinacloudapi.cn/dragonfighter/Equipment/heavy_03.png",
                "Price": 1080,
                "EquipmentElement": [
                    {
                        "ElementNum": 2,
                        "ElementID": "Def",
                        "ElementName": "防禦",
                        "ElementValue": 71
                    },
                    {
                        "ElementNum": 8,
                        "ElementID": "HP",
                        "ElementName": "血量",
                        "ElementValue": 380
                    },
                    {
                        "ElementNum": 11,
                        "ElementID": "DodgeRate",
                        "ElementName": "閃避",
                        "ElementValue": -7
                    },
                    {
                        "ElementNum": 12,
                        "ElementID": "HitRate",
                        "ElementName": "命中",
                        "ElementValue": -8
                    }
                ],
                "RandomElementModels": [],
                "LimitModels": {
                    "Limit_Lv": 6,
                    "Limit_Con": 0,
                    "Limit_Str": 15,
                    "Limit_Vit": 5,
                    "Limit_Spd": 5,
                    "Limit_Int": 0
                },
                "KeyCode": "8+0xv0czUoW7SZFXkrfdVIrn0O7nqKJccrq05sj5BQbLPU48Y2uPzR7hUZN/bz30CKG1w+9HaYvr/nVx/xn1g66SGwgSEJcbGz/pcfdXeailW/m1eDnIJZ54RCakk0jpayh5lfadlFskBOg6iVHIjO01hvWeAHTPNUsWDhUyIBu02Sz74xabduVPjeW0K4xCtfWjb7u4MldLVDuy1rRkAo7OVVcisLleEkok7iaVxjQM5nV3weS25WppT0CejBHcnJc72GA30Qk/QAw2udHgsGPcCyzMJOf6myKVmSqy9vYGAvOGl+EOnGjV4j57DrKhz6Wyayhljntz2prI/vwPezq/wlamQIefmiLN9dmjlY0j+cD64cLBe8LMyi46ufi44jw36+bo78wQ37H8ahy07XOpMXhrBJG9Sbqd/ouY1zcbvaIlCTkJ5gLIYuHGRDZMOznQUPJ/2I3BwPo5wesKwoHEvkTrqeHI41P7EbzsNQuFachBZftES031hpulJsuZ4llEuHpMABBJIZec2WhxwdXgYCMjNWOY4sWtmdguF0HdR1YJn4rboaXhdWJm8v7Xs82jxwuCOtfCrrdiG/nwmq7BCVL/YLU21kCxuODqgNrWAgX8cD7bAvijiWGt37Ug2iUjWiYVMP0uRtBIOgU1LF/SPFs7jn11/yXpquo4tqwg3ekKOD3486F8gf3QtKgjdaQjFEx2sZ+bmrp6vEyY+v3MB69GX1jkL7eGpO6tEk7513uMiS79vELlpLHn8tLZquQwOesXvpJaBusOiYOO8TPBERojWvFuAms2HEBhBMp7MSMOwAY03S5pbUq6FDfVRWibGcP81rzg42hJzAlD6mcx7ncUUHx1JGJe/HtgO42t0ySK7D3tsKic6/eZnLQD85zPSd0sa3ww/M/h/7JwRYM+bpwPXFwC1VL2K9djEi96v7hMOBCrg3H5CMP8I7u197ykjEVhwfSslaCsAVJRXjZ9TxX1NQaKxdE/gU7/duCDJ37oXPPrM4lY5Yxb2/4LhpZ82jqSVxY=",
                "SoldOut": false
            },
            {
                "EquipmentPrototype_ID": 39,
                "Equipment_Name": "普通的 一階重裝",
                "EquipmentLevel_ID": 1,
                "Crystal": 1,
                "Equipment_Type": 6,
                "Equipment_Class": "Armor",
                "EquipmentType_Image": "https://apprecorder.blob.core.chinacloudapi.cn/dragonfighter/Equipment/heavy_01.png",
                "Price": 30,
                "EquipmentElement": [
                    {
                        "ElementNum": 2,
                        "ElementID": "Def",
                        "ElementName": "防禦",
                        "ElementValue": 60
                    },
                    {
                        "ElementNum": 8,
                        "ElementID": "HP",
                        "ElementName": "血量",
                        "ElementValue": 389
                    },
                    {
                        "ElementNum": 11,
                        "ElementID": "DodgeRate",
                        "ElementName": "閃避",
                        "ElementValue": -8
                    },
                    {
                        "ElementNum": 12,
                        "ElementID": "HitRate",
                        "ElementName": "命中",
                        "ElementValue": -6
                    }
                ],
                "RandomElementModels": [],
                "LimitModels": {
                    "Limit_Lv": 1,
                    "Limit_Con": 0,
                    "Limit_Str": 0,
                    "Limit_Vit": 0,
                    "Limit_Spd": 0,
                    "Limit_Int": 0
                },
                "KeyCode": "8+0xv0czUoW7SZFXkrfdVIrn0O7nqKJcfXHsMIAT7+85Hpuv/7KkMKZfUWgtZ7w/qLfJ/GWw7jg+Mw8PIBBWoRB7hexi6ruuurWvgvie218+k000vcCNW5wUNIJ7V46UMfHsvyTDHLZe3cy0tfYs2KspqGzPWbRC/sm7T06eXHFS9Vm+0DKduNrOL5WQFW3SlZQyUSdrWxlldbyTv9WguPlgA9/q+eXPdlhOY5ovjo+M8/3U3u28TZ38WzmUypQyzZOuAYNzTR6eJ2UdAAUHmwpF+LUSGvFmsbiHqFrc62nU3+mJ284Eo/Q5XgLrDD9Q1udLrSQE6GmCrAcZyeYPDZurX2WwUJYOb9zhebhW4UDmaXSEbu2Q7rCeccDGlKhzBoKI/iLJlrAzjFW6sVsnYMGvlfhQ8iaBRAB7ViziMIjXZ+5lDSPRFnxtkduHySBYy36o4lNNOlTnrmD97P7NFB43tbdB55ywSwjIsKeO8NES5U2BzzYkUG2mZNTxvKdRlqnf6ZLpQQgvjFV0Ji8rm0EzgQ6b1wsbQintJj1sf18+vqA4Ltmr+C/s6bGP3lidLaoko4ucwrt7aq+8jiEc3PlPB4yvz6+hxQuVSgm+5tN6Q7LxGoA/NS49aJ7vBI3VcTwS+mFKRNuT56U6hxtWSYqDFefX/RaaDj8brJbDu36/j//4aoorkB9kkNpkvXI2N+5Jt+4jINs6prfpq3ghwpZ3m5OyCK0ec10T6RgjiyPkxOz1Tc2Yiy1GqfIzriRA1GhvVpPAZyYSRSwgHO2TUuHxuYiz//CYXubCtqMF7vtA0+z6qF9R6n3i4OOoCBDRdlAlTYWwyy+PmTPkM+zr7Yqqz9RXir2q3Dr4KKbQEA1ekejmKXpeQfD8FQ+0pNYTy+R4blGmD6aark7H/wFmtqaKfTV6xe4VoWZDWXvfuhnf1WZUT2QWGsA1bXSvKUYcojiZzZ/ux4mOzxosho717baS1urV3cULM4F41T946czw+Bfx4UcAel3pxngFRoPf",
                "SoldOut": false
            },
            {
                "EquipmentPrototype_ID": 42,
                "Equipment_Name": "普通的 火之二階重裝",
                "EquipmentLevel_ID": 1,
                "Crystal": 5,
                "Equipment_Type": 6,
                "Equipment_Class": "Armor",
                "EquipmentType_Image": "https://apprecorder.blob.core.chinacloudapi.cn/dragonfighter/Equipment/heavy_02.png",
                "Price": 270,
                "EquipmentElement": [
                    {
                        "ElementNum": 2,
                        "ElementID": "Def",
                        "ElementName": "防禦",
                        "ElementValue": 73
                    },
                    {
                        "ElementNum": 8,
                        "ElementID": "HP",
                        "ElementName": "血量",
                        "ElementValue": 315
                    },
                    {
                        "ElementNum": 11,
                        "ElementID": "DodgeRate",
                        "ElementName": "閃避",
                        "ElementValue": -7
                    },
                    {
                        "ElementNum": 12,
                        "ElementID": "HitRate",
                        "ElementName": "命中",
                        "ElementValue": -8
                    }
                ],
                "RandomElementModels": [],
                "LimitModels": {
                    "Limit_Lv": 3,
                    "Limit_Con": 0,
                    "Limit_Str": 15,
                    "Limit_Vit": 0,
                    "Limit_Spd": 0,
                    "Limit_Int": 0
                },
                "KeyCode": "8+0xv0czUoW7SZFXkrfdVIrn0O7nqKJc20FYm4J8eLe3OoudyNX0bVA2pNov9AS0ktahsZfMIaSg6qD5SmtmOaAAEk7Rnxu9kj/y3gyREoVCurHnV2WjgOQYAQd9RfxJ0Oz+CckUieL94xip78pOiFaDdrwJj5TsCKJD0IVTIbukL0LzvJSXcr2roNOAWWlVQqY9v/UKNRpRtM21VhwRO4prU68iyo8VSNturOA2kXmZ+qVturkmXIIGRNeoahOGbH9LlzheuYSDD20t4i4fVNoEc12E6zicL300jzTRTlM+KkhBitqkk8PkJ52rIxYpM9WN5zr+Fos+jmCSF/Dk4FV2qqrn0SmAcv6JNxBQOm2g/WuZYyzdxe+1UkCPe0yxa0xqgHm3SXSXW/pg5eSOL/O/QeaQ9e4i2lwH5C6ilFvcYZjLtWqhCjgMnDxHMGp5LXAhwAwFlD9/LADMVWFHd+XbkP53i0Ejw57mFKxcKOvdn0MBV4ESGCyQf/wORjAwjz6tl1d3sU7+NDbegcsslQ0y1PdYbG2kc0CUm/egupjyVPVumXorLAFATMGgbUPR2kHx2ifFAy+0rvO4Pch4HQiTS1B9NQhaj0QZkl89aXSTvMWPqkU1so35Zv+6fj5dXSuWYYaol3+lj+V6cNIiof6CHgd1xfq+cwB35MACvdZhjVGDbLdUBAu73LoQlmk4tf5667ZjNMyakbS93ihB46syRIvu2vhXt+VIcjxuXj3Tf9UGPRTcw1hs+1j623wC5e76XtpKhS4iUPpZo1JD2Wr4MUQN3ii6t+nH1i23gVXi1Wz1fGLURuRU7jfRAgrDekws4Eyf057cOsTbj62P/F/nm3vGthbUjNFZOi4tTUQCHEErUPRBiFNTdY2hu+u6XgBKdNkokHzvsnxlIL+5llyvcyDvTB7NKMaG0cZnSc3HuQM99TbaQxYkzZxwGuO2h1SGk46GUolv5Z8PMF+bqIF285ubkt4jvVfzGM7Tk0YCEGcN08DKV4eGLtf2SbKvLPO0gMQfb8c=",
                "SoldOut": false
            }
        ];
    },
});
