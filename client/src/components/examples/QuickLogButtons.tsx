import QuickLogButtons from "../QuickLogButtons";

export default function QuickLogButtonsExample() {
  return (
    <div className="p-4">
      <QuickLogButtons
        onLogMood={() => console.log("Log mood clicked")}
        onLogSymptoms={() => console.log("Log symptoms clicked")}
        onLogFlow={() => console.log("Log flow clicked")}
        onAddNote={() => console.log("Add note clicked")}
      />
    </div>
  );
}
