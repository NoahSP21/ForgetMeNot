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

import useSound from 'use-sound';
import click from "/sounds/click.mp3";
import success from "/sounds/success2.mp3";


import { useEffect, useState } from "react";
import { useHistory } from "react-router";

import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import { createAppointment, getAllSections } from "./AppointmentApi";
import { Appointment } from "./AppointmentTypes";
import { toast } from "react-toastify";

import './CreateAppointment.css';

const CreateAppointment: React.FC = () => {
  const [playClick] = useSound(click);
  const [playSuccess] = useSound(success);

  const history = useHistory();

  const defaultSections = ["WORK", "DOCTOR", "TRAVEL"];

  const [sections, setSections] = useState<string[]>(defaultSections);
  const [selectedSection, setSelectedSection] = useState<string>("WORK");
  const [customSection, setCustomSection] = useState("");

  const [confirmed, setConfirmed] = useState<boolean>(false); // por defecto false
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  // Cargar secciones de Firebase y combinarlas con las default
  useEffect(() => {
    const loadSections = async () => {
      const allSections = await getAllSections();
      const combined = Array.from(new Set([...defaultSections, ...allSections]));
      setSections(combined);
      if (!combined.includes(selectedSection)) {
        setSelectedSection(combined[0]);
      }
    };
    loadSections();
  }, []);

  const resetForm = () => {
    setSelectedSection("WORK");
    setCustomSection("");
    setConfirmed(false);
    setTitle("");
    setDate("");
    setTime("");
  };

  const handleSave = async () => {
    let finalSection = selectedSection;

    if (selectedSection === "CUSTOM") {
      if (!customSection.trim()) {
        alert("Please enter a custom section name.");
        return;
      }
      finalSection = customSection.trim().toUpperCase();
    }
    //  No permitir titulo vacío
    if (!title.trim()) return toast.error("Please enter a title.");

    //  No permitir fecha vacío
    if (!date.trim()) return toast.error("Please enter a date.");


    const newAppointment: Appointment = {
      title,
      section: finalSection,
      date,
      time,
      confirmed,
      createdAt: Date.now()
    };


    // volvemos al listado
    try {
      await createAppointment(newAppointment);
      toast.success("Appointment created!");
      playSuccess();

      resetForm();
      history.push("/folder/AppointmentManagement");
    } catch (err) {
      console.error("Error creating appointment:", err);
      toast.error("Error creating appointment");
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start"><IonMenuButton /></IonButtons>
          <IonTitle>Forget Me Not</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <Breadcrumbs />

        <h1 style={{ marginTop: "20px" }}>ADD APPOINTMENT</h1>
        <div className="container-apt">

          {/* SECTIONS */}
          <IonItem className="apt-input">
            <IonLabel>Section</IonLabel>
            <IonSelect
              value={selectedSection}
              placeholder="Select section"
              onIonChange={(e) => setSelectedSection(e.detail.value)}
            >
              {sections.map((sec) => (
                <IonSelectOption key={sec} value={sec}>
                  {sec}
                </IonSelectOption>
              ))}
              <IonSelectOption value="CUSTOM">Custom</IonSelectOption>
            </IonSelect>
          </IonItem>

          {selectedSection === "CUSTOM" && (
            <IonItem className="apt-input">
              <IonLabel position="stacked">Custom Section Name</IonLabel>
              <IonInput
                aria-label="Primary input"
                placeholder="Enter custom section"
                value={customSection}
                onIonInput={(e) => setCustomSection(e.detail.value!)}
              />
            </IonItem>
          )}

          {/* TITLE */}
          <IonItem className="apt-input">
            <IonLabel position="stacked">Appointment Title</IonLabel>
            <IonInput
              aria-label="Primary input"
              value={title}
              placeholder="Ex: Dentist appointment"
              onIonInput={(e) => setTitle(e.detail.value!)}
            />
          </IonItem>

          {/* DATE */}
          <IonItem className="apt-input">
            <IonLabel position="stacked">Date (DD/MM/YYYY)</IonLabel>
            <IonInput
              placeholder="Ex: 12/03/2025"
              value={date}
              onIonInput={(e) => setDate(e.detail.value!)}
            />
          </IonItem>

          {/* TIME */ }
          <IonItem className="apt-input">
            <IonLabel position="stacked">Time (HH:MM AM/PM)</IonLabel>
            <IonInput
              value={time}
              placeholder="Ex: 09:30 AM"
              onIonInput={(e) => setTime(e.detail.value!)}
            />
          </IonItem>

          {/* CONFIRMED */}
          <IonItem className="apt-input">
            <IonLabel>Confirmed?</IonLabel>
            <IonSelect
              value={confirmed}
              onIonChange={(e) => setConfirmed(e.detail.value)}
            >
              <IonSelectOption value={true}>Yes</IonSelectOption>
              <IonSelectOption value={false}>No</IonSelectOption>
            </IonSelect>
          </IonItem>

          {/* BOTONES */}
          <div
            style={{
              marginTop: "40px",
              display: "flex",
              justifyContent: "flex-end",
              gap: "12px"
            }}
          >
            <IonButton color="danger" onClick={() => {
              playClick();
              history.goBack()
            }}>
              Discard
            </IonButton>
            <IonButton color="primary" onClick={handleSave}>
              Save
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CreateAppointment;
