function speakText(text) {
  // Stop any ongoing speech before starting a new one
  speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const voices = speechSynthesis.getVoices();

  // Try to find a female voice
  const femaleVoice = voices.find(voice => voice.name.includes("Female") || voice.gender === "female");

  // If a female voice is found, set it; otherwise, use the default
  if (femaleVoice) {
    utterance.voice = femaleVoice;
  }

  // Speak only once
  speechSynthesis.speak(utterance);
}

// Ensure voices are loaded properly
speechSynthesis.onvoiceschanged = () => {
  console.log("Voices updated:", speechSynthesis.getVoices());
};


// ================= Chat Animation on Page Load ==================
document.addEventListener("DOMContentLoaded", function () {
  const chatMessageContainer = document.getElementById("chatMessageContainer");
  let showFirstMessage = true;

  function showMessage(text) {
    chatMessageContainer.innerHTML = "";
    let messageDiv = document.createElement("div");
    messageDiv.classList.add("chat-message");
    messageDiv.textContent = text;
    chatMessageContainer.appendChild(messageDiv);
  }

  function loopMessages() {
    if (showFirstMessage) {
      showMessage("Hi!! I am Nizzy");
    } else {
      showMessage("How can I help you?");
    }
    showFirstMessage = !showFirstMessage;
    setTimeout(loopMessages, 4000);
  }

  loopMessages();
});

// ================= Load Health Conditions from JSON ==================
let healthConditions = {};

async function loadHealthConditions() {
  try {
    const response = await fetch("healthConditions.json");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    healthConditions = await response.json();
    // console.log("Health conditions loaded:", healthConditions);
  } catch (error) {
    console.error("Error loading health conditions:", error);
  }
}

// ================= TensorFlow & NLP Integration ==================
let tfModel = null;

async function loadTfModel() {
  try {
    tfModel = await tf.loadLayersModel("model/model.json");
    console.log("TensorFlow model loaded successfully.");
  } catch (error) {
    console.error("Error loading TensorFlow model:", error);
  }
}

async function predictIntent(userInput) {
  if (!tfModel) {
    return null;
  }
  // Dummy preprocessing: use text length as a feature.
  const inputLength = userInput.length;
  const inputTensor = tf.tensor2d([[inputLength]]);
  const prediction = tfModel.predict(inputTensor);
  const predictionData = await prediction.data();
  const maxIndex = predictionData.indexOf(Math.max(...predictionData));
  const intents = ["headache", "unknown"];
  const confidence = predictionData[maxIndex];
  return { intent: intents[maxIndex], confidence: confidence };
}

//================== Memory object to store user context.================
let userContext = {
  lastCondition: null
};

//=========== Global conversation state for Health Concerns interaction.===========
let healthConversationState = {
  step: 0,
  condition: null,
  choices: [],
  duration: null,
  history: null,
  additionalSymptoms: ""  // initially empty; will accumulate symptom strings
};

// ============ Fuzzy match function. =============
function fuzzyMatch(input, target) {
  input = input.toLowerCase();
  target = target.toLowerCase();
  const inputWords = input.split(" ");
  const targetWords = target.split(", ");
  let matchScore = 0;
  inputWords.forEach((word) => {
    targetWords.forEach((targetWord) => {
      if (targetWord.includes(word)) {
        matchScore += 1;
      }
    });
  });
  return (matchScore / targetWords.length) * 100;
}

// New Helper: Count the number of matching words (symptoms)
function fuzzyMatchCount(input, target) {
  input = input.toLowerCase();
  target = target.toLowerCase();
  const inputWords = input.split(" ");
  const targetWords = target.split(", ");
  let count = 0;
  inputWords.forEach(word => {
    targetWords.forEach(targetWord => {
      if (targetWord.includes(word)) {
        count++;
      }
    });
  });
  return count;
}

//============= Helper: Get all matching conditions based on symptoms.===============
function getMatchingConditions(userInput) {
  let matches = [];
  for (let condition in healthConditions) {
    const score = fuzzyMatch(userInput, healthConditions[condition].symptoms);
    if (score > 40) {
      matches.push({ condition: condition, score: score });
    }
  }
  for (let condition in healthConditions) {
    if (userInput.toLowerCase().includes(condition)) {
      if (!matches.find(m => m.condition === condition)) {
        matches.push({ condition: condition, score: 100 });
      }
    }
  }
  // Sort matches by descending score.
  matches.sort((a, b) => b.score - a.score);
  return matches.map(m => m.condition);
}

// ================= New Helper: Validate Duration Input ==================
function validateDuration(input) {
  const lowerInput = input.toLowerCase();
  // Check if there is any digit in the input (numeric duration)
  if (/\d/.test(lowerInput)) {
    return true;
  }
  // Define allowed keywords (including "today", "yesterday", etc.)
  const keywords = ["today", "yesterday", "yestraday", "morning", "evening", "afternoon", "forenoon", "past", "since", "week", "weeks", "month", "months"];
  return keywords.some(keyword => lowerInput.includes(keyword));
}

// ================= Updated Helper: Display Yes/No Buttons ==================
// When a button is clicked, a user message ("Yes" or "No") is appended and the container remains visible.
function displayYesNoButtons(message, onYes, onNo) {
  const chatBody = document.getElementById("chatBody");

  const container = document.createElement("div");
  container.style.cssText = `
    background: #f0f0f0;
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 5px;
    font-family: Arial, sans-serif;
  `;

  const msgElement = document.createElement("div");
  msgElement.textContent = message;
  msgElement.style.cssText = "margin-bottom: 10px;";
  container.appendChild(msgElement);

  const buttonContainer = document.createElement("div");
  buttonContainer.style.cssText = "display: flex; gap: 10px;";

  const yesButton = document.createElement("button");
  yesButton.textContent = "Yes";
  yesButton.style.cssText = `
    background: #229ea6;
    color: white;
    padding: 6px 12px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  `;
  yesButton.addEventListener("click", function () {
    const userMsg = document.createElement("div");
    userMsg.textContent = "Yes";
    userMsg.style.cssText = "background: #229ea6; color: white; padding: 8px; border-radius: 5px; margin-bottom: 5px; align-self: flex-end; font-family: Arial, sans-serif;";
    chatBody.appendChild(userMsg);
    chatBody.scrollTop = chatBody.scrollHeight;
    onYes();
  });

  const noButton = document.createElement("button");
  noButton.textContent = "No";
  noButton.style.cssText = `
    background: #229ea6;
    color: white;
    padding: 6px 12px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  `;
  noButton.addEventListener("click", function () {
    const userMsg = document.createElement("div");
    userMsg.textContent = "No";
    userMsg.style.cssText = "background: #229ea6; color: white; padding: 8px; border-radius: 5px; margin-bottom: 5px; align-self: flex-end; font-family: Arial, sans-serif;";
    chatBody.appendChild(userMsg);
    chatBody.scrollTop = chatBody.scrollHeight;
    onNo();
  });

  // Speaker Icon
  const speakerIcon = document.createElement("span");
  speakerIcon.textContent = " 🔊";
  speakerIcon.style.cssText = `
    cursor: pointer;
    font-size: 16px;
    margin: 0px;
  `;
  speakerIcon.addEventListener("click", function () {
    speakText(message);
  });

  buttonContainer.appendChild(speakerIcon);
  buttonContainer.appendChild(yesButton);
  buttonContainer.appendChild(noButton);
  container.appendChild(buttonContainer);

  chatBody.appendChild(container);
  chatBody.scrollTop = chatBody.scrollHeight;
}

// ================= New Helper: Display Advice Options ==================
function displayAdviceOptions(message) {
  const chatBody = document.getElementById("chatBody");
  const container = document.createElement("div");
  container.style.cssText = `
    background: #f0f0f0;
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 5px;
    font-family: Arial, sans-serif;
  `;
  
  const msgElement = document.createElement("div");
  msgElement.textContent = message;
  msgElement.style.cssText = "margin-bottom: 10px;";
  container.appendChild(msgElement);

  const buttonContainer = document.createElement("div");
  buttonContainer.style.cssText = "display: flex; gap: 10px;";

  const moreInfoButton = document.createElement("button");
  moreInfoButton.textContent = "More Info";
  moreInfoButton.style.cssText = `
    background: #229ea6;
    color: white;
    padding: 6px 12px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  `;
  moreInfoButton.addEventListener("click", function() {
    displayConditionInfo(healthConversationState.condition);
  });

  const bookButton = document.createElement("button");
  bookButton.textContent = "Book Teleconsultation";
  bookButton.style.cssText = `
    background: #229ea6;
    color: white;
    padding: 6px 12px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  `;
  bookButton.addEventListener("click", function() {
    handleOptionSelection("Book Teleconsultation");
  });
  
  // New: Add a Close button near "Book Teleconsultation"
  const closeButton = document.createElement("button");
  closeButton.textContent = "Close";
  closeButton.style.cssText = `
    background: red;
    color: white;
    padding: 6px 12px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  `;
  closeButton.addEventListener("click", function() {
    document.getElementById("chatContainer").style.display = "none";
    location.reload();
  });

  // Speaker Icon
  const speakerIcon = document.createElement("span");
  speakerIcon.textContent = " 🔊";
  speakerIcon.style.cssText = `
    cursor: pointer;
    font-size: 16px;
    margin-left: 5px;
  `;
  speakerIcon.addEventListener("click", function () {
    speakText(message);
  });

  buttonContainer.appendChild(speakerIcon);
  buttonContainer.appendChild(moreInfoButton);
  buttonContainer.appendChild(bookButton);
  buttonContainer.appendChild(closeButton);
  container.appendChild(buttonContainer);

  chatBody.appendChild(container);
  chatBody.scrollTop = chatBody.scrollHeight;
}

// ================= New Helper: Display Book Teleconsultation Button Only ==================
function displayBookTeleconsultation(message) {
  const chatBody = document.getElementById("chatBody");
  const container = document.createElement("div");
  container.style.cssText = `
    background: #f0f0f0;
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 5px;
    font-family: Arial, sans-serif;
  `;
  
  const msgElement = document.createElement("div");
  msgElement.textContent = message;
  msgElement.style.cssText = "margin-bottom: 10px;";
  container.appendChild(msgElement);
  
  const bookButton = document.createElement("button");
  bookButton.textContent = "Book Teleconsultation";
  bookButton.style.cssText = `
    background: #229ea6;
    color: white;
    padding: 6px 12px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  `;
  bookButton.addEventListener("click", function() {
    handleOptionSelection("Book Teleconsultation");
  });
  
  container.appendChild(bookButton);
  chatBody.appendChild(container);
  chatBody.scrollTop = chatBody.scrollHeight;
}

// ================= Enhanced Healthcare Chatbot Interaction ==================
async function healthcareChatbot(userInput) {
  const lowerInput = userInput.toLowerCase();
  const ignoredWords = ["i", "have", "am", "was", "were", "having"];
  const tokens = lowerInput.split(" ").filter(word => !ignoredWords.includes(word));
  const cleanedInput = tokens.join(" ").trim();

  let diseaseNames = Object.keys(healthConditions);
  let exactMatch = diseaseNames.find(
    (disease) => disease.toLowerCase() === cleanedInput
  );
  if (exactMatch) {
    userContext.lastCondition = exactMatch;
    healthConversationState.condition = exactMatch;
    healthConversationState.step = "confirmAdditionalSymptoms";
    displayYesNoButtons(
      `You have selected ${exactMatch}. Along with this condition, are you having any other symptoms?`,
      function () {
        healthConversationState.step = "additionalSymptoms";
        botReply(document.getElementById("chatBody"), "Please describe your additional symptoms.");
      },
      function () {
        healthConversationState.step = "duration";
        botReply(document.getElementById("chatBody"), "Okay, could you please tell me how long you have been experiencing these symptoms? (For example, '2 days', '1 week', etc.)");
      }
    );
    return "";
  }

  if (
    lowerInput.includes("remedy") ||
    lowerInput.includes("diet") ||
    lowerInput.includes("lifestyle") ||
    lowerInput.includes("more info") ||
    lowerInput.includes("appointment")
  ) {
    let condition = userContext.lastCondition;
    if (!condition) {
      return "I'm sorry, I couldn't determine your condition. Could you please describe your symptoms again?";
    }
    healthConversationState.condition = condition;
    if (lowerInput.includes("remedy")) {
      return healthConditions[condition].remedy;
    } else if (lowerInput.includes("diet")) {
      return healthConditions[condition].diet;
    } else if (lowerInput.includes("lifestyle")) {
      return healthConditions[condition].lifestyle;
    } else if (lowerInput.includes("more info")) {
      displayConditionInfo(condition);
      return "";
    } else if (lowerInput.includes("appointment")) {
      handleOptionSelection("Book Teleconsultation");
      return "";
    }
  }

  if (healthConversationState.step === "choose") {
    const choice = healthConversationState.choices.find(
      (c) => c.toLowerCase() === cleanedInput.trim()
    );
    if (choice) {
      userContext.lastCondition = choice;
      healthConversationState.condition = choice;
      healthConversationState.step = "additionalSymptoms";
      return `Great, you selected ${choice}.\nAlong with this condition, are you having any other symptoms?`;
    } else {
      let conditionList = healthConversationState.choices
        .map((cond, i) => `${i + 1}. ${cond}`)
        .join("\n");
      return `I found several possible conditions based on your symptoms:\n${conditionList}\nPlease type the name of the condition you think best describes your problem.`;
    }
  }

  if (healthConversationState.step === 0) {
    let nlpResult = await predictIntent(userInput);
    let condition = null;
    if (nlpResult && nlpResult.confidence > 0.7 && nlpResult.intent !== "unknown") {
      condition = nlpResult.intent;
    }
    const matches = getMatchingConditions(cleanedInput);
    if (matches.length === 0) {
      return "I'm here to help, but I didn't quite understand your symptoms. Could you please rephrase or provide more details?";
    } else if (matches.length === 1) {
      condition = condition || matches[0];
      userContext.lastCondition = condition;
      healthConversationState.condition = condition;
      healthConversationState.step = "confirmAdditionalSymptoms";
      displayYesNoButtons(
        `I see you might be experiencing ${condition}.\nAlong with this condition, are you having any other symptoms?`,
        function () {
          healthConversationState.step = "additionalSymptoms";
          botReply(document.getElementById("chatBody"), "Please describe your additional symptoms.");
        },
        function () {
          healthConversationState.step = "duration";
          botReply(document.getElementById("chatBody"), "Could you please tell me how long you have been experiencing these symptoms? (For example, '2 days', '1 week', etc.)");
        }
      );
      return "";
    } else {
      const topMatch = matches[0];
      const count = fuzzyMatchCount(cleanedInput, healthConditions[topMatch].symptoms);
      if (count >= 3) {
        condition = topMatch;
        userContext.lastCondition = condition;
        healthConversationState.condition = condition;
        healthConversationState.step = "confirmAdditionalSymptoms";
        displayYesNoButtons(
          `Based on your input, I believe you might be experiencing ${condition}.\nAlong with this condition, are you having any other symptoms?`,
          function () {
            healthConversationState.step = "additionalSymptoms";
            botReply(document.getElementById("chatBody"), "Please describe your additional symptoms.");
          },
          function () {
            healthConversationState.step = "duration";
            botReply(document.getElementById("chatBody"), "Could you please tell me how long you have been experiencing these symptoms? (For example, '2 days', '1 week', etc.)");
          }
        );
        return "";
      } else {
        healthConversationState.step = "multipleSymptoms";
        // Save the initial input in additionalSymptoms.
        healthConversationState.additionalSymptoms = cleanedInput;
        displayBookTeleconsultation("Your symptoms match several diseases, can you describe more symptoms?");
        return "";
      }
    }
  }
  
  else if (healthConversationState.step === "multipleSymptoms") {
    const validMatches = getMatchingConditions(userInput);
    if (validMatches.length === 0) {
      return "Please enter valid symptoms or disease";
    }
    // Accumulate new symptoms to previous ones.
    if (healthConversationState.additionalSymptoms) {
      healthConversationState.additionalSymptoms += ", " + userInput;
    } else {
      healthConversationState.additionalSymptoms = userInput;
    }
    // Re-run matching on the combined symptoms.
    const newMatches = getMatchingConditions(healthConversationState.additionalSymptoms);
    if(newMatches.length === 1) {
      healthConversationState.condition = newMatches[0];
    }
    healthConversationState.step = "advice";
    displayBookTeleconsultation("Sorry for inconvenience. You may book a teleconsultation.");
    return "";
  }
  
  else if (healthConversationState.step === "additionalSymptoms") {
    const validMatches = getMatchingConditions(userInput);
    if (validMatches.length === 0) {
      return "Please enter valid symptoms or disease";
    }
    // Accumulate the new input to previously stored symptoms.
    if (healthConversationState.additionalSymptoms) {
      healthConversationState.additionalSymptoms += ", " + userInput;
    } else {
      healthConversationState.additionalSymptoms = userInput;
    }
    healthConversationState.step = "duration";
    return `Thank you for sharing.\nCould you please tell me how long you have been experiencing these symptoms? (For example, "2 days", "1 week", etc.)`;
  }
  
  else if (healthConversationState.step === "duration") {
    if (!validateDuration(userInput)) {
      return "Please enter how long you have been experiencing these symptoms?";
    }
    healthConversationState.duration = userInput;
    healthConversationState.step = "history";
    displayYesNoButtons(
      "Got it. Have you experienced these symptoms before?",
      function () {
        healthConversationState.history = "recurring";
        healthConversationState.step = "advice";
        displayAdviceOptions("I see that these symptoms are recurring. It might be important to consult a professional if this continues. Would you like more info or book a teleconsultation?");
      },
      function () {
        healthConversationState.history = "new";
        healthConversationState.step = "advice";
        displayAdviceOptions("Thank you for letting me know this is a new occurrence. New symptoms can sometimes be concerning, so please keep an eye on how you feel. Would you like more info or book a teleconsultation?");
      }
    );
    return "";
  }
  
  else if (healthConversationState.step === "advice") {
    if (lowerInput.includes("more info")) {
      displayConditionInfo(healthConversationState.condition);
      return "";
    } else if (lowerInput.includes("appointment") || lowerInput.includes("book")) {
      handleOptionSelection("Book Teleconsultation");
      return "";
    } else {
      displayAdviceOptions("Would you like more info or book a teleconsultation?");
      return "";
    }
  }
}

// ================= Display Detailed Condition Information ==================
function displayConditionInfo(condition) {
  const chatBody = document.getElementById("chatBody");
  let conditionContainer = document.createElement("div");
  conditionContainer.style.cssText = `
        background: #f9f9f9;
        padding: 15px;
        border-radius: 10px;
        margin: 10px 0;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        font-family: Arial, sans-serif;
  `;

  let conditionMessage = document.createElement("p");
  conditionMessage.innerHTML = `<strong>${condition.toUpperCase()}</strong><br>${healthConditions[condition].response}`;
  conditionMessage.style.cssText = `font-size: 14px; color: #333; margin-bottom: 10px;`;

  let buttonContainer = document.createElement("div");
  buttonContainer.style.cssText = "display: flex; gap: 10px; margin-top: 10px;";

  let responseContainer = document.createElement("div");
  responseContainer.classList.add("responseContainer");
  responseContainer.style.cssText = "margin-top: 10px; font-size: 14px; color: #444;";

  ["remedy", "diet", "lifestyle"].forEach((type) => {
    let button = document.createElement("button");
    button.textContent = type.charAt(0).toUpperCase() + type.slice(1);
    button.style.cssText = `
            background: #229ea6;
            color: white;
            padding: 8px 12px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: 0.3s;
    `;
    button.onmouseover = () => (button.style.background = "#1b828a");
    button.onmouseleave = () => (button.style.background = "#229ea6");
    button.onclick = function () {
      const textToSpeak = `${type.charAt(0).toUpperCase() + type.slice(1)}: ${healthConditions[condition][type]}`;
      responseContainer.innerHTML = `<p><strong>${type.charAt(0).toUpperCase() + type.slice(1)}:</strong> ${healthConditions[condition][type]}</p>`;
      speakText(textToSpeak); // Speak the button text content
    };
    buttonContainer.appendChild(button);
  });

  // Speaker Icon
  const speakerIcon = document.createElement("span");
  speakerIcon.textContent = " 🔊";
  speakerIcon.style.cssText = `
  cursor: pointer;
  font-size: 16px;
  position: absolute;
  top: 5px;
  right: 5px;
  `;
  speakerIcon.addEventListener("click", function () {
    // Speak the condition message
    speakText(conditionMessage.textContent);
  });

  buttonContainer.appendChild(speakerIcon);
  conditionContainer.appendChild(conditionMessage);
  conditionContainer.appendChild(buttonContainer);
  conditionContainer.appendChild(responseContainer);
  chatBody.appendChild(conditionContainer);
  chatBody.scrollTop = chatBody.scrollHeight;
}

// ================= Bot Reply Function with Speaker Icon ==================
function botReply(chatBody, message) {
  if (!message) return;

  // Create bot message container
  const botMessage = document.createElement("div");
  botMessage.textContent = message;
  botMessage.style.cssText = `
      white-space: pre-wrap;
      background: #f0f0f0;
      color: black;
      padding: 8px;
      border-radius: 5px;
      margin-bottom: 5px;
      align-self: flex-start;
      font-family: Arial, sans-serif;
      position: relative;
      display: flex;
      align-items: center;
  `;

  // Create speaker icon
  const speakerIcon = document.createElement("span");
  speakerIcon.textContent = " 🔊";
  speakerIcon.style.cssText = `
  cursor: pointer;
  font-size: 16px;
  position: absolute;
  top: 5px;
  right: 5px;
  `;
  speakerIcon.addEventListener("click", function () {
    speakText(message);
  });

  // Append speaker icon to bot message
  botMessage.appendChild(speakerIcon);

  // Append bot message to chat body
  chatBody.appendChild(botMessage);
  chatBody.scrollTop = chatBody.scrollHeight;
}


// ================= Initialize Chat Options ==================
function initializeChat() {
  const chatBody = document.getElementById("chatBody");
  const optionsContainer = document.createElement("div");
  optionsContainer.style.cssText = `
      background: #ffffff;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      font-family: Arial, sans-serif;
      margin: 10px 0;
  `;
  const heading = document.createElement("p");
  heading.textContent = "How May I help you ?";
  heading.style.cssText = `
      font-weight: bold;
      margin-bottom: 10px;
  `;
  optionsContainer.appendChild(heading);
  const options = ["Book Teleconsultation", "Health Concerns"];
  options.forEach((option) => {
    const button = document.createElement("button");
    button.textContent = option;
    button.style.cssText = `
        background: #229ea6;
        color: white;
        padding: 8px 12px;
        border: none;
        margin: 5px 0;
        border-radius: 5px;
        font-family: Arial, sans-serif;
        cursor: pointer;
        display: block;
        width: 100%;
        text-align: left;
    `;
    button.addEventListener("click", () => handleOptionSelection(option));
    optionsContainer.appendChild(button);
  });
  chatBody.appendChild(optionsContainer);
}

// ================= Handle Option Selection ==================
function handleOptionSelection(option) {
  const chatBody = document.getElementById("chatBody");
  const userMessage = document.createElement("div");
  userMessage.textContent = option;
  userMessage.style.cssText = `
      background: #229ea6;
      color: white;
      padding: 8px;
      border-radius: 5px;
      margin-bottom: 5px;
      align-self: flex-end;
      font-family: Arial, sans-serif;
  `;
  chatBody.appendChild(userMessage);
  if (option === "Health Concerns") {
    healthConversationState.step = 0;
    healthConversationState.condition = null;
    healthConversationState.choices = [];
    healthConversationState.duration = null;
    healthConversationState.history = null;
    healthConversationState.additionalSymptoms = "";
  }
  if (option === "Book Teleconsultation") {
    const container = document.createElement("div");
    container.style.cssText = `
        background: #ffffff;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        font-family: Arial, sans-serif;
        margin: 10px 0;
    `;
    const message = document.createElement("p");
    message.textContent = "Select Date to Book Your Teleconsultation:";
    message.style.cssText = `
        font-weight: bold;
        margin-bottom: 10px;
        font-family: Arial, sans-serif;
    `;
    container.appendChild(message);
    const dateInput = document.createElement("input");
    dateInput.type = "date";
    dateInput.min = new Date(new Date().setDate(new Date().getDate() + 1))
      .toISOString()
      .split("T")[0];
    dateInput.style.cssText = `
        margin: 5px 0;
        padding: 5px;
        border: 1px solid #ccc;
        border-radius: 4px;
    `;
    dateInput.addEventListener("change", () => handleDateSelection(dateInput.value));
    container.appendChild(dateInput);
    chatBody.appendChild(container);
  } else if (option === "Health Concerns") {
    const healthQueryDiv = document.createElement("div");
    healthQueryDiv.textContent = "Please describe your health concern";
    healthQueryDiv.style.cssText = `
      background: white;
      color: black;
      padding: 10px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
      font-family: Arial, sans-serif;
      width: 70%;
      margin-top: 10px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    `;
    chatBody.appendChild(healthQueryDiv);
    const inputBox = document.getElementById("userInput");
    const sendButton = document.getElementById("sendButton");
    inputBox.type = "text";
    inputBox.placeholder = "Enter your query...";
    inputBox.style.cssText = `
      margin-top: 430px;
      position: fixed;
      flex: 1;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 25px;
      font-size: 16px;
      width: 300px;
      outline: none;
      transition: border-color 0.3s ease;
    `;
    function addUserMessage(message) {
      const userMessage = document.createElement("div");
      userMessage.textContent = message;
      userMessage.style.cssText = `
        background: #229ea6;
        color: white;
        padding: 8px;
        border-radius: 5px;
        margin-bottom: 5px;
        align-self: flex-end;
        max-width: 70%;
        font-family: Arial, sans-serif;
      `;
      chatBody.appendChild(userMessage);
      chatBody.scrollTop = chatBody.scrollHeight;
    }
    inputBox.addEventListener("keypress", async (e) => {
      if (e.key === "Enter") {
        const userQuery = e.target.value.trim();
        if (userQuery) {
          addUserMessage(userQuery);
          const response = await healthcareChatbot(userQuery);
          botReply(chatBody, response);
          inputBox.value = "";
        }
      }
    });
    sendButton.addEventListener("click", async () => {
      const userQuery = inputBox.value.trim();
      if (userQuery) {
        addUserMessage(userQuery);
        const response = await healthcareChatbot(userQuery);
        botReply(chatBody, response);
        inputBox.value = "";
      }
    });
    chatBody.appendChild(inputBox);
  }
  chatBody.scrollTop = chatBody.scrollHeight;
}

// ================= Handle Date Selection for Teleconsultation ==================
function handleDateSelection(selectedDate) {
  const chatBody = document.getElementById("chatBody");
  const userMessage = document.createElement("div");
  userMessage.textContent = `Selected Date: ${selectedDate}`;
  userMessage.style.cssText = `
      background: #229ea6;
      color: white;
      padding: 8px;
      border-radius: 5px;
      margin-bottom: 5px;
      align-self: flex-end;
      font-family: Arial, sans-serif;
  `;
  chatBody.appendChild(userMessage);
  const container = document.createElement("div");
  container.style.cssText = `
      background: #ffffff;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      margin: 10px 0;
      font-family: Arial, sans-serif;
  `;
  const message = document.createElement("p");
  message.textContent = `Choose Your Time Slot for ${selectedDate}:`;
  message.style.cssText = `
      font-weight: bold;
      margin-bottom: 10px;
  `;
  container.appendChild(message);
  const timeSlots = ["10:00 AM", "11:00 AM", "12:00 PM", "2:00 PM", "3:00 PM"];
  timeSlots.forEach((slot) => {
    const button = document.createElement("button");
    button.textContent = slot;
    button.style.cssText = `
        background: #229ea6;
        color: white;
        padding: 8px 12px;
        border: none;
        margin: 5px 0;
        border-radius: 5px;
        cursor: pointer;
        display: block;
        width: 100%;
        text-align: left;
    `;
    button.addEventListener("click", () =>
      handleTimeSlotSelection(selectedDate, slot)
    );
    container.appendChild(button);
  });
  chatBody.appendChild(container);
  chatBody.scrollTop = chatBody.scrollHeight;
}

// ================= Handle Time Slot Selection and Collect Booking Details ==================
function handleTimeSlotSelection(date, slot) {
  const chatBody = document.getElementById("chatBody");
  const userMessage = document.createElement("div");
  userMessage.textContent = `Selected Time Slot: ${slot}`;
  userMessage.style.cssText = `
      background: #229ea6;
      color: white;
      padding: 8px;
      border-radius: 5px;
      margin-bottom: 5px;
      align-self: flex-end;
  `;
  chatBody.appendChild(userMessage);
  const detailsContainer = document.createElement("div");
  detailsContainer.style.cssText = `
    margin: 10px 0;
    background: #ffffff;
    padding: 20px;
    border-radius: 10px;
    border: 1px solid #ccc;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  `;
  const botMessage = document.createElement("p");
  botMessage.textContent = "Please share the following details:";
  botMessage.style.cssText = `
    font-weight: bold;
    margin-bottom: 15px;
    font-family: Arial, sans-serif;
    font-size: 16px;
  `;
  detailsContainer.appendChild(botMessage);
  const userInputs = {};
  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.placeholder = "Full Name";
  nameInput.style.cssText = `
    background: #f9f9f9;
    color: #333;
    padding: 10px;
    border: 1px solid #ddd;
    margin-bottom: 10px;
    border-radius: 5px;
    display: block;
    width: 100%;
    box-sizing: border-box;
    font-size: 14px;
  `;
  userInputs["Full Name"] = nameInput;
  detailsContainer.appendChild(nameInput);
  const ageInput = document.createElement("input");
  ageInput.type = "number";
  ageInput.placeholder = "Age";
  ageInput.max = "999";
  ageInput.style.cssText = `
    background: #f9f9f9;
    color: #333;
    padding: 10px;
    border: 1px solid #ddd;
    margin-bottom: 10px;
    border-radius: 5px;
    display: block;
    width: 100%;
    box-sizing: border-box;
    font-size: 14px;
  `;
  userInputs["Age"] = ageInput;
  detailsContainer.appendChild(ageInput);
  const genderInput = document.createElement("select");
  genderInput.style.cssText = `
    background: #f9f9f9;
    color: #333;
    padding: 10px;
    border: 1px solid #ddd;
    margin-bottom: 10px;
    border-radius: 5px;
    display: block;
    width: 100%;
    box-sizing: border-box;
    font-size: 14px;
  `;
  ["Select Gender", "Male", "Female", "Others"].forEach((option) => {
    const genderOption = document.createElement("option");
    genderOption.value = option === "Select Gender" ? "" : option;
    genderOption.textContent = option;
    genderInput.appendChild(genderOption);
  });
  userInputs["Gender"] = genderInput;
  detailsContainer.appendChild(genderInput);
  const mobileInput = document.createElement("input");
  mobileInput.type = "number";
  mobileInput.placeholder = "Mobile Number";
  mobileInput.style.cssText = `
    background: #f9f9f9;
    color: #333;
    padding: 10px;
    border: 1px solid #ddd;
    margin-bottom: 10px;
    border-radius: 5px;
    display: block;
    width: 100%;
    box-sizing: border-box;
    font-size: 14px;
  `;
  userInputs["Mobile Number"] = mobileInput;
  detailsContainer.appendChild(mobileInput);
  const submitButton = document.createElement("button");
  submitButton.textContent = "Submit";
  submitButton.style.cssText = `
    background: #229ea6;
    color: white;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    width: 100%;
    margin-top: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  `;
  detailsContainer.appendChild(submitButton);
  chatBody.appendChild(detailsContainer);
  
  // Function to handle form submission.
  function handleSubmit() {
    let allFieldsFilled = true;
    const collectedData = {};
    for (const field in userInputs) {
      const input = userInputs[field];
      const value = input.value.trim();
      if (field === "Full Name" && !/^[a-zA-Z\s]+$/.test(value)) {
        input.style.border = "1px solid red";
        allFieldsFilled = false;
        continue;
      }
      if (field === "Gender" && value === "") {
        input.style.border = "1px solid red";
        allFieldsFilled = false;
        continue;
      }
      if (!value) {
        input.style.border = "1px solid red";
        allFieldsFilled = false;
      } else {
        input.style.border = "1px solid #ddd";
        collectedData[field] = value;
      }
    }
    if (allFieldsFilled) {
      const otpContainer = document.createElement("div");
      otpContainer.style.cssText = `
        margin: 10px 0;
        background: #ffffff;
        padding: 20px;
        border-radius: 10px;
        border: 1px solid #ccc;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      `;
      const otpMessage = document.createElement("p");
      otpMessage.textContent = `OTP sent to ${collectedData["Mobile Number"]}. Verify your number:`;
      otpMessage.style.cssText = `
        font-weight: bold;
        margin-bottom: 15px;
        font-size: 16px;
      `;
      otpContainer.appendChild(otpMessage);
      const otpInput = document.createElement("input");
      otpInput.type = "text";
      otpInput.placeholder = "Enter OTP";
      otpInput.style.cssText = `
        margin: 5px 0;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
        width: 100%;
        box-sizing: border-box;
        font-size: 14px;
      `;
      otpInput.addEventListener("input", (e) => {
        otpInput.value = otpInput.value.replace(/\D/g, "");
      });
      otpContainer.appendChild(otpInput);
      const verifyButton = document.createElement("button");
      verifyButton.textContent = "Verify";
      verifyButton.style.cssText = `
        background: #229ea6;
        color: white;
        padding: 10px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 14px;
        width: 100%;
        margin-top: 10px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      `;
      verifyButton.addEventListener("click", () => {
        const confirmationMessage = document.createElement("div");
        confirmationMessage.innerHTML = `✅ Booking Confirmation!<br><br>
          📅 Date: ${date}<br>
          ⏰ Time: ${slot}<br>
          👤 Patient Name: ${collectedData["Full Name"]}<br>
          📞 Mobile Number: ${collectedData["Mobile Number"]}`;
        confirmationMessage.style.cssText = `
          background: #fff;
          font-family: Arial, Helvetica, sans-serif;
          color: #333;
          padding: 10px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
          width: 100%;
          margin-top: 10px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        `;
        // Append a Close button to the Booking Confirmation.
        const closeConfirmationBtn = document.createElement("button");
        closeConfirmationBtn.textContent = "Close";
        closeConfirmationBtn.style.cssText = `
          background: red;
          color: white;
          padding: 6px 12px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          margin-top: 10px;
        `;
        closeConfirmationBtn.addEventListener("click", function() {
          document.getElementById("chatContainer").style.display = "none";
          location.reload();
        });
        confirmationMessage.appendChild(closeConfirmationBtn);
        chatBody.appendChild(confirmationMessage);
        chatBody.scrollTop = chatBody.scrollHeight;
        otpContainer.remove();
      });
      otpContainer.appendChild(verifyButton);
      chatBody.appendChild(otpContainer);
      chatBody.scrollTop = chatBody.scrollHeight;
      otpInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") verifyButton.click();
      });
    } else {
      botReply(chatBody, "❗ Please fill in all the details.");
    }
  }
  submitButton.addEventListener("click", handleSubmit);
  detailsContainer.addEventListener("keydown", (event) => {
    if (event.key === "Enter") handleSubmit();
  });
  chatBody.scrollTop = chatBody.scrollHeight;
}

// ================= Initialize Chat on Page Load ==================
document.addEventListener("DOMContentLoaded", () => {
  initializeChat();
  loadTfModel();
  loadHealthConditions();
});

// ================= Chat Container Toggle ==================
document.getElementById("botButton").addEventListener("click", function (e) {
  e.preventDefault();
  const chatContainer = document.getElementById("chatContainer");
  chatContainer.style.display =
    chatContainer.style.display === "none" || chatContainer.style.display === ""
      ? "flex"
      : "none";
});

// ================= Close Chat ==================
document.getElementById("closeButton").addEventListener("click", function () {
  document.getElementById("chatContainer").style.display = "none";
  location.reload();
});