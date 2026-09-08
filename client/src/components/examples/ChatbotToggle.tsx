import ChatbotToggle from "../ChatbotToggle";

export default function ChatbotToggleExample() {
  return (
    <div className="p-4 min-h-screen bg-background">
      <h1 className="text-2xl font-bold mb-4">Chatbot Toggle Example</h1>
      <p className="text-muted-foreground">Look for the chat button in the bottom right corner!</p>
      <ChatbotToggle />
    </div>
  );
}
