var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var _ = require('underscore');

app.get('/', function(req, res, next) {
  res.sendFile(__dirname + '/public/index.html')
});

app.use(express.static('public'));


var players = {
  team1: {},
  team2: {},
  turn: {}
};


const getRandomObjectFromArray = function(arrayOfObjects) {
  if (arrayOfObjects.length === 0) {
    return null;
  }
  return _.sample(arrayOfObjects);
};

let clients = [];

var clientCount = 0;
io.on('connection', function(client) {
  console.log('Client connected...');
  client.on('join', function(data) {
    console.log(data.name+ 'has joined');
    clientCount++;
    clients.push({ id: clientCount, index: clientCount, name : data.name});
    console.log('totalClients', clientCount);
    console.log(clients);
  });




  function card(value, name, suit, index, code){
    this.value = value;
    this.name = name;
    this.suit = suit;
    this.index = index;
    this.code =  code;
  }

  var cards = [];
  function deck(){
    this.names = ['1', '2', '3', '4', '5', '6', '7', '9', '10', 'J', 'Q', 'K'];
    this.suits = ['Hearts','Diamonds','Spades','Clubs'];
    let index = 0;
    for( var s = 0; s < this.suits.length; s++) {
      for( var n = 0; n < this.names.length; n++ ) {
        index++;
        let code = (s+1) + this.names[n];
        cards.push( new card( n+1, this.names[n], this.suits[s], index, code));
      }
    }
    return cards;
  }
  
  
  client.on('claim', function (data) {
    let cardFound = false;
    let responseObj = {};

    //let user = _.findWhere(clients, {id : data.to});
    let deletedCard;
    let clientDetails = {};

    for(let i=0; i<clients.length; i++){
      if(clients[i].id == data.to){
        clientDetails.to_name = clients[i].name;
        let cards = clients[i].cards;
        for(let j=0; j<cards.length; j++){
          if(cards[j].code == data.cardCode){
            cardFound = true;
            deletedCard =  cards[j];
            clients[i].cards.splice(j, 1);
            break;
          }
        }
      }
    }

    for(let k=0; k<clients.length; k++){
      if(clients[k].id = data.from){
        clientDetails.from_name = clients[k].name;
        clientDetails.card_name = deletedCard.name + ' ' + deletedCard.suit;
        clients[k].cards.push(deletedCard);
        break;
      }
    }
    if(cardFound){
      responseObj.data = clients;
      responseObj.code = 200;
      responseObj.status = 'card_found';
      responseObj.turn = data.from;
    } else {
      responseObj.data = clients;
      responseObj.code = 402;
      responseObj.status = 'card_not_found';
      responseObj.turn = data.to;
    }
    client.emit('clients', responseObj);
    client.broadcast.emit('clients', responseObj);

    client.emit('msgs', Object.assign(responseObj, clientDetails));
    client.broadcast.emit('msgs', Object.assign(responseObj, clientDetails));
  })


  client.on('startGame', function (clientName) {
    let responseObj = {};
    let deckCards = deck();
    let numberOfClients = clients.length;
    let bots =  6 - numberOfClients;
    let cardArray = [...deckCards];
    let loopCount = parseInt(deckCards.length/ 6);
    let randomCard = [];
    for(let i=0; i<bots; i++){
      clients.push({name:'bot-'+ (i+1), type: 'bot'});
    }
     let shuffledArray = _.shuffle(clients.keys());


    //Teams Seperation
    for(let i=0;i<shuffledArray; i++){
      let cli = [];
      cli.push(clients[shuffledArray[i]]);
      if(i = (shuffledArray.length / 2) - 1){
        players['team1']['clients'] = cli;
        clients[shuffledArray[i]]['team'] = 'team_1'

      } else {
        players['team2']['clients'] = cli;
        clients[shuffledArray[i]]['team'] = 'team_2'
      }
    }

   /* let randomTurnIndex =  _.sample(shuffledArray);
    players['turn']['player'] = clients[randomTurnIndex].id;
    players['turn']['team'] =  clients[randomTurnIndex].team;*/

    players['turn']['player'] = clients[0].id;
    players['turn']['team'] =  clients[0].team;

    //Cards for Clients
    for(let i=0; i<loopCount; i++) {
      console.log('cardArray-->', cardArray);
      for (let j = 0; j < clients.length; j++) {
        randomCard = getRandomObjectFromArray(cardArray);
       let index =  _.findLastIndex(cardArray, {index : randomCard.index});
        cardArray.splice(index, 1);
        if (!_.has(clients[j], 'cards')) {
          clients[j]['cards'] = [];
          clients[j]['cards'].push(randomCard);
        } else {
          clients[j]['cards'].push(randomCard);
        }
      }
    }
    responseObj.data = clients;
    responseObj.code = 200;
    responseObj.status = 'clients_segregrated';
    responseObj.turn =  players['turn'];
    client.emit('clients', responseObj);
    client.broadcast.emit('clients', responseObj);
    console.log('cardArray',  JSON.stringify(cardArray));
  })

  client.on('messages', function(data){
    client.emit('thread', {personName : data.personName, message : data.message});
    client.broadcast.emit('thread', {personName : data.personName, message : data.message});
  });
});

server.listen(7777);