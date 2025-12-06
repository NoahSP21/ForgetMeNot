import { IonBreadcrumbs, IonBreadcrumb } from "@ionic/react";
import { useLocation, useHistory } from "react-router-dom";
import CreateStudyPlan from "../../pages/Study/CreateStudyPlan";
import EditStudyPlan from "../../pages/Study/EditStudyPlan";
import CreateAppointment from "../../pages/AppointmentManagement/CreateAppointment";
import EditAppointment from "../../pages/AppointmentManagement/EditAppointment";

interface BreadcrumbsProps {
  dynamicNames?: Record<string, string>;
  hideSegments?: string[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ dynamicNames, hideSegments = [] }) => {
  const location = useLocation();
  const history = useHistory();

  // URL parts without "folder"
  let parts = location.pathname
    .split("/")
    .filter((p) => p && p !== "folder");

    // remove segments that should be hidden
  parts = parts.filter((p) => !hideSegments.includes(p));

  // Build a valid URL INCLUDING "folder" at the beginning
  const buildPath = (index: number) =>
    "/folder/" + parts.slice(0, index + 1).join("/");

  // Optional display name mapping
  const nameMap: Record<string, string> = {
    Home: "Home",
    Profile: "Profile",
    EditProfile: "Edit Profile",
    ToBuy: "To Buy",
    CreateToBuy:"Create new list",
    EditListToBuyPage: "Edit list",
    Cleaning: "Cleaning",
    CreateRoom: "Create room",
    EditRoom: "Edit room",
    Study: "Study",
    CreateStudyPlan: "Create study plan",
    EditStudyPlan: "Edit study plan",
    AppointmentManagement: "Appointments",
    CreateAppointment: "Create appointment",
    EditAppointment:"Edit appointment"
  };

  return (
    <div style={{ padding: "10px 16px" }}>
      <IonBreadcrumbs>
        {parts.map((p, index) => (
          <IonBreadcrumb
            key={index}
            onClick={() => history.push(buildPath(index))}
            style={{ cursor: "pointer" }}
          >
            {/* prioritise dynamicNames if it exists */}
            {dynamicNames?.[p] || nameMap[p] || p} 
          </IonBreadcrumb>
        ))}
      </IonBreadcrumbs>
    </div>
  );
};

export default Breadcrumbs;
