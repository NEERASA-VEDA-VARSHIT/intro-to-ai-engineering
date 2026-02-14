// import { checkEnvironment } from "./utils.js"
// import OpenAI from "openai"

// // Initialize the OpenAI client using environment variables
// const openai = new OpenAI({
//   apiKey: process.env.AI_KEY,
//   baseURL: process.env.AI_URL,
//   dangerouslyAllowBrowser: true
// })

// checkEnvironment();


// const messages = [ 
//   {
//     role: "system",
//     content: `Make these suggestions thoughtful and practical. 
//     Your response must be under 100 words. 
//     Skip intros and conclusions. 
//     Only output gift suggestions.`
//   },
//   {
//     role: "user",
//     content: `Suggest some gifts for someone who loves hiphop music.`
//   }
// ]

// const firstResponse = await openai.chat.completions.create({
//   model: process.env.AI_MODEL,
//   messages
// })

// // Extract the model's generated text from the response
// console.log(firstResponse.choices[0].message.content)

// const firstAssistantMessage = firstResponse.choices[0].message
// messages.push(firstAssistantMessage)

// messages.push({
//   role: "user",
//   content: "More budget friendly. Less than $40."
// })

// // Send second chat completions request with extended messages array
// const secondResponse = await openai.chat.completions.create({
//   model: process.env.AI_MODEL,
//   messages,
// });

// console.log("Budget friendly suggestions:");
// console.log(secondResponse.choices[0].message.content);


import OpenAI from "openai";
import { autoResizeTextarea, checkEnvironment, setLoading } from "./utils.js";
checkEnvironment();

// Initialize an OpenAI client for your provider using env vars
const openai = new OpenAI({
  apiKey: process.env.AI_KEY,
  baseURL: process.env.AI_URL,
  dangerouslyAllowBrowser: true,
});

// Get UI elements
const giftForm = document.getElementById("gift-form");
const userInput = document.getElementById("user-input");
const outputContent = document.getElementById("output-content");

function start() {
  // Setup UI event listeners
  userInput.addEventListener("input", () => autoResizeTextarea(userInput));
  giftForm.addEventListener("submit", handleGiftRequest);
}

// Initialize messages array with system prompt
const messages = [
  {
    role: "system",
    content: `You are the Gift Genie!
    Make your gift suggestions thoughtful and practical.
    Your response must be under 100 words. 
    Skip intros and conclusions. 
    Only output gift suggestions.`,
  },
];

async function handleGiftRequest(e) {
  // Prevent default form submission
  e.preventDefault();

  // Get user input, trim whitespace, exit if empty
  const userPrompt = userInput.value.trim();
  if (!userPrompt) return;

 // Set loading state
 setLoading(true);
 
  // Add user message to messages array
  messages.push({ role: "user", content: userPrompt });

  // Send chat completions request
  const response = await openai.chat.completions.create({
    model: process.env.AI_MODEL,
    messages,
  });

  // Extract the model's generated text from the response
  const assistantMessage = response.choices[0].message;
  messages.push(assistantMessage);

  // Render assistant's response
  outputContent.textContent = assistantMessage.content;
  
  // Clear loading state
  setLoading(false);

  // Clear user input
  userInput.value = "";

  // Auto-resize textarea
  autoResizeTextarea(userInput);

}

start();
