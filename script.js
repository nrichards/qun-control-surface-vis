const DEFAULT_HIGHLIGHT_DURATION = 500; // Time in milliseconds for button highlight
const DEFAULT_DELAY_BETWEEN_STEPS = 1500; // Time in milliseconds between highlighting steps
const DEFAULT_DELAY_PER_BUTTON = 500; // Time in milliseconds between highlighting each button within a step


function highlightSequence(sequence, delayPerButton = DEFAULT_DELAY_PER_BUTTON) {
    console.log("highlightSequence");
    const containerElement = document.getElementById("container");
  
    sequence.forEach(function(step, stepIndex) { // Added stepIndex for delays
      const buttonLabels = step.split("+"); // Split by "+" symbol
      let totalDelay = 0; // Initialize total delay for the step
  
      buttonLabels.forEach(function(label, buttonIndex) {
        const queryString = `button.${label.trim().toLowerCase()}`;
        totalDelay += delayPerButton * buttonIndex; // Delay each button within the step
        console.log("highlightSequence totalDelay="+totalDelay);

        setTimeout(function() {
        console.log("highlightSequence.1");

          const buttonElement = containerElement.querySelector(queryString);
          if (buttonElement) {
            buttonElement.classList.add("highlighted");
            setTimeout(function() {
                console.log("highlightSequence.2");

              buttonElement.classList.remove("highlighted");
            }, DEFAULT_HIGHLIGHT_DURATION); // Highlight duration (adjustable)
          } else {
            console.warn(`Button not found: ${label}`);
          }
          
        }, totalDelay); // Use totalDelay for individual button highlighting
      });
  
      // Delay between steps (adjustable)
      setTimeout(function() {
        console.log("highlightSequence.3");
      }, DEFAULT_DELAY_BETWEEN_STEPS); 
    });
  }
  
  const buttonSequence1 = ["SHIFT + B1", "B1 + Dial"]; // First sequence
  const buttonSequence2 = ["B2 + B3", "Dial + Enter"]; // Second sequence (example)
  
  highlightSequence(buttonSequence1);


  // Websocket connection logic
const ws = new WebSocket("ws://localhost:8765"); // Replace with your server details

ws.onopen = function() {
  console.log("Websocket connection established");
};

ws.onmessage = function(event) {
  const receivedSequence = JSON.parse(event.data); // Parse received JSON data
  highlightSequence(receivedSequence); // Call highlightSequence with received sequence
};

ws.onerror = function(error) {
  console.error("Websocket connection error:", error);
};
