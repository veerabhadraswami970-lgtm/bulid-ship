import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import type { SupportedLanguage } from "./types";
import Header from "./components/Header";
import ChatPage from "./pages/ChatPage";
import AboutPage from "./pages/AboutPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  const [language, setLanguage] = useState<SupportedLanguage>("en");

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <div className="max-w-5xl mx-auto w-full px-2">
          <Header language={language} onLanguageChange={setLanguage} />
        </div>
        <Routes>
          <Route path="/" element={<ChatPage language={language} />} />
          <Route
            path="/about"
            element={<AboutPage language={language} />}
          />
          <Route path="*" element={<NotFoundPage language={language} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
