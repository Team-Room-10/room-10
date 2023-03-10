'use strict'

require('dotenv').config();
const PORT = process.env.PORT || 3006;
const { io } = require('socket.io-client');
const socket = io(`http://localhost:${PORT}/room10`);
const { prompt } = require('enquirer');
console.log(process.env.PORT);
let timer = 5;

socket.on('main-menu', mainMenu);
socket.on('start-game', async () => {
  console.log('Get ready to begin');
  setInterval(advanceTimer, 1000);
});

async function mainMenu() {
  let { haveAccount } = await prompt({
    type: 'input',
    name: 'haveAccount',
    message: 'Press 1 if you want to sign into an existing account.\n  Press 2 if you want to create an account.\n  Press 3 if you want to continue as a guest.'
  })

  if (haveAccount === '1') {
    let credentials = await getCredentials();
    socket.emit('login', credentials);
  } else if (haveAccount === '2') {
    let credentials = await getCredentials();
    socket.emit('create-account', credentials);
  } else if (haveAccount === '3') {
    console.log('Continuing as guest');
    socket.emit('continue-guest');
  } else {
    mainMenu();
  }
}

async function getCredentials() {
  let { username } = await prompt({
    type: 'input',
    name: 'username',
    message: 'Please enter your username'
  })
  
  let { password } = await prompt({
    type: 'input',
    name: 'password',
    message: 'Please enter your password'
  })

  let credentials = { username, password };
  return credentials

}

function advanceTimer() {
  if (timer > 0) {
    console.log(timer);
  }
  timer -= 1;
}

// async function signup
// function continueGuest
