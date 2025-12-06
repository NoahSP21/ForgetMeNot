import {
    IonButton,
    IonContent,
    IonHeader,
    IonInput,
    IonItem,
    IonLabel,
    IonPage,
    IonTitle,
    IonToolbar,
    IonRadioGroup,
    IonRadio,
    IonList,
    IonCheckbox,
    IonIcon
} from '@ionic/react';
import { useState } from 'react';

import useSound from 'use-sound';
import click from "/sounds/click.mp3";
import success from "/sounds/success2.mp3";

import { useHistory } from 'react-router';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import { db, uid } from '../../firebase/firebaseConfig';
import { addStudyPlan } from './StudyApi';
import './CreateStudyPlan.css';
import { add, close } from 'ionicons/icons';
import { toast } from 'react-toastify';

interface Unit {
    name: string;
}

interface Subject {
    name: string;
    units: Unit[];
}

type FrequencyType = 'none' | 'everyday' | 'weekly' | 'monthly' | 'custom';

const weekDays = [
    { id: "M", label: "M" },  // Monday
    { id: "TU", label: "T" }, // Tuesday
    { id: "W", label: "W" },  // Wednesday
    { id: "TH", label: "T" }, // Thursday
    { id: "F", label: "F" },  // Friday
    { id: "SA", label: "S" }, // Saturday
    { id: "SU", label: "S" }  // Sunday
];


const CreateStudyPlan: React.FC = () => {
    const [playClick] = useSound(click);
    const [playSuccess] = useSound(success);

    const history = useHistory();



    // LEFT SIDE STATES
    const [title, setTitle] = useState<string>('');
    const [subjects, setSubjects] = useState<Subject[]>([
        { name: '', units: [{ name: '' }] }
    ]);

    // RIGHT SIDE STATES
    const [frequency, setFrequency] = useState<FrequencyType>('none');
    const [customNumber, setCustomNumber] = useState<number>(1);
    const [customPeriod, setCustomPeriod] = useState<'day' | 'week' | 'month'>('day');
    const [selectedWeekdays, setSelectedWeekdays] = useState<string[]>([]);

    // FUNCTIONS LEFT SIDE
    const updateSubjectName = (index: number, value: string) => {
        const newSubjects = [...subjects];
        newSubjects[index].name = value;
        setSubjects(newSubjects);
    };

    // Reset values
    const resetForm = () => {
        setTitle("");
        setSubjects([]);
        setFrequency('none');
    };

    const addSubject = () => {
        setSubjects([...subjects, { name: '', units: [{ name: '' }] }]);
    };

    const removeSubject = (index: number) => {
        if (subjects.length === 1) return; // prevent deleting the only one

        setSubjects(subjects.filter((_, i) => i !== index));
    };

    const updateUnitName = (subjectIndex: number, unitIndex: number, value: string) => {
        const newSubjects = [...subjects];
        newSubjects[subjectIndex].units[unitIndex].name = value;
        setSubjects(newSubjects);
    };

    const addUnit = (subjectIndex: number) => {
        const newSubjects = [...subjects];
        newSubjects[subjectIndex].units.push({ name: '' });
        setSubjects(newSubjects);
    };



    const removeUnit = (subjectIndex: number, unitIndex: number) => {
        const newSubjects = [...subjects];
        newSubjects[subjectIndex].units = newSubjects[subjectIndex].units.filter(
            (_, i) => i !== unitIndex
        );
        setSubjects(newSubjects);
    };


    // FUNCTIONS RIGHT SIDE
    const toggleWeekday = (d: string) => {
        setSelectedWeekdays((prev) =>
            prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
        );
    };

    // SAVE PLAN
    const savePlan = async () => {
        try {

            const planData = {
                title,
                subjects: subjects.reduce((acc: Record<string, any>, sub, idx) => {
                    acc[`subject_${idx}`] = {
                        name: sub.name,
                        units: sub.units.reduce((uAcc: Record<string, any>, unit, uIdx) => {
                            uAcc[`unit_${uIdx}`] = { name: unit.name };
                            return uAcc;
                        }, {})
                    };
                    return acc;
                }, {}),
                frequency: {
                    type: frequency,
                    customNumber: frequency === 'custom' ? customNumber : null,
                    customPeriod: frequency === 'custom' ? customPeriod : null,
                    weekdays: frequency === 'custom' ? selectedWeekdays : null
                }
            };

            //  No empty title
            if (!title.trim()) {
                toast.error("Plan title cannot be empty");
                return;
            }

            //  No empty subject
            for (let subj of subjects) {
                if (!subj.name.trim()) {
                    toast.error("Subject name cannot be empty.");
                    return;
                }}

                await addStudyPlan(planData);
                toast.success("Plan created!");
                playSuccess();

                resetForm();
                history.push('/folder/Study');

            } catch (err) {
                console.error("Error creating list:", err);
                toast.error("Error creating list");
            }
        };



        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Forget Me Not</IonTitle>
                    </IonToolbar>
                </IonHeader>

                <IonContent>
                    <Breadcrumbs />
                    <h1>CREATE STUDY PLAN</h1>
                    <div className="create-study-container">

                        {/* LEFT SIDE */}
                        <div className="left-side-create-study">
                            <IonItem className='plan-item'>
                                <IonLabel position="stacked">Plan Title</IonLabel>
                                <IonInput
                                    placeholder="Enter plan title"
                                    value={title}
                                    onIonInput={(e) => setTitle(e.detail.value!)}
                                />
                            </IonItem>

                            <IonList className="create-subject-block">
                                {subjects.map((subj, sIdx) => (
                                    <div key={sIdx} >
                                        {/* ADD / REMOVE BUTTONS */}

                                        <IonItem className='plan-item'>
                                            <IonLabel position="stacked">Subject</IonLabel>
                                            <IonInput
                                                placeholder="Subject name"
                                                value={subj.name}
                                                onIonInput={(e) => updateSubjectName(sIdx, e.detail.value!)}
                                            />
                                        </IonItem>
                                        {sIdx === subjects.length - 1 ? (
                                            <IonButton expand='block' className='add-subject-btn' onClick={addSubject}>Add Subject</IonButton>

                                        ) : (
                                            <IonButton color='danger' expand='block' className='delete-subject-btn' onClick={() => removeSubject(sIdx)}>Delete Subject</IonButton>
                                        )}

                                        {subj.units.map((unit, uIdx) => (
                                            <div key={uIdx} className="unit-row">
                                                <IonItem className="plan-item-unit" key={uIdx}>
                                                    <IonLabel>Unit: </IonLabel>
                                                    <IonInput
                                                        placeholder="Unit name (optional)"
                                                        value={unit.name}
                                                        onIonInput={(e) => updateUnitName(sIdx, uIdx, e.detail.value!)}
                                                    />

                                                    {uIdx === subj.units.length - 1 ? (
                                                        <IonIcon
                                                            icon={add}
                                                            className="icon-add-unit"
                                                            onClick={() => addUnit(sIdx)}
                                                        />
                                                    ) : (
                                                        <IonIcon
                                                            icon={close}
                                                            className="icon-remove-unit"
                                                            onClick={() => removeUnit(sIdx, uIdx)}
                                                        />
                                                    )}
                                                </IonItem>
                                            </div>
                                        ))}

                                        <IonButton className='add-unit-btn' onClick={() => addUnit(sIdx)}>Add Unit</IonButton>
                                    </div>
                                ))}

                            </IonList>




                        </div>

                        {/* RIGHT SIDE */}
                        <div className="right-side-create-study">
                            <p className='plan-question'>With which frequency will this plan repeat?</p>
                            <IonRadioGroup value={frequency} onIonChange={(e) => setFrequency(e.detail.value)}>
                                <IonItem className='plan-item-right'>
                                    <IonRadio slot="start" value="none" />
                                    <IonLabel>It will not repeat</IonLabel>
                                </IonItem>
                                <IonItem className='plan-item-right'>
                                    <IonRadio slot="start" value="everyday" />
                                    <IonLabel>Everyday</IonLabel>
                                </IonItem>
                                <IonItem className='plan-item-right'>
                                    <IonRadio slot="start" value="weekly" />
                                    <IonLabel>Every week</IonLabel>
                                </IonItem>
                                <IonItem className='plan-item-right'>
                                    <IonRadio slot="start" value="monthly" />
                                    <IonLabel>Every month</IonLabel>
                                </IonItem>
                                <IonItem className='plan-item-right'>
                                    <IonRadio slot="start" value="custom" />
                                    <IonLabel>Custom</IonLabel>
                                </IonItem>
                            </IonRadioGroup>

                            {frequency === 'custom' && (
                                <div className="custom-frequency">
                                    <p>Repeats every:</p>
                                    <div className="frequency-row">
                                        <IonInput
                                            className='frequency-number'
                                            type="number"
                                            value={customNumber}
                                            onIonInput={(e) => setCustomNumber(Number(e.detail.value!))}
                                        />
                                        <IonItem className='repeat-plan-item-right'>
                                            <IonRadioGroup value={customPeriod} onIonChange={(e) => setCustomPeriod(e.detail.value)}>
                                                <IonItem className='plan-item-right'>
                                                    <IonRadio slot="start" value="day" />
                                                    <IonLabel>Day</IonLabel>
                                                </IonItem>
                                                <IonItem className='plan-item-right'>
                                                    <IonRadio slot="start" value="week" />
                                                    <IonLabel>Week</IonLabel>
                                                </IonItem>
                                                <IonItem className='plan-item-right'>
                                                    <IonRadio slot="start" value="month" />
                                                    <IonLabel>Month</IonLabel>
                                                </IonItem>
                                            </IonRadioGroup>
                                        </IonItem>
                                    </div>
                                    <p>OR</p>
                                    <p> Repeats on:</p>
                                    <div className="weekdays-buttons">
                                        {weekDays.map((day) => (
                                            <IonButton
                                                key={day.id}
                                                color={selectedWeekdays.includes(day.id) ? 'primary' : 'medium'}
                                                onClick={() => toggleWeekday(day.id)}
                                            >
                                                {day.label}
                                            </IonButton>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="action-buttons">
                                <IonButton color="danger" onClick={() => {
                                    playClick();
                                    history.goBack()
                                }}>
                                    Discard
                                </IonButton>
                                <IonButton color="primary" onClick={savePlan}>Save</IonButton>
                            </div>
                        </div>

                    </div>
                </IonContent>
            </IonPage >
        );
    };

    export default CreateStudyPlan;
