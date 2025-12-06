// Study.tsx
import React, { useEffect, useState } from 'react';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonMenuButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonDatetime,
    useIonViewWillEnter,
    IonList,
    IonItem,
    IonLabel,
    IonIcon
} from '@ionic/react';
import { useHistory } from 'react-router';

import useSound from 'use-sound';
import click from "/sounds/click.mp3";
import deleteSound from "/sounds/delete.mp3";

import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import { getStudyPlans, deleteStudyPlan, getStudyPlan } from './StudyApi';
import './Study.css';
import { add } from 'ionicons/icons';
import TodayCountdownTimer from '../../components/Cronometro/TodayCountdownTimer';

type SubjectMap = { [id: string]: { name: string; units?: { [id: string]: { name: string } } } };

interface StudyPlan {
    id?: string;
    title: string;
    subjects?: SubjectMap;
    chronometer?: { enabled: boolean; minutes: number } | null;
    frequency?: any;
    createdAt?: any;
    nextOccurrence?: any;
}

const Study: React.FC = () => {
    const [playClick] = useSound(click);
    const [playDelete] = useSound(deleteSound);

    const history = useHistory();
    const [plans, setPlans] = useState<StudyPlan[]>([]);
    const [calendarValue, setCalendarValue] = useState<string | undefined>(undefined);
    const [todayPlans, setTodayPlans] = useState<StudyPlan[]>([]);


    const loadPlans = async () => {
        const data = await getStudyPlans();
        setPlans(data);

        if (data.length) {
            const todayPlansArray = data.filter((p: any) => isPlanToday(p));
            setTodayPlans(todayPlansArray); 
        } else {
            setTodayPlans([]); // vacío si no hay planes
        }
    };


    useIonViewWillEnter(() => {
        loadPlans();
    });

    // buttons
    const goCreate = () => history.push('/folder/Study/CreateStudyPlan');

    const goEdit = (id?: string) => history.push(`/folder/Study/EditStudyPlan/${id}`);

    const removePlan = async (id?: string) => {
        if (!id) return;
        await deleteStudyPlan(id);
        await loadPlans();
    };


    // Helpers to render subjects map
    const renderSubjects = (subjects?: SubjectMap) => {
        if (!subjects) return null;

        return Object.keys(subjects).map((subjectId) => {
            const subject = subjects[subjectId];
            const units = subject.units ? Object.values(subject.units) : [];

            return (
                <div key={subjectId} className="subject-block">
                    {/* Subject name */}
                    <div className="subject-name">{subject.name}</div>

                    {/* Units */}
                    {units.length > 0 && (
                        <div className="units-block">
                            {units.map((u, index) => (
                                <div key={index} className="unit-item">• {u.name}</div>
                            ))}
                        </div>
                    )}
                </div>
            );
        });
    };

    // funcion que reciba el plan y devuelva si toca hoy

    const isPlanToday = (plan: StudyPlan) => {
        const today = new Date();
        const dayOfWeek = today.getDay(); // Domingo = 0, Lunes = 1, ..., Sábado = 6
        const dayIds = ["SU", "M", "TU", "W", "TH", "F", "SA"];

        switch (plan.frequency?.type) {
            case 'none':
                // ocurrirá solo si fue creado hoy
                if (!plan.createdAt?.toDate) return false;
                const created = plan.createdAt.toDate();
                return created.toDateString() === today.toDateString();

            case 'everyday':
                return true;

            case 'weekly':
                // repetir cada semana en el mismo día de la semana que fue creado
                if (!plan.createdAt?.toDate) return false;
                const createdDay = plan.createdAt.toDate().getDay();
                return createdDay === dayOfWeek;

            case 'monthly':
                // repetir cada mes en el mismo día del mes que fue creado
                if (!plan.createdAt?.toDate) return false;
                const createdDate = plan.createdAt.toDate().getDate();
                return createdDate === today.getDate();

            case 'custom':
                // si custom usa días de la semana
                if (plan.frequency.weekdays?.length) {
                    return plan.frequency.weekdays.includes(dayIds[dayOfWeek]);
                }
                // si usa intervalo con customNumber y customPeriod
                if (plan.frequency.customNumber && plan.frequency.customPeriod) {
                    if (!plan.createdAt?.toDate) return false;
                    const created = plan.createdAt.toDate();
                    const diffDays = Math.floor(
                        (today.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)
                    );

                    switch (plan.frequency.customPeriod) {
                        case "day":
                            return diffDays % plan.frequency.customNumber === 0;

                        case "week":
                            return Math.floor(diffDays / 7) % plan.frequency.customNumber === 0;

                        case "month":
                            const months =
                                today.getFullYear() * 12 + today.getMonth() -
                                (created.getFullYear() * 12 + created.getMonth());
                            return months % plan.frequency.customNumber === 0;
                    }
                }

                return false;

            default:
                return false;
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

            <IonContent fullscreen>
                <Breadcrumbs />
                <h1>STUDY</h1>
                <div className="study-layout">

                    {/* LEFT column */}
                    <div className="study-left">


                        {/* TODAY plan */}
                        <div className="today-card">
                            <h3>TODAY</h3>

                            {todayPlans.length > 0 ? (
                                todayPlans.map(plan => (
                                    <IonCard key={plan.id} className="today-plan-card">
                                        <IonCardHeader>
                                            <IonCardTitle>{plan.title}</IonCardTitle>
                                        </IonCardHeader>
                                        <IonCardContent>
                                            {renderSubjects(plan.subjects)}

                                            {plan.chronometer?.enabled && (
                                                <p>{plan.chronometer.minutes} min</p>
                                            )}

                                            {/* Cronómetro */}
                                            <TodayCountdownTimer onFinishSound='/sounds/finish-alarm.mp3' />
                                        </IonCardContent>
                                    </IonCard>
                                ))
                            ) : (
                                <IonCard><IonCardContent>No plans today</IonCardContent></IonCard>
                            )}

                        </div>

                        <h3>STUDY PLANS</h3>

                        <div className="study-plans-box">
                            {plans.length === 0 && <div className="no-plans">No study plans yet</div>}

                            {plans.map((p) => (
                                <IonCard key={p.id} className="study-plan-card">
                                    <IonCardHeader>
                                        <IonCardTitle>{p.title}</IonCardTitle>
                                    </IonCardHeader>

                                    <IonCardContent>
                                        <div className="plan-subjects">{renderSubjects(p.subjects)}</div>
                                        <p className="plan-frequency">Frequency: {p.frequency?.type || 'No repeat'}</p>

                                        <div className="plan-actions">
                                            <IonButton size="small" color="primary" onClick={() => {
                                                playClick();
                                                goEdit(p.id)}}>
                                                Edit
                                                </IonButton>
                                            <IonButton size="small" color="danger" onClick={() => {
                                                playDelete();
                                                removePlan(p.id)}}>
                                                Delete

                                            </IonButton>
                                        </div>
                                    </IonCardContent>
                                </IonCard>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT column */}
                    <div className="study-right">
                        <h3>TODAY</h3>
                        <div className="calendar-wrapper">
                            <IonDatetime
                                value={calendarValue}
                                onIonChange={(e: any) => setCalendarValue(e.detail.value)}
                                presentation="date"
                            />
                        </div>

                        <div className='createPlan-container'>
                            <IonButton
                                onClick={() => {
                                    playClick();
                                    goCreate()}}
                                color='dark'
                                fill="clear"
                                className="add-btn-studyplan"
                            >
                                Create new list
                            </IonButton>
                        </div>
                    </div>

                </div>
            </IonContent>
        </IonPage>
    );
};

export default Study;
