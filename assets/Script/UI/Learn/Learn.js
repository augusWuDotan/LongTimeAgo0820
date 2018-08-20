
cc.Class({
    extends: cc.Component,

    properties: {
        VideoPlayerLayer: {
            default: null,
            type: cc.VideoPlayer
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

    },

    start() {

    },

    initMovieType(type, mp4, title) {
        console.log('initMovieType');
        //https://sites.google.com/site/spinename/test/videoplayback.mp4
        this.type = type;
        this.mp4 = mp4;
        this.title = title;
        this.wordLabel = this.node.getChildByName('word').getChildByName('label').getComponent(cc.Label).string = this.title;
        console.log('mp4:' + mp4);
    },

    initReadType(type, mp4, title, picUrl) {
        console.log('initReadType');
        var self = this;
        //https://sites.google.com/site/spinename/test/videoplayback.mp4
        this.type = type;
        this.mp4 = mp4;
        this.picUrl = picUrl;
        this.title = title;
        this.wordLabel = this.node.getChildByName('word').getChildByName('label').getComponent(cc.Label).string = this.title;
        console.log('mp4:' + mp4);
        console.log('picUrl:' + picUrl);
        if (picUrl != '' && picUrl != null) {
            cc.loader.load({ url: picUrl, type: 'png' }, function (error, texture) {
                if (error != null) {
                    self.onError(error);
                } else {
                    var spriteFrame = new cc.SpriteFrame(texture);
                    self.node.getChildByName('learnPic').getChildByName('pic').getComponent(cc.Sprite).spriteFrame = spriteFrame;
                }
            });
        }        
    },
    //主控臺呼叫 初始化或是播放 
    initOrVoicePlay() {
        if (this.mp4 != '' && this.mp4 != null) {
            if (!this.VideoPlayerLayer || !this.VideoPlayer) {

                this.VideoPlayerLayer = this.node.getChildByName('VideoPlayer');
                this.VideoPlayer = this.VideoPlayerLayer.addComponent(cc.VideoPlayer);
                this.VideoPlayer.resourceType = cc.VideoPlayer.ResourceType.REMOTE;
                this.VideoPlayer.remoteURL = this.mp4;
                this.VideoPlayer.currentTime = 0;
                this.VideoPlayer.keepAspectRatio = false;
                this.VideoPlayer.isFullscreen = false;
                //
                var PlayEventHandler = new cc.Component.EventHandler();
                PlayEventHandler.target = this.node; //这个 node 节点是你的事件处理代码组件所属的节点
                PlayEventHandler.component = "Learn";//这个是代码文件名
                PlayEventHandler.handler = "onVideoPlayerEvent";
                this.VideoPlayer.videoPlayerEvent.push(PlayEventHandler);
                //
                this.canPlay = false;
            } else {
                if (this.type != 'Movie') this.VideoPlayer.play();
            }
        }
    },

    toggieFullScreen(isfull) {
        this.VideoPlayer.isFullscreen = isfull;
    },

    //播放完畢
    completePlay() {
        if (this.type == 'Movie') this.VideoPlayer.isFullscreen = false;
    },

    pausePlay() {
        if (this.VideoPlayer) this.VideoPlayer.stop();
    },

    ClearVideo(){
        if (this.VideoPlayerLayer && this.VideoPlayer) {
            console.log('ClearVideo');
            this.VideoPlayerLayer.removeComponent(this.VideoPlayer);
            if(this.VideoPlayer){
                console.log('destroy');
                this.VideoPlayer.destroy();
                this.VideoPlayer = null;
            }
        }
    },

    onVideoPlayerEvent: function (sender, event) {
        console.log(event);

        var self = this;
        switch (event) {
            //播放中
            case cc.VideoPlayer.EventType.PLAYING:

                break;
            //暫停
            case cc.VideoPlayer.EventType.PAUSED:

                break;
            //停止
            case cc.VideoPlayer.EventType.STOPPED:

                break;
            //播放結束
            case cc.VideoPlayer.EventType.COMPLETED:
                self.completePlay();//播放完畢
                break;
            //下載完
            case cc.VideoPlayer.EventType.META_LOADED:

                break;
            //準備好可以播放
            case cc.VideoPlayer.EventType.READY_TO_PLAY:
                self.canPlay = true;
                if(cc.sys.os === cc.sys.OS_IOS){
                    self.VideoPlayer.pause()
                }
                if (self.type != 'Movie') self.VideoPlayer.play();
                break;
            //點擊屏幕
            case cc.VideoPlayer.EventType.CLICKED:
                if (self.canPlay) {
                    if (self.type == 'Movie') {
                        if (self.VideoPlayer) {
                            if (self.VideoPlayer.isPlaying()) {
                                self.toggieFullScreen(false);
                                self.VideoPlayer.pause();
                            }
                            else {
                                self.toggieFullScreen(true);
                                self.VideoPlayer.play();
                            }
                        }
                    } else {
                        var scale1Action = cc.scaleTo(0.1, 1.2, 1.2);
                        var scale2Action = cc.scaleTo(0.1, 1, 1);
                        var action = cc.sequence(
                            scale1Action,
                            scale2Action
                        )
                        self.node.getChildByName('learn_audio').runAction(action);

                        if (self.VideoPlayer.isPlaying()) {
                            self.VideoPlayer.stop();
                            self.VideoPlayer.play();
                        }
                        else {
                            self.VideoPlayer.play();
                        }
                    }

                }
                break;

            default:
                break;
        }


        if (event === cc.VideoPlayer.EventType.META_LOADED) {
            //下載結束

        } else if (event === cc.VideoPlayer.EventType.CLICKED) {

        }
    },
    // update (dt) {},
});
