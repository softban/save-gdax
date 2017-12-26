
const fs = require('fs');
const websocket = require('websocket').w3cwebsocket;
const client = new websocket('wss://ws-feed.gdax.com', 'echo-protocol');
const subscription = require('./subscribe.json');

console.log('{save.GDAX}')
var TRADES = 0;
var PRICE = 0;

client.onerror = function() { console.log('{!} connection error.') };
client.onclose = function() { console.log('{!} connection closed.'); };
client.onopen = function() {
  console.log('{!} sending subscription.');
  client.send( JSON.stringify(subscription) );
  console.log('{!} client connected.');

  setInterval(() => {
    process.stdout.clearLine();  // clear current text
    process.stdout.cursorTo(0);  // move cursor to beginning of line
    process.stdout.write(`{session} live-price: ${PRICE.toFixed(2)} trades: ${TRADES}`);
  }, 4000);

};

client.onmessage = function(request) {
  let response = JSON.parse(request.data);
  if (response.type === "ticker" && response.trade_id != undefined) {
    TRADES++
    PRICE=parseInt(response.price);
    fs.appendFile("data.csv", `${response.trade_id}, ${response.sequence}, ${response.time}, ${response.price}, ${response.side}, ${response.last_size}\n`);
  }
};
