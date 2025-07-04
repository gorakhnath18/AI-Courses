// This object represents a fully detailed, generated lesson module.
export const mockModule = {
  title: "Introduction to C++",
  notes: "C++ is a powerful, general-purpose programming language created by Bjarne Stroustrup as an extension of the C programming language. It is a statically-typed, compiled, multi-paradigm language that supports procedural, object-oriented, and generic programming. Its primary strengths lie in performance, efficiency, and control over system resources, making it a popular choice for performance-critical applications like game engines, high-frequency trading platforms, and operating systems. The language is built around the concept of objects, which are instances of classes. These classes can contain both data (attributes) and functions (methods) that operate on that data, encapsulating functionality into reusable and organized blocks. C++ also provides low-level memory manipulation through features like pointers, which, while powerful, require careful management to avoid common programming errors. Understanding these core principles is the first and most crucial step toward mastering C++. potential 'deepDiveTopics' for further exploration: 'Memory Management', 'Standard Template Library (STL)', 'Compiler Process'.",
  flashcards: [
    { front: "Who created C++?", back: "Bjarne Stroustrup, as an extension of the C language." },
    { front: "What are the main strengths of C++?", back: "Performance, efficiency, and fine-grained control over system resources and memory." },
    { front: "What is an 'object' in C++?", back: "An instance of a class, which encapsulates both data (attributes) and functions (methods)." }
  ],
  youtubeVideos: [
      { videoId: "vLnPwxZdW4Y", title: "C++ Tutorial for Beginners - Full Course" },
      { videoId: "ZzaPdXTrSb8", title: "C++ FULL COURSE For Beginners (Learn C++ in 10 Hours)" }
  ]
};

// This object represents the initial course structure with only a roadmap.
export const mockCourse = {
  _id: "6867cd92e55b6eb034de970d", // Example MongoDB ID
  title: "C++ Learning Roadmap",
  originalPrompt: "c++",
  roadmap: [
    { title: "Fundamentals of Programming in C++", description: "Learn the basic syntax, variables, data types, and control structures." },
    { title: "Object-Oriented Programming (OOP) in C++", description: "Explore classes, objects, inheritance, polymorphism, and encapsulation." },
    { title: "Memory Management and Pointers", description: "Understand manual memory management, pointers, references, and smart pointers." },
    { title: "Standard Template Library (STL)", description: "Master the use of containers, iterators, and algorithms for efficient programming." },
    { title: "Advanced C++ Topics", description: "Dive into templates, exception handling, and modern C++ features." }
  ],
  // The lessons array starts empty and will be populated on-demand.
  lessons: []
};

// This represents the list of courses for the "My Courses" page.
export const mockCourseList = [
    { _id: "6867cd92e55b6eb034de970d", title: "C++ Learning Roadmap", originalPrompt: "c++", createdAt: "2024-05-20T10:00:00Z" },
    { _id: "6867ce34f99a5e23a4b9871e", title: "Introduction to Python", originalPrompt: "python basics", createdAt: "2024-05-19T14:30:00Z" },
];