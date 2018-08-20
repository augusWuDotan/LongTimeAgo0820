
cc.Class({
    extends: cc.Component,

    properties: {
        LearnMovie: {
            default: null,
            type: cc.Prefab
        },
        LearnRead: {
            default: null,
            type: cc.Prefab
        },
        content: {
            default: null,
            type: cc.Node
        },
        PageView: cc.PageView
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        console.log('cc.VideoPlayer.EventType.PLAYING : ' + cc.VideoPlayer.EventType.PLAYING);
        console.log('cc.VideoPlayer.EventType.PAUSED : ' + cc.VideoPlayer.EventType.PAUSED);
        console.log('cc.VideoPlayer.EventType.STOPPED : ' + cc.VideoPlayer.EventType.STOPPED);
        console.log('cc.VideoPlayer.EventType.COMPLETED : ' + cc.VideoPlayer.EventType.COMPLETED);
        console.log('cc.VideoPlayer.EventType.META_LOADED : ' + cc.VideoPlayer.EventType.META_LOADED);
        console.log('cc.VideoPlayer.EventType.CLICKED : ' + cc.VideoPlayer.EventType.CLICKED);
        console.log('cc.VideoPlayer.EventType.READY_TO_PLAY : ' + cc.VideoPlayer.EventType.READY_TO_PLAY);

    },


    start() {
        if (!this.readyAdd) {
            this.readyAdd = true;
            this.Data = this.debugData();
            var self = this;
            this.scheduleOnce(function () {
                self.addData();
            }, 0.8);
        }
    },

    setReady() {
        this.readyAdd = true;
    },

    init() {
        if (!this.isOpen) {
            this.isOpen = true;
            this.node.getComponent(cc.Animation).play('open');
        }
        // this.Data = this.debugData();
        // var self = this;
        // this.scheduleOnce(function () {
        //     self.addData();
        // }, 0.8);
        var self = this;
        this.Data = [];
        var httpRequest = require('XMLHttpRequest');
        var request = new httpRequest();
        request.getLearnList(83, function (json, error) {
            if (error != null) {
                self.onError(error);
            } else {
                console.log(JSON.stringify(json));
                if (json.result_status == false) {
                    var message = json.result_message;
                    console.error(message);
                } else {
                    console.log(JSON.stringify(json.result_content));
                    self.Data = json.result_content;
                    self.scheduleOnce(function () {
                        self.addData();
                    },0.5);
                }
            }
        });
    },

    addData() {
        var self = this;
        this.currentIndex = 0;
        this.PageView.setCurrentPageIndex(this.currentIndex);
        this.PageLabel = this.node.getChildByName('page').getChildByName('label');
        this.PageLabel.getComponent(cc.Label).string = (this.currentIndex + 1) + '/' + (this.Data.length);

        for (let i = 0; i < this.Data.length; i++) {
            console.log(i);
            let Item;
            if (this.Data[i].learnType == 'Movie') {
                Item = cc.instantiate(this.LearnMovie);
                this.PageView.addPage(Item);
                Item.setPosition(cc.p(0, 0));
                var LearnMovieControl = Item.getComponent('Learn');
                if (LearnMovieControl) LearnMovieControl.initMovieType(this.Data[i].learnType, this.Data[i].learnMovieUrl, this.Data[i].learnTitle);
            } else {
                Item = cc.instantiate(this.LearnRead);
                Item.setPosition(cc.p(0, 0));
                this.PageView.addPage(Item);
                var LearnReadControl = Item.getComponent('Learn');
                if (LearnReadControl) LearnReadControl.initReadType(this.Data[i].learnType, this.Data[i].learnVoiceUrl, this.Data[i].learnTitle, this.Data[i].learnPicUrl);
            }

            if (i == 0) {
                Item.getComponent('Learn').initOrVoicePlay();
            }
        }
    },


    // 监听事件
    onPageEvent(sender, eventType) {
        // console.log(eventType);
        // 翻页事件
        if (eventType !== cc.PageView.EventType.PAGE_TURNING) {
            return;
        }

        if(this.currentIndex > sender.getCurrentPageIndex()){
            //大->小
            var ClearIndex = this.currentIndex+3;
            if((ClearIndex) < this.Data.length){
                //清除video
                sender.content.children[ClearIndex].getComponent('Learn').ClearVideo();
            }
        }else{
            //小->大
            var ClearIndex = this.currentIndex-3;
            if((ClearIndex) >= 0){
                //清除video
                sender.content.children[ClearIndex].getComponent('Learn').ClearVideo();
            }
        }

        console.log("当前所在的页面索引:" + sender.getCurrentPageIndex());
        //強制關閉前面的播放停止
        sender.content.children[this.currentIndex].getComponent('Learn').pausePlay();
        this.currentIndex = sender.getCurrentPageIndex();
        this.PageLabel.getComponent(cc.Label).string = (this.currentIndex + 1) + '/' + (this.Data.length);

        var self = this;
        if(cc.sys.os === cc.sys.OS_IOS){
            self.scheduleOnce(function delayShow() {
                sender.content.children[self.currentIndex].getComponent('Learn').initOrVoicePlay();
            },0.1);
        }else{
            sender.content.children[self.currentIndex].getComponent('Learn').initOrVoicePlay();
        }
        

    },

    back() {
        this.scheduleOnce(function () {
            cc.director.loadScene("MenuScene");
        }, 0.3);
    },

    backLevel() {
        this.scheduleOnce(function () {
            this.PageView.removeAllPages();
            this.node.setPosition(cc.p(0, 1080));
            this.node.parent.getChildByName('LevelLayer').active = true;
        }, 0.3);
    },

    // update (dt) {},

    debugData() {
        //http://mosaandnasa.com.cn/Conversation.mp4
        return [
            {
                "learnID": 0,
                "learnType": "Movie",
                "learnMovieUrl": "https://sites.google.com/site/spinename/test/videoplayback.mp4",
                "learnPicUrl": null,
                "learnTitle": "人教小三(下) - Lesson1",
                "learnVoiceUrl": null
            },
            {
                "learnID": 0,
                "learnType": "Movie",
                "learnMovieUrl": "https://sites.google.com/site/spinename/test/videoplayback.mp4",
                "learnPicUrl": null,
                "learnTitle": "人教小三(下) - Lesson1",
                "learnVoiceUrl": null
            },
            {
                "learnID": 16,
                "learnType": "Read",
                "learnMovieUrl": null,
                "learnPicUrl": "https://apprecorder.blob.core.chinacloudapi.cn/file-manager/image/12503.png",
                "learnTitle": "name",
                "learnVoiceUrl": "https://apprecorder.blob.core.chinacloudapi.cn/file-manager/audio/8744.mp3"
            }, {
                "learnID": 1,
                "learnType": "Read",
                "learnMovieUrl": null,
                "learnPicUrl": "https://apprecorder.blob.core.chinacloudapi.cn/file-manager/image/11253.png",
                "learnTitle": "face",
                "learnVoiceUrl": "https://apprecorder.blob.core.chinacloudapi.cn/file-manager/audio/7543.mp3"
            },
            {
                "learnID": 2,
                "learnType": "Read",
                "learnMovieUrl": null,
                "learnPicUrl": null,
                "learnTitle": "lake",
                "learnVoiceUrl": "https://apprecorder.blob.core.chinacloudapi.cn/file-manager/audio/8780.mp3"
            },
            {
                "learnID": 3,
                "learnType": "Read",
                "learnMovieUrl": null,
                "learnPicUrl": "https://apprecorder.blob.core.chinacloudapi.cn/file-manager/image/11939.png",
                "learnTitle": "cake",
                "learnVoiceUrl": "https://apprecorder.blob.core.chinacloudapi.cn/file-manager/audio/8409.mp3"
            },
            {
                "learnID": 4,
                "learnType": "Read",
                "learnMovieUrl": null,
                "learnPicUrl": null,
                "learnTitle": "plate",
                "learnVoiceUrl": "https://apprecorder.blob.core.chinacloudapi.cn/file-manager/audio/7254.mp3"
            },
            {
                "learnID": 5,
                "learnType": "Read",
                "learnMovieUrl": null,
                "learnPicUrl": "https://apprecorder.blob.core.chinacloudapi.cn/file-manager/image/12528.png",
                "learnTitle": "PE",
                "learnVoiceUrl": "https://apprecorder.blob.core.chinacloudapi.cn/file-manager/audio/9185.mp3"
            },
            {
                "learnID": 6,
                "learnType": "Read",
                "learnMovieUrl": null,
                "learnPicUrl": null,
                "learnTitle": "Chinese",
                "learnVoiceUrl": "https://apprecorder.blob.core.chinacloudapi.cn/file-manager/audio/7227.mp3"
            },
            {
                "learnID": 7,
                "learnType": "Read",
                "learnMovieUrl": null,
                "learnPicUrl": "https://apprecorder.blob.core.chinacloudapi.cn/file-manager/image/12179.png",
                "learnTitle": "art",
                "learnVoiceUrl": "https://apprecorder.blob.core.chinacloudapi.cn/file-manager/audio/8945.mp3"
            },
            {
                "learnID": 8,
                "learnType": "Read",
                "learnMovieUrl": null,
                "learnPicUrl": "https://apprecorder.blob.core.chinacloudapi.cn/file-manager/image/12613.png",
                "learnTitle": "science",
                "learnVoiceUrl": "https://apprecorder.blob.core.chinacloudapi.cn/file-manager/audio/7889.mp3"
            },
            {
                "learnID": 9,
                "learnType": "Read",
                "learnMovieUrl": null,
                "learnPicUrl": "https://apprecorder.blob.core.chinacloudapi.cn/file-manager/image/12481.png",
                "learnTitle": "math",
                "learnVoiceUrl": "https://apprecorder.blob.core.chinacloudapi.cn/file-manager/audio/9065.mp3"
            },
            {
                "learnID": 10,
                "learnType": "Read",
                "learnMovieUrl": null,
                "learnPicUrl": null,
                "learnTitle": "computer class",
                "learnVoiceUrl": null
            },
            {
                "learnID": 11,
                "learnType": "Read",
                "learnMovieUrl": null,
                "learnPicUrl": "https://apprecorder.blob.core.chinacloudapi.cn/file-manager/image/12358.png",
                "learnTitle": "English",
                "learnVoiceUrl": "https://apprecorder.blob.core.chinacloudapi.cn/file-manager/audio/8966.mp3"
            },
            {
                "learnID": 12,
                "learnType": "Read",
                "learnMovieUrl": null,
                "learnPicUrl": "https://apprecorder.blob.core.chinacloudapi.cn/file-manager/image/12501.png",
                "learnTitle": "music",
                "learnVoiceUrl": "https://apprecorder.blob.core.chinacloudapi.cn/file-manager/audio/8993.mp3"
            },
            {
                "learnID": 13,
                "learnType": "Read",
                "learnMovieUrl": null,
                "learnPicUrl": null,
                "learnTitle": "favorite",
                "learnVoiceUrl": "https://apprecorder.blob.core.chinacloudapi.cn/file-manager/audio/9174.mp3"
            },
            {
                "learnID": 14,
                "learnType": "Read",
                "learnMovieUrl": null,
                "learnPicUrl": null,
                "learnTitle": "make",
                "learnVoiceUrl": "https://apprecorder.blob.core.chinacloudapi.cn/file-manager/audio/8793.mp3"
            },
            {
                "learnID": 15,
                "learnType": "Read",
                "learnMovieUrl": null,
                "learnPicUrl": null,
                "learnTitle": "tape",
                "learnVoiceUrl": "https://apprecorder.blob.core.chinacloudapi.cn/file-manager/audio/9033.mp3"
            },

            {
                "learnID": 17,
                "learnType": "Read",
                "learnMovieUrl": null,
                "learnPicUrl": null,
                "learnTitle": "observe",
                "learnVoiceUrl": "https://apprecorder.blob.core.chinacloudapi.cn/file-manager/audio/11026.mp3"
            },
            {
                "learnID": 18,
                "learnType": "Read",
                "learnMovieUrl": null,
                "learnPicUrl": null,
                "learnTitle": "activity",
                "learnVoiceUrl": "https://apprecorder.blob.core.chinacloudapi.cn/file-manager/audio/7927.mp3"
            },
            {
                "learnID": 19,
                "learnType": "Read",
                "learnMovieUrl": null,
                "learnPicUrl": null,
                "learnTitle": "boring",
                "learnVoiceUrl": "https://apprecorder.blob.core.chinacloudapi.cn/file-manager/audio/7569.mp3"
            },
            {
                "learnID": 20,
                "learnType": "Read",
                "learnMovieUrl": null,
                "learnPicUrl": null,
                "learnTitle": "email",
                "learnVoiceUrl": "https://apprecorder.blob.core.chinacloudapi.cn/file-manager/audio/9006.mp3"
            },
            {
                "learnID": 21,
                "learnType": "Read",
                "learnMovieUrl": null,
                "learnPicUrl": null,
                "learnTitle": "piano",
                "learnVoiceUrl": "https://apprecorder.blob.core.chinacloudapi.cn/file-manager/audio/8507.mp3"
            },
            {
                "learnID": 22,
                "learnType": "Read",
                "learnMovieUrl": null,
                "learnPicUrl": null,
                "learnTitle": "listen",
                "learnVoiceUrl": "https://apprecorder.blob.core.chinacloudapi.cn/file-manager/audio/8783.mp3"
            },
            {
                "learnID": 23,
                "learnType": "Read",
                "learnMovieUrl": null,
                "learnPicUrl": null,
                "learnTitle": "early",
                "learnVoiceUrl": "https://apprecorder.blob.core.chinacloudapi.cn/file-manager/audio/8935.mp3"
            }
        ];


    },
});
