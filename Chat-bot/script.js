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

const healthConditions = {
  "headache": {
    "disease name": "headache",
    "response": "It seems you have a headache. Make sure to stay hydrated, rest, and avoid stress. Do you need more suggestions?",
    "symptoms": "Throbbing or constant pain in the head, sensitivity to light or sound, nausea.",
    "remedy": "Here are few Remedies:, Drink water, Take rest in a quiet room, Take over-the-counter pain relievers if necessary.",
    "diet": "Avoid caffeine and eat light, non-spicy food.",
    "lifestyle": "Maintain regular sleep patterns and limit screen time."
  },
  "fever": {
    "disease name": "fever",
    "response": "Fever can be uncomfortable. Rest, stay hydrated, and consider taking fever-reducing medication. Do you need more suggestions?",
    "symptoms": "Elevated body temperature, chills, sweating, muscle aches, fatigue.",
    "remedy": "Here are few Remedies:, Stay hydrated, Take rest, Take acetaminophen if needed.",
    "diet": "Eat easy-to-digest foods like soups and broths.",
    "lifestyle": "Get enough rest and avoid overexertion."
  },
  "fatigue": {
    "disease name": "fatigue",
    "response": "Fatigue could be due to stress, poor sleep, or nutrition. I recommend light exercise and a balanced diet. Do you need more suggestions?",
    "symptoms": "Persistent tiredness, lack of energy, difficulty concentrating.",
    "remedy": "Here are few Remedies:, Take short naps, Stay hydrated, Avoid excessive caffeine.",
    "diet": "Consume iron-rich foods like spinach and proteins like eggs.",
    "lifestyle": "Incorporate relaxation techniques like meditation into your routine."
  },
    "body pain": {
        "disease name": "body pain",
        "response": "Body pain can be caused by various factors like overexertion, stress, or underlying medical conditions. Rest and hydration can help. Would you like suggestions?",
        "symptoms": "Generalized aches, stiffness, fatigue, difficulty in movement.",
        "remedy": "Here are a few remedies:, Take rest and avoid strenuous activities, Apply a warm compress or take a warm bath, Use over-the-counter pain relievers if needed.",
        "diet": "Consume foods rich in antioxidants and magnesium, like nuts, spinach, and fruits.",
        "lifestyle": "Incorporate regular physical activity like stretching and yoga, and ensure adequate sleep."
    },
    "throat pain": {
        "disease name": "throat pain",
        "response": "Throat pain is often caused by infections or irritation. Home remedies and hydration can ease symptoms. Need guidance?",
        "symptoms": "Sore throat, difficulty swallowing, redness, and irritation in the throat.",
        "remedy": "Here are a few remedies:, Gargle with warm salt water, Stay hydrated with warm fluids like tea, Use throat lozenges or sprays for relief.",
        "diet": "Consume soothing foods like honey, ginger, and warm soups. Avoid spicy and acidic foods.",
        "lifestyle": "Avoid smoking, use a humidifier to keep the air moist, and rest your voice."
    },
    "neck pain": {
        "disease name": "neck pain",
        "response": "Neck pain can result from poor posture, strain, or injury. Gentle exercises and rest may help. Would you like tips?",
        "symptoms": "Stiffness in the neck, difficulty turning the head, soreness, and sometimes headaches.",
        "remedy": "Here are a few remedies:, Apply a cold or warm compress to the neck, Perform gentle neck stretches, Use a supportive pillow for sleeping.",
        "diet": "Include anti-inflammatory foods like turmeric, berries, and leafy greens.",
        "lifestyle": "Maintain good posture, take regular breaks from screens, and avoid heavy lifting."
    },
    "joint pain": {
        "disease name": "joint pain",
        "response": "Joint pain can be due to arthritis, injury, or strain. Rest and proper care can alleviate discomfort. Need advice?",
        "symptoms": "Swelling, stiffness, reduced range of motion, redness around the joint.",
        "remedy": "Here are a few remedies:, Apply ice packs to reduce swelling, Perform low-impact exercises like swimming, Use over-the-counter pain relief creams or medications.",
        "diet": "Consume omega-3 rich foods like fish and flaxseeds, and avoid processed foods.",
        "lifestyle": "Stay active but avoid overexertion, and maintain a healthy weight to reduce stress on joints."
    },
    "back pain": {
        "disease name": "back pain",
        "response": "Back pain can result from poor posture, heavy lifting, or underlying conditions. Exercises and rest may help. Need guidance?",
        "symptoms": "Aching or sharp pain in the back, difficulty standing or bending, stiffness.",
        "remedy": "Here are a few remedies:, Use heat or cold therapy, Practice stretching and strengthening exercises, Avoid prolonged sitting or heavy lifting.",
        "diet": "Consume calcium and vitamin D-rich foods like dairy and fortified cereals.",
        "lifestyle": "Maintain a proper posture, invest in ergonomic furniture, and stay active."
    },
    "leg pain": {
        "disease name": "leg pain",
        "response": "Leg pain can be due to muscle strain, cramps, or circulation issues. Rest and hydration can help. Need advice?",
        "symptoms": "Cramping, swelling, soreness, or tingling in the legs.",
        "remedy": "Here are a few remedies:, Elevate your legs while resting, Massage the affected area, Stay hydrated and stretch regularly.",
        "diet": "Include potassium-rich foods like bananas and sweet potatoes, and stay hydrated.",
        "lifestyle": "Avoid sitting or standing for long periods, and wear comfortable footwear."
    },
    "arm pain": {
        "disease name": "arm pain",
        "response": "Arm pain can arise from overuse, strain, or injury. Rest and proper care may alleviate discomfort. Need guidance?",
        "symptoms": "Soreness, swelling, difficulty in movement, or tingling in the arm.",
        "remedy": "Here are a few remedies:, Rest the arm and avoid overexertion, Apply ice to reduce swelling, Use a compression bandage if needed.",
        "diet": "Consume anti-inflammatory foods like nuts, seeds, and berries.",
        "lifestyle": "Practice proper ergonomics, and avoid repetitive motions."
    },
    "vomiting": {
      "disease name": "vomiting",
      "response": "Vomiting can be caused by various factors such as infections or motion sickness. Rest and hydration are important. Need remedies?",
      "symptoms": "Nausea, stomach discomfort, frequent expulsion of stomach contents, dizziness.",
      "remedy": "Here are a few remedies:, Sip clear fluids like water or ginger tea, Avoid solid foods until vomiting subsides, Rest in a comfortable position.",
      "diet": "Consume bland foods like crackers or toast once symptoms improve, Avoid greasy or spicy foods.",
      "lifestyle": "Avoid rapid movements and practice relaxation techniques to reduce nausea triggers."
  },
  "wheezing": {
      "disease name": "wheezing",
      "response": "Wheezing is a whistling sound while breathing, often due to respiratory issues. Breathing exercises and medication can help. Need advice?",
      "symptoms": "Whistling sound during breathing, shortness of breath, tightness in the chest.",
      "remedy": "Here are a few remedies:, Use prescribed inhalers or bronchodilators, Perform steam inhalation to ease breathing, Avoid allergens or irritants.",
      "diet": "Consume anti-inflammatory foods like turmeric and ginger, and avoid dairy if it worsens mucus.",
      "lifestyle": "Maintain good air quality in your living environment and avoid smoking."
  },
  "allergy": {
      "disease name": "allergy",
      "response": "Allergies can cause symptoms like sneezing or skin irritation. Identifying triggers and avoiding them is crucial. Need help?",
      "symptoms": "Sneezing, itching, rashes, watery eyes, swelling.",
      "remedy": "Here are a few remedies:, Take antihistamines as prescribed, Use a cold compress for skin irritation, Avoid exposure to known allergens.",
      "diet": "Include vitamin C-rich foods to boost immunity and avoid allergenic foods if identified.",
      "lifestyle": "Use air purifiers and keep your living area dust-free."
  },
  "runny nose": {
      "disease name": "runny nose",
      "response": "A runny nose is often a sign of a cold or allergy. Rest and hydration can help. Would you like remedies?",
      "symptoms": "Excess mucus production, nasal congestion, frequent sneezing.",
      "remedy": "Here are a few remedies:, Use saline nasal spray, Perform steam inhalation, Stay hydrated with warm fluids.",
      "diet": "Consume warm soups and herbal teas, and avoid cold drinks.",
      "lifestyle": "Keep your surroundings warm and avoid sudden exposure to cold air."
  },
  "cough": {
      "disease name": "cough",
      "response": "Coughing can be due to throat irritation or respiratory issues. Remedies can help ease the discomfort. Need tips?",
      "symptoms": "Persistent coughing, throat irritation, chest tightness.",
      "remedy": "Here are a few remedies:, Sip warm honey and lemon water, Use a humidifier to moisten the air, Avoid irritants like smoke.",
      "diet": "Consume warm broths and herbal teas, and avoid cold or carbonated beverages.",
      "lifestyle": "Practice breathing exercises and avoid straining your voice."
  },
  "sore throat": {
      "disease name": "sore throat",
      "response": "A sore throat can result from infections or irritation. Gargling and hydration can help. Need remedies?",
      "symptoms": "Throat pain, difficulty swallowing, redness in the throat.",
      "remedy": "Here are a few remedies:, Gargle with warm salt water, Drink warm fluids like tea with honey, Use throat lozenges for relief.",
      "diet": "Consume soft, warm foods and avoid spicy or acidic items.",
      "lifestyle": "Avoid speaking loudly and rest your voice."
  },
  "sinusitis": {
    "disease name": "sinusitis",
    "response": "Sinusitis leads to nasal congestion and facial pain. Proper hydration and medications can help. Would you like tips?",
    "symptoms": "Facial pain or pressure, nasal congestion, headache, post-nasal drip.",
    "remedy": "Here are a few remedies:, Use saline nasal spray, Inhale steam or take hot showers, Take over-the-counter decongestants.",
    "diet": "Drink warm fluids like soup or herbal tea, and avoid cold or sugary drinks.",
    "lifestyle": "Use a humidifier and avoid allergens or pollutants that can worsen symptoms."
},
"rhinitis": {
    "disease name": "rhinitis",
    "response": "Rhinitis causes a runny nose and sneezing. Managing allergens and medications can relieve symptoms. Need advice?",
    "symptoms": "Runny nose, sneezing, nasal congestion, itchy eyes.",
    "remedy": "Here are a few remedies:, Avoid allergens, Use antihistamines or nasal sprays, Rinse your nose with saline water.",
    "diet": "Include anti-inflammatory foods like turmeric and ginger, and avoid dairy if it worsens congestion.",
    "lifestyle": "Keep your surroundings clean and use air filters to reduce allergens."
},
"diarrhea": {
    "disease name": "diarrhea",
    "response": "Diarrhea can cause dehydration. Stay hydrated and eat bland foods. Would you like more suggestions?",
    "symptoms": "Frequent loose or watery stools, abdominal cramps, dehydration, nausea.",
    "remedy": "Here are a few remedies:, Drink oral rehydration solutions, Eat bananas, rice, applesauce, and toast (BRAT diet), Avoid caffeine and fatty foods.",
    "diet": "Consume electrolyte-rich drinks like coconut water, and avoid spicy and greasy foods.",
    "lifestyle": "Practice proper hygiene and avoid contaminated food or water."
},
"bronchitis": {
    "disease name": "bronchitis",
    "response": "Bronchitis causes cough and chest discomfort. Rest and hydration can help recovery. Need tips?",
    "symptoms": "Persistent cough, chest discomfort, fatigue, shortness of breath.",
    "remedy": "Here are a few remedies:, Drink warm fluids to soothe the throat, Use a humidifier, Avoid smoking and irritants.",
    "diet": "Consume foods rich in antioxidants like fruits and vegetables, and stay hydrated with warm liquids.",
    "lifestyle": "Avoid exposure to pollutants and get plenty of rest."
},
"asthma": {
    "disease name": "asthma",
    "response": "Asthma causes breathing difficulties due to airway inflammation. Medications and lifestyle adjustments can help. Need guidance?",
    "symptoms": "Shortness of breath, wheezing, chest tightness, coughing (especially at night).",
    "remedy": "Here are a few remedies:, Use prescribed inhalers, Avoid allergens or irritants, Practice breathing exercises.",
    "diet": "Include anti-inflammatory foods like omega-3-rich fish and avoid processed foods.",
    "lifestyle": "Stay active but avoid overexertion and maintain a dust-free environment."
},
"food poisoning": {
    "disease name": "food poisoning",
    "response": "Food poisoning leads to nausea, vomiting, and diarrhea. Rest and hydration are crucial. Need advice?",
    "symptoms": "Nausea, vomiting, diarrhea, stomach cramps, fever.",
    "remedy": "Here are a few remedies:, Drink oral rehydration solutions, Eat bland foods like rice and bananas, Rest and avoid heavy meals.",
    "diet": "Consume clear fluids and electrolyte drinks, and avoid greasy, spicy, or sugary foods.",
    "lifestyle": "Ensure proper food hygiene and avoid expired or contaminated foods."
},
"migraine": {
    "disease name": "migraine",
    "response": "Migraines cause intense headaches and sensitivity to light. Rest and hydration can help. Need tips?",
    "symptoms": "Throbbing headache, nausea, sensitivity to light and sound, visual disturbances.",
    "remedy": "Here are a few remedies:, Rest in a dark, quiet room, Apply a cold compress to the head, Take prescribed pain relievers.",
    "diet": "Avoid trigger foods like caffeine, chocolate, and processed meats.",
    "lifestyle": "Maintain regular sleep patterns and manage stress effectively."
},
"common cold": {
    "disease name": "common cold",
    "response": "The common cold causes sneezing, a runny nose, and fatigue. Rest and hydration can help. Need advice?",
    "symptoms": "Runny nose, sneezing, sore throat, mild fever, cough.",
    "remedy": "Here are a few remedies:, Drink warm fluids, Gargle with saltwater, Use steam inhalation to clear nasal passages.",
    "diet": "Consume vitamin C-rich foods like oranges and stay hydrated with warm soups.",
    "lifestyle": "Avoid crowded places and wash your hands frequently to prevent spread."
},
"influenza (flu)": {
    "disease name": "influenza (flu)",
    "response": "Influenza causes fever, body aches, and fatigue. Rest and hydration are key. Would you like more tips?",
    "symptoms": "High fever, muscle aches, fatigue, sore throat, chills.",
    "remedy": "Here are a few remedies:, Rest and drink plenty of fluids, Take prescribed antiviral medications, Use warm compresses for aches.",
    "diet": "Consume warm broths and herbal teas, and avoid cold or sugary foods.",
    "lifestyle": "Get vaccinated annually and maintain good hygiene practices."
},
"ear infection": {
    "disease name": "ear infection",
    "response": "Ear infections cause pain and hearing difficulty. Warm compresses and medications can help. Need suggestions?",
    "symptoms": "Ear pain, hearing difficulty, fever, fluid drainage from the ear.",
    "remedy": "Here are a few remedies:, Use warm compresses for pain relief, Take prescribed antibiotics if recommended, Avoid inserting objects into the ear.",
    "diet": "Stay hydrated and consume immune-boosting foods like citrus fruits and garlic.",
    "lifestyle": "Maintain ear hygiene and avoid exposure to loud noises."
},    "chest pain": {
  "disease name": "chest pain",
  "response": "Chest pain can have various causes, including heart or lung issues. Immediate evaluation is crucial if symptoms are severe. Would you like general advice?",
  "symptoms": "Pressure, tightness, or discomfort in the chest, pain radiating to the arms or jaw, shortness of breath.",
  "remedy": "Here are a few remedies:, Rest and avoid strenuous activity, Take prescribed medications if advised, Apply relaxation techniques for anxiety-induced pain.",
  "diet": "Avoid heavy, fatty meals and consume heart-healthy foods like fruits, vegetables, and whole grains.",
  "lifestyle": "Monitor symptoms, avoid smoking, and seek medical attention if pain persists or worsens."
},
"acidity (acid reflux)": {
  "disease name": "acidity (acid reflux)",
  "response": "Acidity causes heartburn and discomfort. Lifestyle changes and antacids can provide relief. Need tips?",
  "symptoms": "Burning sensation in the chest, sour taste in the mouth, bloating, nausea.",
  "remedy": "Here are a few remedies:, Avoid lying down immediately after meals, Elevate your head while sleeping, Take antacids or prescribed medications.",
  "diet": "Eat small, frequent meals, avoid spicy and fatty foods, and include fiber-rich items.",
  "lifestyle": "Avoid smoking, reduce alcohol intake, and maintain a healthy weight."
},
"constipation": {
  "disease name": "constipation",
  "response": "Constipation can cause discomfort and bloating. Increasing fiber and hydration can help. Would you like remedies?",
  "symptoms": "Infrequent bowel movements, difficulty passing stool, bloating, abdominal pain.",
  "remedy": "Here are a few remedies:, Drink plenty of water, Include high-fiber foods in your diet, Take gentle laxatives if needed.",
  "diet": "Consume fruits, vegetables, and whole grains, and avoid processed foods.",
  "lifestyle": "Stay active with regular exercise and establish a consistent bathroom routine."
},
"indigestion": {
  "disease name": "indigestion",
  "response": "Indigestion causes discomfort after eating. Dietary changes and medications can help. Need advice?",
  "symptoms": "Abdominal discomfort, bloating, nausea, belching.",
  "remedy": "Here are a few remedies:, Eat smaller meals, Avoid eating too quickly, Take over-the-counter antacids.",
  "diet": "Avoid caffeine, spicy foods, and carbonated drinks. Include probiotics like yogurt.",
  "lifestyle": "Avoid lying down immediately after eating and manage stress effectively."
},
"cold sore": {
  "disease name": "cold sore",
  "response": "Cold sores are caused by a viral infection. Antiviral creams can reduce symptoms. Need tips?",
  "symptoms": "Small, fluid-filled blisters around the lips, itching or tingling sensation, mild fever.",
  "remedy": "Here are a few remedies:, Apply antiviral creams, Avoid picking at the sores, Use cold compresses for pain relief.",
  "diet": "Consume immune-boosting foods like citrus fruits and zinc-rich foods.",
  "lifestyle": "Avoid sharing utensils or personal items and manage stress to prevent outbreaks."
},
"urinary tract infection (UTI)": {
  "disease name": "urinary tract infection (UTI)",
  "response": "UTIs cause pain during urination. Hydration and proper hygiene are key. Need advice?",
  "symptoms": "Burning sensation during urination, frequent urge to urinate, cloudy or foul-smelling urine.",
  "remedy": "Here are a few remedies:, Drink plenty of water, Avoid caffeine and alcohol, Take prescribed antibiotics if needed.",
  "diet": "Include cranberry juice and foods rich in vitamin C.",
  "lifestyle": "Practice good hygiene and avoid holding urine for long periods."
},
"eczema": {
  "disease name": "eczema",
  "response": "Eczema causes itchy, inflamed skin. Moisturizing and avoiding triggers can help. Need suggestions?",
  "symptoms": "Red, itchy, and dry skin, oozing or crusting patches, thickened skin over time.",
  "remedy": "Here are a few remedies:, Use fragrance-free moisturizers, Take lukewarm baths, Avoid harsh soaps and irritants.",
  "diet": "Include anti-inflammatory foods like fish and leafy greens, and avoid dairy or processed foods if they worsen symptoms.",
  "lifestyle": "Wear loose, cotton clothing and manage stress to reduce flare-ups."
},
"anemia": {
  "disease name": "anemia",
  "response": "Anemia causes fatigue and weakness due to low hemoglobin. Dietary changes and supplements can help. Need tips?",
  "symptoms": "Fatigue, pale skin, shortness of breath, dizziness.",
  "remedy": "Here are a few remedies:, Take iron supplements as prescribed, Avoid tea or coffee with meals, Treat underlying conditions if present.",
  "diet": "Include iron-rich foods like spinach, red meat, and legumes, along with vitamin C for better absorption.",
  "lifestyle": "Ensure regular check-ups and maintain a balanced diet."
},
"insomnia": {
  "disease name": "insomnia",
  "response": "Insomnia leads to difficulty sleeping. Relaxation techniques and proper sleep hygiene can help. Need advice?",
  "symptoms": "Difficulty falling asleep, waking up frequently, daytime fatigue, irritability.",
  "remedy": "Here are a few remedies:, Follow a regular sleep schedule, Avoid caffeine or heavy meals before bedtime, Practice relaxation techniques like meditation.",
  "diet": "Consume foods rich in tryptophan like turkey and bananas, and avoid sugary or caffeinated drinks.",
  "lifestyle": "Create a comfortable sleep environment and limit screen time before bed."
},
"panic attack": {
  "disease name": "panic attack",
  "response": "Panic attacks cause sudden fear and physical symptoms. Breathing exercises can help. Need more tips?",
  "symptoms": "Rapid heartbeat, chest pain, dizziness, sweating, shortness of breath.",
  "remedy": "Here are a few remedies:, Practice deep breathing, Focus on grounding techniques, Seek professional counseling if needed.",
  "diet": "Avoid caffeine and processed foods that may worsen anxiety.",
  "lifestyle": "Maintain a healthy work-life balance and practice mindfulness."
},
"allergic rhinitis": {
  "disease name": "allergic rhinitis",
  "response": "Allergic rhinitis causes sneezing and nasal congestion due to allergens. Avoiding triggers can help. Need suggestions?",
  "symptoms": "Sneezing, runny nose, itchy eyes, nasal congestion.",
  "remedy": "Here are a few remedies:, Use antihistamines as prescribed, Perform nasal irrigation, Minimize exposure to allergens.",
  "diet": "Consume foods rich in quercetin like onions and apples to reduce allergy symptoms.",
  "lifestyle": "Keep your environment dust-free and use air purifiers if needed."
},
"tonsillitis": {
  "disease name": "tonsillitis",
  "response": "Tonsillitis causes a sore throat and difficulty swallowing. Rest and hydration are key. Would you like tips?",
  "symptoms": "Sore throat, swollen tonsils, fever, difficulty swallowing, white patches on tonsils.",
  "remedy": "Here are a few remedies:, Gargle with warm salt water, Take over-the-counter pain relievers, Stay hydrated.",
  "diet": "Consume warm soups, herbal teas, and soft foods to ease swallowing.",
  "lifestyle": "Avoid smoking and practice good oral hygiene."
},
"otitis media (middle ear infection)": {
  "disease name": "otitis media (middle ear infection)",
  "response": "Middle ear infections cause ear pain and hearing difficulty. Warm compresses and medications can help. Need guidance?",
  "symptoms": "Ear pain, difficulty hearing, fluid drainage from the ear, fever.",
  "remedy": "Here are a few remedies:, Apply a warm compress to the affected ear, Take prescribed antibiotics if needed, Avoid inserting objects into the ear.",
  "diet": "Focus on immune-boosting foods like citrus fruits and leafy greens.",
  "lifestyle": "Avoid exposure to secondhand smoke and keep ears dry."
},
"earwax blockage": {
  "disease name": "earwax blockage",
  "response": "Earwax blockage can cause hearing issues and discomfort. Proper cleaning methods are essential. Need advice?",
  "symptoms": "Hearing loss, earache, ringing in the ear (tinnitus), dizziness.",
  "remedy": "Here are a few remedies:, Use ear drops to soften wax, Avoid cotton swabs deep in the ear, Consult a doctor for professional cleaning.",
  "diet": "Maintain a balanced diet to support ear health.",
  "lifestyle": "Avoid inserting objects into the ear and clean the outer ear regularly."
},
"laryngitis": {
  "disease name": "laryngitis",
  "response": "Laryngitis causes voice loss and throat irritation. Resting your voice can help. Need remedies?",
  "symptoms": "Hoarseness, sore throat, dry throat, difficulty speaking.",
  "remedy": "Here are a few remedies:, Rest your voice, Drink warm fluids, Use a humidifier to moisten the air.",
  "diet": "Consume warm teas with honey and avoid caffeine or alcohol.",
  "lifestyle": "Avoid shouting and exposure to irritants like smoke."
},
"nasal polyps": {
  "disease name": "nasal polyps",
  "response": "Nasal polyps cause nasal obstruction and breathing issues. Medications can reduce symptoms. Need tips?",
  "symptoms": "Nasal congestion, loss of smell, runny nose, postnasal drip.",
  "remedy": "Here are a few remedies:, Use corticosteroid nasal sprays, Perform steam inhalation, Take prescribed medications.",
  "diet": "Consume anti-inflammatory foods like turmeric and ginger.",
  "lifestyle": "Avoid allergens and maintain good air quality in your home."
},
"pharyngitis": {
  "disease name": "pharyngitis",
  "response": "Pharyngitis causes throat pain and irritation. Warm liquids and rest can help. Need advice?",
  "symptoms": "Sore throat, difficulty swallowing, swollen lymph nodes, fever.",
  "remedy": "Here are a few remedies:, Gargle with warm salt water, Drink warm herbal teas, Avoid irritants like smoke.",
  "diet": "Consume warm broths, soft foods, and stay hydrated.",
  "lifestyle": "Avoid straining your throat and rest well to recover."
},
"vertigo": {
  "disease name": "vertigo",
  "response": "Vertigo causes dizziness and balance issues. Exercises and medications can help. Need tips?",
  "symptoms": "Dizziness, spinning sensation, nausea, difficulty balancing.",
  "remedy": "Here are a few remedies:, Perform vestibular rehabilitation exercises, Avoid sudden head movements, Stay hydrated.",
  "diet": "Reduce salt intake to manage fluid balance in the inner ear.",
  "lifestyle": "Avoid caffeine, alcohol, and smoking, and get enough rest."
},
"snoring": {
  "disease name": "snoring",
  "response": "Snoring can disrupt sleep quality. Lifestyle changes and proper sleep posture can help. Need suggestions?",
  "symptoms": "Loud breathing during sleep, interrupted breathing, fatigue during the day.",
  "remedy": "Here are a few remedies:, Sleep on your side, Use nasal strips to improve airflow, Avoid alcohol before bedtime.",
  "diet": "Maintain a healthy weight by consuming a balanced diet.",
  "lifestyle": "Establish a regular sleep routine and avoid smoking."
},
"sleep apnea": {
  "disease name": "sleep apnea",
  "response": "Sleep apnea causes interrupted breathing during sleep. Medical devices and lifestyle changes can help. Need guidance?",
  "symptoms": "Loud snoring, gasping for air during sleep, daytime fatigue, difficulty concentrating.",
  "remedy": "Here are a few remedies:, Use a CPAP machine as prescribed, Avoid sleeping on your back, Lose excess weight if needed.",
  "diet": "Focus on a balanced diet with low-fat and nutrient-rich foods.",
  "lifestyle": "Avoid alcohol and sedatives before bed and maintain a consistent sleep schedule."
},  
  "gastroesophageal reflux disease (GERD)": {
    "disease name": "gastroesophageal reflux disease (GERD)",
    "response": "GERD causes heartburn and acid reflux. Lifestyle changes and dietary adjustments can reduce symptoms. Need suggestions?",
    "symptoms": "Heartburn, regurgitation of food or sour liquid, difficulty swallowing.",
    "remedy": "Here are a few remedies:, Avoid lying down after meals, Eat smaller, frequent meals, Elevate the head while sleeping.",
    "diet": "Avoid trigger foods like spicy and fatty meals, and include fiber-rich foods.",
    "lifestyle": "Maintain a healthy weight and avoid smoking and alcohol."
  },
  "irritable bowel syndrome (IBS)": {
    "disease name": "irritable bowel syndrome (IBS)",
    "response": "IBS causes abdominal discomfort and irregular bowel habits. Dietary changes and stress management can help. Need advice?",
    "symptoms": "Abdominal pain, bloating, diarrhea or constipation.",
    "remedy": "Here are a few remedies:, Practice stress-reducing techniques, Identify and avoid trigger foods, Engage in regular physical activity.",
    "diet": "Follow a low-FODMAP diet and include soluble fiber.",
    "lifestyle": "Establish a consistent eating and sleeping schedule."
  },
  "ulcerative colitis": {
    "disease name": "ulcerative colitis",
    "response": "Ulcerative colitis causes inflammation in the colon, leading to pain and diarrhea. Medication and diet adjustments can help. Would you like tips?",
    "symptoms": "Frequent diarrhea with blood or pus, abdominal cramps, fatigue.",
    "remedy": "Here are a few remedies:, Take prescribed medications, Use a heating pad for abdominal pain, Stay hydrated.",
    "diet": "Consume a low-fiber diet during flare-ups and avoid dairy products.",
    "lifestyle": "Manage stress and ensure regular medical follow-ups."
  },
  "hepatitis": {
    "disease name": "hepatitis",
    "response": "Hepatitis affects the liver and can cause fatigue and jaundice. Treatment and lifestyle changes can aid recovery. Need guidance?",
    "symptoms": "Jaundice, abdominal pain, nausea, dark urine, fatigue.",
    "remedy": "Here are a few remedies:, Avoid alcohol, Follow your doctor’s advice on medications, Get adequate rest.",
    "diet": "Consume a high-protein, low-fat diet and stay hydrated.",
    "lifestyle": "Avoid sharing personal items like razors and practice safe hygiene."
  },
  "peptic ulcer disease": {
    "disease name": "peptic ulcer disease",
    "response": "Peptic ulcers cause stomach pain and discomfort. Treatment and dietary changes can aid healing. Would you like advice?",
    "symptoms": "Burning stomach pain, bloating, nausea, loss of appetite.",
    "remedy": "Here are a few remedies:, Avoid NSAIDs and spicy foods, Take antacids or prescribed medications, Eat smaller, frequent meals.",
    "diet": "Include non-acidic foods like bananas and oatmeal, and avoid caffeine and alcohol.",
    "lifestyle": "Manage stress effectively and avoid smoking."
  },
  "polycystic ovary syndrome (PCOS)": {
    "disease name": "polycystic ovary syndrome (PCOS)",
    "response": "PCOS affects hormone levels and can cause irregular periods. Lifestyle changes and medication can help. Would you like tips?",
    "symptoms": "Irregular periods, excessive hair growth, weight gain, acne.",
    "remedy": "Here are a few remedies:, Maintain a healthy weight, Perform regular exercise, Manage stress effectively.",
    "diet": "Consume low-glycemic foods like whole grains and legumes, and avoid refined sugars.",
    "lifestyle": "Establish a regular sleep schedule and manage symptoms with relaxation techniques."
  },
  "endometriosis": {
    "disease name": "endometriosis",
    "response": "Endometriosis causes pelvic pain and irregular periods. Medical management and lifestyle changes can help. Need advice?",
    "symptoms": "Pelvic pain, heavy periods, pain during intercourse, infertility.",
    "remedy": "Here are a few remedies:, Use heat therapy for pain relief, Engage in light physical activities, Consider prescribed hormonal treatments.",
    "diet": "Consume anti-inflammatory foods like berries and leafy greens, and avoid processed foods.",
    "lifestyle": "Practice stress management and maintain a healthy work-life balance."
  },
  "uterine fibroids": {
    "disease name": "uterine fibroids",
    "response": "Uterine fibroids can cause heavy bleeding and pelvic pain. Treatment options vary depending on severity. Would you like guidance?",
    "symptoms": "Heavy menstrual bleeding, pelvic pain, frequent urination, backache.",
    "remedy": "Here are a few remedies:, Use heat therapy for pain relief, Stay hydrated and manage stress, Follow medical advice on treatment.",
    "diet": "Consume foods high in fiber and reduce red meat intake.",
    "lifestyle": "Maintain a healthy weight and monitor symptoms regularly."
  },
  "menstrual irregularities": {
    "disease name": "menstrual irregularities",
    "response": "Irregular periods can result from hormonal imbalances or lifestyle factors. Need tips for regulation?",
    "symptoms": "Irregular cycle length, missed periods, heavy or light bleeding.",
    "remedy": "Here are a few remedies:, Track your cycle, Manage stress with relaxation techniques, Consult a gynecologist for further evaluation.",
    "diet": "Consume iron-rich foods to prevent anemia and include a balanced diet.",
    "lifestyle": "Maintain a consistent sleep schedule and limit caffeine intake."
  },
  "menopause symptoms": {
    "disease name": "menopause symptoms",
    "response": "Menopause can bring hot flashes, mood swings, and other changes. Lifestyle adjustments can help. Need tips?",
    "symptoms": "Hot flashes, night sweats, mood changes, vaginal dryness.",
    "remedy": "Here are a few remedies:, Perform regular weight-bearing exercises, Use cooling techniques for hot flashes, Practice mindfulness or yoga.",
    "diet": "Include calcium- and vitamin D-rich foods to support bone health.",
    "lifestyle": "Engage in regular physical activity and maintain a healthy routine."
  },
  "hypertension": {
    "disease name": "hypertension",
    "response": "Hypertension, or high blood pressure, can strain your heart. Lifestyle changes and medication can help. Need advice?",
    "symptoms": "High blood pressure readings, headaches, dizziness, shortness of breath.",
    "remedy": "Here are a few remedies:, Monitor your blood pressure regularly, Reduce salt intake, Exercise for 30 minutes daily.",
    "diet": "Consume potassium-rich foods like bananas and leafy greens, and avoid processed foods high in sodium.",
    "lifestyle": "Manage stress through relaxation techniques and maintain a healthy weight."
  },
  "coronary artery disease (CAD)": {
    "disease name": "coronary artery disease (CAD)",
    "response": "Coronary artery disease restricts blood flow to the heart. Lifestyle changes and medical management are essential. Need tips?",
    "symptoms": "Chest pain (angina), shortness of breath, fatigue, heart attack.",
    "remedy": "Here are a few remedies:, Avoid smoking, Perform moderate-intensity exercises, Take prescribed medications regularly.",
    "diet": "Consume heart-healthy foods like salmon, nuts, and whole grains.",
    "lifestyle": "Manage stress, monitor cholesterol levels, and attend regular checkups."
  },
  "arrhythmia": {
    "disease name": "arrhythmia",
    "response": "Arrhythmias are irregular heartbeats. Medical evaluation and lifestyle changes can help. Do you need guidance?",
    "symptoms": "Palpitations, dizziness, shortness of breath, fatigue.",
    "remedy": "Here are a few remedies:, Avoid caffeine and stimulants, Practice stress management techniques, Follow your doctor's advice on medications.",
    "diet": "Consume magnesium-rich foods like spinach and avocados.",
    "lifestyle": "Avoid alcohol and monitor your heart rate during physical activity."
  },
  "heart failure": {
    "disease name": "heart failure",
    "response": "Heart failure reduces the heart's ability to pump blood effectively. Lifestyle modifications and treatment can improve symptoms. Need suggestions?",
    "symptoms": "Shortness of breath, swelling in legs and abdomen, fatigue, rapid heartbeat.",
    "remedy": "Here are a few remedies:, Monitor fluid intake, Avoid high-sodium foods, Take medications as prescribed.",
    "diet": "Consume a low-sodium diet and include potassium-rich foods.",
    "lifestyle": "Maintain a daily weight log and follow a structured exercise plan."
  },
  "myocardial infarction (heart attack)": {
    "disease name": "myocardial infarction (heart attack)",
    "response": "A heart attack requires immediate medical attention. Post-recovery, lifestyle changes are crucial. Need advice?",
    "symptoms": "Chest pain, arm or jaw pain, shortness of breath, nausea, sweating.",
    "remedy": "Here are a few remedies:, Follow a cardiac rehabilitation program, Avoid smoking and alcohol, Practice stress management.",
    "diet": "Consume a heart-healthy diet rich in fruits, vegetables, and whole grains.",
    "lifestyle": "Monitor cholesterol and blood pressure levels, and engage in regular physical activity."
  },
  "stroke rehabilitation": {
    "disease name": "stroke rehabilitation",
    "response": "Stroke can affect movement and coordination. Physiotherapy is vital for recovery. Do you need guidance?",
    "symptoms": "Weakness on one side of the body, slurred speech, vision problems, difficulty walking.",
    "remedy": "Here are a few remedies:, Follow a structured physiotherapy program, Perform balance and coordination exercises, Use assistive devices for mobility.",
    "diet": "Consume heart-healthy foods like fruits, vegetables, and whole grains.",
    "lifestyle": "Engage in regular physical therapy sessions and monitor blood pressure."
  },
  "parkinson's disease": {
    "disease name": "parkinson's disease",
    "response": "Parkinson's affects movement and coordination. Physiotherapy can improve mobility. Need suggestions?",
    "symptoms": "Tremors, slowed movement, muscle stiffness, impaired posture and balance, speech changes.",
    "remedy": "Here are a few remedies:, Perform balance and gait training, Use stretching exercises to reduce stiffness, Practice speech therapy for communication.",
    "diet": "Consume antioxidant-rich foods like berries and green tea. Avoid excessive protein near medication times.",
    "lifestyle": "Establish a structured daily routine and engage in regular physiotherapy."
  },
  "cerebral palsy": {
    "disease name": "cerebral palsy",
    "response": "Cerebral palsy affects movement and posture. Physiotherapy helps improve function. Would you like advice?",
    "symptoms": "Muscle stiffness or weakness, difficulty with coordination, involuntary movements, balance problems.",
    "remedy": "Here are a few remedies:, Practice muscle-strengthening exercises, Use braces or splints for support, Engage in regular stretching to reduce spasticity.",
    "diet": "Consume a balanced diet rich in vitamins and minerals to support growth.",
    "lifestyle": "Maintain a structured routine and engage in therapy sessions regularly."
  },
  "herniated disc": {
    "disease name": "herniated disc",
    "response": "A herniated disc causes back pain and nerve irritation. Physiotherapy can help relieve symptoms. Need tips?",
    "symptoms": "Back pain, leg or arm pain, numbness or tingling, muscle weakness.",
    "remedy": "Here are a few remedies:, Perform core-strengthening exercises, Avoid heavy lifting, Use ice or heat therapy for relief.",
    "diet": "Consume anti-inflammatory foods and ensure adequate hydration.",
    "lifestyle": "Maintain proper posture and take breaks from prolonged sitting."
  },
  "osteoarthritis": {
    "disease name": "osteoarthritis",
    "response": "Osteoarthritis causes joint pain and stiffness, commonly in the knees, hips, or hands. Physiotherapy can help. Do you want advice?",
    "symptoms": "Joint pain, stiffness, swelling, decreased range of motion, bone spurs.",
    "remedy": "Here are a few remedies:, Perform low-impact exercises, Use hot or cold packs, Practice stretching techniques for mobility.",
    "diet": "Consume foods rich in omega-3s, such as fish, and anti-inflammatory foods like turmeric and ginger.",
    "lifestyle": "Maintain a healthy weight to reduce joint strain and avoid prolonged inactivity."
  },
  "frozen shoulder": {
    "disease name": "frozen shoulder",
    "response": "Frozen shoulder limits shoulder mobility and causes pain. Physiotherapy can improve movement. Would you like exercises?",
    "symptoms": "Shoulder stiffness, pain, limited range of motion.",
    "remedy": "Here are a few remedies:, Perform gentle stretching exercises, Use heat therapy before stretching, Avoid sudden or jerky movements.",
    "diet": "Focus on a balanced diet with adequate vitamin D and calcium to support bone health.",
    "lifestyle": "Perform regular shoulder stretches and avoid prolonged immobilization."
  },
  "lower back pain": {
    "disease name": "lower back pain",
    "response": "Lower back pain is common and can limit mobility. Physiotherapy and proper posture are key. Need suggestions?",
    "symptoms": "Muscle ache, shooting or stabbing pain, limited flexibility, difficulty standing upright.",
    "remedy": "Here are a few remedies:, Practice core-strengthening exercises, Apply heat or cold packs for relief, Avoid heavy lifting and poor posture.",
    "diet": "Consume foods rich in calcium and magnesium, such as dairy products and leafy greens.",
    "lifestyle": "Maintain proper posture, avoid prolonged sitting, and take frequent breaks during long activities."
  },
  "tennis elbow (lateral epicondylitis)": {
    "disease name": "tennis elbow (lateral epicondylitis)",
    "response": "Tennis elbow causes pain in the elbow due to repetitive strain. Physiotherapy can aid recovery. Would you like tips?",
    "symptoms": "Elbow pain, weakened grip strength, pain when lifting or gripping objects.",
    "remedy": "Here are a few remedies:, Rest the affected arm, Use a brace or strap for support, Perform stretching and strengthening exercises.",
    "diet": "Include foods rich in omega-3s and antioxidants to reduce inflammation.",
    "lifestyle": "Avoid repetitive motions, and practice proper ergonomics in daily activities."
  },
  "carpal tunnel syndrome": {
    "disease name": "carpal tunnel syndrome",
    "response": "Carpal tunnel syndrome causes wrist pain and tingling due to nerve compression. Physiotherapy can help. Need advice?",
    "symptoms": "Tingling or numbness in the hand, weakness in the hand, pain in the wrist or palm.",
    "remedy": "Here are a few remedies:, Perform wrist stretches, Use wrist splints during repetitive tasks, Apply ice packs to reduce swelling.",
    "diet": "Consume anti-inflammatory foods and ensure proper hydration.",
    "lifestyle": "Take regular breaks from repetitive tasks and maintain proper hand posture."
  },
  "spinal cord injury (SCI)": {
    "disease name": "spinal cord injury (SCI)",
    "response": "Spinal cord injuries affect mobility and sensation. Physiotherapy can improve recovery. Do you need guidance?",
    "symptoms": "Loss of movement, loss of sensation, difficulty breathing, muscle spasms.",
    "remedy": "Here are a few remedies:, Follow a structured physiotherapy program, Use assistive devices if needed, Perform range-of-motion exercises.",
    "diet": "Consume high-protein foods for muscle repair and fiber-rich foods to prevent constipation.",
    "lifestyle": "Maintain proper posture and stay consistent with rehabilitation exercises."
  },
  "cervical spondylosis": {
    "disease name": "cervical spondylosis",
    "response": "Cervical spondylosis causes neck pain and stiffness. Physiotherapy and posture correction are essential. Need tips?",
    "symptoms": "Neck pain, stiffness, headaches, numbness or tingling in the arms or hands.",
    "remedy": "Here are a few remedies:, Perform neck-stretching exercises, Use hot or cold packs for relief, Sleep with a supportive pillow.",
    "diet": "Consume calcium- and vitamin-D-rich foods to strengthen bones.",
    "lifestyle": "Avoid prolonged use of smartphones or laptops and maintain good posture."
  },
  "ankle sprain": {
    "disease name": "ankle sprain",
    "response": "An ankle sprain causes pain and swelling. Physiotherapy can aid recovery. Would you like advice?",
    "symptoms": "Swelling, bruising, pain when bearing weight, limited range of motion.",
    "remedy": "Here are a few remedies:, Follow the R.I.C.E method (Rest, Ice, Compression, Elevation), Perform strengthening exercises once swelling subsides, Use an ankle brace for support.",
    "diet": "Consume foods rich in vitamin C and protein for tissue repair.",
    "lifestyle": "Avoid weight-bearing activities during initial recovery and wear supportive footwear."
  },
  "plantar fasciitis": {
    "disease name": "plantar fasciitis",
    "response": "Plantar fasciitis causes heel pain due to inflammation. Physiotherapy can provide relief. Need suggestions?",
    "symptoms": "Heel pain, stiffness in the morning, pain after prolonged standing or activity.",
    "remedy": "Here are a few remedies:, Perform stretching exercises for the calf and plantar fascia, Use orthotic insoles for arch support, Apply ice packs to reduce inflammation.",
    "diet": "Consume anti-inflammatory foods and maintain a healthy weight.",
    "lifestyle": "Avoid prolonged standing and wear supportive shoes."
  },
  "rotator cuff injury": {
    "disease name": "rotator cuff injury",
    "response": "Rotator cuff injuries cause shoulder pain and weakness. Physiotherapy is crucial for recovery. Need advice?",
    "symptoms": "Shoulder pain, difficulty lifting the arm, weakness in the shoulder, cracking sensation during movement.",
    "remedy": "Here are a few remedies:, Perform shoulder-strengthening exercises, Avoid heavy lifting during recovery, Use ice packs for pain relief.",
    "diet": "Consume protein-rich foods to support muscle repair.",
    "lifestyle": "Avoid repetitive overhead motions and practice proper posture."
  },
  "depression": {
    "disease name": "depression",
    "response": "Depression can affect daily life. Seeking professional help is important. Need self-care tips?",
    "symptoms": "Persistent sadness, loss of interest, changes in appetite or sleep patterns, fatigue, difficulty concentrating.",
    "remedy": "Here are a few remedies:, Practice mindfulness, Stay active with regular exercise, Reach out to supportive friends or therapists.",
    "diet": "Consume foods rich in omega-3s, vitamin D, and magnesium. Avoid excessive caffeine and processed foods.",
    "lifestyle": "Maintain a regular sleep schedule and set achievable daily goals."
  },
  "anxiety": {
    "disease name": "anxiety",
    "response": "Anxiety can be overwhelming. Relaxation techniques can help. Do you need suggestions?",
    "symptoms": "Restlessness, rapid heartbeat, excessive worry, difficulty concentrating, muscle tension.",
    "remedy": "Here are a few remedies:, Practice deep breathing or meditation, Engage in physical activity, Limit caffeine and alcohol.",
    "diet": "Consume magnesium-rich foods like leafy greens and nuts. Avoid stimulants like coffee.",
    "lifestyle": "Create a calm environment and take breaks to manage stress."
  },
  "bipolar disorder": {
    "disease name": "bipolar disorder",
    "response": "Bipolar disorder requires long-term management. Medication and lifestyle changes help. Need tips?",
    "symptoms": "Mood swings, periods of depression and mania, impulsive behavior, changes in energy levels.",
    "remedy": "Here are a few remedies:, Follow prescribed medications, Stick to a structured routine, Track mood changes.",
    "diet": "Maintain a balanced diet with nutrient-dense foods. Avoid alcohol and drugs.",
    "lifestyle": "Get adequate sleep, exercise, and attend regular therapy sessions."
  },
  "PTSD (Post-Traumatic Stress Disorder)": {
    "disease name": "PTSD (Post-Traumatic Stress Disorder)",
    "response": "PTSD can cause distressing memories. Therapy and self-care are vital. Need guidance?",
    "symptoms": "Flashbacks, nightmares, avoidance of triggers, heightened anxiety, difficulty sleeping.",
    "remedy": "Here are a few remedies:, Practice grounding techniques, Avoid triggers, Seek professional therapy.",
    "diet": "Consume omega-3-rich foods and whole grains to support brain health.",
    "lifestyle": "Develop a support system and practice relaxation techniques like yoga."
  },
  "kidney stones": {
    "disease name": "kidney stones",
    "response": "Kidney stones can cause severe pain. Staying hydrated is important. Do you need relief tips?",
    "symptoms": "Severe pain in the back or side, blood in urine, frequent urination, nausea, fever.",
    "remedy": "Here are a few remedies:, Drink plenty of water, Take prescribed pain relievers, Use lemon juice or apple cider vinegar.",
    "diet": "Limit salt and oxalate-rich foods like spinach. Include more citrus fruits and water-rich foods.",
    "lifestyle": "Stay active and monitor urine output to prevent stone recurrence."
  },
  "obesity": {
    "disease name": "obesity",
    "response": "Obesity can lead to other health issues. Lifestyle changes are key. Do you need advice?",
    "symptoms": "Excess body fat, difficulty with physical activity, fatigue, joint pain.",
    "remedy": "Here are a few remedies:, Engage in regular physical activity, Follow a calorie-controlled diet, Seek support from a nutritionist if needed.",
    "diet": "Consume nutrient-dense, low-calorie foods. Avoid sugary drinks and fried foods.",
    "lifestyle": "Track your meals and exercise regularly to maintain progress."
  },
  "hypertension": {
    "disease name": "hypertension",
    "response": "Hypertension can be managed with lifestyle changes. Would you like guidance?",
    "symptoms": "Headaches, shortness of breath, nosebleeds (in severe cases), dizziness.",
    "remedy": "Here are a few remedies:, Reduce sodium intake, Exercise regularly, Manage stress through relaxation.",
    "diet": "Focus on DASH diet foods like fruits, vegetables, and low-fat dairy. Limit fatty and salty foods.",
    "lifestyle": "Quit smoking, limit alcohol, and maintain a healthy weight."
  },
  "hypothyroidism": {
    "disease name": "hypothyroidism",
    "response": "Hypothyroidism can cause fatigue and weight gain. Proper treatment can help. Need advice?",
    "symptoms": "Fatigue, weight gain, dry skin, cold intolerance, constipation, depression.",
    "remedy": "Here are a few remedies:, Take prescribed thyroid medication, Avoid skipping doses, Monitor symptoms regularly.",
    "diet": "Consume iodine-rich foods like seafood. Avoid goitrogens like soy and raw cruciferous vegetables.",
    "lifestyle": "Maintain regular exercise and get enough sleep to manage fatigue."
  },
  "polycystic ovary syndrome (PCOS)": {
    "disease name": "polycystic ovary syndrome (PCOS)",
    "response": "PCOS affects hormonal balance and ovulation. Lifestyle changes can help. Would you like guidance?",
    "remedy": "Here are a few remedies:, Exercise regularly, Maintain a healthy weight, Take prescribed medications like hormonal therapy.",
    "diet": "Consume a low-carb diet with high-fiber foods like vegetables and legumes. Avoid processed foods.",
    "lifestyle": "Practice stress reduction techniques and establish a consistent sleep schedule.",
    "symptoms": "Irregular periods, excessive hair growth (hirsutism), acne, weight gain, and thinning hair."
  },
  "endometriosis": {
    "disease name": "endometriosis",
    "response": "Endometriosis causes painful periods and other symptoms. Managing pain is crucial. Need tips?",
    "remedy": "Here are a few remedies:, Take over-the-counter pain relievers, Apply heat to the lower abdomen, Follow medical treatment plans.",
    "diet": "Consume anti-inflammatory foods like leafy greens and fish. Avoid trans fats and sugary foods.",
    "lifestyle": "Track your menstrual cycle and manage stress through relaxation techniques.",
    "symptoms": "Pelvic pain, painful periods, heavy menstrual bleeding, pain during intercourse, and infertility."
  },
  "erectile dysfunction": {
    "disease name": "erectile dysfunction",
    "response": "Erectile dysfunction can have physical or psychological causes. Do you need guidance?",
    "remedy": "Here are a few remedies:, Consult a doctor for underlying issues, Manage stress, Exercise regularly.",
    "diet": "Eat heart-healthy foods like nuts, fruits, and whole grains. Avoid excessive alcohol and fatty foods.",
    "lifestyle": "Avoid smoking and limit alcohol intake. Manage stress effectively.",
    "symptoms": "Difficulty achieving or maintaining an erection, reduced sexual desire, and stress or embarrassment related to sexual performance."
  },
  "uterine fibroids": {
    "disease name": "uterine fibroids",
    "response": "Uterine fibroids can cause heavy periods or discomfort. Treatment options are available. Would you like tips?",
    "remedy": "Here are a few remedies:, Take prescribed medications, Apply heat for cramps, Stay hydrated during heavy periods.",
    "diet": "Consume foods rich in vitamin D and green leafy vegetables. Avoid processed and high-fat foods.",
    "lifestyle": "Maintain a healthy weight and track symptoms for medical consultations.",
    "symptoms": "Heavy menstrual bleeding, prolonged periods, pelvic pain, frequent urination, and backache."
  },
  "rheumatoid arthritis": {
    "disease name": "rheumatoid arthritis",
    "response": "Rheumatoid arthritis is an autoimmune disease causing joint pain and stiffness. Would you like tips for relief?",
    "remedy": "Here are a few remedies:, Use hot or cold packs, Perform low-impact exercises, Take anti-inflammatory medications as prescribed.",
    "diet": "Consume foods rich in omega-3 fatty acids, such as fish, and anti-inflammatory spices like turmeric.",
    "lifestyle": "Avoid smoking, manage stress, and maintain a healthy weight.",
    "symptoms": "Joint pain, swelling, stiffness, fatigue, and loss of joint function."
  },
  "lupus": {
    "disease name": "lupus",
    "response": "Lupus is an autoimmune condition that affects multiple organs. Do you need guidance on managing symptoms?",
    "remedy": "Here are a few remedies:, Avoid excessive sun exposure, Take prescribed medications, Manage stress with relaxation techniques.",
    "diet": "Consume a diet rich in fruits, vegetables, and whole grains. Avoid processed foods and excessive salt.",
    "lifestyle": "Practice stress management, get adequate rest, and avoid overexertion.",
    "symptoms": "Fatigue, joint pain, skin rashes, fever, and hair loss."
  },
  "multiple sclerosis": {
    "disease name": "multiple sclerosis",
    "response": "Multiple sclerosis affects the nervous system. Managing symptoms is key. Would you like advice?",
    "remedy": "Here are a few remedies:, Engage in physical therapy, Take prescribed medications, Rest adequately to reduce fatigue.",
    "diet": "Consume foods rich in omega-3s and antioxidants. Avoid saturated fats and processed foods.",
    "lifestyle": "Stay active within your limits and maintain a regular sleep schedule.",
    "symptoms": "Numbness or tingling, muscle weakness, balance problems, fatigue, and vision issues."
  },
  "celiac disease": {
    "disease name": "celiac disease",
    "response": "Celiac disease is triggered by gluten. Avoiding gluten is essential. Would you like dietary suggestions?",
    "remedy": "Here are a few remedies:, Follow a strict gluten-free diet, Avoid cross-contaminated foods, Take vitamin supplements if needed.",
    "diet": "Consume gluten-free grains like rice, quinoa, and corn. Avoid wheat, barley, and rye.",
    "lifestyle": "Read food labels carefully and ensure proper nutrition through balanced meals.",
    "symptoms": "Abdominal pain, bloating, diarrhea, weight loss, and fatigue."
  }
};

// Memory object to store user context
let userContext = {
  lastCondition: null
};

// Fuzzy match function
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

// Function to match health condition
function matchCondition(userInput) {
  for (let condition in healthConditions) {
    if (userInput.toLowerCase().includes(condition)) {
      userContext.lastCondition = condition;
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

  if (highestScore > 70) {
    userContext.lastCondition = bestMatch;
    return bestMatch;
  } else {
    return null;
  }
}

// Function to handle chatbot logic
function healthcareChatbot(userInput) {
  let condition = matchCondition(userInput);

  if (!condition && userContext.lastCondition) {
    condition = userContext.lastCondition;
  }

  if (condition) {
    userContext.lastCondition = condition; // Store last mentioned condition

    if (userInput.toLowerCase().includes("remedy")) {
      return healthConditions[condition].remedy;
    } else if (userInput.toLowerCase().includes("diet")) {
      return healthConditions[condition].diet;
    } else if (userInput.toLowerCase().includes("lifestyle")) {
      return healthConditions[condition].lifestyle;
    } else if (userInput.toLowerCase().includes(condition)) {
      // Display condition response with buttons inside the same container
      displayConditionInfo(condition);
      return;
    }else {
      return `These symptoms are more similar to the symptoms of ${condition}. I would suggest consulting a doctor. Do you want to book an appointment?`;
    }
  } else {
    return "I'm here to help, but I didn't quite understand your concern. Could you rephrase or provide more details?";
  }
}

// Function to create and display disease info and buttons in the same container
function displayConditionInfo(condition) {
    const chatBody = document.getElementById("chatBody");

    // Create a container for disease info + buttons + response
    let conditionContainer = document.createElement("div");
    conditionContainer.style.cssText = `
        background: #f9f9f9;
        padding: 15px;
        border-radius: 10px;
        margin: 10px 0;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        font-family: Arial, sans-serif;
    `;

    // Add disease information
    let conditionMessage = document.createElement("p");
    conditionMessage.innerHTML = `<strong>${condition.toUpperCase()}</strong><br>${healthConditions[condition].response}`;
    conditionMessage.style.cssText = `font-size: 14px; color: #333; margin-bottom: 10px;`;

    // Create button container
    let buttonContainer = document.createElement("div");
    buttonContainer.style.cssText = "display: flex; gap: 10px; margin-top: 10px;";

    // Create response container (where remedies, diet, or lifestyle info will be shown)
    let responseContainer = document.createElement("div");
    responseContainer.classList.add("responseContainer");
    responseContainer.style.cssText = "margin-top: 10px; font-size: 14px; color: #444;";

    // Create buttons dynamically
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

    // Append elements to the container
    conditionContainer.appendChild(conditionMessage);
    conditionContainer.appendChild(buttonContainer);
    conditionContainer.appendChild(responseContainer);

    // Append the container to the chat
    chatBody.appendChild(conditionContainer);
    chatBody.scrollTop = chatBody.scrollHeight;
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
  } else if (option === "Health Queries") {
    botReply(chatBody, "Please describe your health query");

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
      chatBody.scrollTop = chatBody.scrollHeight;
    }

    // Handle Enter key press
    inputBox.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        const userQuery = e.target.value.trim();
        if (userQuery) {
          addUserMessage(userQuery);
          const response = healthcareChatbot(userQuery);
          botReply(chatBody, response);
          inputBox.value = "";
        }
      }
    });

    // Handle button click
    sendButton.addEventListener("click", () => {
      const userQuery = inputBox.value.trim();
      if (userQuery) {
        addUserMessage(userQuery);
        const response = healthcareChatbot(userQuery);
        botReply(chatBody, response);
        inputBox.value = "";
      }
    });

    chatBody.appendChild(inputBox);
  }
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

  // Handle Submit button click
  submitButton.addEventListener("click", () => {
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

    // Proceed to OTP verification
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
        otpContainer.remove();
      });

      chatBody.appendChild(otpContainer);

      chatBody.scrollTop = chatBody.scrollHeight;
    } else {
      botReply(chatBody, "❗ Please fill in all the details.");
    }
  });

  detailsContainer.appendChild(submitButton);

  chatBody.appendChild(detailsContainer);

  chatBody.scrollTop = chatBody.scrollHeight;
}

// Initialize chat on page load
document.addEventListener("DOMContentLoaded", initializeChat);

document.getElementById("botButton").addEventListener("click", function (e) {
  e.preventDefault();
  const chatContainer = document.getElementById("chatContainer");
  chatContainer.style.display = chatContainer.style.display === "none" || chatContainer.style.display === "" ? "flex" : "none";
});

// Close chat
document.getElementById("closeButton").addEventListener("click", function () {
  document.getElementById("chatContainer").style.display = "none";
});
