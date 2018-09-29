// initializing socket, connection to server
var socket = io.connect('http://localhost:7777');
var person;
socket.on('connect', function(data) {
  socket.emit('join',{name : person, type: 'client'});
});

// listener for 'thread' event, which updates messages
socket.on('thread', function(data) {
  $('#thread').append('<li>' + data.personName +':' + data.message + '</li>');
});


socket.on('clients', function (response) {
  console.log('response', response);
  if(response.code = 200){
    response.data.forEach(function(item) {
      if(item.name === person){
        $('#cards').html(JSON.stringify(item.cards));
      }
    })
  }
})


socket.on('msgs', function (data) {
  $('#thread').append('<li>' + data.from_name +'has asked' + data.card_name + 'to' + data.to_name + '</li>');
})


// prevents form from submitting and sends a message to server
$('form').submit(function(){
  var message = $('#message').val();
  socket.emit('messages', {personName : person, message: message});
  this.reset();
  return false;
});



$(function() {
  person = prompt("Please enter your name", "");
})



function getTurn(data){
  let initalturn = Math.floor(Math.random() * Math.floor(6));
  if(data[initalturn].type === 'client'){

  } else {

  }

}


function claim () {
  let cardCode = prompt("Please enter your cardcode", "");
  socket.emit('claim', {from: 1 , to : 2 ,cardCode :  cardCode})
  console.log()
//'claiming 2 hearts'
}



function startGame (){
  socket.emit('startGame', person);
}