//競技場暫存
module.exports = {
    //競技場使用 socket.io 連接url
    // SocketIO_URL : 'http://192.168.0.3:1337', 
    SocketIO_URL : 'http://nj-socketio.azurewebsites.net/', 
    // SocketIO_URL : 'https://nj-socketio.azurewebsites.net/', 
    
    Client_debug : 'debug',//debug
    Client_ArenaList : 'ArenaListCallback',//競技場回傳
    Client_Connect : 'ConnectCallback',//進入單一競技場回傳
    Client_Restart : 'RestartCallback',//重新刷新競技場
    Client_showRoom : 'showRooms',//顯示該競技場的更新
    Client_CancelFightCallback : 'CancelFightCallback',//離開配對是否成功
    Client_ReadyCallback : 'Ready4FightCallback',//連接配對 系統馬上給予自己的資訊
    Client_GameStart : 'Game_Start',//已經配對 系統給予雙方 房間訊息
    Client_RoleAnwser : 'RoleAnswer',//兩方其中一方的答題動做
    Client_AnswerCallback : 'AnswerCallback',//答題結束回傳
    Client_UseItemsCallBack : 'UseItemsCallBack',//使用道具
    Client_AttackCallback : 'AttackCallBack',//攻擊回傳
    Client_GameNextCallBack : 'GameNextCallBack',//下一步
    Client_Victory : 'Victory',//勝利或是失敗


    //service socket.io Receive key
    Service_doArenaList : 'doArenaList',//要求取得競技場陣列
    Service_doConnect : 'doConnect',//連接競技場「區域」
    Service_doReady4Fight : 'doReady4Fight',//進入配對
    Service_CancelFight : 'CancelFight',//離開配對
    Service_Waitting : 'WaittingLong',//超過幾秒，呼叫機器人配對
    Service_Answer : 'Answer',//答題
    Service_doUseItems : 'doUseItems',//使用道具
    Service_doAttack : 'Attack',//攻擊
    Service_doGameNext : 'GameNext',//下一步
};