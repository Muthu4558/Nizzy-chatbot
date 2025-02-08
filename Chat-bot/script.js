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
  lastCondition: null,
  additionalSymptoms: []
};

//=========== Global conversation state for Health Concerns interaction.===========
let healthConversationState = {
  step: 0,
  condition: null,
  choices: [],
  duration: null,
  history: null
};

// ============ Fuzzy match function with ignored words =============
const ignoredWords = ["i", "have", "having", "i am", "was", "is", "there", "that"];

function cleanInput(input) {
  let words = input.toLowerCase().split(" ");
  return words.filter(word => !ignoredWords.includes(word)).join(" ");
}

function fuzzyMatch(input, target) {
  input = cleanInput(input);
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

//============= Helper: Get all matching conditions based on symptoms.===============
function getMatchingConditions(userInput) {
  let matches = [];
  let cleanedInput = cleanInput(userInput);
  
  for (let condition in healthConditions) {
    const score = fuzzyMatch(cleanedInput, healthConditions[condition].symptoms);
    if (score > 40) {
      matches.push({ condition: condition, score: score });
    }
  }

  for (let condition in healthConditions) {
    if (cleanedInput.includes(condition)) {
      if (!matches.find(m => m.condition === condition)) {
        matches.push({ condition: condition, score: 100 });
      }
    }
  }

  matches.sort((a, b) => b.score - a.score);
  return matches.map(m => m.condition);
}

// ================= Enhanced Healthcare Chatbot Interaction ==================
async function healthcareChatbot(userInput) {
  let lowerInput = cleanInput(userInput);

  // Handle remedy, diet, lifestyle, or appointment requests
  if (["remedy", "diet", "lifestyle", "more info", "appointment"].some(keyword => lowerInput.includes(keyword))) {
    let condition = userContext.lastCondition;
    if (!condition) {
      return speak("I'm sorry, I couldn't determine your condition. Could you please describe your symptoms again?");
    }
    if (lowerInput.includes("remedy")) {
      return speak(healthConditions[condition].remedy);
    } else if (lowerInput.includes("diet")) {
      return speak(healthConditions[condition].diet);
    } else if (lowerInput.includes("lifestyle")) {
      return speak(healthConditions[condition].lifestyle);
    } else if (lowerInput.includes("more info")) {
      displayConditionInfo(condition);
      return "";
    } else if (lowerInput.includes("appointment")) {
      handleOptionSelection("Book Teleconsultation");
      return "";
    }
  }

  if (healthConversationState.step === "choose") {
    let choice = healthConversationState.choices.find(c => c.toLowerCase() === lowerInput.trim());
    if (choice) {
      userContext.lastCondition = choice;
      healthConversationState.condition = choice;
      healthConversationState.step = 1;
      return speak(`You selected ${choice}. Could you please provide more details about your symptoms (e.g., intensity or any additional issues)?`);
    } else {
      let conditionList = healthConversationState.choices.map((cond, i) => `${i + 1}. ${cond}`).join("\n");
      return speak(`I found several possible conditions based on your symptoms:\n${conditionList}\nPlease type the name of the condition you think best describes your problem.`);
    }
  }

  if (healthConversationState.step === 0) {
    let matches = getMatchingConditions(lowerInput);

    if (matches.length === 0) {
      return speak("I'm here to help, but I couldn't understand your symptoms. Could you please rephrase or provide more details?");
    } else if (matches.length === 1) {
      userContext.lastCondition = matches[0];
      healthConversationState.condition = matches[0];
      healthConversationState.step = 1;
      return speak(`I feel sorry that you're experiencing ${matches[0]}.
Along with this condition, have you experienced any other symptoms?
Also, how long have you been experiencing these symptoms?`);
    } else {
      healthConversationState.step = "choose";
      healthConversationState.choices = matches;
      let conditionList = matches.map((cond, i) => `${i + 1}. ${cond}`).join("\n");
      return speak(`I found multiple possible conditions based on your symptoms:\n${conditionList}\nPlease type the name of the condition you think best describes your problem.`);
    }
  }
}

// ================== Text-to-Speech Integration ==================

// Returns a promise that resolves when voices are available.
function getVoicesAsync() {
  return new Promise((resolve, reject) => {
    let voices = window.speechSynthesis.getVoices();
    if (voices.length !== 0) {
      resolve(voices);
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        voices = window.speechSynthesis.getVoices();
        resolve(voices);
      };
    }
  });
}

async function speak(text) {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(text);
  
  // Wait for voices to load
  const voices = await getVoicesAsync();
  // Try to pick a voice with "female" in its name; fallback to first available voice.
  const femaleVoice = voices.find(voice => voice.name.toLowerCase().includes('female')) || voices[0];
  utterance.voice = femaleVoice;
  
  synth.speak(utterance);
  return text;
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
    button.onmouseover = () => button.style.background = "#1b828a";
    button.onmouseleave = () => button.style.background = "#229ea6";
    button.onclick = function () {
      responseContainer.innerHTML = `<p><strong>${type.charAt(0).toUpperCase() + type.slice(1)}:</strong> ${healthConditions[condition][type]}</p>`;
    };
    buttonContainer.appendChild(button);
  });

  conditionContainer.appendChild(conditionMessage);
  conditionContainer.appendChild(buttonContainer);
  conditionContainer.appendChild(responseContainer);

  chatBody.appendChild(conditionContainer);
  chatBody.scrollTop = chatBody.scrollHeight;
}

// ================= Bot Reply Function with Speaker Icon ==================
function botReply(chatBody, message) {
  if (!message) return;
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
  `;

  const speakerIcon = document.createElement("span");
  speakerIcon.textContent = " 🔊";
  speakerIcon.style.cssText = `
    cursor: pointer;
    font-size: 16px;
    margin-left: 5px;
  `;
  speakerIcon.addEventListener("click", function () {
    speak(message);
  });
  botMessage.appendChild(speakerIcon);
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
    // Reset the conversation state for a new health concern conversation.
    healthConversationState.step = 0;
    healthConversationState.condition = null;
    healthConversationState.choices = [];
    healthConversationState.duration = null;
    healthConversationState.history = null;
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
    dateInput.min = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split("T")[0];
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

    // Function to add user message to chat.
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
    font-family: Arial, Helvetica, sans-serif;
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
        otpInput.value = otpInput.value.replace(/\\D/g, "");
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
});
