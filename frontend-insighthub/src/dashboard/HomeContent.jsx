import GreetingSection from "./GreetingSection";
import LineUpSection from "./LineUpSection";
import MyWorkSection from "./MyWorkSection";
import WeeklyActivityCard from "./WeeklyActivityCard";
import TotalProgressCard from "./TotalProgressCard";
import WorkingActivityChart from "./WorkingActivityChart";

export default function HomeContent() {
  return (
    <div className="flex flex-col lg:flex-row">
      {/* Left Content */}
      <div className="flex-1 p-4 lg:p-6 space-y-6">
        <GreetingSection />
        <LineUpSection />
        <MyWorkSection />
      </div>

      {/* Right Sidebar */}
      <div className="w-full lg:w-80 p-4 lg:p-6 space-y-4 lg:border-l lg:border-gray-200 bg-white">
        <WeeklyActivityCard />
        <TotalProgressCard />
        <WorkingActivityChart />
      </div>
    </div>
  );
}