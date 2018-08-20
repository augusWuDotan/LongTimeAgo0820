cc.Class({
    extends: cc.Component,

    properties: {
       level1_5:{
           default:null,
           type:cc.SpriteFrame
       },
       level6_100:{
        default:null,
        type:cc.SpriteFrame
    }
    },

    // LIFE-CYCLE CALLBACKS:
    /**
     * 
     * @param {*} rankLevel 排名
     * @param {*} school 學校
     * @param {*} name 姓名
     * @param {*} roleLevel 角色等級 
     * @param {*} winScore 勝場數
     */
    init(rankLevel,school,name,roleLevel,winScore){
        // rankLevel = rankLevel;
        // school = school;
        // name = name;
        // roleLevel = roleLevel;
        // winScore = winScore;
        if(rankLevel && rankLevel != null){

            if(rankLevel>0 && rankLevel<=5) this.node.getChildByName('level').getComponent(cc.Sprite).spriteFrame = this.level1_5;
            else if(rankLevel>5 && rankLevel<=100) this.node.getChildByName('level').getComponent(cc.Sprite).spriteFrame = this.level6_100;
            else {}
 
            this.node.getChildByName('level').getChildByName('label').getComponent(cc.Label).string = rankLevel;
         }
 
         if(school && school != null){
             this.node.getChildByName('title').getComponent(cc.Label).string = school;
         }
 
         if(name && name != null){
             if(this.node.getChildByName('title').getComponent(cc.Label).string == '')this.node.getChildByName('title').getComponent(cc.Label).string += name;
             else this.node.getChildByName('title').getComponent(cc.Label).string +=  (' - ' +name);
         }
 
         if(roleLevel && roleLevel != null){
             this.node.getChildByName('title').getComponent(cc.Label).string += ('Lv.' + roleLevel);
         }
 
         if(winScore && winScore != null){
             this.node.getChildByName('winlabel').getComponent(cc.Label).string = (winScore+'场');
         }
         
    },

    onLoad () {
       

    },

    start () {

    },

    // update (dt) {},
});
