# Full-Stack PWA: Dynamic Student Survey App

This project is a full-stack Progressive Web App (PWA). It features a weather-based "Ride or Not" recommendation and a dynamic survey system that renders forms from a JSON schema.

## Deliverables

-   **PWA Project:** The `frontend` and `backend` folders.
-   **Mockups:** PNG files
-   **README:** This file.

---

## 🚀 How to Run Locally

### Prerequisites

-   Node.js (v18+)
-   npm
-   MongoDB Atlas (or a local MongoDB instance)

### 1. Backend Setup

1.  **Navigate to the backend:**
    ```bash
    cd backend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Create `.env` file:** Create a file named `.env` in the `backend` folder and add your MongoDB connection string:
    ```
    MONGO_URI=your_mongodb_connection_string_goes_here
    ```
4.  **Seed the database:** This is a one-time step to populate the `surveytemplates` collection from `surveyData.json`.
    ```bash
    node seed.js
    ```
5.  **Start the backend server:**
    ```bash
    npm run dev
    ```
    The server will be running on `http://localhost:5001`.

### 2. Frontend Setup

1.  **Open a new terminal** and navigate to the frontend:
    ```bash
    cd frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start the frontend app:**
    ```bash
    npm run dev
    ```
    The app will open on `http://localhost:5173` (or a similar port).

---

## A. Tech Stack & Justification

This project was built using the **MERN** stack, chosen for its efficiency and suitability for this JSON-heavy assignment.

-   **Frontend:** **React (with Vite)**
    -   **Why:** React's component-based architecture and state management (`useState`, `useEffect`) are perfect for building a dynamic, reactive survey form. It makes handling conditional visibility (`checkVisibility.js`) and answer states simple and declarative. Vite was chosen for its blazing-fast development server.
-   **Backend:** **Node.js + Express.js**
    -   **Why:** Node.js and Express provide a lightweight, fast, and scalable foundation for building the REST API. Since the frontend is also JavaScript, it allows for a unified language across the stack.
-   **Database:** **MongoDB (with Mongoose)**
    -   **Why:** This was the most critical choice. The assignment is centered around a complex, nested JSON schema. A NoSQL database like MongoDB is purpose-built to store this kind of flexible, document-based data. Both the `SurveyTemplate` and the `SurveySubmission` (a JSON object of answers) map naturally to MongoDB collections, simplifying development significantly.

---

## B. Project Structure & Database Schema

### Key Folders & Files

```
fullstack-survey-pwa/
├── backend/
│   ├── models/             # Mongoose schemas (SurveyTemplate, SurveySubmission)
│   ├── routes/             # API route definitions (api.js)
│   ├── .env                # Stores secrets (MONGO_URI)
│   ├── surveyData.json     # The raw JSON survey data for seeding
│   ├── seed.js             # The seeder script
│   ├── server.js           # Express server setup and DB connection
│   └── package.json
│
├── frontend/
│   ├── public/             # PWA icons (pwa-192x192.png, etc.)
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   ├── inputs/     # Individual input types (TextInput, etc.)
│   │   │   ├── Notification.jsx   # Non-blocking error/success notifications
│   │   │   ├── QuestionRenderer.jsx # Renders the correct input for a question
│   │   │   ├── SubmissionDetail.jsx # Formats and displays a single submission
│   │   │   └── WeatherWidget.jsx    # The 3-day forecast widget
│   │   ├── pages/          # The 3 main screens (Dashboard, SurveyForm, SubmissionsList)
│   │   ├── utils/          # Helper functions (checkVisibility.js)
│   │   ├── App.jsx         # Main app, contains routing
│   │   ├── index.css       # Global stylesheet
│   │   └── main.jsx        # React entry point
│   ├── vite.config.js      # Vite config (with PWA plugin)
│   └── package.json
│
└── README.md               # This file
```

### Database Schema

Two collections are used in MongoDB:

1.  **`surveytemplates`**
    * Stores the structure of each survey.
    * `title` (String): e.g., "Student Daily Habits Survey"
    * `surveyData` (Mixed): The entire, original JSON object for the survey (sections, questions, logic, etc.).

2.  **`surveysubmissions`**
    * Stores each user's completed form.
    * `surveyTemplate` (ObjectId): A reference to the `_id` of the survey in `surveytemplates`.
    * `answers` (Mixed): A key-value JSON object of the user's answers (e.g., `{"q_1": "John", "q_2": "3rd"}`).
    * `submittedAt` (Date): A timestamp for the submission.

---

## C. From Prototype to Production

This prototype is functional but would need several enhancements for a robust, production-ready system.

1.  **Authentication & Authorization:**
    * Implement user login (e.g., JWT).
    * Associate submissions with a `userId`.
    * Secure endpoints so only authenticated users can submit forms and only admins can view all submissions.
2.  **Robust Error Handling & Validation:**
    * **Backend:** Implement server-side validation (e.g., using `zod` or `joi`) to ensure no bad data is saved, even if the frontend validation fails.
    * **Frontend:** Move from simple `alert()` validation to an inline error state system (e.g., "This field is required" shown in red under the input).
3.  **UI/UX & Accessibility:**
    * Implement a proper design system or component library (e.g., Material-UI, Chakra UI) for a professional look and feel.
    * Ensure all inputs are fully accessible (ARIA attributes, keyboard navigation).
    * Add PWA features like a `manifest.json` and a `service-worker` for offline capabilities.
4.  **Performance & Scalability:**
    * Paginate the `GET /api/submissions` endpoint, which could otherwise return thousands of records.
    * Add indexes to the database (e.g., on `surveyTemplate` in the submissions collection) for faster querying.
    * Containerize the frontend and backend (using Docker) and deploy on a scalable platform (e.g., Kubernetes, AWS).

---

## D. AI Prompts Used

This section documents the prompts used for AI assistance during the development process, as required by the assignment. The prompts were focused on high-level architectural trade-offs, best practices, and debugging, rather than direct code generation.

* "I'm planning the tech stack for this full-stack PWA assignment. Since the survey part is so heavily based on JSON, I'm leaning towards the MERN stack. Does this seem like a good fit? What are the main benefits of using MongoDB here versus a relational database like PostgreSQL?"

* "I need to design the backend API for this. The assignment requires a full backend, not Firebase. What's a clean, modular folder structure you'd recommend for a Node.js/Express server? Also, what are the essential API endpoints I'll need to build to support all three screens?"

* "For the dynamic survey form, I need to manage the state of all the answers to check the conditional visibility logic. I'm using React. What would be a better pattern here: a single large `useState` object for all answers, or using `useReducer`? What are the pros and cons for this specific use case?"

* "The app needs to give a 'Ride or Not' recommendation based on the weather. My first thought is to just check for rain. Can you suggest a more robust or realistic logic? What other data points from a weather API (like wind, or min/max temp) should I consider?"

* "The `README.md` requires a 'path to production' section. My current prototype will have basic functionality. Can you help me outline the 3-4 most important steps I would need to take to make this app truly production-ready (e.g., auth, error handling, etc.)?"