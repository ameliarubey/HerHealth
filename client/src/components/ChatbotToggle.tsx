import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import Chatbot from "./Chatbot";

export default function ChatbotToggle() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {!isOpen && (
        <Button
          size="icon"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-[100] flex items-center justify-center
"
          onClick={() => setIsOpen(true)}
          data-testid="button-open-chatbot"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
      {isOpen && <Chatbot onClose={() => setIsOpen(false)} />}
    </>
  );
}
