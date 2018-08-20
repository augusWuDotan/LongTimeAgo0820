var self;
var ArenaUtils = require('ArenaUtils');
cc.Class({
    extends: cc.Component,

    properties: {
        //狀態 prefab
        StatusHorizonvalItemPrefab: {
            default: null,
            type: cc.Prefab
        },
        //狀態列表 節點
        StatusScrolLayer: {
            default: null,
            type: cc.Node
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() { },

    //this.StatusBarControl.initData(AvatarNode, name, hp, mp, effectList);
    initData(AvatarNode, name, hp, mp, effectList) {
        self = this;
        //頭像
        this.avatarNode = this.node.getChildByName('headNode');
        var avatar = cc.instantiate(AvatarNode);
        this.avatarNode.addChild(avatar);
        avatar.setPosition(cc.p(0, 0));
        //文字
        this.NameLabel = this.node.getChildByName('Name');
        this.HpLabel = this.node.getChildByName('Hp');
        this.MpLabel = this.node.getChildByName('Mp');
        this.NameLabel.getComponent(cc.Label).string = name;
        this.HpLabel.getComponent(cc.Label).string = hp;
        this.MpLabel.getComponent(cc.Label).string = mp;
        //狀態列
        if(effectList)this.CreateStatusHorizonvalItem(effectList);
    },

    //建立橫向的顯示
    CreateStatusHorizonvalItem(effectList) {
        //找到建立的節點
        var CreateNode = this.StatusScrolLayer;

        //判斷資料最大值 取其三顯示
        let maxIndex = effectList.length;

        //重新建立狀態
        for (let i = 0; i < maxIndex; i++) {
            var effect = effectList[i]
            //
            var StatusHorizonvalItemNode = cc.instantiate(self.StatusHorizonvalItemPrefab);//建立節點
            // console.log(StatusHorizonvalItemNode);
            StatusHorizonvalItemNode._name = effect.SourceName;//設定name
            StatusHorizonvalItemNode._tag = effect.element;//設定tag
            CreateNode.addChild(StatusHorizonvalItemNode);
            StatusHorizonvalItemNode.setPosition(cc.p(0, 0));//設置座標點 [這裡有layout屬性 設置 0,0 就會自動排列]
            StatusHorizonvalItemNode.getComponent('StatusHorizontalItem').initData(effect);//初始化數值
   
        }
    },

    //結束這個節點
    doDestroy() {
        this.node.destroy();
    },

    start() {

    },

    // update (dt) {},
});
