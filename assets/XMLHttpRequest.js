// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // start () {},

    // update (dt) {},

    // 送出請求的主要方法
    sendRequest (url, method, header, body, callback) {
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.responseType = 'json';
        
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                callback(response, null);
            } else if (xhr.readyState == 4) {
                callback(null, xhr.statusText);
            }
        };

        xhr.onerror = function () {
            callback(null, "** An error occurred during the transaction");
        };

        xhr.open(method, url);

        if (header != null) {
            for (i = 0; i < header.length; i++) {
                xhr.setRequestHeader(header[i].key, header[i].value);
            }
        }
        
        if (body != null) {
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(JSON.stringify(body));
        } else {
            xhr.send();
        }
    },

    // 從愛美語後台取得 token
    serverAccess (callback) {
        var body = {
            'server_account': 'Melody',
            'server_password': 'Melody12345'
        };

        this.sendRequest('https://bjapp-api.chinacloudsites.cn/api/Student/ServerAccess', 'POST', null, body, function(data, error) {
            if (error != null) {
                callback(null, error);
            } else {
                var json = JSON.parse(data);
                callback(json, null);
            }
        });
    },

    // 從愛美語後台登入並取得龍潭後台要用的 token
    loginForDragon (token, account, password, callback) {
        var header = [{
            'key': 'Server_Token',
            'value': token
        }];

        var body = {
            'account': account,
            'password': password
        };

        this.sendRequest('https://bjapp-api.chinacloudsites.cn/api/Student/LoginForDragon', 'POST', header, body, function(data, error) {
            if (error != null) {
                callback(null, error);
            } else {
                var json = JSON.parse(data);
                callback(json, null);
            }
        });
    },

    // 從龍潭的後台取得使用者資料，使用者身份由上一個 api 取得的 token 決定
    members (token, callback) {
        var header = [{
            'key': 'Server_Token',
            'value': token,
        }];

        this.sendRequest('http://dragon-api.azurewebsites.net/api/Members', 'POST', header, null, function(data, error) {
            if (error != null) {
                callback(null, error);
            } else {
                var json = JSON.parse(data);
                callback(json, null)
            }
        });
    },

    // 取得劇情
    introduce (token, storyPackageID, storeName, callback) {
        var header = [{
            'key': 'Server_Token',
            'value': token,
        }];

        this.sendRequest('http://dragon-api.azurewebsites.net/api/Introduce?StoryPackageID=' + storyPackageID + '&StoreName=' + storeName, 'GET', header, null, function(data, error) {
            if (error != null) {
                callback(null, error);
            } else {
                var json = JSON.parse(data);
                callback(json, null)
            }
        });
    },

    // 取得武器和裝備店的物品
    getEquipmentShopGoodsList (token, id, shopType, callback) {
        var header = [{
            'key': 'Server_Token',
            'value': token,
        }];

        this.sendRequest('http://dragon-api.azurewebsites.net/api/Shops/' + id + '?ShopType=' + shopType, 'GET', header, null, function(data, error) {
            if (error != null) {
                callback(null, error);
            } else {
                var json = JSON.parse(data);
                callback(json, null)
            }
        });
    },

    // 購買武器店或裝備店的物品
    buyEquipmentShopGoods (token, keyCode, callback) {
        var header = [{
            'key': 'Server_Token',
            'value': token,
        }];

        var body = {
            'keyCode': keyCode
        };
        
        this.sendRequest('http://dragon-api.azurewebsites.net/api/Shops', 'POST', header, body, function(data, error) {
            if (error != null) {
                callback(null, error);
            } else {
                var json = JSON.parse(data);
                callback(json, null)
            }
        });
    },

    // 取得道具店物品
    getItemShopGoodsList (token, callback) {
        var header = [{
            'key': 'Server_Token',
            'value': token,
        }];

        this.sendRequest('http://dragon-api.azurewebsites.net/api/Props', 'GET', header, null, function(data, error) {
            if (error != null) {
                callback(null, error);
            } else {
                var json = JSON.parse(data);
                callback(json, null)
            }
        });
    },

    // 購買道具店物品
    buyItemShopGoods (token, id, count, callback) {
        var header = [{
            'key': 'Server_Token',
            'value': token,
        }];

        var body = {
            'PropsPrototype_ID': id,
            'Count': count
        };
        
        this.sendRequest('http://dragon-api.azurewebsites.net/api/Props', 'POST', header, body, function(data, error) {
            if (error != null) {
                callback(null, error);
            } else {
                var json = JSON.parse(data);
                callback(json, null)
            }
        });
    },

    // 取得技能店物品
    getSkillShopGoodsList (token, callback) {
        var header = [{
            'key': 'Server_Token',
            'value': token,
        }];

        this.sendRequest('http://dragon-api.azurewebsites.net/api/Skills', 'GET', header, null, function(data, error) {
            if (error != null) {
                callback(null, error);
            } else {
                var json = JSON.parse(data);
                callback(json, null)
            }
        });
    },

    // 購買技能店物品
    buySkillShopGoods (token, id, callback) {
        var header = [{
            'key': 'Server_Token',
            'value': token,
        }];

        var body = {
            'SkillPrototype_ID': id
        };
        
        this.sendRequest('http://dragon-api.azurewebsites.net/api/Skills', 'POST', header, body, function(data, error) {
            if (error != null) {
                callback(null, error);
            } else {
                var json = JSON.parse(data);
                callback(json, null)
            }
        });
    },

     // 取得武器和裝備店的物品
     getLearnList (LearnId, callback) {
       
        this.sendRequest('http://dragon-api.azurewebsites.net/API/Learn/?id=' + LearnId , 'GET', null, null, function(data, error) {
            if (error != null) {
                callback(null, error);
            } else {
                var json = JSON.parse(data);
                callback(json, null)
            }
        });
    },

    //取得 MailBoxList
    getMemberMailBoxList(userToken,callback) {

        var header = [{
            'key': 'Server_Token',
            'value': userToken,
        }];

      
        this.sendRequest('http://dragon-api.azurewebsites.net/api/MailBox', 'GET', header, null, function(data, error) {
            if (error != null) {
                callback(null, error);
            } else {
                var json = JSON.parse(data);
                callback(json, null)
            }
        });

    },


     //取得 MailBoxList
     getMemberMailBoxItem(userToken,MailBoxId,callback) {

        var header = [{
            'key': 'Server_Token',
            'value': userToken,
        }];

      
        this.sendRequest('http://dragon-api.azurewebsites.net/api/MailBox?id='+MailBoxId, 'GET', header, null, function(data, error) {
            if (error != null) {
                callback(null, error);
            } else {
                var json = JSON.parse(data);
                callback(json, null)
            }
        });

    },

     //取得 關卡資訊
     getStory(userToken,StoryMainAction_Number,callback) {

        console.log('StoryMainAction_Number:'+StoryMainAction_Number);

        var header = [{
            'key': 'Server_Token',
            'value': userToken,
        }];

      
        this.sendRequest('https://dragon-api.azurewebsites.net/api/Storys?id='+StoryMainAction_Number, 'GET', header, null, function(data, error) {
            if (error != null) {
                callback(null, error);
            } else {
                var json = JSON.parse(data);
                callback(json, null)
            }
        });

    },

});
