
cc.Class({
    extends: cc.Component,

    properties: {
      badge1:{
          default:null,
          type:cc.Node
      },
      badge2:{
        default:null,
        type:cc.Node
    },
    badge3:{
        default:null,
        type:cc.Node
    },
    badge4:{
        default:null,
        type:cc.Node
    },
    badge5:{
        default:null,
        type:cc.Node
    },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
        
        
    },

    start () {},

    init(titleLevel){
        this.titleLevel = titleLevel;

        if(this.titleLevel && this.titleLevel >= 1)  this.badge1.active = true;
        else this.badge1.active = false;

        if(this.titleLevel && this.titleLevel >= 2 )  this.badge2.active = true;
        else this.badge2.active = false;
        
        if(this.titleLevel && this.titleLevel >= 3)  this.badge3.active = true;
        else this.badge3.active = false;
        
        if(this.titleLevel && this.titleLevel >= 4)  this.badge4.active = true;
        else this.badge4.active = false;
        
        if(this.titleLevel && this.titleLevel >= 5)  this.badge5.active = true;
        else this.badge5.active = false;
        
    },

    // update (dt) {},
});
