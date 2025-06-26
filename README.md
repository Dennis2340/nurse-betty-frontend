# Nurse Betty - AI Healthcare Assistant

Nurse Betty is a real-time, voice-based AI healthcare assistant built with Next.js, React, and the OpenAI Realtime API. This application allows users to interact with an AI named "Nurse Betty" who can analyze symptoms, answer medical questions, and perform various healthcare-related tasks.

## Features

*   **Real-Time Voice Interaction:** Speak to Nurse Betty in real time and receive spoken responses.
*   **Symptom Analysis:** Describe your symptoms to Nurse Betty, and she will provide you with relevant information and suggestions.
*   **Medical Task Automation:** Nurse Betty can perform a variety of tasks, such as:
    *   Generating lab orders
    *   Writing prescriptions
    *   Referring patients to providers
    *   Retrieving medical guidelines
*   **Secure and Scalable:** The application is built with a secure API and is designed to be scalable.

## Technologies Used

*   **Frontend:**
    *   [Next.js](https://nextjs.org/)
    *   [React](https://reactjs.org/)
    *   [Tailwind CSS](https://tailwindcss.com/)
*   **Real-Time AI:**
    *   [@openai/agents-realtime](https://www.npmjs.com/package/@openai/agents-realtime)
    *   OpenAI `gpt-4o-realtime-preview` model
*   **Backend:**
    *   [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
*   **Other Key Libraries:**
    *   [axios](https://axios-http.com/) for making HTTP requests
    *   [zod](https://zod.dev/) for data validation

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   [Node.js](https://nodejs.org/en/) (version 20 or later)
*   [npm](https://www.npmjs.com/)

### Installation

1.  Clone the repo
    ```sh
    git clone https://github.com/your_username/nurse-betty-frontend.git
    ```
2.  Install NPM packages
    ```sh
    npm install
    ```
3.  Create a `.env` file in the root of the project and add the following environment variables:
    ```
    OPENAI_API_KEY=your_openai_api_key
    ```

### Running the Application

1.  Start the development server
    ```sh
    npm run dev
    ```
2.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## API Reference

The application uses Next.js API Routes to create a serverless backend. The following API endpoints are available:

*   `POST /api/session`: Creates a new user session.
*   `POST /api/generate-token`: Generates a new token for a user session.
*   `POST /api/analyze-symptoms`: Analyzes a list of symptoms.
*   `POST /api/flag-for-moderation`: Flags a conversation for moderation.
*   `POST /api/generate-lab-order`: Generates a new lab order.
*   `POST /api/medical-model-query`: Queries the medical AI model.
*   `POST /api/refer-to-provider`: Refers a patient to a provider.
*   `POST /api/retrieve-guideline`: Retrieves a medical guideline.
*   `POST /api/save-to-record`: Saves a conversation to a patient's record.
*   `POST /api/send-via-whatsapp`: Sends a message via WhatsApp.
*   `POST /api/write-prescription`: Writes a new prescription.

## How It Works

1.  **Start a Session:** When the user clicks "Start Session," the application creates a new session and generates a token to authenticate the user.
2.  **Connect to the AI:** The application connects to the OpenAI Realtime API and creates a new `RealtimeSession` with a specific voice (`nurseBettyVoice`).
3.  **Listen for Voice Input:** The application listens for the user's voice input and transcribes it to text using the `gpt-4o-mini-transcribe` model.
4.  **Process the Input:** The transcribed text is sent to the `gpt-4o-realtime-preview` model, which processes the input and determines the appropriate response.
5.  **Perform Actions:** If the user's request requires a specific action (e.g., "analyze my symptoms"), the AI will call the corresponding API endpoint (e.g., `/api/analyze-symptoms`).
6.  **Generate a Spoken Response:** The AI generates a spoken response, which is streamed back to the user in real time.
7.  **End the Session:** When the user clicks "End Session," the application disconnects from the AI and ends the session.

## License

Distributed under the MIT License. See `LICENSE` for more information.