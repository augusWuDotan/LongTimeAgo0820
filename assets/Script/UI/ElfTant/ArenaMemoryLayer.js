var self;
cc.Class({
    extends: cc.Component,

    properties: {
        //
        memoryItem: {
            default: null,
            type: cc.Prefab
        },
        TopicItem: {
            default: null,
            type: cc.Prefab
        },
        //
        Content: {
            default: null,
            type: cc.Node
        },
        //
        ChoiceItem: {
            default: null,
            url: cc.AudioClip
        },
        store_buy: {
            default: null,
            url: cc.AudioClip
        },

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() { 
        self = this;
    },

    start() {
        var self = this;
        for (var i = 0; i < 12; i++) {
            var item = cc.instantiate(this.memoryItem);
            this.Content.addChild(item);
            item.setPosition(cc.p(0, 0));
            item._tag = i;
            //

            var clickEventHandler = new cc.Component.EventHandler();
            clickEventHandler.target = self.node; //这个 node 节点是你的事件处理代码组件所属的节点
            clickEventHandler.component = "ArenaMemoryLayer";//这个是代码文件名
            clickEventHandler.handler = "itemClick";
            clickEventHandler.customEventData = "test";

            var detail_btn = item.getChildByName('detail_btn');
            var button = detail_btn.addComponent(cc.Button);
            button.transition = cc.Button.Transition.SCALE;
            button.duration = 0.1;
            button.zoomScale = 0.8;
            button.clickEvents.push(clickEventHandler);
        }
    },

    //
    itemClick(event, customEventData) {
        console.log(event.target._parent._tag);
        console.log(customEventData);

        //todo 進入 競技紀錄 
        this.goMemoryDetail();
    },

    back() {
        this.node.setPosition(cc.p(0, -1080));
        this.node.active = false;
        this.node._parent.getChildByName('ElfTantLayer').setPosition(cc.p(0, 0));
    },

    goMemoryDetail() {
        this.node.getChildByName('MemoryDetailLayer').active = true;
        this.node.getChildByName('ArenaMemory').active = false;
        this.node.getChildByName('Elfin').active = false;
        this.node.getChildByName('back').active = false;

        //
        this.TopicItemNodes = [];
        this.selectItemNodeIndex = -1;
        this.memoryDetail = this.debugData();
        this.AddTopicBoardControl(this.memoryDetail);
        this.addTopicItem(this.memoryDetail);

    },

    backMemoryDetail() {
        //
        if(self.TopicItemNodes){
            self.TopicItemNodes.forEach(child => {
                self.node.getChildByName('MemoryDetailLayer').removeChild(child);
            });
        }
        this.TopicItemNodes = [];
        this.selectItemNodeIndex = -1;
        this.memoryDetail = null;
        //
        this.node.getChildByName('ArenaMemory').active = true;
        this.node.getChildByName('Elfin').active = true;
        this.node.getChildByName('back').active = true;
        this.node.getChildByName('MemoryDetailLayer').active = false;

    },

    //加入題目 選擇bar
    addTopicItem() {
        console.log('addTopicItem');
        var index = 0;
        this.memoryDetail.forEach(subject => {

            var Item = cc.instantiate(self.TopicItem);
            Item.setPosition(self.setItemPosition(Item, index, self.memoryDetail.length));//設定座標
            Item.getComponent('TopicTabItem').init(self.TopicCallback, index, subject.Permission);
            self.node.getChildByName('MemoryDetailLayer').addChild(Item);
            self.TopicItemNodes.push(Item);

            index++;
        });

        //預設第一個 
        var currentP = this.TopicItemNodes[0].getPosition();
        this.TopicItemNodes[0].setPosition(cc.p(currentP.x, currentP.y - 25));
        this.TopicItemNodes[0].scale = 1.3;
        self.selectItemNodeIndex = 0;
    },

    //設定點擊回傳
    TopicCallback(index) {
        console.log(index);
        //重置選到的目標
        if (self.selectItemNodeIndex !== -1) {
            let curP = self.TopicItemNodes[self.selectItemNodeIndex].getPosition();
            self.TopicItemNodes[self.selectItemNodeIndex].setPosition(cc.p(curP.x, curP.y + 25));
            self.TopicItemNodes[self.selectItemNodeIndex].scale = 1;
        }
        //
        let selectP = self.TopicItemNodes[index].getPosition();
        self.TopicItemNodes[index].setPosition(cc.p(selectP.x, selectP.y - 25));
        self.selectItemNodeIndex = index;
        //
        if (self.ChoiceItem) cc.audioEngine.playEffect(self.ChoiceItem, false, 1);
        self.TopicShowControl.ChoiceTopic(index);
    },

    //設定座標
    setItemPosition(ItemNode, index, length) {
        // console.log('index :' + index);
        // console.log('length :' + length);
        //20 = 距離左邊長
        //space = 10
        var leftRightSpace = 20;//預設
        var space = (self.node.width - (leftRightSpace * 2) - (ItemNode.width * 15)) / 14;//求出節點與節點之間的距離
        leftRightSpace = (self.node.width - ItemNode.width * length - space * (length - 1)) / 2;//重新計算兩邊的邊距離
        var Ranx = (0 - (self.node.width / 2) + leftRightSpace + (space * index) + (ItemNode.width * (index + 0.5)));//x
        var RanY = (self.node.height / 2) - (ItemNode.width) + 25;//y
        // console.log('space :' + space);
        // console.log('leftRightSpace :' + leftRightSpace);
        // console.log('Ranx :' + Ranx);
        // console.log('RanY :' + RanY);
        return cc.p(Ranx, RanY);
    },

    //新增題版管理
    AddTopicBoardControl(SubjectData) {
        console.log('AddTopicBoardControl');
        this.TopicShowControl = this.node.getChildByName('MemoryDetailLayer').getChildByName('ShowTopicLayer').getComponent('TopicShowControl');
        if (this.TopicShowControl) {
            console.log('this.TopicShowControl init');
            //題目列表、index、是否自動答題、是否展示用
            this.TopicShowControl.init(SubjectData, 0, false, true);
        }
    },


    // update (dt) {},

    //測試用
    debugData() {
        return [
            {
                "Select_Option_ID": 3016,
                "Answer_Time": 2292,
                "Permission": false,
                "Subject": {
                    "UseTime": 2147483647,
                    "Subject_ID": 1172,
                    "Template_Name": "CH1",
                    "SubjectType_Name": "聽音檔選圖",
                    "QuestionData": {
                        "QuestionTopicContent": "",
                        "QuestionTopicPhoto": "",
                        "QuestionTopicVoicePath": "https://apprecorder.blob.core.chinacloudapi.cn/file-manager/audio/11340.mp3"
                    },
                    "OptionData": [
                        {
                            "Option_ID": 3015,
                            "PhotoPath": "https://apprecorder.blob.core.chinacloudapi.cn/file-manager/image/11328.png",
                            "OptionContent": "",
                            "isCorrect": false
                        },
                        {
                            "Option_ID": 3014,
                            "PhotoPath": "https://apprecorder.blob.core.chinacloudapi.cn/file-manager/image/11329.png",
                            "OptionContent": "",
                            "isCorrect": true
                        },
                        {
                            "Option_ID": 3016,
                            "PhotoPath": "https://apprecorder.blob.core.chinacloudapi.cn/file-manager/image/11331.png",
                            "OptionContent": "",
                            "isCorrect": false
                        }
                    ]
                }
            },
            {
                "Select_Option_ID": 2747,
                "Answer_Time": 2316,
                "Permission": true,
                "Subject": {
                    "UseTime": 2147483647,
                    "Subject_ID": 1059,
                    "Template_Name": "CH9",
                    "SubjectType_Name": "看句子看圖選OX",
                    "QuestionData": {
                        "QuestionTopicContent": "Look at my schoolbag.",
                        "QuestionTopicPhoto": "",
                        "QuestionTopicVoicePath": ""
                    },
                    "OptionData": [
                        {
                            "Option_ID": 2747,
                            "PhotoPath": "https://apprecorder.blob.core.chinacloudapi.cn/file-manager/image/5.png",
                            "OptionContent": "",
                            "isCorrect": true
                        },
                        {
                            "Option_ID": 2748,
                            "PhotoPath": "https://apprecorder.blob.core.chinacloudapi.cn/file-manager/image/6.png",
                            "OptionContent": "",
                            "isCorrect": false
                        }
                    ]
                }
            },
            {
                "Select_Option_ID": 2639,
                "Answer_Time": 4606,
                "Permission": true,
                "Subject": {
                    "UseTime": 2147483647,
                    "Subject_ID": 1013,
                    "Template_Name": "CH4",
                    "SubjectType_Name": "聽音檔選句子",
                    "QuestionData": {
                        "QuestionTopicContent": "",
                        "QuestionTopicPhoto": "",
                        "QuestionTopicVoicePath": "https://apprecorder.blob.core.chinacloudapi.cn/file-manager/audio/11267.mp3"
                    },
                    "OptionData": [
                        {
                            "Option_ID": 2641,
                            "PhotoPath": "",
                            "OptionContent": "Touch your schoolbag.",
                            "isCorrect": false
                        },
                        {
                            "Option_ID": 2639,
                            "PhotoPath": "",
                            "OptionContent": "Touch your ear.",
                            "isCorrect": true
                        },
                        {
                            "Option_ID": 2640,
                            "PhotoPath": "",
                            "OptionContent": "Touch your eye.",
                            "isCorrect": false
                        }
                    ]
                }
            },
            {
                "Select_Option_ID": 3024,
                "Answer_Time": 1499,
                "Permission": false,
                "Subject": {
                    "UseTime": 2147483647,
                    "Subject_ID": 1175,
                    "Template_Name": "CH1",
                    "SubjectType_Name": "聽音檔選圖",
                    "QuestionData": {
                        "QuestionTopicContent": "",
                        "QuestionTopicPhoto": "",
                        "QuestionTopicVoicePath": "https://apprecorder.blob.core.chinacloudapi.cn/file-manager/audio/11343.mp3"
                    },
                    "OptionData": [
                        {
                            "Option_ID": 3023,
                            "PhotoPath": "https://apprecorder.blob.core.chinacloudapi.cn/file-manager/image/11331.png",
                            "OptionContent": "",
                            "isCorrect": true
                        },
                        {
                            "Option_ID": 3024,
                            "PhotoPath": "https://apprecorder.blob.core.chinacloudapi.cn/file-manager/image/11333.png",
                            "OptionContent": "",
                            "isCorrect": false
                        },
                        {
                            "Option_ID": 3025,
                            "PhotoPath": "https://apprecorder.blob.core.chinacloudapi.cn/file-manager/image/11329.png",
                            "OptionContent": "",
                            "isCorrect": false
                        }
                    ]
                }
            },
            {
                "Select_Option_ID": 2645,
                "Answer_Time": 4571,
                "Permission": true,
                "Subject": {
                    "UseTime": 2147483647,
                    "Subject_ID": 1015,
                    "Template_Name": "CH6",
                    "SubjectType_Name": "看圖看句子選克漏字",
                    "QuestionData": {
                        "QuestionTopicContent": " Touch your _.",
                        "QuestionTopicPhoto": "",
                        "QuestionTopicVoicePath": ""
                    },
                    "OptionData": [
                        {
                            "Option_ID": 2645,
                            "PhotoPath": "",
                            "OptionContent": " Touch your ruler.",
                            "isCorrect": true
                        },
                        {
                            "Option_ID": 2647,
                            "PhotoPath": "",
                            "OptionContent": " Touch your dog.",
                            "isCorrect": false
                        },
                        {
                            "Option_ID": 2646,
                            "PhotoPath": "",
                            "OptionContent": " Touch your mouth.",
                            "isCorrect": false
                        }
                    ]
                }
            },
            {
                "Select_Option_ID": 544,
                "Answer_Time": 4978,
                "Permission": false,
                "Subject": {
                    "UseTime": 2147483647,
                    "Subject_ID": 224,
                    "Template_Name": "CH3",
                    "SubjectType_Name": "看圖選單字",
                    "QuestionData": {
                        "QuestionTopicContent": "",
                        "QuestionTopicPhoto": "https://apprecorder.blob.core.chinacloudapi.cn/file-manager/image/",
                        "QuestionTopicVoicePath": ""
                    },
                    "OptionData": [
                        {
                            "Option_ID": 544,
                            "PhotoPath": "",
                            "OptionContent": "hand",
                            "isCorrect": false
                        },
                        {
                            "Option_ID": 545,
                            "PhotoPath": "",
                            "OptionContent": "eraser",
                            "isCorrect": false
                        },
                        {
                            "Option_ID": 543,
                            "PhotoPath": "",
                            "OptionContent": "ear",
                            "isCorrect": true
                        }
                    ]
                }
            },
            {
                "Select_Option_ID": 2757,
                "Answer_Time": 1864,
                "Permission": true,
                "Subject": {
                    "UseTime": 2147483647,
                    "Subject_ID": 1064,
                    "Template_Name": "CH3",
                    "SubjectType_Name": "看圖選句子",
                    "QuestionData": {
                        "QuestionTopicContent": "",
                        "QuestionTopicPhoto": "https://apprecorder.blob.core.chinacloudapi.cn/file-manager/image/",
                        "QuestionTopicVoicePath": ""
                    },
                    "OptionData": [
                        {
                            "Option_ID": 2757,
                            "PhotoPath": "",
                            "OptionContent": "I have two eyes.",
                            "isCorrect": true
                        },
                        {
                            "Option_ID": 2759,
                            "PhotoPath": "",
                            "OptionContent": "I have an apple.",
                            "isCorrect": false
                        },
                        {
                            "Option_ID": 2758,
                            "PhotoPath": "",
                            "OptionContent": "I have a mouth.",
                            "isCorrect": false
                        }
                    ]
                }
            },
            {
                "Select_Option_ID": 2643,
                "Answer_Time": 1973,
                "Permission": false,
                "Subject": {
                    "UseTime": 2147483647,
                    "Subject_ID": 1014,
                    "Template_Name": "CH5",
                    "SubjectType_Name": "聽音檔看句子選克漏字",
                    "QuestionData": {
                        "QuestionTopicContent": "Touch your _.",
                        "QuestionTopicPhoto": "",
                        "QuestionTopicVoicePath": ""
                    },
                    "OptionData": [
                        {
                            "Option_ID": 2643,
                            "PhotoPath": "",
                            "OptionContent": "Touch your pencil.",
                            "isCorrect": false
                        },
                        {
                            "Option_ID": 2642,
                            "PhotoPath": "",
                            "OptionContent": "Touch your nose.",
                            "isCorrect": true
                        },
                        {
                            "Option_ID": 2644,
                            "PhotoPath": "",
                            "OptionContent": "Touch your book.",
                            "isCorrect": false
                        }
                    ]
                }
            },
            {
                "Select_Option_ID": 1439,
                "Answer_Time": 1061,
                "Permission": true,
                "Subject": {
                    "UseTime": 2147483647,
                    "Subject_ID": 552,
                    "Template_Name": "CH5",
                    "SubjectType_Name": "聽音檔看句子選克漏字",
                    "QuestionData": {
                        "QuestionTopicContent": "sister",
                        "QuestionTopicPhoto": "",
                        "QuestionTopicVoicePath": ""
                    },
                    "OptionData": [
                        {
                            "Option_ID": 1440,
                            "PhotoPath": "",
                            "OptionContent": "That is my sister",
                            "isCorrect": false
                        },
                        {
                            "Option_ID": 1439,
                            "PhotoPath": "",
                            "OptionContent": "This is my sister.",
                            "isCorrect": true
                        },
                        {
                            "Option_ID": 1441,
                            "PhotoPath": "",
                            "OptionContent": "They are my sisters.",
                            "isCorrect": false
                        }
                    ]
                }
            },
            {
                "Select_Option_ID": 1428,
                "Answer_Time": 4303,
                "Permission": true,
                "Subject": {
                    "UseTime": 2147483647,
                    "Subject_ID": 548,
                    "Template_Name": "CH2",
                    "SubjectType_Name": "看字選圖",
                    "QuestionData": {
                        "QuestionTopicContent": "This is my mother.",
                        "QuestionTopicPhoto": "",
                        "QuestionTopicVoicePath": ""
                    },
                    "OptionData": [
                        {
                            "Option_ID": 1429,
                            "PhotoPath": "https://apprecorder.blob.core.chinacloudapi.cn/file-manager/image/11328.png",
                            "OptionContent": "",
                            "isCorrect": false
                        },
                        {
                            "Option_ID": 1430,
                            "PhotoPath": "https://apprecorder.blob.core.chinacloudapi.cn/file-manager/image/11330.png",
                            "OptionContent": "",
                            "isCorrect": false
                        },
                        {
                            "Option_ID": 1428,
                            "PhotoPath": "https://apprecorder.blob.core.chinacloudapi.cn/file-manager/image/11329.png",
                            "OptionContent": "",
                            "isCorrect": true
                        }
                    ]
                }
            },
            {
                "Select_Option_ID": 2756,
                "Answer_Time": 1039,
                "Permission": true,
                "Subject": {
                    "UseTime": 2147483647,
                    "Subject_ID": 1063,
                    "Template_Name": "CH9",
                    "SubjectType_Name": "看句子看圖選OX",
                    "QuestionData": {
                        "QuestionTopicContent": "I have a mouth.",
                        "Ques tionTopicPhoto": "",
                        "QuestionTopicVoicePath": ""
                    },
                    "OptionData": [
                        {
                            "Option_ID": 2756,
                            "PhotoPath": "https://apprecorder.blob.core.chinacloudapi.cn/file-manager/image/6.png",
                            "OptionContent": "",
                            "isCorrect": true
                        },
                        {
                            "Option_ID": 2755,
                            "PhotoPath": "https://apprecorder.blob.core.chinacloudapi.cn/file-manager/image/5.png",
                            "OptionContent": "",
                            "isCorrect": false
                        }
                    ]
                }
            },
            {
                "Select_Option_ID": 1454,
                "Answer_Time": 3479,
                "Permission": true,
                "Subject": {
                    "UseTime": 2147483647,
                    "Subject_ID": 557,
                    "Template_Name": "CH12",
                    "SubjectType_Name": "聽音檔看句子選OX",
                    "QuestionData": {
                        "QuestionTopicContent": "This is my brother.",
                        "QuestionTopicPhoto": "",
                        "QuestionTopicVoicePath": ""
                    },
                    "OptionData": [
                        {
                            "Option_ID": 1454,
                            "PhotoPath": "https://apprecorder.blob.core.chinacloudapi.cn/file-manager/image/6.png",
                            "OptionContent": "",
                            "isCorrect": true
                        },
                        {
                            "Option_ID": 1453,
                            "PhotoPath": "https://apprecorder.blob.core.chinacloudapi.cn/file-manager/image/5.png",
                            "OptionContent": "",
                            "isCorrect": false
                        }
                    ]
                }
            },
            {
                "Select_Option_ID": 653,
                "Answer_Time": 1834,
                "Permission": true,
                "Subject": {
                    "UseTime": 2147483647,
                    "Subject_ID": 268,
                    "Template_Name": "CH9",
                    "SubjectType_Name": "看句子看圖選OX",
                    "QuestionData": {
                        "QuestionTopicContent": "Look at my face.",
                        "QuestionTopicPhoto": "",
                        "QuestionTopicVoicePath": ""
                    },
                    "OptionData": [
                        {
                            "Option_ID": 653,
                            "PhotoPath": "https://apprecorder.blob.core.chinacloudapi.cn/file-manager/image/5.png",
                            "OptionContent": "",
                            "isCorrect": true
                        },
                        {
                            "Option_ID": 654,
                            "PhotoPath": "https://apprecorder.blob.core.chinacloudapi.cn/file-manager/image/6.png",
                            "OptionContent": "",
                            "isCorrect": false
                        }
                    ]
                }
            },
            {
                "Select_Option_ID": 609,
                "Answer_Time": 349,
                "Permission": true,
                "Subject": {
                    "UseTime": 2147483647,
                    "Subject_ID": 249,
                    "Template_Name": "CH10",
                    "SubjectType_Name": "寫提示聽音檔看圖選OX",
                    "QuestionData": {
                        "QuestionTopicContent": "Listen and look. Are they the same?",
                        "QuestionTopicPhoto": "",
                        "QuestionTopicVoicePath": ""
                    },
                    "OptionData": [
                        {
                            "Option_ID": 610,
                            "PhotoPath": "https://apprecorder.blob.core.chinacloudapi.cn/file-manager/image/6.png",
                            "OptionContent": "",
                            "isCorrect": false
                        },
                        {
                            "Option_ID": 609,
                            "PhotoPath": "https://apprecorder.blob.core.chinacloudapi.cn/file-manager/image/5.png",
                            "OptionContent": "",
                            "isCorrect": true
                        }
                    ]
                }
            }
        ];
    }
});
