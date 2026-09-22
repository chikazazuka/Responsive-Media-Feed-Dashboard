// STEP 1: First we get connection object from the browser.

// We checked and figured not every browser supports navigator.connection.
var connection = navigator.connection;

// STEP 2: This function looks at the connection and decides fast, medium or slow.
function getNetworkState() {
  // Since some browsers does not support the connection object we cannot know,

  // so we just say "fast" and show the normal page.
  if (!connection) {
    return "fast";
  }

  // So this block of code will read the 3 items we need from the connection object
  var type = connection.effectiveType; // "4g", "3g", "2g" or "slow-2g"
  var speed = connection.downlink; // download speed
  var saving = connection.saveData; // true or false if the user turn on data saver?

  // For SLOW 2g internet
  if (saving === true || type === "2g" || type === "slow-2g") {
    return "slow";
  }

  // MEDIUM: 3g, or the speed is under 1.5 Mbps even if it says 4g
  if (type === "3g" || speed < 1.5) {
    return "medium";
  }

  // FAST: everything else
  return "fast";
}

// STEP 3: This function will put the numbers in the Network Diagnostics panel.

// The ids (#connection-type, #connection-speed and #connection-saver) are in the index.html file.
function updateDiagnostics(state) {
  document.getElementById("network-state").textContent = state;

  // no connection means there is nothing to show on the website
  if (!connection) {
    document.getElementById("connection-type").textContent = "not supported";
    document.getElementById("connection-speed").textContent = "-";
    document.getElementById("connection-saver").textContent = "-";
    return;
  }

  document.getElementById("connection-type").textContent =
    connection.effectiveType;
  document.getElementById("connection-speed").textContent =
    connection.downlink + " Mbps";
  document.getElementById("connection-saver").textContent = connection.saveData
    ? "On"
    : "Off";
}

// STEP 4: This function changes the class on the <body>.
function updateNetworkClass() {
  var state = getNetworkState();

  // This will remove all 3 old classes so we don't end up with two at once
  document.body.classList.remove(
    "network-fast",
    "network-medium",
    "network-slow",
  );

  // add the new one, for example "network-" + "slow" makes "network-slow"
  document.body.classList.add("network-" + state);

  // This as well will update the diagnostic panel
  updateDiagnostics(state);

  // This will display in the console so we can see it working 
  console.log("Network state is now:", state);
}

// STEP 5: We run it once when the page loads so the body has a class straight away.
updateNetworkClass();

// STEP 6: We run it again every time the connection changes.
if (connection) {
  connection.addEventListener("change", updateNetworkClass);
}
