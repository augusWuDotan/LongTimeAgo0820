var jsb_reflection = {
    
   //播放音檔
    PlayMusicUseNactiveModel(AudioPath){
        if (CC_JSB) {
            if(cc.sys.os === cc.sys.OS_ANDROID){
                //音效
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "PlayMusic", "(Ljava/lang/String;)V", AudioPath);
            }else if(cc.sys.os === cc.sys.OS_IOS){
                //ios
                var isSuccess = jsb.reflection.callStaticMethod("NativeOcClass", "playAudio:",AudioPath);        
                console.log(isSuccess);
            }else{
                console.log('no device');
            } 
        }
    },
    
    //destroy audio model
    DestroyMusicNactiveModel(){
        if (CC_JSB) {
            if(cc.sys.os === cc.sys.OS_ANDROID){
                //android
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "destroyMusic", "(Ljava/lang/String;)V", 'finish');
            }else if(cc.sys.os === cc.sys.OS_IOS){
                //ios
                jsb.reflection.callStaticMethod("NativeOcClass", "destroyPlayer");
            }else{
                console.log('no device');
            }  
        }
    },

    //觸發震動 Vibrate
    doVibrate(){
        if(CC_JSB){
            if(cc.sys.os === cc.sys.OS_ANDROID){
                //android
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "doVibrate","(I)V", 300);//震動
            }else if(cc.sys.os === cc.sys.OS_IOS){
                //ios
                jsb.reflection.callStaticMethod("NativeOcClass", "vibrate");
            }
        }
    },

    LoadZip(){
        if(CC_JSB){
            if(cc.sys.os === cc.sys.OS_ANDROID){
                //android
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "LoadZip","(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", "path","filename","FileExtension");
            }else if(cc.sys.os === cc.sys.OS_IOS){
                //ios
                // jsb.reflection.callStaticMethod("NativeOcClass", "vibrate");
            }
        }
    },
};
module.exports = jsb_reflection;