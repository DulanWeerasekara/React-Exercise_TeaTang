# Dulan Weerasekara
# Todo App

This is a Todo application built with React and TypeScript, utilizing Shadcn UI for the user interface components. The app allows users to create, update, and delete todos while filtering them based on their completion status.

## Setup Instructions

To run the application locally, follow these steps:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/DulanWeerasekara/React-Exercise_TeaTang.git
2. **Select the working Directry**:
   ```bash
   cd frontend
   cd todo-app
3. **Install Dependencies: Ensure you have Node.js installed. Then, run**:
   ```bash
   npm i
4. **Open Another terminal on backend directry and install FastApi and uvicorn**:
   ```bash
   pip install fastapi uvicorn
5. **Run the FastAPI Server**:
   ```bash
   uvicorn main:app --reload
6. **On the frontend/todo-app Directry: Run the React Application**:
   ```bash
   npm run dev
7. **Access the Application: Open your browser and go to http://localhost:3000**.

## Design Decisions
Component Structure: The application uses functional components for better readability and hooks for managing state and side effects. Each UI component (like Card, Table, Button) is kept modular for easier maintenance and reusability.
State Management: React's useState and useEffect hooks are utilized to manage component states and side effects (like fetching data).
Shadcn UI Integration: Chose Shadcn UI for its beautiful and responsive design components. It helped streamline the UI development process, allowing focus on functionality.
## Challenges Faced
Shadcn UI Integration: Initially, I faced challenges with integrating Shadcn UI components due to varying props and customization options.

Solution: I referred to the official documentation and examples provided by Shadcn UI. Additionally, I utilized community forums and GitHub discussions for specific issues, which helped me understand how to customize components effectively.

   



