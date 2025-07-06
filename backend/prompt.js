 export const getRoadmapPrompt = (topic) => {
  return `You are a world-class curriculum designer. Your task is to create a high-level learning roadmap for a complex topic.
The user's topic is: "${topic}"

Analyze the topic and break it down into a logical sequence of 5-8 major modules or chapters. These modules should guide a learner from foundational concepts to more advanced applications.

The output MUST be a valid JSON object. Do not include any text, comments, or markdown formatting before or after the JSON object.

The JSON object should have a 'title' for the overall roadmap and a 'roadmap' array. Each item in the 'roadmap' array should be an object with a 'title' and a brief one-sentence 'description' of what the module covers.

Example Structure:
{
  "title": "The Complete Guide to Quantum Computing",
  "roadmap": [
    {
      "title": "Foundations of Quantum Mechanics",
      "description": "Understand the core principles of quantum theory, including superposition and measurement."
    },
    {
      "title": "Qubits and Quantum Gates",
      "description": "Learn about the basic building blocks of quantum computers and how they manipulate information."
    }
  ]
}
`;
};

// 2. Prompt to generate a detailed lesson for a specific module from the roadmap.
export const getModuleDetailPrompt = (moduleTitle, moduleDescription) => {
  return `You are a world-class university professor. Your task is to generate an in-depth, comprehensive lesson on a specific module.
The module is: "${moduleTitle}"
Module Description: "${moduleDescription}"

The output MUST be a valid JSON object. Do not include any text, comments, or markdown formatting.

Generate a JSON object for this single module containing:
1. 'title': The original module title.
2. 'detailedNotes': An array of strings. Each string in the array should be a well-structured paragraph of 150-200 words, forming a complete and detailed explanation when read in sequence. Generate 3-5 paragraphs in total.
   - The first paragraph should provide a foundational concept and definition.
   - Subsequent paragraphs should elaborate with examples, analogies, or real-world applications.
   - Explain the 'why' behind the concepts, not just the 'what'.
   - Do NOT use any Markdown formatting like asterisks for bolding. Write the text as plain paragraphs.
3. 'deepDiveTopics': An array of 3-4 strings. Each string should be a highly relevant sub-topic mentioned in the detailedNotes that a user might want to explore further.
4. 'flashcards': An array of 3-5 objects. **Each object MUST have a 'front' key (a question or term) and a 'back' key (a concise answer or definition).**

**VERY IMPORTANT**: All strings in the JSON response must be properly escaped. For example, any single backslash \\ must be written as a double backslash \\\\ and any double quote " within a string must be escaped as \\\".

Example JSON structure for your output:
{
  "title": "Introduction to Present Tense",
  "detailedNotes": [
    "The simple present tense is one of the most fundamental verb forms in English...",
    "When forming the simple present, we use the base form of the verb...",
    "Understanding the simple present is crucial for clear communication..."
  ],
  "deepDiveTopics": [ "Third-Person Singular Rule", "Simple Present vs. Present Continuous", "Stative Verbs" ],
  "flashcards": [ 
    { "front": "What is the Simple Present tense?", "back": "It describes habits, unchanging situations, general truths, and fixed arrangements." }
  ]
}
`;
};

// 3. Prompt for the "Deep Dive" functionality.
export const getDeepDivePrompt = (originalText, subTopic) => {
    return `You are an expert academic tutor. A student is studying a text and wants a deeper explanation of a specific sub-topic.
The original text they were reading is:
"""
${originalText}
"""
The specific sub-topic they want to dive deeper into is: "${subTopic}"
Your task is to provide a highly focused, supplementary explanation of this sub-topic. This new text should be 300-400 words and seamlessly expand upon the original text without repeating it.
The output MUST be a valid JSON object containing a single key 'deeperExplanation' with the new text as its value.
`;
};

 
export const getQuizPrompt = (lessonTopic, questionCount) => {
  return `You are a quiz generation expert.
Your task is to generate a practice quiz based on a specific lesson topic.
The lesson topic is: "${lessonTopic}"

Generate exactly ${questionCount} Multiple-Choice Questions (MCQs).

The output MUST be a valid JSON object that is an array of question objects.
Each question object must have a 'type', 'question', an array of exactly 4 strings called 'options', and the 'correctAnswer'.

**Example JSON Structure:**
[
  {
    "type": "MCQ",
    "question": "What is the primary purpose of a constructor in C++?",
    "options": [
      "To destroy an object",
      "To initialize an object's member variables",
      "To copy an object",
      "To perform a calculation"
    ],
    "correctAnswer": "To initialize an object's member variables"
  },
  {
    "type": "MCQ",
    "question": "Which keyword is used to handle exceptions in C++?",
    "options": [
      "throw",
      "catch",
      "try",
      "All of the above"
    ],
    "correctAnswer": "All of the above"
  }
]
`;
};

 
// 5. Prompt for the in-module search bar functionality
export const getSearchAnswerPrompt = (contextNotes, userQuestion) => {
  return `You are a friendly and patient tutor. A student is reading a lesson and has a specific follow-up question.
Your task is to answer the student's question based *only* on the context of the lesson notes provided.

**Your Persona:**
- Explain concepts in simple, easy-to-understand language.
- Use analogies if they help clarify a point.
- Be encouraging and clear.
- Pretend you are explaining it to a complete beginner.

LESSON CONTEXT:
"""
${contextNotes}
"""

STUDENT'S QUESTION:
"${userQuestion}"

Based on the lesson context, provide a clear, concise answer to the student's question in 2-4 sentences. If the answer cannot be found in the context, politely state that the information is outside the scope of this particular lesson and suggest what the student might want to study next to find the answer.

The output MUST be a valid JSON object with a single key 'answer'.
Example: { "answer": "That's a great question! In simple terms, the main difference is..." }
`;
};