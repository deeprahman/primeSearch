var statusDisplay;
var worker;
var searchButton;

window.onload = function() {
  statusDisplay = document.getElementById("status");
  searchButton = document.getElementById("searchButton");
};

function doSearch() {
  // Get the two numbers in the text boxes. This is the search range.
  searchButton.disabled = true;

  var fromNumber = document.getElementById("from").value;
  var toNumber = document.getElementById("to").value;

  // Ordinarily you would give the web worker JavaScript in a separate
  // file, using a line of code like this.  
  //worker = new Worker("PrimeWorker.js");
  
  // Because this example is hosted on CodePen,
  // which doesn't let you use separate JS files,
  // we need to use a workaround to grab the
  // PrimeWorker.js code from the findPrimes() function
  // on this page.  
  var blob = new Blob([document.querySelector('#FindPrimes').textContent]); 
  blobURL = window.URL.createObjectURL(blob);

  worker = new Worker(blobURL);
  worker.onmessage = receivedWorkerMessage;
  worker.onerror = workerError;
  
  worker.postMessage(
   { from: fromNumber,
     to: toNumber
   }
  );

  statusDisplay.innerHTML = "A web worker is on the job ("+
   fromNumber + " to " + toNumber + ") ...";  
}

function receivedWorkerMessage(event) {
  var message = event.data;

  if (message.messageType == "PrimeList") {
    var primes = message.data;

    // Show the prime number list on the page.
    var primeList = "";
    for (var i=0; i<primes.length; i++) {
      primeList += primes[i];
      if (i != primes.length-1) primeList += ", ";
    }
    var displayList = document.getElementById("primeContainer");
    displayList.innerHTML = primeList;

    if (primeList.length == 0) {
      statusDisplay.innerHTML = "Search failed to find any results.";
    }
    else {
      statusDisplay.innerHTML = "The results are here!";
    }
    searchButton.disabled = false;
  }
  else if (message.messageType == "Progress") {
    statusDisplay.innerHTML = message.data + "% done ...";
  }
}

function workerError(error) {
  statusDisplay.innerHTML = error.message;
}

function cancelSearch() {
  worker.terminate();
  worker = null;
  statusDisplay.innerHTML = "Search cancelled.";
  searchButton.disabled = false;
}
