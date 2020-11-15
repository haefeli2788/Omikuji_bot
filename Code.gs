var CHANNEL_ACCESS_TOKEN = '2gaNhrydIk2w0L7Cs/lMLPC9tWReB/5npIR8wlIyV/nvDBB/6aLACzN+4DA6Y4hQDSn4/z2A7EeF/cMCKq+BhTjNtugAyFCJeNUEycZZcsqc54fcanHp/keAtysrc0+vBcsPzVwygalfAjZBxVgkswdB04t89/1O/w1cDnyilFU=';
var line_endpoint = 'https://api.line.me/v2/bot/message/reply';

//ポストで送られてくるので、ポストデータ取得
//JSONをパースする
function doPost(e) {
var json = JSON.parse(e.postData.contents);

//返信するためのトークン取得
var reply_token= json.events[0].replyToken;
if (typeof reply_token === 'undefined') {
return;
}

//送られたLINEメッセージを取得
var user_message = json.events[0].message.text;
var reply_messages;
  if('おみくじ' == user_message){
//スプレッドAppを呼出し
    var ss = SpreadsheetApp.getActiveSpreadsheet();
//シートを取得
    var sheet = ss.getSheetByName("sheet1");
//シートの最終行取得
    var lastRow = sheet.getLastRow();
//最終行までのランダムな列を取得
    var row = Math.ceil(Math.random() * (lastRow-1)) + 1;
//ランダムなセル情報を取得
    reply_messages = [ sheet.getRange(row, 1).getValue(),];
  }
   else{
    reply_messages = ['「おみくじ」と入れて下さい'];
  }

// メッセージを返信
var messages = reply_messages.map(function (v) {
return {'type': 'text', 'text': v};
});
UrlFetchApp.fetch(line_endpoint, {
'headers': {
'Content-Type': 'application/json; charset=UTF-8',
'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
},
'method': 'post',
'payload': JSON.stringify({
'replyToken': reply_token,
'messages': messages,
}),
});
return ContentService.createTextOutput(JSON.stringify({'content': 'post ok'})).setMimeType(ContentService.MimeType.JSON);
}
