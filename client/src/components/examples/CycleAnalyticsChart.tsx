import CycleAnalyticsChart from "../CycleAnalyticsChart";

export default function CycleAnalyticsChartExample() {
  const mockData = [
    { cycle: "Jan", length: 28 },
    { cycle: "Feb", length: 29 },
    { cycle: "Mar", length: 27 },
    { cycle: "Apr", length: 28 },
    { cycle: "May", length: 30 },
    { cycle: "Jun", length: 28 },
  ];

  return (
    <div className="p-4">
      <CycleAnalyticsChart data={mockData} title="Cycle Length Trends" />
    </div>
  );
}
