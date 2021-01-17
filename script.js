/* eslint-disable no-alert */

/**************
 *   SLICE 1
 **************/

function updateCoffeeView(coffeeQty) {
  document.querySelector('#coffee_counter').innerText = coffeeQty;
}

function clickCoffee(data) {
  data.coffee += 1;
  updateCoffeeView(data.coffee);
  renderProducers(data);
}

/**************
 *   SLICE 2
 **************/

function unlockProducers(producers, coffeeCount) {
  producers.forEach((prod) => {
    if (coffeeCount >= prod.price / 2) {
      prod.unlocked = true;
    }
  });
}

function getUnlockedProducers(data) {
  return data.producers.filter((prod) => prod.unlocked === true);
}

function makeDisplayNameFromId(id) {
  return id
    .split('_')
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(' ');
}

// You shouldn't need to edit this function-- its tests should pass once you've written makeDisplayNameFromId
function makeProducerDiv(producer, index) {
  const containerDiv = document.createElement('div');
  containerDiv.className = 'producer';
  const displayName = makeDisplayNameFromId(producer.id);
  const currentCost = producer.price;
  const html = `
  <div class="producer-column">
    <div class="producer-title">${displayName}</div>
    <button type="button" id="buy_${producer.id}">Buy</button>
  </div>
  <div class="producer-column">
    <div>Quantity: ${producer.qty}</div>
    <div>Coffee/second: ${producer.cps}</div>
    <div id='${index}' class='cpcs'>Cost per coffee/second: ${Math.round(
    currentCost / producer.cps
  )}</div>
    <div>Cost: ${currentCost} coffee</div>
  </div>
  `;
  containerDiv.innerHTML = html;
  return containerDiv;
}

function deleteAllChildNodes(parent) {
  while (parent.firstChild !== null) {
    parent.removeChild(parent.firstChild);
  }
}

function renderProducers(data) {
  unlockProducers(data.producers, data.coffee);
  let unlocked = getUnlockedProducers(data);
  let prodContain = document.querySelector('#producer_container');
  deleteAllChildNodes(prodContain);
  unlocked.forEach((prod, index) =>
    prodContain.appendChild(makeProducerDiv(prod, index))
  );
}

/**************
 *   SLICE 3
 **************/

function getProducerById(data, producerId) {
  return data.producers.filter((prod) => prod.id === producerId)[0];
}

function canAffordProducer(data, producerId) {
  let producer = getProducerById(data, producerId);
  if (data.coffee >= producer.price) {
    return true;
  }
  return false;
}

function updateCPSView(cps) {
  document.querySelector('#cps').innerText = cps;
}

function updatePrice(oldPrice) {
  return Math.floor(oldPrice * 1.25);
}

function attemptToBuyProducer(data, producerId) {
  let producer = getProducerById(data, producerId);
  let bool = canAffordProducer(data, producerId);
  if (bool === true) {
    producer.qty += 1;
    data.coffee -= producer.price;
    producer.price = updatePrice(producer.price);
    data.totalCPS += producer.cps;
  }
  return bool;
}

function buyButtonClick(event, data) {
  let producerID;
  if (event.target.id !== undefined) {
    producerID = event.target.id.slice(4);
  }
  let eventy = event.target.tagName;
  if (eventy === 'BUTTON') {
    if (canAffordProducer(data, producerID) === false) {
      window.alert('Not enough coffee!');
    } else {
      attemptToBuyProducer(data, producerID);
      renderProducers(data);
      updateCPSView(data.totalCPS);
      updateCoffeeView(data.coffee);
      bestProd();
    }
  }
}

function tick(data) {
  data.coffee += data.totalCPS;
  updateCoffeeView(data.coffee);
  renderProducers(data);
  updateCPSView(data.totalCPS);
}

function bestProd(data) {
  let prods = Array.from(document.querySelectorAll('.cpcs'));
  let min = parseInt(prods[0].innerText.slice(24));
  let childNum;
  for (let i = 1; i < prods.length; i++) {
    if (parseInt(prods[i].innerText.slice(24)) < min) {
      console.log(prods[i].id);
      min = parseInt(prods[i].innerText.slice(24));
      childNum = i;
    }
  }
  document.getElementById(`${childNum}`).style.background = 'green';

  // document.getElementById(`${childNum}`).parent.css('background-color', 'green');
}
/*************************
 *  Local Storage!
 *************************/

function store(data) {
  localStorage.setItem('data', JSON.stringify(data));
  oldData = JSON.parse(localStorage.getItem('data'));
}

function restart() {
  localStorage.clear();
  data = {
    coffee: 0,
    totalCPS: 0,
    producers: [
      {
        id: 'chemex',
        price: 10,
        unlocked: false,
        cps: 1,
        qty: 0,
      },
      {
        id: 'french_press',
        price: 50,
        unlocked: false,
        cps: 2,
        qty: 0,
      },
      {
        id: 'mr._coffee',
        price: 100,
        unlocked: false,
        cps: 5,
        qty: 0,
      },
      {
        id: 'ten_cup_urn',
        price: 500,
        unlocked: false,
        cps: 10,
        qty: 0,
      },
      {
        id: 'espresso_machine',
        price: 1000,
        unlocked: false,
        cps: 20,
        qty: 0,
      },
      {
        id: 'ten_gallon_urn',
        price: 5000,
        unlocked: false,
        cps: 50,
        qty: 0,
      },
      {
        id: 'coffeeshop',
        price: 10000,
        unlocked: false,
        cps: 75,
        qty: 0,
      },
      {
        id: 'coffee_factory',
        price: 50000,
        unlocked: false,
        cps: 100,
        qty: 0,
      },
      {
        id: 'coffee_fountain',
        price: 100000,
        unlocked: false,
        cps: 200,
        qty: 0,
      },
      {
        id: 'coffee_river',
        price: 500000,
        unlocked: false,
        cps: 500,
        qty: 0,
      },
      {
        id: 'coffee_ocean',
        price: 1000000,
        unlocked: false,
        cps: 1000,
        qty: 0,
      },
      {
        id: 'coffee_planet',
        price: 5000000,
        unlocked: false,
        cps: 2000,
        qty: 0,
      },
    ],
  };
}

/*************************
 *  Start your engines!
 *************************/

// You don't need to edit any of the code below
// But it is worth reading so you know what it does!

// So far we've just defined some functions; we haven't actually
// called any of them. Now it's time to get things moving.

// We'll begin with a check to see if we're in a web browser; if we're just running this code in node for purposes of testing, we don't want to 'start the engines'.

// How does this check work? Node gives us access to a global variable /// called `process`, but this variable is undefined in the browser. So,
// we can see if we're in node by checking to see if `process` exists.
if (typeof process === 'undefined') {
  // Get starting data from the window object
  // (This comes from data.js)

  let data;
  if (localStorage.getItem('data')) {
    data = JSON.parse(localStorage.getItem('data'));
  } else {
    data = window.data;
  }

  // Add an event listener to the giant coffee emoji
  const bigCoffee = document.getElementById('big_coffee');
  bigCoffee.addEventListener('click', () => clickCoffee(data));

  // Add an event listener to the container that holds all of the producers
  // Pass in the browser event and our data object to the event listener
  const producerContainer = document.getElementById('producer_container');
  producerContainer.addEventListener('click', (event) => {
    buyButtonClick(event, data);
  });

  const restartButton = document.querySelector('#restart');

  restartButton.addEventListener('click', (event) => {
    restart();
    data = window.data;
  });

  // Call the tick function passing in the data object once per second
  setInterval(() => tick(data), 1000);

  setInterval(() => store(data), 1000);
}
// Meanwhile, if we aren't in a browser and are instead in node
// we'll need to exports the code written here so we can import and
// Don't worry if it's not clear exactly what's going on here;
// We just need this to run the tests in Mocha.
else if (process) {
  module.exports = {
    updateCoffeeView,
    clickCoffee,
    unlockProducers,
    getUnlockedProducers,
    makeDisplayNameFromId,
    makeProducerDiv,
    deleteAllChildNodes,
    renderProducers,
    updateCPSView,
    getProducerById,
    canAffordProducer,
    updatePrice,
    attemptToBuyProducer,
    buyButtonClick,
    tick,
  };
}
