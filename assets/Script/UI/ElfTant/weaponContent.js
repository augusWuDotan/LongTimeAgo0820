var self;
cc.Class({
    extends: cc.Component,

    properties: {
        //武器物件
        weaponItem: {
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
        this.defaultWeapon = this.debugData()[0];//預設第一個是正在使用的裝備
        this.GridLayout = this.node.getChildByName('GridLayout');
        this.leftArrow = this.node.getChildByName('leftArrow');
        this.rightArrow = this.node.getChildByName('rightArrow');
        if(!this.InEquipmentIndex) this.InEquipmentIndex = { 'page': 0, 'pageIndex': 0 };//裝備中 預設 page : 0 , pageIndex : 0
        this.pageCount = 6;//武器 每一頁只有6件
        this.page = Math.ceil(data.length / this.pageCount);//計算 共幾頁 //ex: 11 =>  Math.ceil(11/2 = 5.5 => 6)

        this.currentPage = 0;//現在的頁數index
        this.pageData = [];
        for (let i = 0; i < this.page; i++) {
            var weaponModel = {
                'index': i,
                'data': []
            }
            if (data[i * this.pageCount]) weaponModel.data.push(data[i * this.pageCount]);
            if (data[i * this.pageCount + 1]) weaponModel.data.push(data[i * this.pageCount + 1]);
            if (data[i * this.pageCount + 2]) weaponModel.data.push(data[i * this.pageCount + 2]);
            if (data[i * this.pageCount + 3]) weaponModel.data.push(data[i * this.pageCount + 3]);
            if (data[i * this.pageCount + 4]) weaponModel.data.push(data[i * this.pageCount + 4]);
            if (data[i * this.pageCount + 5]) weaponModel.data.push(data[i * this.pageCount + 5]);

            this.pageData.push(weaponModel);
        }
        console.log(this.pageData);

        if (this.leftArrow) this.leftArrow.active = false;//第一頁 不用左滑
        this.addItem(this.currentPage);//建立第一頁的資訊
    },

    addItem(page) {
        //
        var weaponData = this.pageData[page];
        this.GridLayout.removeAllChildren();
        var pageIndex = 0;
        weaponData.data.forEach(weapon => {
            //Equipment_Name 
            var Item = cc.instantiate(this.weaponItem);
            this.GridLayout.addChild(Item);
            Item.setPosition(cc.p(0, 0));
            //
            if (this.InEquipmentIndex.page == page && this.InEquipmentIndex.pageIndex == pageIndex) {
                Item.getComponent('GridItem').init('weapon', weapon, page, pageIndex, this.selectFuc, true);
            } else {
                Item.getComponent('GridItem').init('weapon', weapon, page, pageIndex, this.selectFuc, false);
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
        if(this.currentSelectNode){
            console.log('updadteSetting');
            var self = this;
            this.AlertTipLayer.getComponent('Alert').LeaveFunc = function () {
                self.AlertTipLayer.getComponent('Alert').LeaveFunc = null;
                self.updateValue();
            };//設定執行方法
            this.AlertTipLayer.getComponent('Alert').initErrorAlert('是否装备\n' + self.currentSelectNode.getComponent('GridItem').info.Equipment_Name + '？');
            this.AlertTipLayer.setPosition(960, 540);
        }else{
            this.AlertTipLayer.getComponent('Alert').initErrorAlert('您尚未选择武器');
            this.AlertTipLayer.setPosition(960, 540);
        }
        
    },

    //
    updateValue() {
        console.log('送出武器設定');
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
                self.AlertTipLayer.getComponent('Alert').initErrorAlert('成功装备武器');
                self.AlertTipLayer.setPosition(960, 540);
            }, 0.2);
            
        }
        this.PackLayer.goneTipLayer();
    },



    debugData() {
        return [
            {
                "EquipmentPrototype_ID": 151,
                "Equipment_Name": "普通的 水之石劍",
                "EquipmentLevel_ID": 1,
                "Crystal": 4,
                "Equipment_Type": 1,
                "Equipment_Class": "Weapon",
                "EquipmentType_Image": "https://apprecorder.blob.core.chinacloudapi.cn/dragonfighter/Equipment/sword1_2.png",
                "Price": 270,
                "EquipmentElement": [
                    {
                        "ElementNum": 1,
                        "ElementID": "Atk",
                        "ElementName": "攻擊",
                        "ElementValue": 40
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
                "KeyCode": "8+0xv0czUoW7SZFXkrfdVIrn0O7nqKJcPYBTjXxNpc56Km2yNdOBTMyvmYb15kIwxfp/pepDxQ2jmlIqUmA6udnOXFe47/kjCntJs1EbyrFN28D4OIJ31XqBLP4hwHIPgSJEyRaTE+wj4mJKgUUctNfcQnbK7mXZ94HTBsD7n/eoWLlKZrNNWOmaBFfeCu/F6wEaUKDqEyC4dbt3kqSlY9nP5rkkJFMILYWD3uC+g3iGHEWFqsYz52NjDq27aVROBT3LIvJO4yfeddAMRGQdDxwuTS8hbsUh+l74qNI8FMeEt0K+sDjEMUec2PgMyBKU6eVlHbwvR8AksaayQ0Dqwwe8nMzTpWRsaU0aBK4pAlVYZT+iZIrmFW7LM7MZmI+nV7nqXSDZyIJJtbS/lpUkftczCKraE4q5RG4vVjGrX1B8cyA02JHesJBZVQpGlybthvjpW8kBnAJmQoXsT8aXR+dymhYCfdRaGnnWxuThY9a1XgAaaUeteCZNfXTGdzOp14IBn3pwVIaBCtqHoxoO5ewO8DMIXYhDN7pw2dTSm7S11tx6qDtw+1fV8/geiK1/v5qzEv9ds+F/t61ckzw6wF1Ej4OQHjJx+4+VlsiJKYPTghbIfPwOo8P1cOLTvnkdyGAQEKZkLY4+vJjKUQzWupnJtG1Y5G3r8WIQ0iks1Uv2zYK//IV5DeidfhYlAIAt",
                "SoldOut": false
            },
            {
                "EquipmentPrototype_ID": 151,
                "Equipment_Name": "普通的 火之石劍",
                "EquipmentLevel_ID": 1,
                "Crystal": 5,
                "Equipment_Type": 1,
                "Equipment_Class": "Weapon",
                "EquipmentType_Image": "https://apprecorder.blob.core.chinacloudapi.cn/dragonfighter/Equipment/sword1_2.png",
                "Price": 270,
                "EquipmentElement": [
                    {
                        "ElementNum": 1,
                        "ElementID": "Atk",
                        "ElementName": "攻擊",
                        "ElementValue": 36
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
                "KeyCode": "8+0xv0czUoW7SZFXkrfdVIrn0O7nqKJcPYBTjXxNpc56Km2yNdOBTMyvmYb15kIwxfp/pepDxQ1TxizvNLSud87SerfMbK9/sKgIvvD4tiWFB1vRKIWZJ7ksBbjSmfiuv5Yb0+p2xp/qkkk24vju9XUWerYeueawQ6CxhZUMimI1xUwyQAn4D7T2De2ZhI4jSxvgWvvDH81UDApL8026vpr+G8vU5kdW6SnHxSEayvxEnOnh/77jJ8MYREwVSDyAIl2hK5Nnxi9rHSPdpNrCYBZTZwGSO6R0KhJ5PfjQKa6UKqjsdLBOWNk5pUsgnA0tyhBPj8bfoOklsog7D+gQUwW0eDGqtDsA0huW8Ziabx53H9ifIy6qKZxf1T4TWJ3z8wu7BXHsP3Yem5T+RfA2jmQS8M6RbW5U4t8l7aBYFbuJLttEynD0T91+bKoZmt6AjRB5hUyCaWc1uI7VoRI2qSLQwmvpcs82sn9QQOTejRsQGlSbgDZzGYUDhtfDUKi2Pt/hAJcAK6uuxmfftcu2X4L9mk4XhB5YYJFtjDb+Blfl6TSHeQHSzTHnJvkINQvvXqQo7YfbubBRyBoP1EvHzeRm/SKwJIG0KOzJUCyMcFZgUjD3WqSBr1u45gJ6AJUxTbTsdjEhNLa9Dv+iwWfqOT6XeXgCc+56p9d6OudOwDScrQQ3eM8u5LuoeSfq8JsB",
                "SoldOut": false
            },
            {
                "EquipmentPrototype_ID": 70,
                "Equipment_Name": "普通的 騎士劍",
                "EquipmentLevel_ID": 1,
                "Crystal": 1,
                "Equipment_Type": 1,
                "Equipment_Class": "Weapon",
                "EquipmentType_Image": "https://apprecorder.blob.core.chinacloudapi.cn/dragonfighter/Equipment/sword1_3.png",
                "Price": 1080,
                "EquipmentElement": [
                    {
                        "ElementNum": 1,
                        "ElementID": "Atk",
                        "ElementName": "攻擊",
                        "ElementValue": 39
                    },
                    {
                        "ElementNum": 12,
                        "ElementID": "HitRate",
                        "ElementName": "命中",
                        "ElementValue": 1
                    }
                ],
                "RandomElementModels": [],
                "LimitModels": {
                    "Limit_Lv": 6,
                    "Limit_Con": 5,
                    "Limit_Str": 15,
                    "Limit_Vit": 0,
                    "Limit_Spd": 5,
                    "Limit_Int": 0
                },
                "KeyCode": "8+0xv0czUoW7SZFXkrfdVIrn0O7nqKJc7aQIVceZjy1BOS838ycC0ht0lohGhsd44nZOHLrXlddVGzhAKsHDet3ZeLxEG2EQ3YT+tfuUmrhqO1K8IW6hdX276j+Oz2STuA14VPHdc+uRCZ5WLp45KY4i7ibk4Lf9YeIegXWgwN3t0c+856YqOgQGHHpPzalEj83dMOMvenwDsj+o8le12/VmxY5T4SrF4q6hJvZ9tJt9mz0OFc+hOrP11x+KvwE1AlDbOfJ9kDf36jHZyQbP4ZM/lHILvK5/lxUblXvL+E9o4DUyP4y9mOtFx8ZypP13DUrdT/83X/vHq1Zz39aCXsJhf4mnxX2/XQHa6Lazj+NZpjExJr/ioL89hvwQMXUt1pjzDVRztpQRaQbEruS3ZBovZ8XP679lxpy8ertbnASMWvZqwCbQr801HpVUFWT3aurt8gLuElFKfDcXTXdVspVs13uwJfHSEINIokKLHtkfZ9qn+BcvHOdSe57VpLLYq4dVdTb50zJvqc9Hxi68erGH6z2RMpC5++r9uxE9MvzLO7FkjoTIQb8aMZnYtqrj9D+hXlFjRO9CF0Utx6724MVZ4+8LY27fmiDZOrtB5rK8PdqSZajKjxguY0LbtFMKUCI+EUAigqSNnY0mMKtuhUwdGRV+LFt2xwtnpMyW0OdsjWQtV6fPYGJF+zk4+bVQXEgeZG9Q8lrMYEqIv+TxuX7KQ8XlhP3R7zXPWdJ3zkAy8KGqX94+fYwSB1XzsAa0opWpioM7RhDDO7GfoCzqiisExDHaWFckWHYpe7AeKxA=",
                "SoldOut": false
            },
            {
                "EquipmentPrototype_ID": 70,
                "Equipment_Name": "精良的 騎士劍",
                "EquipmentLevel_ID": 2,
                "Crystal": 1,
                "Equipment_Type": 1,
                "Equipment_Class": "Weapon",
                "EquipmentType_Image": "https://apprecorder.blob.core.chinacloudapi.cn/dragonfighter/Equipment/sword1_3.png",
                "Price": 2160,
                "EquipmentElement": [
                    {
                        "ElementNum": 1,
                        "ElementID": "Atk",
                        "ElementName": "攻擊",
                        "ElementValue": 50
                    },
                    {
                        "ElementNum": 12,
                        "ElementID": "HitRate",
                        "ElementName": "命中",
                        "ElementValue": 1
                    }
                ],
                "RandomElementModels": [
                    {
                        "ElementNum": 8,
                        "ElementID": "HP",
                        "ElementName": "血量",
                        "ElementValue": 65
                    },
                    {
                        "ElementNum": 5,
                        "ElementID": "Res",
                        "ElementName": "恢復",
                        "ElementValue": 1
                    }
                ],
                "LimitModels": {
                    "Limit_Lv": 6,
                    "Limit_Con": 5,
                    "Limit_Str": 15,
                    "Limit_Vit": 0,
                    "Limit_Spd": 5,
                    "Limit_Int": 0
                },
                "KeyCode": "8+0xv0czUoW7SZFXkrfdVIrn0O7nqKJc7aQIVceZjy1BOS838ycC0jHYOYqGyWwzZeNhx3Ferve8JCskl+rqozQsCTrEWqrouPPeW+opil6JlPPKaxFA9+Q2ZSxgZLtksJHBOWQiVndX3YLICwmQ6oYWm860lNH0y8avFosZfyjO8Fd/zOnZiZg2tozDId36gPGNxZKjbhnHe83louI5cpdKwz6lSUPBzcenz8SJ+bhU9DpB/v55nktli5rA46/qAuk51VeAw93CjAgim71UIPSC7HyttDlEXq94M+Xd1lgPb7efH1KSQbwDB39tLoYUFxzX29wzZJOM2QJa/cc2U9JzV4vM5oWnEviXWxDJMD22cgdjDnCe6BbK6aT7P8eCn/b6CZ3kAPSTrEp5iskUZg/P+FIHsTGC3MgEkawAK2RgdErWfMOrsyCRXe3kRCOIU8DWjuhDD192846bzD/zrLRUvo3vqniUndJjEr2h0n2mgRXr5mj/P6sXdxxXkgFMJLLIFxZABYfg4zR5ig039cdVJ4mmv0M5K+l4iHAsjsepTkeeYZltTqoqd/Qi+epuN2yfMu9aXEfuU1VPPWEwuIEUALX7e7ahUjhS/JU6Ywpd0sHGRXx5F3ifdKKhYmW4uaIx+7qtnT8vY8Pu4I4BxmD/QpHMezMYBRCvEScbvB0+129pmuwgOdC1gIbJqKCNNHOO0FLNNKKUGnwvRNnkY6BxVHPbi4Vbmn0QPp+Dx/ZDrKVQaQYll/x9pb0WGKK3AgXM9VyQdfYkhAyS2gUQcBwY7mPP2RbWzF9nbWgj+3/AXKzIzYjzmtKfU2M7ZtL8sb00LAGM9Qim7P7/AZrAENwFJluW7okV4lQOvB1Y6fTUPfOP7pWFqfBcXGdXGA7fN63ag5NnuCzVG+35u+lRmvMkoBxSk/uhbHwuT3uIOLsMzNf8PJdH3UC7oc55YhHk8fwSPfqxKsYMZOVLj+WorD92VznbTvxjiCdUgj9JuTo=",
                "SoldOut": false
            },
            {
                "EquipmentPrototype_ID": 151,
                "Equipment_Name": "普通的 水之石劍",
                "EquipmentLevel_ID": 1,
                "Crystal": 4,
                "Equipment_Type": 1,
                "Equipment_Class": "Weapon",
                "EquipmentType_Image": "https://apprecorder.blob.core.chinacloudapi.cn/dragonfighter/Equipment/sword1_2.png",
                "Price": 270,
                "EquipmentElement": [
                    {
                        "ElementNum": 1,
                        "ElementID": "Atk",
                        "ElementName": "攻擊",
                        "ElementValue": 33
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
                "KeyCode": "8+0xv0czUoW7SZFXkrfdVIrn0O7nqKJcPYBTjXxNpc56Km2yNdOBTMyvmYb15kIwxfp/pepDxQ2jmlIqUmA6udnOXFe47/kjCntJs1EbyrFN28D4OIJ31XqBLP4hwHIPgSJEyRaTE+wj4mJKgUUctNfcQnbK7mXZ94HTBsD7n/eoWLlKZrNNWOmaBFfeCu/F6wEaUKDqEyC4dbt3kqSlY9nP5rkkJFMILYWD3uC+g3iGHEWFqsYz52NjDq27aVROBT3LIvJO4yfeddAMRGQdDxwuTS8hbsUh+l74qNI8FMeEt0K+sDjEMUec2PgMyBKU6eVlHbwvR8AksaayQ0Dqwwe8nMzTpWRsaU0aBK4pAlVYZT+iZIrmFW7LM7MZmI+nV7nqXSDZyIJJtbS/lpUkftczCKraE4q5RG4vVjGrX1B8cyA02JHesJBZVQpGlybthvjpW8kBnAJmQoXsT8aXR+dymhYCfdRafVR4eqU8CJBvAMI0AY2ib491MJUeNzouej1467w5zTD/KHVO5Na1n7zt9RhNvPBNoyrSWvEfRqe1Gp1/A8iMwj6jzqaZsLGUmtUM32uOzkHL6R882x9yjV4SHoNRsxocLfH1r1JxqW6hYU1NQadNcJDgpraDXW/MwALIYOp2RWwtDKaj2ocbXyYAPRB5IG5W6cob0AB2+CP4HVipEAYW5uuTd3vqRKpn",
                "SoldOut": false
            },
            {
                "EquipmentPrototype_ID": 151,
                "Equipment_Name": "普通的 金之石劍",
                "EquipmentLevel_ID": 1,
                "Crystal": 2,
                "Equipment_Type": 1,
                "Equipment_Class": "Weapon",
                "EquipmentType_Image": "https://apprecorder.blob.core.chinacloudapi.cn/dragonfighter/Equipment/sword1_2.png",
                "Price": 270,
                "EquipmentElement": [
                    {
                        "ElementNum": 1,
                        "ElementID": "Atk",
                        "ElementName": "攻擊",
                        "ElementValue": 27
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
                "KeyCode": "8+0xv0czUoW7SZFXkrfdVIrn0O7nqKJcPYBTjXxNpc56Km2yNdOBTMyvmYb15kIwxfp/pepDxQ3zi16OOI9kT2H8WHdtyE5mqR9e5+MjTTyVp8+k0DU6L7SnxQAZu9Y/NBSBa3q14C5WoJmihMzEfJcqh+jYMXUDpuO6N0JC77wNfO2iXHLWx5ufP7j4PBbZziL/DQKlEdhAwDMegV5ddC+uQF3RXu6Kaa757qF9FcP6z2JD6nRETGzKE481vTfM0r8NuUqgKVfPiNFFL7c8OLwe886z2+56ux7pgKKHZ24iwhRVGUgrW45fvuUmTn3y74dMaZgRl69t84QVCV97TufltzfGuHwU3O5scRxg5FGQ1SL3lMW6+PMRc/U9q4U2lP2Xz8Ni6eAkra5onJFag1glTRjI4wh/KwSDTPOELiqZh5bA9dIXdZnoq9s9cCxto863f3Y6nC2XHewhrz43mC0CwAWNPlBrPHjND+uWIm8cVIqq+zB/fU7Gg+Wn+213AJHPMuESqMBmIiDqmaDbmf8FMcGxFWzBnt98NUmDWG+XsPoBF6Efh0GDgzEQHTd36VD4ZRIGVaNeoK8rJju+eYg3uybNwWv9bGx97Y/CIUS41x+AVzS8yhB7ps9VQZp6npq9HWdqo9DgB1qpiDHzFudyEAHrIEccXaoJd7t6Q4Sgtt7dVQ+gczQjJH0ZYScN",
                "SoldOut": false
            },
            {
                "EquipmentPrototype_ID": 66,
                "Equipment_Name": "普通的 防身木劍",
                "EquipmentLevel_ID": 1,
                "Crystal": 1,
                "Equipment_Type": 1,
                "Equipment_Class": "Weapon",
                "EquipmentType_Image": "https://apprecorder.blob.core.chinacloudapi.cn/dragonfighter/Equipment/sword1_1.png",
                "Price": 30,
                "EquipmentElement": [
                    {
                        "ElementNum": 1,
                        "ElementID": "Atk",
                        "ElementName": "攻擊",
                        "ElementValue": 32
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
                "KeyCode": "8+0xv0czUoW7SZFXkrfdVIrn0O7nqKJcOVwZQSRZbRKZUhUWSbOkEjfJqZTnSnlUdQ7yTex38h0g90AMtKCJPahPaVyz8iYVqHnpvW39geIwD4TZ9E2mdXaeu2vfVoXde2GXlnnCiCKKJKg65LuTH5RVOW2ubKysdZZXes4FFEKGvefSl7LuErYhQojOnbqm/8Mvd/fECvdcU3yTgL9ebxzF0FiSrbxseHivpv/38lSzI+J5VVdnjjlgDVYHKY9NdC5kI4/KYWibvocT+DzXUmX/oLRJhg0WTCyNKO4gtm9br8KQSVFEBlNJnA926S4/Xtlhot1Xufn/snIlA3gRYkgyC6rhoAaVUKnTO1Mu5CL1DW1ZBot/MTWa78I4NWjAyVh568R90QoID9qY1u6oRq1MbaHUulwOZb6KCa7L8rHaWTbNfsgzc46/nA9HFA4AWVFeNMhRBZ4PCz3wGOyN+yqbZerfJZZ4dl8gdmKG12sSCZ+ukOM4wKZWZezKy+dz8Y9KM7Z5qh2aqDDx9xLA2jiSUpIoY3hJHJb+TWq5yzYmKIG/TIxE2JYqNEXl6F4Rd1K3BPowfpCPL7HgoJtO2Y8h3pCBL8hDG8m8tYFuZlr34e/SMgBSejen6mdy2AhA+2IU0AwuPbDz+Tw2Gt1WoI9xL+y4NJJhnfKbJUgK+ObBK07142Hlel9Qcv/ACzE4",
                "SoldOut": false
            },
            {
                "EquipmentPrototype_ID": 151,
                "Equipment_Name": "普通的 石劍",
                "EquipmentLevel_ID": 1,
                "Crystal": 1,
                "Equipment_Type": 1,
                "Equipment_Class": "Weapon",
                "EquipmentType_Image": "https://apprecorder.blob.core.chinacloudapi.cn/dragonfighter/Equipment/sword1_2.png",
                "Price": 270,
                "EquipmentElement": [
                    {
                        "ElementNum": 1,
                        "ElementID": "Atk",
                        "ElementName": "攻擊",
                        "ElementValue": 42
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
                "KeyCode": "8+0xv0czUoW7SZFXkrfdVIrn0O7nqKJcPYBTjXxNpc56Km2yNdOBTMyvmYb15kIwxfp/pepDxQ2LKbmUl4J/XoPLWYejPPBSEkmrdptKFSHJLflnBdiwViOpgWhOvtQumK4nHFo6RAZjZwf584Dd7Nj4pvmh4t+cxlArwAf4/SMXbFKxHW+02EhWU7zAUsvPn4MIQCGpPZAU32voP6X91F2GqLBcS/LIADvDhw2DDl5f3gyWk6bWx3Y7cBLKTEIs7dCWiuRnornYbEV3NtBd7R235UceMUuQrit3qCBXWhtC76che5v0ykooV8MjGCMrglwnlPt5qXs1CKDgTmQY+YB/kaK2H3V8YjVKKL4jCsJKFdp1j0z0ebDQBYzperlepOgM7CKjfpBWrQsu5wfx85CQHE82S2CPQayORh+H5Ax8ToNxGaJRZhLSbB/F6dbIb7ONRULTh6SgyJRXb1xzkaIWRJMGR4gaOVX4T4F4Z7VDtK+RAV4bXS+EyzCS8aZRpVQytRcfTXIqQDic714SyyLJUw4M507K1sb5q1Smkz15B3q+FmZXul7VFvHX8CENYJMgzc79rPMXwY/jg82XAkWcnps+cugQ5MeM9cVsmd3XiNqxZSk3USqA6LS+YCtID7aNBMO+pGa2J8zUcV6qzifjWwUXvgkH1xBv8k6QyvuHbz5QcVZ66g==",
                "SoldOut": false
            }
        ];
    },
});
