var self;
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() { },

    init(RankData) {
        self = this;
        this.personItem = cc.find('personItem');
        this.person = this.node.getChildByName('person');
        this.self = this.node.getChildByName('self');
        //
        this.initPerson();
        this.initSelf();
        //預設
        this.person.active = true;
        this.self.active = false;
    },

    //
    initPerson(PersonData) {
        this.ScrollView = this.person.getChildByName('ScrollView');
        this.ScrollView.getComponent(cc.ScrollView).unscheduleAllCallbacks();
        this.ScrollIndex = 0;
        this.DataLength = 5;
        this.content = this.ScrollView.getChildByName('view').getChildByName('content');
        this.content.removeAllChildren();

        for (let i = 0; i < this.DataLength; i++) {
            var item = cc.instantiate(this.personItem);
            self.content.addChild(item);
            item.setPosition(cc.p(0, 0));
            //
            item.getComponent('PersonItem').init('', i + 1, '吴东承', 999);
        }

        this.scheduleShowLevel();

        this.touchOffset = null;//觸碰時 scrollView 位移的 Offset

        this.ScrollView.on('scroll-ended', function (event) {
            console.log('停止滑動');
            if( self.touchOffset == null) return;
            var v2 = event.target.getComponent(cc.ScrollView).getScrollOffset();//已經位移

            if ((Math.floor((0 - Math.floor(self.touchOffset.x)) / 400)) != (Math.floor((0 - Math.floor(v2.x)) / 400))) {
                console.log('其他畫面'); 
                var scrollIndex = Math.floor((0 - Math.floor(v2.x)) / 400);//利用位移取得現在在哪一個位置
                self.ScrollIndex = scrollIndex;
                console.log('self.ScrollIndex:' + self.ScrollIndex);
                self.scheduleShowLevel();//

            } else {

                console.log('原本畫面');

            }

        }, this);
        this.ScrollView.on(cc.Node.EventType.TOUCH_START, function (event) {
            console.log('按下');
            self.ScrollView.getComponent(cc.ScrollView).unscheduleAllCallbacks();
            self.touchOffset = self.ScrollView.getComponent(cc.ScrollView).getScrollOffset();
        }, this);

        this.ScrollView.on(cc.Node.EventType.TOUCH_END, function (event) {
            console.log('離開');
            self.scheduleShowLevel();
        }, this);
        this.ScrollView.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            console.log('取消');
            self.scheduleShowLevel();
        }, this);

    },

    initSelf(SelfData) {

    },

    showSelf() {
        this.ScrollView.getComponent(cc.ScrollView).unscheduleAllCallbacks();
        this.self.active = true;
        this.person.active = false;
    },

    showPerson() {
        this.person.active = true;
        this.self.active = false;

        this.scheduleShowLevel();
    },

    scheduleShowLevel() {
        this.ScrollView.getComponent(cc.ScrollView).unscheduleAllCallbacks();
        this.ScrollView.getComponent(cc.ScrollView).schedule(function reapeat(params) {
            self.ScrollIndex++;
            if (self.ScrollIndex >= self.DataLength) self.ScrollIndex = 0;
            console.log('self.ScrollIndex:' + self.ScrollIndex);
            if (self.ScrollIndex != 0) self.ScrollView.getComponent(cc.ScrollView).scrollToOffset(cc.p(Math.floor(400 * self.ScrollIndex), 0), 1);
            else self.ScrollView.getComponent(cc.ScrollView).scrollToOffset(cc.p(Math.floor(400 * self.ScrollIndex), 0), 0.5);
        }, 5);
    },

    start() {

    },

    // update (dt) {},
});
