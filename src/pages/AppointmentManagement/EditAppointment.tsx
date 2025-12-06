import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonButtons,
    IonMenuButton,
    IonList
  } from "@ionic/react";
  
  import { useEffect, useState } from "react";
  import { useHistory, useParams } from "react-router";
  import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
  
  import {
    getAllSections,
    getAllAppointments,
    updateAppointment
  } from "./AppointmentApi";
  
  import { Appointment } from "./AppointmentTypes";
  import { toast } from "react-toastify";
  
  interface RouteParams {
    id: string;
  }
  
  const EditAppointment: React.FC = () => {
    const history = useHistory();
    const { id } = useParams<RouteParams>();
  
    const defaultSections = ["WORK", "DOCTOR", "TRAVEL"];
  
    const [sections, setSections] = useState<string[]>(defaultSections);
    const [selectedSection, setSelectedSection] = useState<string>("WORK");
    const [customSection, setCustomSection] = useState("");
  
    const [confirmed, setConfirmed] = useState<boolean>(false);
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
  
    const [loading, setLoading] = useState(true);
  
    // 🔹 1) LOAD all data: sections + appointment data
    useEffect(() => {
      const loadData = async () => {
        try {
          // Load all appointments to find the one we want
          const all = await getAllAppointments();
          const app = all.find(a => a.id === id);
  
          if (!app) {
            toast.error("Appointment not found");
            history.push("/folder/AppointmentManagement");
            return;
          }
  
          // Load sections
          const dynamicSections = await getAllSections();
          const combined = Array.from(
            new Set([...defaultSections, ...dynamicSections])
          );
  
          setSections(combined);
  
          // Fill the form with the appointment data
          setTitle(app.title);
          setDate(app.date);
          setTime(app.time);
          setConfirmed(app.confirmed);
  
          if (
            !defaultSections.includes(app.section) &&
            app.section.toUpperCase() !== "CUSTOM"
          ) {
            setSelectedSection("CUSTOM");
            setCustomSection(app.section);
          } else {
            setSelectedSection(app.section);
          }
  
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
  
      loadData();
    }, [id]);
  
  
    // 🔹 2) SAVE CHANGES
    const handleSave = async () => {
      let finalSection = selectedSection;
  
      if (selectedSection === "CUSTOM") {
        if (!customSection.trim()) {
          return toast.error("Please enter a custom section name");
        }
        finalSection = customSection.trim().toUpperCase();
      }
  
      if (!title.trim()) return toast.error("Please enter a title");
      if (!date.trim()) return toast.error("Please enter a date");
      if (!time.trim()) return toast.error("Please enter a time");
  
      try {
        await updateAppointment(id, {
          title,
          date,
          time,
          confirmed,
          section: finalSection
        });
  
        toast.success("Appointment updated!");
        history.push("/folder/AppointmentManagement");
      } catch (err) {
        console.error(err);
        toast.error("Error updating appointment");
      }
    };
  
  
    if (loading) return <IonPage><IonContent>Loading...</IonContent></IonPage>;
  
  
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start"><IonMenuButton /></IonButtons>
            <IonTitle>Forget Me Not</IonTitle>
          </IonToolbar>
        </IonHeader>
  
        <IonContent className="ion-padding">
        <Breadcrumbs dynamicNames={{ [id]: title }} />

  
          <h1 style={{ marginTop: "20px" }}>EDIT APPOINTMENT</h1>
  
          {/* SECTIONS */}
          <IonItem>
            <IonLabel>Section</IonLabel>
            <IonSelect
              value={selectedSection}
              onIonChange={e => setSelectedSection(e.detail.value)}
            >
              {sections.map(sec => (
                <IonSelectOption key={sec} value={sec}>
                  {sec}
                </IonSelectOption>
              ))}
              <IonSelectOption value="CUSTOM">Custom</IonSelectOption>
            </IonSelect>
          </IonItem>
  
          {selectedSection === "CUSTOM" && (
            <IonItem>
              <IonLabel position="stacked">Custom Section Name</IonLabel>
              <IonInput
                placeholder="Enter custom section"
                value={customSection}
                onIonInput={e => setCustomSection(e.detail.value!)}
              />
            </IonItem>
          )}
  
          {/* TITLE */}
          <IonItem>
            <IonLabel position="stacked">Appointment Title</IonLabel>
            <IonInput
              value={title}
              onIonInput={e => setTitle(e.detail.value!)}
            />
          </IonItem>
  
          {/* DATE */}
          <IonItem>
            <IonLabel position="stacked">Date</IonLabel>
            <IonInput
              value={date}
              onIonInput={e => setDate(e.detail.value!)}
            />
          </IonItem>
  
          {/* TIME */}
          <IonItem>
            <IonLabel position="stacked">Time</IonLabel>
            <IonInput
              value={time}
              onIonInput={e => setTime(e.detail.value!)}
            />
          </IonItem>
  
          {/* CONFIRMED */}
          <IonItem>
            <IonLabel>Confirmed?</IonLabel>
            <IonSelect
              value={confirmed}
              onIonChange={e => setConfirmed(e.detail.value)}
            >
              <IonSelectOption value={true}>Yes</IonSelectOption>
              <IonSelectOption value={false}>No</IonSelectOption>
            </IonSelect>
          </IonItem>
  
          {/* BUTTONS */}
          <div
            style={{
              marginTop: "40px",
              display: "flex",
              justifyContent: "flex-end",
              gap: "12px"
            }}
          >
            <IonButton color="danger" onClick={() => history.goBack()}>
              Cancel
            </IonButton>
  
            <IonButton color="primary" onClick={handleSave}>
              Save Changes
            </IonButton>
          </div>
        </IonContent>
      </IonPage>
    );
  };
  
  export default EditAppointment;
  