# **App Name**: DocuChat

## Core Features:

- User Authentication: User authentication (sign-up/login) using the API's /signup and /token endpoints.
- Document Upload: Document upload interface, sending files to the /upload endpoint.
- Question Input & Answer Display: Question input field and display of the AI-generated answer received from the /ask endpoint.
- History Display: Display user's question/answer history using the /history endpoint.
- Context Aware Question Answering: Call a tool using the available document for the most accurate answers based on context and relationships between different pieces of data inside of it.
- Question Rephrasing: Use AI to paraphrase user questions, generating multiple different wordings of the same question for use by the backend LLM to better produce good answers.

## Style Guidelines:

- Primary color: Deep indigo (#3F51B5) to evoke trust and intelligence, aligning with the app's functionality.
- Background color: Very light grey (#F0F0F0), close in hue to indigo but only 15% saturation, to provide a neutral backdrop and emphasize content.
- Accent color: Sky blue (#03A9F4) to draw attention to interactive elements, offset 30 degrees on the color wheel, lighter and brighter to contrast against the indigo.
- Headline Font: 'Space Grotesk' (sans-serif) for headers and titles, to bring a techy and modern vibe
- Body Font: 'Inter' (sans-serif) for the main text and conversation bubbles to support comfortable reading
- Follow a design mimicking ChatGPT, with a conversation-style layout, and distinct bubbles for user questions and AI responses.
- History section placed in a sidebar, showing a scrollable list of previous conversations.