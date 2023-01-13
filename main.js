var worker;

function doSearch() {
  // Disable the button, so the user can't start more than one search
  // at the same time.
  searchButton.disabled = true;

  // Create the worker.
  worker = new Worker("PrimeWorker.js");

  // Hook up to the onMessage event, so you can receive messages
  // from the worker.
  worker.onmessage = receivedWorkerMessage;

  // Get the number range, and send it to the web worker.
  var fromNumber = document.getElementById("from").value;
  var toNumber = document.getElementById("to").value;

  worker.postMessage(
    {
      from: fromNumber,
      to: toNumber
    }
  );

  // Let the user know that things are on their way.
  statusDisplay.innerHTML = "A web worker is on the job (" +
    fromNumber + " to " + toNumber + ") ...";


  function receivedWorkerMessage(event) {
    // Get the prime number list.
    var primes = event.data;

    // Copy the list to the page.
    // Take the results (an array of prime numbers), loop over it,
    // and paste all the primes together into one long piece of text.
    var primeList = "";
    for (var i = 0; i < primes.length; i++) {
      primeList += primes[i];
      if (i != primes.length - 1) primeList += ", ";
    }

    // Show the prime number list on the page.
    var displayList = document.getElementById("primeContainer");
    displayList.textContent = primeList;

    // Update the status text to tell the user what just happened.
    var statusDisplay = document.getElementById("status");
    if (primeList.length == 0) {
      statusDisplay.textContent = "Search didn't find any results.";
    }
    else {
      statusDisplay.textContent = "The results are here!";
    }

    // Allow more searches.
    searchButton.disabled = false;
  }

}







