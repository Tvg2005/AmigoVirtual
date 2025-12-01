import { DashboardHeader } from "./sections/DashboardHeader";
import { DashboardMainSection } from "./sections/DashboardMainSection";
import { DashboardNavigation } from "./sections/DashboardNavigation";

const Dashboard = (): JSX.Element => {
  return (
    <>
        <DashboardHeader/>
        <DashboardNavigation/>
        <DashboardMainSection/>
    </>
  );
};

export default Dashboard;
