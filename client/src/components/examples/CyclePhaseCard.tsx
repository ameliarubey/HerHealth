import CyclePhaseCard from "../CyclePhaseCard";

export default function CyclePhaseCardExample() {
  return (
    <div className="space-y-4 p-4">
      <CyclePhaseCard phase="menstrual" cycleDay={2} />
      <CyclePhaseCard phase="follicular" cycleDay={10} />
      <CyclePhaseCard phase="ovulatory" cycleDay={14} />
      <CyclePhaseCard phase="luteal" cycleDay={22} />
    </div>
  );
}
