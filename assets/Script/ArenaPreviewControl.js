var self;
cc.Class({
  extends: cc.Component,

  properties: {
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
    //漸顯
    this.node.opacity = 0;
    var action = cc.fadeIn(0.5);
    this.node.runAction(action);

    //Item
    this.TopicItem = cc.find('TopicTabItem');
    console.log(this.TopicItem);

    //競技場的資料保存
    this.ArenaData = cc.find('ArenaData');
    if (this.ArenaData) {
      console.log('this.ArenaData is init');
      cc.game.addPersistRootNode(this.ArenaData);//儲存為永久節點
      this.ArenaDataComponent = this.ArenaData.getComponent('ArenaData');
      this.isBot = this.ArenaDataComponent.isBot;
    }

    //取得socketIO
    this.socketControl = cc.find('SocketControl');
    if (this.socketControl) {
      this.socketControl.getComponent('SocketIoCtrl').setArenaCallBack(this.ArenaCallback, 'Fight');
      console.log('this.socketControl is init');
    }


  },

  start() {
    //初始化畫面
    this.scheduleOnce(function delay(params) {
      this.init();
    }, 0.5);
  },

  //初始化畫面
  init() {
    console.log('init');
    this.TopicItemNodes = [];
    this.selectItemNodeIndex = -1;
    if (this.ArenaDataComponent) {
      if (this.ArenaDataComponent.ArenaGameFinishData) {
        this.GameFinishData = this.ArenaDataComponent.ArenaGameFinishData;
      } else {
        this.GameFinishData = this.debugData();
      }
    }
    else this.GameFinishData = this.debugData();
    this.AddTopicBoardControl(this.GameFinishData);
    this.addTopicItem(this.GameFinishData);

    if (this.isBot) {
      console.log('use bot');
      var interval = 4;//幾秒後顯示下一題
      var repeat = this.GameFinishData.length >= 5 ? 4 : (this.GameFinishData.length - 1)
      var delay = 4;
      var goFireDelay = Math.floor(Math.random()*3+6);
      //決定要用哪一個
      var index = 0;
      // 
      console.log('repeat:' + repeat);
      console.log('delay:' + delay);
      if (repeat === 0) {
        this.scheduleOnce(function delayGoFighttime(params) {
          this.BotGoFight();
        }, goFireDelay);
      } else {
        this.schedule(function delaytime(params) {
          index++;
          //找出該節點
          var TabNode = self.TopicItemNodes[index];
          TabNode.getComponent(cc.Button).clickEvents[0].emit([index.toString()]);

          console.log('back index:'+index); 
          //end
          if (index == repeat) {
            console.log('back delay:'+delay); 
            //取消所有計時器
            self.unscheduleAllCallbacks();
            //回競技場//重新計算 goFireDelay 秒後 
            self.scheduleOnce(function delayGoFighttime(params) {
              this.BotGoFight();
            }, goFireDelay);
          }

        }, interval, repeat, delay);
      }

    }
  },

  //機器人------
  BotGoFight(){
    console.log('BotGoFight');
    var ButtonNode = this.node.getChildByName('back')
    ButtonNode.getComponent(cc.Button).clickEvents[0].emit(['0']);
    var scale1Action = cc.scaleTo(0.1, 0.85, 0.85);
    var scale2Action = cc.scaleTo(0.1, 1, 1);
    var action = cc.sequence(
        scale1Action,
        scale2Action
    )
    ButtonNode.runAction(action);
  },

  //加入題目 選擇bar
  addTopicItem() {
    console.log('addTopicItem');
    var index = 0;
    this.GameFinishData.forEach(subject => {

      var Item = cc.instantiate(self.TopicItem);
      Item.setPosition(self.setItemPosition(Item, index, self.GameFinishData.length));//設定座標
      Item.getComponent('TopicTabItem').init(self.TopicCallback, index, subject.Permission);
      self.node.addChild(Item);
      self.TopicItemNodes.push(Item);

      index++;
    });

    //預設第一個 
    var currentP = this.TopicItemNodes[0].getPosition();
    this.TopicItemNodes[0].setPosition(cc.p(currentP.x,currentP.y-25));
    this.TopicItemNodes[0].scale = 1.3;
    self.selectItemNodeIndex = 0;
  },

  //設定點擊回傳
  TopicCallback(index) {
    console.log(index);
    //重置選到的目標
    if (self.selectItemNodeIndex !== -1) {
      let curP = self.TopicItemNodes[self.selectItemNodeIndex].getPosition();
      self.TopicItemNodes[self.selectItemNodeIndex].setPosition(cc.p(curP.x,curP.y+25));
      self.TopicItemNodes[self.selectItemNodeIndex].scale = 1; 
    }
    //
    let selectP = self.TopicItemNodes[index].getPosition();
    self.TopicItemNodes[index].setPosition(cc.p(selectP.x,selectP.y-25));
    self.selectItemNodeIndex = index;
    //
    if(self.ChoiceItem)cc.audioEngine.playEffect(self.ChoiceItem, false, 1);
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
    this.TopicShowControl = this.node.getChildByName('ShowTopicLayer').getComponent('TopicShowControl');
    if (this.TopicShowControl) {
      console.log('this.TopicShowControl init');
      //題目列表、index、是否自動答題、是否展示用
      this.TopicShowControl.init(SubjectData, 0, false, true);
    }
  },

  /**
   * 統一回傳格式
   * @param {*} NodeName 節點名字
   * @param {*} actionName 行為名字 
   * @param {*} result 回傳內容
   */
  ArenaCallback(NodeName, actionName, result) {
    console.log('NodeName:' + NodeName);
    switch (NodeName) {
      //socket
      case 'socket':
        self.SocketCallBack(actionName, result);
        break;
      default:
        break;
    }
  },
  //socket call back
  SocketCallBack(functionName, resultData) {
    console.log('functionName:' + functionName);
    switch (functionName) {
      case 'RestartCallback':
        cc.director.loadScene("FightArena");
        break;
      default:
        break;
    }
  },

  //回戰鬥畫面
  goFight() {
    if(self.store_buy)cc.audioEngine.playEffect(self.store_buy, false, 0.6);
    var debugToken = '';
    this.socketControl.getComponent('SocketIoCtrl').doConnect(this.ArenaDataComponent.getMemberID(), this.ArenaDataComponent.getArenaId(), true, debugToken);
  },

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

  // update (dt) {},
});
