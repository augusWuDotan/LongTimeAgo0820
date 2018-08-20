var self;
cc.Class({
    extends: cc.Component,

    properties: {
        //
        MailListContent: {
            default: null,
            type: cc.Node
        },

        //
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.MailItem = cc.find('MailItem');
        console.log('this.MailItem:' + this.MailItem);
        //
        this.MailContent = this.node.getChildByName('MailContent');


        // var d = new Date('2018-08-15T10:32:30.833');
        // console.log(d.toLocaleString());
    },

    start() {
        self = this;
        this.dataNode = cc.director.getScene().getChildByName("DataNode");
        this.MailList = [];
        this.MailItemObject = Object.create(null);
        this.getMailList();//mail list
        //xml
    },

    getMailList() {
        var token;
        if (this.dataNode) token = this.dataNode.getComponent('DataNode').token;
        else token = 'vZqr9/Miup2bQxsCmm2XAol5M8y+QW65NGITyvDh0f0S8984YmKstpVkNXUwKeUI';

        var httpRequest = require('XMLHttpRequest');
        var request = new httpRequest();
        request.getMemberMailBoxList(token, function (json, error) {
            if (error != null) {
                console.log('error: ' + error);

            } else {
                console.log(JSON.stringify(json));
                if (json.result_status == false) {
                    var message = json.result_message;
                    console.error('message: ' + message);
                } else {
                    console.log(JSON.stringify(json.result_content));
                    //todo 
                    self.MailList = json.result_content;
                    self.initMailList(self.MailList);//初始化列表
                }
            }
        });
    },

    //
    getMailItem(MailBoxId) {
        console.log('getMailItem > MailBoxId: ' + MailBoxId);
        var token;
        if (this.dataNode) token = this.dataNode.getComponent('DataNode').token;
        else token = 'vZqr9/Miup2bQxsCmm2XAol5M8y+QW65NGITyvDh0f0S8984YmKstpVkNXUwKeUI';

        var httpRequest = require('XMLHttpRequest');
        var request = new httpRequest();
        request.getMemberMailBoxItem(token, MailBoxId, function (json, error) {
            if (error != null) {
                console.log('error: ' + error);
            } else {
                console.log(JSON.stringify(json));
                if (json.result_status == false) {
                    var message = json.result_message;
                    console.error('message: ' + message);
                } else {
                    console.log(JSON.stringify(json.result_content));
                    //todo 
                    self.MailItemObject = json.result_content;
                    self.UpdateItemContent();//
                }
            }
        });
    },

    initMailList(MailList) {
        //Item  select => width: 656.4  Height: 160 , normal => width: 550  Height: 160
        //position = cc.p(328.2,0);
        var mailIndex = 0;
        this.selectItem = null;
        MailList.forEach(mail => {
            console.log(JSON.stringify(mail));
            var mailItem = cc.instantiate(this.MailItem);
            if(mailIndex == 0) this.selectItem = mailItem;
            this.MailListContent.addChild(mailItem);
            mailItem.setPosition(cc.p(328.2, 0));
            //
            mailItem.getChildByName('Name').getComponent(cc.Label).string = mail.SenderName;
            mailItem.getChildByName('Title').getComponent(cc.Label).string = mail.Title;
            mailItem.getChildByName('ReadDot').active = !mail.isRead;
            //
            var Box = mailItem.getChildByName('Box');
            if (mail.haveAttached) {
                var path = mail.PicUrl;
                if (path != null && path != '') {
                    cc.loader.load(path, function (err, tex) {
                        if (err) {
                            //console.log(err);
                        } else {
                            var spf = new cc.SpriteFrame();
                            spf.initWithTexture(tex);
                            Box.getComponent(cc.Sprite).spriteFrame = spf;
                            /*
                            var propSize = texture.getContentSize();
                            var side = self.TopicBoardPhotoLayer.width > self.TopicBoardPhotoLayer.height ? self.TopicBoardPhotoLayer.height : self.TopicBoardPhotoLayer.width;//確定矩行邊長
                            self.TopicBoardPhotoLayer.getChildByName('TopicPhoto').width = side * 17 / 24;
                            self.TopicBoardPhotoLayer.getChildByName('TopicPhoto').height = side * 17 / 24;
                            self.TopicBoardPhotoLayer.getChildByName('TopicPhoto').getComponent(cc.Sprite).spriteFrame = spf;                            
                            */
                        }
                    });
                }
            }
            //click
            var button = mailItem.addComponent(cc.Button);
            var MailButtonEventHandler = new cc.Component.EventHandler();
            MailButtonEventHandler.target = self.node; //这个 node 节点是你的事件处理代码组件所属的节点
            MailButtonEventHandler.component = "MailLayer";//这个是代码文件名
            MailButtonEventHandler.handler = "MailItemClick";
            MailButtonEventHandler.customEventData = mailIndex.toString();
            button.clickEvents.push(MailButtonEventHandler);

            if(mailIndex == (MailList.length-1) && this.selectItem != null){
                console.log('first');
                this.selectItem.width = 656.4;
                var MailBoxId = this.MailList[0].MailBox_ID;
                this.getMailItem(MailBoxId);
            }

            mailIndex++;
        });

      
    },

    //
    UpdateItemContent() {
        if (this.MailItemObject) {
            //
            if (this.MailContent) {
                var time = new Date(this.MailItemObject.SendTime);
                console.log(time.toLocaleString());
                var timeHour = (time.getHours() > 11 ? 'PM' + ((time.getHours() - 12) > 9 ? (time.getHours() - 12) : '0' + (time.getHours() - 12)) : 'AM' + (time.getHours() > 9 ? time.getHours() : '0' + time.getHours()));
                var timeStr = time.getFullYear() + '/' + ((time.getMonth() + 1) > 9 ? (time.getMonth() + 1) : '0' + (time.getMonth() + 1)) + '/' + (time.getDate() > 9 ? time.getDate() : '0' + time.getDate()) + ' ' + timeHour + ':' + (time.getMinutes()>9 ? time.getMinutes(): '0'+time.getMinutes());
                this.MailContent.getChildByName('SenderName').getComponent(cc.Label).string = this.MailItemObject.SenderName;
                this.MailContent.getChildByName('CreatTime').getComponent(cc.Label).string = timeStr;
                this.MailContent.getChildByName('Title').getComponent(cc.Label).string = this.MailItemObject.Title;
                this.MailContent.getChildByName('Content').getComponent(cc.Label).string = this.MailItemObject.Content;
                var BoxIcon = this.MailContent.getChildByName('Box');
                console.log('haveAttached:' + this.MailItemObject.haveAttached);
                if (this.MailItemObject.haveAttached) {
                    var BoxPath = this.MailItemObject.Attached.Prop.PropsPrototype_Img;
                    console.log('BoxPath:' + BoxPath);
                    if (BoxPath != null && BoxPath != '') {
                        cc.loader.load(BoxPath, function (err, tex) {
                            if (err) {
                                //console.log(err);
                            } else {
                                var spf = new cc.SpriteFrame();
                                spf.initWithTexture(tex);
                                BoxIcon.getComponent(cc.Sprite).spriteFrame = spf;
                            }
                        });
                    }
                }

            }
        }
    },

    MailItemClick(event, index) {
        console.log('MailItemClick');

        //更換狀態變成已讀
        event.target.getChildByName('ReadDot').active = false;
        //
        if (!this.selectItem) {
            this.selectItem = event.target;
            this.selectItem.width = 656.4;
        } else {
            this.selectItem.width = 580;
            this.selectItem = event.target;
            this.selectItem.width = 656.4;
        }
        //清除content內容
        if (this.MailContent) {
            this.MailContent.getChildByName('SenderName').getComponent(cc.Label).string = '';
            this.MailContent.getChildByName('CreatTime').getComponent(cc.Label).string = '';
            this.MailContent.getChildByName('Title').getComponent(cc.Label).string = '';
            this.MailContent.getChildByName('Content').getComponent(cc.Label).string = '';
            this.MailContent.getChildByName('Box').getComponent(cc.Sprite).spriteFrame = null;
        }
        //取得id 取得資訊
        var MailBoxId = this.MailList[parseInt(index)].MailBox_ID;
        console.log('MailBoxId: ' + MailBoxId);
        this.getMailItem(MailBoxId);
    },


    back() {
        this.scheduleOnce(function main() {
            cc.director.loadScene("Main");
        }, 0.1);
    },
    // update (dt) {},
});
