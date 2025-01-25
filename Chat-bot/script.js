const healthConditions = {
  headache: {
    response:
      "It seems you have a headache. Make sure to stay hydrated, rest, and avoid stress. Do you need more suggestions?",
    symptoms:
      "Throbbing or constant pain in the head, sensitivity to light or sound, nausea.",
    remedy:
      "Here are a few remedies: Drink water, take rest in a quiet room, take over-the-counter pain relievers if necessary.",
    diet: "Avoid caffeine and eat light, non-spicy food.",
    lifestyle: "Maintain regular sleep patterns and limit screen time.",
  },
  fever: {
    response:
      "Fever can be uncomfortable. Rest, stay hydrated, and consider taking fever-reducing medication. Do you need more suggestions?",
    symptoms: "Elevated body temperature, chills, sweating, muscle aches, fatigue.",
    remedy:
      "Here are a few remedies: Stay hydrated, take rest, take acetaminophen if needed.",
    diet: "Eat easy-to-digest foods like soups and broths.",
    lifestyle: "Get enough rest and avoid overexertion.",
  },
  fatigue: {
    response:
      "Fatigue could be due to stress, poor sleep, or nutrition. I recommend light exercise and a balanced diet. Do you need more suggestions?",
    symptoms: "Persistent tiredness, lack of energy, difficulty concentrating.",
    remedy:
      "Here are a few remedies: Take short naps, stay hydrated, avoid excessive caffeine.",
    diet: "Consume iron-rich foods like spinach and proteins like eggs.",
    lifestyle: "Incorporate relaxation techniques like meditation into your routine.",
  },
};

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

function matchCondition(userInput) {
  for (let condition in healthConditions) {
    if (userInput.toLowerCase().includes(condition)) {
      return condition;
    }
  }

  let bestMatch = null;
  let highestScore = 0;

  for (let condition in healthConditions) {
    const details = healthConditions[condition];
    if (details.symptoms) {
      const score = fuzzyMatch(userInput, details.symptoms);
      if (score > highestScore) {
        bestMatch = condition;
        highestScore = score;
      }
    }
  }

  return highestScore > 70 ? bestMatch : null;
}

function healthcareChatbot(userInput) {
  const condition = matchCondition(userInput);

  if (condition) {
    if (userInput.toLowerCase().includes("remedy")) {
      const remedyList = healthConditions[condition].remedy.split(", ");
      return remedyList.map((line) => `- ${line}`).join("\n");
    } else if (userInput.toLowerCase().includes("diet")) {
      return healthConditions[condition].diet;
    } else if (userInput.toLowerCase().includes("lifestyle")) {
      return healthConditions[condition].lifestyle;
    } else {
      return `These symptoms are more similar to the symptoms of ${condition}. I would suggest consulting a doctor. Do you want to book an appointment?`;
    }
  } else {
    return "I'm here to help, but I didn't quite understand your concern. Could you rephrase or provide more details?";
  }
}

// Function to send bot replies
function botReply(chatBody, message) {
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
  `;
  chatBody.appendChild(botMessage);
  chatBody.scrollTop = chatBody.scrollHeight;
}

// Initialize chat options
function initializeChat() {
  const chatBody = document.getElementById("chatBody");

  // Create a container for the options
  const optionsContainer = document.createElement("div");
  optionsContainer.style.cssText = `
      background: #ffffff;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 8px;
      margin: 10px 0;
  `;

  // Add the heading
  const heading = document.createElement("p");
  heading.textContent = "How May I help you ?";
  heading.style.cssText = `
      font-weight: bold;
      margin-bottom: 10px;
  `;
  optionsContainer.appendChild(heading);

  // Define options
  const options = ["Book Teleconsultation", "Health Queries"];

  // Add buttons for each option
  options.forEach((option) => {
    const button = document.createElement("button");
    button.textContent = option;
    button.style.cssText = `
        background: #f0f0f0;
        color: black;
        padding: 8px 12px;
        border: none;
        margin: 5px 0;
        border-radius: 5px;
        cursor: pointer;
        display: block;
        width: 100%;
        text-align: left;
    `;
    button.addEventListener("click", () => handleOptionSelection(option));
    optionsContainer.appendChild(button);
  });

  // Append the options container to the chat body
  chatBody.appendChild(optionsContainer);
}


// Handle option selection
function handleOptionSelection(option) {
  const chatBody = document.getElementById("chatBody");

  // Display user's choice as a message bubble
  const userMessage = document.createElement("div");
  userMessage.textContent = option;
  userMessage.style.cssText = `
      background: #229ea6;
      color: white;
      padding: 8px;
      border-radius: 5px;
      margin-bottom: 5px;
      align-self: flex-end;
  `;
  chatBody.appendChild(userMessage);

   // Handle "Book Teleconsultation" option
   if (option === "Book Teleconsultation") {
    const container = document.createElement("div");
    container.style.cssText = `
        background: #ffffff;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 8px;
        margin: 10px 0;
    `;

    const message = document.createElement("p");
    message.textContent = "Select Date to Book Your Teleconsultation:";
    message.style.cssText = `
        font-weight: bold;
        margin-bottom: 10px;
    `;
    container.appendChild(message);

    const dateInput = document.createElement("input");
    dateInput.type = "date";
    dateInput.min = new Date(new Date().setDate(new Date().getDate() + 1))
      .toISOString()
      .split("T")[0]; // Set minimum date to tomorrow
    dateInput.style.cssText = `
        margin: 5px 0;
        padding: 5px;
        border: 1px solid #ccc;
        border-radius: 4px;
    `;
    dateInput.addEventListener("change", () => handleDateSelection(dateInput.value));
    container.appendChild(dateInput);

    chatBody.appendChild(container);
  } else if (option === "Health Queries") {
    botReply(chatBody, "Please describe your health query:");
    
    const inputBox = document.getElementById("userInput");
    const sendButton = document.getElementById("sendButton");

    // Style the input box
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

    // Function to display the user input in chatBody
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
        `;
        chatBody.appendChild(userMessage);
        chatBody.scrollTop = chatBody.scrollHeight; // Scroll to the bottom
    }

    // Handle Enter key press
    inputBox.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        const userQuery = e.target.value.trim();
        if (userQuery) {
          addUserMessage(userQuery); // Display user message in chatBody
          const response = healthcareChatbot(userQuery);
          botReply(chatBody, response); // Display chatbot's response
          inputBox.value = ""; // Clear input field
        }
      }
    });

    // Handle button click
    sendButton.addEventListener("click", () => {
        const userQuery = inputBox.value.trim();
        if (userQuery) {
            addUserMessage(userQuery); // Display user message in chatBody
            const response = healthcareChatbot(userQuery);
            botReply(chatBody, response); // Display chatbot's response
            inputBox.value = ""; // Clear input field
        }
    });

    chatBody.appendChild(inputBox);
}



  // Scroll to the bottom of the chat
  chatBody.scrollTop = chatBody.scrollHeight;
}

// Handle date selection
function handleDateSelection(selectedDate) {
  const chatBody = document.getElementById("chatBody");

  // Display the selected date
  const userMessage = document.createElement("div");
  userMessage.textContent = `Selected Date: ${selectedDate}`;
  userMessage.style.cssText = `
      background: #229ea6;
      color: white;
      padding: 8px;
      border-radius: 5px;
      margin-bottom: 5px;
      align-self: flex-end;
  `;
  chatBody.appendChild(userMessage);
}

// Handle date selection
function handleDateSelection(selectedDate) {
  const chatBody = document.getElementById("chatBody");

  // Display user's selected date as a message bubble
  const userMessage = document.createElement("div");
  userMessage.textContent = `Selected Date: ${selectedDate}`;
  userMessage.style.cssText = `
      background: #229ea6;
      color: white;
      padding: 8px;
      border-radius: 5px;
      margin-bottom: 5px;
      align-self: flex-end;
  `;
  chatBody.appendChild(userMessage);

  // Create a container for the message and time slots
  const container = document.createElement("div");
  container.style.cssText = `
      background: #ffffff;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 8px;
      margin: 10px 0;
  `;

  // Add a message for the selected date
  const message = document.createElement("p");
  message.textContent = `Choose Your Time Slot for ${selectedDate}:`;
  message.style.cssText = `
      font-weight: bold;
      margin-bottom: 10px;
  `;
  container.appendChild(message);

  // Available time slots
  const timeSlots = ["10:00 AM", "11:00 AM", "12:00 PM", "2:00 PM", "3:00 PM"];
  timeSlots.forEach((slot) => {
    const button = document.createElement("button");
    button.textContent = slot;
    button.style.cssText = `
        background: #f0f0f0;
        color: black;
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

  // Scroll to the bottom of the chat
  chatBody.scrollTop = chatBody.scrollHeight;
}

// Handle time slot selection
function handleTimeSlotSelection(selectedDate, selectedTime) {
  const chatBody = document.getElementById("chatBody");

  // Display selected time slot as a message bubble
  const userMessage = document.createElement("div");
  userMessage.textContent = `Selected Time Slot: ${selectedTime}`;
  userMessage.style.cssText = `
      background: #229ea6;
      color: white;
      padding: 8px;
      border-radius: 5px;
      margin-bottom: 5px;
      align-self: flex-end;
  `;
  chatBody.appendChild(userMessage);

  // Scroll to the bottom of the chat
  chatBody.scrollTop = chatBody.scrollHeight;
}

// Handle personal details
function handleTimeSlotSelection(date, slot) {
  const chatBody = document.getElementById("chatBody");

  // Create a container for the message, input fields, and button
  const detailsContainer = document.createElement("div");
  detailsContainer.style.cssText = `
    margin: 10px 0;
    background: #ffffff;
    padding: 20px;
    border-radius: 10px;
    border: 1px solid #ccc;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  `;

  // Add the bot message inside the container
  const botMessage = document.createElement("p");
  botMessage.textContent = "Please share the following details:";
  botMessage.style.cssText = `
    font-weight: bold;
    margin-bottom: 15px;
    font-size: 16px;
  `;
  detailsContainer.appendChild(botMessage);

  // Store input elements
  const userInputs = {};

  // Add input for Full Name (text only)
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

  // Add input for Age (3-digit integers only)
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

  // Add dropdown for Gender
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

  // Add input for Mobile Number (integer only)
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

  // Add Submit button
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

  // Append the container to chatBody
  chatBody.appendChild(detailsContainer);

  // Handle Submit button click
  submitButton.addEventListener("click", () => {
    let allFieldsFilled = true;
    const collectedData = {};

    // Validate inputs
    for (const field in userInputs) {
      const input = userInputs[field];
      const value = input.value.trim();

      // Validate "Full Name" for text only
      if (field === "Full Name" && !/^[a-zA-Z\s]+$/.test(value)) {
        input.style.border = "1px solid red";
        allFieldsFilled = false;
        continue;
      }

      // Validate Gender dropdown
      if (field === "Gender" && value === "") {
        input.style.border = "1px solid red";
        allFieldsFilled = false;
        continue;
      }

      // Validate empty fields
      if (!value) {
        input.style.border = "1px solid red";
        allFieldsFilled = false;
      } else {
        input.style.border = "1px solid #ddd";
        collectedData[field] = value;
      }
    }

    // Proceed to OTP verification
if (allFieldsFilled) {
  // Create an OTP container
  const otpContainer = document.createElement("div");
  otpContainer.style.cssText = `
    margin: 10px 0;
    background: #ffffff;
    padding: 20px;
    border-radius: 10px;
    border: 1px solid #ccc;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  `;

  // Add the OTP message to the container
  const otpMessage = document.createElement("p");
  otpMessage.textContent = `OTP sent to ${collectedData["Mobile Number"]}. Verify your number:`;
  otpMessage.style.cssText = `
    font-weight: bold;
    margin-bottom: 15px;
    font-size: 16px;
  `;
  otpContainer.appendChild(otpMessage);

  // Add the OTP input field
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

    // Add event listener to ensure only integers are allowed (no decimals or non-numeric input)
  otpInput.addEventListener("input", function (e) {
    // Remove any non-digit characters
  otpInput.value = otpInput.value.replace(/\D/g, '');
});

  otpContainer.appendChild(otpInput);

  // Add the Verify button
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
  otpContainer.appendChild(verifyButton);

  // Add click event for Verify button
  verifyButton.addEventListener("click", () => {
    botReply(
      chatBody,
      `✅ Booking Confirmation!\n\n📅 Date: ${date}\n⏰ Time: ${slot}\n👤 Patient Name: ${collectedData["Full Name"]}\n📞 Mobile Number: ${collectedData["Mobile Number"]}`
    );
    otpContainer.remove(); // Remove the OTP container after successful verification
  });

  // Append the OTP container to the chat body
  chatBody.appendChild(otpContainer);

  // Scroll to the bottom of the chat
  chatBody.scrollTop = chatBody.scrollHeight;
} else {
  botReply(chatBody, "❗ Please fill in all the details.");
}
  });

  detailsContainer.appendChild(submitButton);

  // Append the details container to the chat body
  chatBody.appendChild(detailsContainer);

  // Scroll to the bottom of the chat
  chatBody.scrollTop = chatBody.scrollHeight;
}

// Initialize chat on page load
document.addEventListener("DOMContentLoaded", initializeChat);

// JavaScript for toggling chat visibility
document.getElementById("botButton").addEventListener("click", function (e) {
  e.preventDefault();
  const chatContainer = document.getElementById("chatContainer");
  chatContainer.style.display = chatContainer.style.display === "none" || chatContainer.style.display === "" ? "flex" : "none";
});

// Close chat
document.getElementById("closeButton").addEventListener("click", function () {
  document.getElementById("chatContainer").style.display = "none";
});