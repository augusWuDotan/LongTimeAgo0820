cc.Class({
    extends: cc.Component,

    properties: {
        Audio_ArenaListScene:{
            default: null,
            url: cc.AudioClip
        },
        Audio_ArenaRankScene:{
            default: null,
            url: cc.AudioClip
        },
        Audio_ArenaFightLoadingScene:{
            default: null,
            url: cc.AudioClip
        },
        Audio_ArenaFightScene:{
            default: null,
            url: cc.AudioClip
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.useAudio = null;
        this.useAudioID = null;
    },

    //競技場 ArenaList
    PlayArenaList() {
        if(this.useAudio != this.Audio_ArenaListScene){
            this.useAudio = this.Audio_ArenaListScene;
            if(this.useAudioID!=null)cc.audioEngine.stop(this.useAudioID);
            if(this.Audio_ArenaListScene) this.useAudioID = cc.audioEngine.play(this.Audio_ArenaListScene, true, 0.1);
        }else{
            //null
        }     
    },

    //競技場 Rank
    PlayArenaRank() {
        if(this.useAudio != this.Audio_ArenaRankScene){
            this.useAudio = this.Audio_ArenaListScene;
            if(this.useAudioID!=null)cc.audioEngine.stop(this.useAudioID);
            if(this.Audio_ArenaRankScene) this.useAudioID = cc.audioEngine.play(this.Audio_ArenaRankScene, true, 0.1);
        }else{
            //null
        }   
    },

    //競技場 FightLoad
    PlayArenaFightLoading() {

        if(this.useAudio != this.Audio_ArenaFightLoadingScene){
            this.useAudio = this.Audio_ArenaListScene;
            if(this.useAudioID!=null)cc.audioEngine.stop(this.useAudioID);
            if(this.Audio_ArenaFightLoadingScene) this.useAudioID = cc.audioEngine.play(this.Audio_ArenaFightLoadingScene, false, 1);
        }else{
            //null
        }   
    },

    //競技場 Fight
    PlayArenaFight() {
        if(this.useAudio != this.Audio_ArenaFightScene){
            this.useAudio = this.Audio_ArenaListScene;
            if(this.useAudioID!=null)cc.audioEngine.stop(this.useAudioID);
            if(this.Audio_ArenaFightScene) this.useAudioID = cc.audioEngine.play(this.Audio_ArenaFightScene, true, 0.2);
        }else{
            //null
        }   
    },

    //停止現在正在播放的所有音效
    stopAllAudio(){
        if(this.useAudioID!=null)cc.audioEngine.stop(this.useAudioID);
    },



    // start () {},

    // update (dt) {},
});
