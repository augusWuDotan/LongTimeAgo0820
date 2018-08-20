
var self;
cc.Class({
    extends: cc.Component,

    properties: {
        //
        singleLoadingPrefab: {
            default: null,
            type: cc.Prefab
        },
    
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        self = this;
        this.gameData = this.GameData();//取得預設遊戲資訊
        //進入場景
        this.setLoadingPrefab('single');//競技
    },

    /**
   * 統一回傳格式
   * @param {*} NodeName 節點名字
   * @param {*} actionName 行為名字 
   * @param {*} result 回傳內容
   */
    ArenaCallback(NodeName, actionName, result) {
        //
        switch (NodeName) {
            //遊戲開場
            case 'ArenaGameLoadingAreaLayer':
                self.ArenaGameLoadingAreaLayerCallback(actionName, result);
                break;
            //屬性區
            case 'AttributeArea':
                self.ArenaAttributeAreaCallback(actionName, result);
                break;
            //Rival 對手區
            case 'RivalAreaLayerControl':
                self.RivalAreaLayerCallback(actionName, result);
                break;
            //題版區
            case 'TopicControl':
                self.TopicLayerCallback(actionName, result);
                break;
            //攻擊控制 AttackControl
            case 'AttackControl':
                self.AttackControlCallback(actionName, result);
                break;

            default:
                break;
        }
    },

    //分析回傳處理 loading
    ArenaGameLoadingAreaLayerCallback(actionName, result) {
        console.log(actionName);
        switch (actionName) {
            case 'setRoleData':
                break;
            case 'setRivalData':
            self.LoadingAnimStartFirst();
                break;
            case 'showScreenFinish':
                self.LoadingAnimStartFirst_();
                break;
            case 'showLoadingLayerFirstStepRoleVisiableFinish':
                self.LoadingAnimStartSecond();
                break;
            case 'showFinish':
                self.LoadingAnimEnd();
                break;
            case 'CloseFinish':
                // self.AttributeArea.AttributeAreaShow();//出場動畫
                break;

            default:
                break;
        }
    },

    /**
     * 設定讀取畫面
     */
    setLoadingPrefab() {
        this.addSingleLoading();//單機版
    },

    addSingleLoading() {
        this.LoadingLayer = this.node.getChildByName("LoadingLayer");
        if (this.LoadingLayer) console.log('this.LoadingLayer init');
        //
        this.singleLoadingLayer = cc.instantiate(this.singleLoadingPrefab);
        this.LoadingLayer.addChild(this.singleLoadingLayer);
        this.singleLoadingLayer.getComponent('ArenaGameLoadingControl').setArenaCallback(this.ArenaCallback);

        //呼叫讀取畫面 啟動顯示
        this.LoadingRoleData(this.gameData.players[0]);
        this.LoadingRivalData(this.gameData.players[1]);
    },

    /**
     * normal Loading 畫面配置
     */

    //設定主角屬性
    LoadingRoleData(attribute) {
        this.singleLoadingLayer.getComponent('ArenaGameLoadingControl').setRoleData(attribute.RoleName, attribute.RoleTitleType, attribute.FightScore);
    },
    //設定對手屬性
    LoadingRivalData(attribute) {
        this.singleLoadingLayer.getComponent('ArenaGameLoadingControl').setRivalData(attribute.RoleName, attribute.RoleTitleType, attribute.FightScore);
    },
    //設定開始動畫 第一步
    LoadingAnimStartFirst() {
        this.singleLoadingLayer.getComponent('ArenaGameLoadingControl').showLoadingLayerFirstStep();
    },
    //設定開始動畫 第一步 大圖出現
    LoadingAnimStartFirst_() {
        this.singleLoadingLayer.getComponent('ArenaGameLoadingControl').showLoadingLayerFirstStepRoleVisiable();
    },
    //設定開始動畫 第二步
    LoadingAnimStartSecond() {
        this.singleLoadingLayer.getComponent('ArenaGameLoadingControl').showLoadingLayerSecondStep();
    },
    //設定離開動畫
    LoadingAnimEnd() {
        this.singleLoadingLayer.getComponent('ArenaGameLoadingControl').CloseLoadingLayer();
    },

    /**
     * Fight Loading 畫面配置
     */


    /**
     * 屬性畫面配置
     */
    


    //取得要用的資訊
    GameData() {
        var debugData = {
            "_id": "5b1f295155895910d04979f1",
            "players": [
                {
                    "isFighting": false,
                    "_id": "5b1f294a55895910d04979ef",
                    "AnswerList": [],
                    "PermissionList": [],
                    "PersonalAttackList": [],
                    "GameStatusList": [],
                    "RoleAvator": "http://mosaandnasa.com/Cocos-hotfix/board/photo/role_icon.png",
                    "RoleName": "吳東承",
                    "RoleType": "human",
                    "RoleTitleType": 2,
                    "RoleLevel": 56,
                    "VictoryTimesScore": 56,
                    "HP": 100,
                    "MP": 100,
                    "HubConnectID": "D4VVHy0Qn3Wz5RXgAAAA",
                    "FightScore": 1000,
                    "Skills": [
                        {
                            "id": 0,
                            "name": "強擊斧",
                            "iconPath": "/Texture/AttackSkill/tab_icon3",
                            "Jiugongge": null,
                            "useMagic": 0,
                            "skillTalk": "看我的重擊"
                        },
                        {
                            "id": 1,
                            "name": "烈焰術",
                            "iconPath": "/Texture/AttackSkill/sample1",
                            "Jiugongge": [
                                4,
                                5,
                                6
                            ],
                            "useMagic": 10,
                            "skillTalk": "烈焰術!燃燒你的靈魂"
                        },
                        {
                            "id": 2,
                            "name": "雷擊",
                            "iconPath": "/Texture/AttackSkill/sample3",
                            "Jiugongge": [
                                0,
                                1,
                                2,
                                4,
                                6,
                                7,
                                8
                            ],
                            "useMagic": 20,
                            "skillTalk": "顫抖吧～雷擊!"
                        },
                        {
                            "id": null,
                            "name": null,
                            "iconPath": null,
                            "Jiugongge": null,
                            "useMagic": null,
                            "skillTalk": null
                        },
                        {
                            "id": null,
                            "name": null,
                            "iconPath": null,
                            "Jiugongge": null,
                            "useMagic": null,
                            "skillTalk": null
                        },
                        {
                            "id": null,
                            "name": null,
                            "iconPath": null,
                            "Jiugongge": null,
                            "useMagic": null,
                            "skillTalk": null
                        }
                    ],
                    "Props": [
                        {
                            "id": 0,
                            "name": "紅藥水",
                            "iconPath": "/resources/Texture/common/default_item.png",
                            "type": "HP",
                            "amount": 15
                        },
                        {
                            "id": 1,
                            "name": "紅藥水",
                            "iconPath": "/resources/Texture/common/default_item.png",
                            "type": "HP",
                            "amount": 15
                        },
                        {
                            "id": 2,
                            "name": "紅藥水",
                            "iconPath": "/resources/Texture/common/default_item.png",
                            "type": "HP",
                            "amount": 15
                        },
                        {
                            "id": null,
                            "name": null,
                            "iconPath": null,
                            "type": null,
                            "amount": null
                        },
                        {
                            "id": null,
                            "name": null,
                            "iconPath": null,
                            "type": null,
                            "amount": null
                        }
                    ],
                    "__v": 0
                },
                {
                    "isFighting": false,
                    "_id": "5b1f295155895910d04979f0",
                    "RoleAvator": "http://mosaandnasa.com/Cocos-hotfix/board/photo/monster.png",
                    "RoleName": "水行獸",
                    "RoleType": "boss",
                    "RoleTitleType": 2,
                    "RoleLevel": 56,
                    "RoleWinScore": 1000,
                    "RoleMinUseTime": 2,
                    "RoleAnwserCorrectProbability": 0.8,
                    "HP": 100,
                    "MP": 100,
                    "HubConnectID": "d9eC5poDWHUS202BAAAB",
                    "FightScore": 500,
                    "AnswerList": [],
                    "PermissionList": [],
                    "PersonalAttackList": [],
                    "GameStatusList": [],
                    "__v": 0,
                    "Skills": [
                        {
                            "id": 0,
                            "name": "撲擊",
                            "iconPath": null,
                            "Jiugongge": null,
                            "skillTalk": "我咬！",
                            "useMagic": 0
                        },
                        {
                            "id": 1,
                            "name": "冰裂天地",
                            "iconPath": null,
                            "Jiugongge": null,
                            "skillTalk": "看我的大招！冰裂天地",
                            "useMagic": 20
                        }
                    ],
                    "Props": [
                        {
                            "id": 0,
                            "name": null,
                            "iconPath": null,
                            "type": null,
                            "amount": null
                        },
                        {
                            "id": 1,
                            "name": null,
                            "iconPath": null,
                            "type": null,
                            "amount": null
                        },
                        {
                            "id": 2,
                            "name": null,
                            "iconPath": null,
                            "type": null,
                            "amount": null
                        },
                        {
                            "id": 3,
                            "name": null,
                            "iconPath": null,
                            "type": null,
                            "amount": null
                        },
                        {
                            "id": 4,
                            "name": null,
                            "iconPath": null,
                            "type": null,
                            "amount": null
                        }
                    ]
                }
            ],
            "subjects": [
                {
                    "BoardType": "CH1",
                    "BoardTypeName": "看問句選答句",
                    "QuestionData": {
                        "QuestionTopicContent": null,
                        "QuestionTopicPhoto": null,
                        "QuestionTopicVoicePath": "Sfx/boardTypeOneVoice.mp3"
                    },
                    "AnwserData": [
                        {
                            "OptionID": 0,
                            "PhotoPath": "http://mosaandnasa.com/Cocos-hotfix/board/photo/boardTypeOnePhoto1.png",
                            "AnwserContent": null,
                            "ChoiceCorrect": true
                        },
                        {
                            "OptionID": 1,
                            "PhotoPath": "http://mosaandnasa.com/Cocos-hotfix/board/photo/boardTypeOnePhoto2.png",
                            "AnwserContent": null,
                            "ChoiceCorrect": false
                        },
                        {
                            "OptionID": 2,
                            "PhotoPath": "http://mosaandnasa.com/Cocos-hotfix/board/photo/boardTypeOnePhoto3.png",
                            "AnwserContent": null,
                            "ChoiceCorrect": false
                        }
                    ]
                },
                {
                    "BoardType": "CH2",
                    "QuestionData": {
                        "QuestionTopicContent": "Jump",
                        "QuestionTopicPhoto": null,
                        "QuestionTopicVoicePath": null
                    },
                    "AnwserData": [
                        {
                            "PhotoPath": "http://mosaandnasa.com/Cocos-hotfix/board/photo/boardTypeTwoPhoto1.png",
                            "AnwserContent": null,
                            "ChoiceCorrect": false
                        },
                        {
                            "PhotoPath": "http://mosaandnasa.com/Cocos-hotfix/board/photo/boardTypeTwoPhoto2.png",
                            "AnwserContent": null,
                            "ChoiceCorrect": true
                        },
                        {
                            "PhotoPath": "http://mosaandnasa.com/Cocos-hotfix/board/photo/boardTypeTwoPhoto3.png",
                            "AnwserContent": null,
                            "ChoiceCorrect": false
                        }
                    ]
                },
                {
                    "BoardType": "CH3",
                    "QuestionData": {
                        "QuestionTopicContent": null,
                        "QuestionTopicPhoto": "http://mosaandnasa.com/Cocos-hotfix/board/photo/boardTypeThreePhoto.png",
                        "QuestionTopicVoicePath": null
                    },
                    "AnwserData": [
                        {
                            "PhotoPath": null,
                            "AnwserContent": "Walk",
                            "ChoiceCorrect": false
                        },
                        {
                            "PhotoPath": null,
                            "AnwserContent": "Swim",
                            "ChoiceCorrect": true
                        },
                        {
                            "PhotoPath": null,
                            "AnwserContent": "Fly",
                            "ChoiceCorrect": false
                        }
                    ]
                },
                {
                    "BoardType": "CH4",
                    "QuestionData": {
                        "QuestionTopicContent": null,
                        "QuestionTopicPhoto": null,
                        "QuestionTopicVoicePath": "Sfx/boardTypeFourVoice.mp3"
                    },
                    "AnwserData": [
                        {
                            "PhotoPath": null,
                            "AnwserContent": "Walk",
                            "ChoiceCorrect": false
                        },
                        {
                            "PhotoPath": null,
                            "AnwserContent": "Swim",
                            "ChoiceCorrect": true
                        },
                        {
                            "PhotoPath": null,
                            "AnwserContent": "Fly",
                            "ChoiceCorrect": false
                        }
                    ]
                },
                {
                    "BoardType": "CH5",
                    "QuestionData": {
                        "QuestionTopicContent": "What is this animal doing?",
                        "QuestionTopicPhoto": null,
                        "QuestionTopicVoicePath": "Sfx/boardTypeFiveVoice.mp3"
                    },
                    "AnwserData": [
                        {
                            "PhotoPath": null,
                            "AnwserContent": "Walk",
                            "ChoiceCorrect": false
                        },
                        {
                            "PhotoPath": null,
                            "AnwserContent": "Swim",
                            "ChoiceCorrect": true
                        },
                        {
                            "PhotoPath": null,
                            "AnwserContent": "Fly",
                            "ChoiceCorrect": false
                        }
                    ]
                },
                {
                    "BoardType": "CH6",
                    "QuestionData": {
                        "QuestionTopicContent": "What is this animal doing?",
                        "QuestionTopicPhoto": "http://mosaandnasa.com/Cocos-hotfix/board/photo/boardTypeSixPhoto.png",
                        "QuestionTopicVoicePath": null
                    },
                    "AnwserData": [
                        {
                            "PhotoPath": null,
                            "AnwserContent": "Walk",
                            "ChoiceCorrect": false
                        },
                        {
                            "PhotoPath": null,
                            "AnwserContent": "Swim",
                            "ChoiceCorrect": true
                        },
                        {
                            "PhotoPath": null,
                            "AnwserContent": "Fly",
                            "ChoiceCorrect": false
                        }
                    ]
                },
                {
                    "BoardType": "CH7",
                    "QuestionData": {
                        "QuestionTopicContent": "How are  you?",
                        "QuestionTopicPhoto": null,
                        "QuestionTopicVoicePath": null
                    },
                    "AnwserData": [
                        {
                            "PhotoPath": null,
                            "AnwserContent": "That's good.",
                            "ChoiceCorrect": false
                        },
                        {
                            "PhotoPath": null,
                            "AnwserContent": "It's cool.",
                            "ChoiceCorrect": false
                        },
                        {
                            "PhotoPath": null,
                            "AnwserContent": "I'm fine.",
                            "ChoiceCorrect": true
                        }
                    ]
                },
                {
                    "BoardType": "CH8",
                    "QuestionData": {
                        "QuestionTopicContent": null,
                        "QuestionTopicPhoto": "http://mosaandnasa.com/Cocos-hotfix/board/photo/boardTypeEightPhoto.png",
                        "QuestionTopicVoicePath": "Sfx/boardTypeEightVoice.mp3"
                    },
                    "AnwserData": [
                        {
                            "PhotoPath": null,
                            "AnwserContent": "Cry",
                            "ChoiceCorrect": false
                        },
                        {
                            "PhotoPath": null,
                            "AnwserContent": "SingSong",
                            "ChoiceCorrect": true
                        },
                        {
                            "PhotoPath": null,
                            "AnwserContent": "Angry",
                            "ChoiceCorrect": false
                        }
                    ]
                },
                {
                    "BoardType": "CH9",
                    "QuestionData": {
                        "QuestionTopicContent": "is she sing song?",
                        "QuestionTopicPhoto": "http://mosaandnasa.com/Cocos-hotfix/board/photo/boardTypeNinePhoto.png",
                        "QuestionTopicVoicePath": null
                    },
                    "AnwserData": [
                        {
                            "PhotoPath": "http://mosaandnasa.com/Cocos-hotfix/board/photo/boardTypeCorrect.png",
                            "AnwserContent": null,
                            "ChoiceCorrect": true
                        },
                        {
                            "PhotoPath": "http://mosaandnasa.com/Cocos-hotfix/board/photo/boardTypeError.png",
                            "AnwserContent": null,
                            "ChoiceCorrect": false
                        }
                    ]
                },
                {
                    "BoardType": "CH10",
                    "QuestionData": {
                        "QuestionTopicContent": "Is this woman dancing?",
                        "QuestionTopicPhoto": "http://mosaandnasa.com/Cocos-hotfix/board/photo/boardTypeTenPhoto.png",
                        "QuestionTopicVoicePath": "Sfx/boardTypeTenVoice.mp3"
                    },
                    "AnwserData": [
                        {
                            "PhotoPath": "http://mosaandnasa.com/Cocos-hotfix/board/photo/boardTypeCorrect.png",
                            "AnwserContent": null,
                            "ChoiceCorrect": true
                        },
                        {
                            "PhotoPath": "http://mosaandnasa.com/Cocos-hotfix/board/photo/boardTypeError.png",
                            "AnwserContent": null,
                            "ChoiceCorrect": false
                        }
                    ]
                },
                {
                    "BoardType": "CH11",
                    "QuestionData": {
                        "QuestionTopicContent": null,
                        "QuestionTopicPhoto": null,
                        "QuestionTopicVoicePath": "Sfx/boardTypeElevenVoice.mp3"
                    },
                    "AnwserData": [
                        {
                            "PhotoPath": "http://mosaandnasa.com/Cocos-hotfix/board/photo/boardTypeCorrect.png",
                            "AnwserContent": null,
                            "ChoiceCorrect": false
                        },
                        {
                            "PhotoPath": "http://mosaandnasa.com/Cocos-hotfix/board/photo/boardTypeError.png",
                            "AnwserContent": null,
                            "ChoiceCorrect": true
                        }
                    ]
                },
                {
                    "BoardType": "CH12",
                    "QuestionData": {
                        "QuestionTopicContent": "does the voice say swim?",
                        "QuestionTopicPhoto": null,
                        "QuestionTopicVoicePath": "Sfx/boardTypeThirteenVoice.mp3"
                    },
                    "AnwserData": [
                        {
                            "PhotoPath": "http://mosaandnasa.com/Cocos-hotfix/board/photo/boardTypeCorrect.png",
                            "AnwserContent": null,
                            "ChoiceCorrect": false
                        },
                        {
                            "PhotoPath": "http://mosaandnasa.com/Cocos-hotfix/board/photo/boardTypeError.png",
                            "AnwserContent": null,
                            "ChoiceCorrect": true
                        }
                    ]
                }
            ],
            "AnwserTimeLimit": 5,
            "AttackTimeLimit": 8,
            "currentIdx": 0,
            "__v": 0
        };
        return debugData;
    },

    start() {

    },

    // update (dt) {},
});
