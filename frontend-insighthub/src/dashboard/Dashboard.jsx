import Sidebar from "./Sidebar";
import Header from "./Header";
import GreetingSection from "./GreetingSection";
import LineUpSection from "./LineUpSection";
import TrendingSection from "./TrendingSection";
import MyWorkSection from "./MyWorkSection";
import WeeklyActivityCard from "./WeeklyActivityCard";
import TotalProgressCard from "./TotalProgressCard";
import WorkingActivityChart from "./WorkingActivityChart";

export default function Dashboard() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex flex-col w-full">
        <Header />
        <div className="p-6 grid grid-cols-3 gap-4">
          <div className="col-span-2 space-y-4">
            <GreetingSection />
            <LineUpSection />
            <TrendingSection />
            <MyWorkSection />
          </div>
          <div className="space-y-4">
            <WeeklyActivityCard />
            <TotalProgressCard />
            <WorkingActivityChart />
          </div>
        </div>
      </div>
    </div>
  );
}
