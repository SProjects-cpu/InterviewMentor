import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add Remix Icons CDN
const remixIconsLink = document.createElement('link');
remixIconsLink.href = 'https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css';
remixIconsLink.rel = 'stylesheet';
document.head.appendChild(remixIconsLink);

// Add Inter and JetBrains Mono fonts
const fontsLink = document.createElement('link');
fontsLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap';
fontsLink.rel = 'stylesheet';
document.head.appendChild(fontsLink);

// Add page title
const titleElement = document.createElement('title');
titleElement.textContent = 'ResumeAI - Modern Resume Builder';
document.head.appendChild(titleElement);

createRoot(document.getElementById("root")!).render(<App />);
