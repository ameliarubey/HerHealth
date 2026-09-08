import { useState } from "react";
import Chatbot from "../Chatbot";
import { Button } from "@/components/ui/button";

export default function ChatbotExample() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="p-4 min-h-screen bg-background relative">
      {!isOpen && (
        <Button onClick={() => setIsOpen(true)}>
          Open Chatbot
        </Button>
      )}
      {isOpen && <Chatbot onClose={() => setIsOpen(false)} />}
    </div>
  );
}
