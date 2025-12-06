import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonMenuButton,
    IonButtons,
    IonIcon
} from "@ionic/react";

import useSound from 'use-sound';
import click from "/sounds/click.mp3";
import deleteSound from "/sounds/delete.mp3";

import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router";

import { Appointment } from "./AppointmentTypes";
import { getAllAppointments, deleteAppointment } from "./AppointmentApi";

import "./AppointmentManagement.css";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import { close } from "ionicons/icons";

const AppointmentManagement: React.FC = () => {
    const [playClick] = useSound(click);
    const [playDelete] = useSound(deleteSound);

    const history = useHistory();
    const location = useLocation();

    const [confirmedAppointments, setConfirmedAppointments] = useState<Appointment[]>([]);
    const [pendingAppointments, setPendingAppointments] = useState<Appointment[]>([]);
    const [sections, setSections] = useState<string[]>(["WORK", "DOCTOR", "TRAVEL"]);

    const loadAppointments = async () => {
        const all = await getAllAppointments();

        const confirmed = all.filter(a => a.confirmed);
        const pending = all.filter(a => !a.confirmed);

        const dynamicSections = Array.from(new Set(all.map(a => a.section).filter(Boolean)));
        setSections(Array.from(new Set([...sections, ...dynamicSections])));

        setConfirmedAppointments(confirmed);
        setPendingAppointments(pending);
    };


    useEffect(() => {
        loadAppointments();
    }, [location.key]);

    const handleDelete = async (id: string) => {
        await deleteAppointment(id);
        setConfirmedAppointments(prev => prev.filter(a => a.id !== id));
        setPendingAppointments(prev => prev.filter(a => a.id !== id));
    };

    const goToCreate = () => history.push('/folder/AppointmentManagement/CreateAppointment');
    const goToEdit = (id: string) => history.push(`/folder/AppointmentManagement/EditAppointment/${id}`);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start"><IonMenuButton /></IonButtons>
                    <IonTitle>Forget Me Not</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding">
                <Breadcrumbs />
                <h1>APPOINTMENT MANAGEMENT</h1>
                <div className="appointments-container">

                    {/* CONFIRMED COLUMN */}
                    <div className="column">
                        <h3>CONFIRMED APPOINTMENTS</h3>
                        {sections.map(section => {
                            const apps = confirmedAppointments.filter(a => a.section === section);
                            if (!apps.length) return null;
                            return (
                                <div className="section-box" key={`confirmed-${section}`}>
                                    <h3>{section}</h3>
                                    {apps.map(app => (
                                        <div className="appointment-card" key={app.id}>
                                            <div className="appointment-title">
                                                {app.title}
                                                <button className="close-btn" onClick={() => {
                                                    playDelete();
                                                    handleDelete(app.id!)
                                                }}>
                                                    <IonIcon
                                                        icon={close}
                                                    />
                                                </button>
                                            </div>
                                            <div className="datetime-box">
                                                <div className="date-box">{app.date}</div>
                                                <div className="time-box">{app.time}</div>
                                            </div>
                                            <IonButton expand="block" onClick={() => goToEdit(app.id!)}>Edit</IonButton>
                                        </div>
                                    ))}
                                </div>
                            );
                        })}
                        <IonButton expand="block" color="primary"  onClick={() => {
                            playClick();
                            goToCreate()
                        }}>+ Add confirmed appointment</IonButton>
                    </div>

                    {/* PENDING COLUMN */}
                    <div className="column">
                        <h3>APPOINTMENTS TO CONFIRM</h3>
                        {sections.map(section => {
                            const apps = pendingAppointments.filter(a => a.section === section);
                            if (!apps.length) return null;
                            return (
                                <div className="section-box" key={`pending-${section}`}>
                                    <h3>{section}</h3>
                                    {apps.map(app => (
                                        <div className="appointment-card" key={app.id}>
                                            <div className="appointment-title">
                                                {app.title}
                                                <button className="close-btn" onClick={() => {
                                                    playDelete();
                                                    handleDelete(app.id!)}}>
                                                    <IonIcon
                                                        icon={close}
                                                    />
                                                </button>
                                            </div>
                                            <div className="datetime-box">
                                                <div className="date-box">{app.date}</div>
                                                <div className="time-box">{app.time}</div>
                                            </div>
                                            <IonButton expand="block" onClick={() => goToEdit(app.id!)}>Edit</IonButton>
                                        </div>
                                    ))}
                                </div>
                            );
                        })}
                        <IonButton expand="block" color="secondary" onClick={() => {
                            playClick();
                            goToCreate()
                        }}>
                            + Add appointment yet to confirm</IonButton>
                    </div>

                </div>
            </IonContent>
        </IonPage>
    );
};

export default AppointmentManagement;
