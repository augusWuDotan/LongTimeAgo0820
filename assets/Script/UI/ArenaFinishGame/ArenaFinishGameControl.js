var self;
cc.Class({
  extends: cc.Component,

  properties: {
    Success1: {
      default: null,
      url: cc.AudioClip
    },
    Success2: {
      default: null,
      url: cc.AudioClip
    },
    Success3: {
      default: null,
      url: cc.AudioClip
    },
    Success4: {
      default: null,
      url: cc.AudioClip
    },
    Success5: {
      default: null,
      url: cc.AudioClip
    },

    Fail1: {
      default: null,
      url: cc.AudioClip
    },
    Fail2: {
      default: null,
      url: cc.AudioClip
    },
    Fail3: {
      default: null,
      url: cc.AudioClip
    },
    Fail4: {
      default: null,
      url: cc.AudioClip
    },
    Fail5: {
      default: null,
      url: cc.AudioClip
    },
    ChoiceBtn: {
      default: null,
      url: cc.AudioClip
    },

  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    //競技場的資料保存
    this.ArenaData = cc.find('ArenaData');
    if (this.ArenaData) {
      console.log('this.ArenaData is init');
      cc.game.addPersistRootNode(this.ArenaData);//儲存為永久節點
      this.ArenaDataComponent = this.ArenaData.getComponent('ArenaData');
    }

    //取得socketIO
    this.socketControl = cc.find('SocketControl');

  },

  init(isBot) {
    self = this;
    this.isBot = isBot;
    console.log(this.node);
    this.VictoryLayer = this.node.getChildByName('VictoryLayer');
    this.VictoryControl = this.VictoryLayer.getComponent('VictoryControl');
    if (this.VictoryControl) {
      //VictoryControl
      console.log('VictoryControl init');
    }
    this.LoseLayer = this.node.getChildByName('LoseLayer');
    this.LoseControl = this.LoseLayer.getComponent('LoseControl');
    if (this.LoseControl) {
      //VictoryControl
      console.log('LoseControl init');
    }
  },


  show() {
    // this.VictoryLayer.setPosition(0, 0);
    // this.VictoryControl.init(this.DebugDatas[0]);
    this.LoseLayer.setPosition(0, 0);
    this.LoseControl.init();
  },

  testNot() {
    // this.VictoryLayer.setPosition(1900, 0);
    this.LoseLayer.setPosition(1900, 0);
  },

  //
  ArenaCallBack(ComponentName, functionName, resultData) {
    //確定有資料或是null
    if (!ComponentName) return;
    if (!functionName) return;
    if (!resultData) return;

    switch (ComponentName) {
      case 'socket':
        self.SocketCallBack(functionName, resultData);
        break;

      default:
        break;
    }
  },

  SocketCallBack(functionName, resultData) {
    switch (functionName) {
      //重新connect
      case 'RestartCallback':
        cc.director.loadScene("FightArena");
        break;
      default:
        break;
    }
  },

  showVictory(reword) {
    var number = Math.floor(cc.random0To1() * 5);
    var audio = null;
    switch (number) {
      case 0: audio = self.Success1; break;
      case 1: audio = self.Success2; break;
      case 2: audio = self.Success3; break;
      case 3: audio = self.Success4; break;
      case 4: audio = self.Success5; break;
    }
    console.log('showVictory---');
    console.log(audio);
    console.log('---showVictory');
    cc.audioEngine.playEffect(audio, false, 0.8);

    this.VictoryLayer.setPosition(0, 0);
    this.VictoryControl.init(reword);

    //isBot
    if (this.isBot) {
      this.scheduleOnce(function (params) {
        var ButtonNode = self.node.getChildByName('VictoryLayer').getChildByName('Result');
        ButtonNode.getComponent(cc.Button).clickEvents[0].emit(['0'])
        var scale1Action = cc.scaleTo(0.1, 0.85, 0.85);
        var scale2Action = cc.scaleTo(0.1, 1, 1);
        var action = cc.sequence(
          scale1Action,
          scale2Action
        )
        ButtonNode.runAction(action);
      }, 8);
    }
  },

  closeVictory() {
    this.VictoryLayer.setPosition(1900, 0);
  },

  showLose() {
    var number = Math.floor(cc.random0To1() * 5);
    var audio = null;
    switch (number) {
      case 0: audio = self.Fail1; break;
      case 1: audio = self.Fail2; break;
      case 2: audio = self.Fail3; break;
      case 3: audio = self.Fail4; break;
      case 4: audio = self.Fail5; break;
    }
    console.log('showLose---');
    console.log(audio);
    console.log('---showLose');
    cc.audioEngine.playEffect(audio, false, 0.8);
    this.LoseLayer.setPosition(0, 0);
    this.LoseControl.init();

    //isBot
    if (this.isBot) {
      this.scheduleOnce(function (params) {
        var ButtonNode = self.node.getChildByName('LoseLayer').getChildByName('Result');
        ButtonNode.getComponent(cc.Button).clickEvents[0].emit(['0'])
        var scale1Action = cc.scaleTo(0.1, 0.85, 0.85);
        var scale2Action = cc.scaleTo(0.1, 1, 1);
        var action = cc.sequence(
          scale1Action,
          scale2Action
        )
        ButtonNode.runAction(action);
      }, 8);
    }
  },

  closeLose() {
    console.log('CLoseLose');
    this.LoseLayer.setPosition(1900, 0);
  },

  goOK() {
    cc.audioEngine.playEffect(this.ChoiceBtn, false, 0.7);
    this.scheduleOnce(function delaytime(params) {
      // cc.director.loadScene("ArenaPreviewScene");
    },0.5);
  },

  goResult() {
    cc.audioEngine.playEffect(this.ChoiceBtn, false, 0.7);
    this.scheduleOnce(function (params) {
      cc.director.loadScene("ArenaPreviewScene");
    },0.8);
  },

  debugData() {
    return [
      {
        "Select_Option_ID": 533,
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
  },

  start() {

  },

  update(dt) { },
});
