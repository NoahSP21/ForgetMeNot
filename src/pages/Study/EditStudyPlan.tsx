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
    IonIcon
} from "@ionic/react";

import useSound from 'use-sound';
import click from "/sounds/click.mp3";
import success from "/sounds/success2.mp3";

import { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import { getStudyPlan, updateStudyPlan } from "./StudyApi";
import { StudyPlan, Subject, Unit } from "./StudyTypes";
import "./CreateStudyPlan.css";
import { add, close } from "ionicons/icons";
import { toast } from "react-toastify";



type FrequencyType = "none" | "everyday" | "weekly" | "monthly" | "custom";

const weekDays = [
    { id: "M", label: "M" },
    { id: "TU", label: "T" },
    { id: "W", label: "W" },
    { id: "TH", label: "T" },
    { id: "F", label: "F" },
    { id: "SA", label: "S" },
    { id: "SU", label: "S" }
];

const EditStudyPlan: React.FC = () => {
    const [playClick] = useSound(click);
    const [playSuccess] = useSound(success);

    const history = useHistory();
    const { id } = useParams<{ id: string }>();

    // FORM STATES
    const [title, setTitle] = useState("");
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [frequency, setFrequency] = useState<FrequencyType>("none");
    const [customNumber, setCustomNumber] = useState(1);
    const [customPeriod, setCustomPeriod] = useState<"day" | "week" | "month">("day");
    const [selectedWeekdays, setSelectedWeekdays] = useState<string[]>([]);

    const [loading, setLoading] = useState(true);

    // ---------------------------------------------------------
    // LOAD DATA WHEN PAGE OPENS
    // ---------------------------------------------------------
    useEffect(() => {
        const load = async () => {
            const plan = await getStudyPlan(id);
            if (!plan) {
                alert("Plan not found");
                return history.push("/folder/Study");
            }

            setTitle(plan.title || "");

            // Convert backend structure -> form-friendly structure
            const subjArray = Object.values(plan.subjects || {}).map((sub: any) => ({
                name: sub.name,
                units: Object.values(sub.units || {}).map((u: any) => ({
                    name: u.name || ""
                }))
            })) as Subject[];


            setSubjects(subjArray);


            setFrequency(plan.frequency?.type || "none");
            setCustomNumber(plan.frequency?.customNumber || 1);
            setCustomPeriod(plan.frequency?.customPeriod || "day");
            setSelectedWeekdays(plan.frequency?.weekdays || []);

            setLoading(false);
        };

        load();
    }, [id, history]);

    // ---------------------------------------------------------
    // SUBJECT / UNIT HANDLERS
    // ---------------------------------------------------------

    const updateSubjectName = (index: number, value: string) => {
        const copy = [...subjects];
        copy[index].name = value;
        setSubjects(copy);
    };

    const addSubject = () => {
        setSubjects([...subjects, { name: "", units: [{ name: "" }] }]);
    };

    const removeSubject = (i: number) => {
        if (subjects.length === 1) return;
        setSubjects(subjects.filter((_, idx) => idx !== i));
    };

    const updateUnitName = (si: number, ui: number, value: string) => {
        const copy = [...subjects];
        copy[si].units[ui].name = value;
        setSubjects(copy);
    };

    const addUnit = (i: number) => {
        const copy = [...subjects];
        copy[i].units.push({ name: "" });
        setSubjects(copy);
    };

    const removeUnit = (si: number, ui: number) => {
        const copy = [...subjects];
        copy[si].units = copy[si].units.filter((_, i) => i !== ui);
        setSubjects(copy);
    };

    // ---------------------------------------------------------
    // WEEKDAY TOGGLE
    // ---------------------------------------------------------
    const toggleWeekday = (d: string) => {
        setSelectedWeekdays((prev) =>
            prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
        );
    };

    // ---------------------------------------------------------
    // SAVE CHANGES
    // ---------------------------------------------------------
    const saveChanges = async () => {

        const planData = {
            title,
            subjects: subjects.reduce((acc: any, sub, sIdx) => {
                acc[`subject_${sIdx}`] = {
                    name: sub.name,
                    units: sub.units.reduce((uAcc: any, unit, uIdx) => {
                        uAcc[`unit_${uIdx}`] = { name: unit.name };
                        return uAcc;
                    }, {})
                };
                return acc;
            }, {}),
            frequency: {
                type: frequency,
                customNumber: frequency === "custom" ? customNumber : null,
                customPeriod: frequency === "custom" ? customPeriod : null,
                weekdays: frequency === "custom" ? selectedWeekdays : null
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
            }
        }

        try {
            await updateStudyPlan(id, planData); // espera a que se guarde en Firestore
            toast.success("List updated!");
            playSuccess();

            history.push("/folder/Study"); // vuelve a ToBuy y carga los datos
        } catch (err) {
            console.error("Error updating list:", err);
            toast.error("Error updating list");
        }

    };

    if (loading) return <IonPage><IonContent>Loading...</IonContent></IonPage>;

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Edit Plan</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <Breadcrumbs dynamicNames={{ [id]: title }} />

                <h1>EDIT STUDY PLAN</h1>

                <div className="create-study-container">
                    {/* LEFT SIDE */}
                    <div className="left-side-create-study">
                        <IonItem className="plan-item">
                            <IonLabel position="stacked">Plan Title</IonLabel>
                            <IonInput
                                value={title}
                                onIonInput={(e) => setTitle(e.detail.value!)}
                            />
                        </IonItem>

                        <IonList className="create-subject-block">
                            {subjects.map((subj, sIdx) => (
                                <div key={sIdx}>
                                    <IonItem className="plan-item">
                                        <IonLabel position="stacked">Subject</IonLabel>
                                        <IonInput
                                            value={subj.name}
                                            onIonInput={(e) =>
                                                updateSubjectName(sIdx, e.detail.value!)
                                            }
                                        />
                                    </IonItem>

                                    {sIdx === subjects.length - 1 ? (
                                        <IonButton expand="block" onClick={addSubject}>
                                            Add Subject
                                        </IonButton>
                                    ) : (
                                        <IonButton
                                            expand="block"
                                            color="danger"
                                            onClick={() => removeSubject(sIdx)}
                                        >
                                            Delete Subject
                                        </IonButton>
                                    )}

                                    {subj.units.map((unit, uIdx) => (
                                        <div key={uIdx} className="unit-row">
                                            <IonItem className="plan-item-unit">
                                                <IonLabel>Unit: </IonLabel>
                                                <IonInput
                                                    value={unit.name}
                                                    onIonInput={(e) =>
                                                        updateUnitName(
                                                            sIdx,
                                                            uIdx,
                                                            e.detail.value!
                                                        )
                                                    }
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
                                                        onClick={() =>
                                                            removeUnit(sIdx, uIdx)
                                                        }
                                                    />
                                                )}
                                            </IonItem>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </IonList>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="right-side-create-study">
                        <p className="plan-question">
                            With which frequency will this plan repeat?
                        </p>

                        <IonRadioGroup
                            value={frequency}
                            onIonChange={(e) => setFrequency(e.detail.value)}
                        >
                            <IonItem className="plan-item-right">
                                <IonRadio slot="start" value="none" />
                                <IonLabel>It will not repeat</IonLabel>
                            </IonItem>

                            <IonItem className="plan-item-right">
                                <IonRadio slot="start" value="everyday" />
                                <IonLabel>Everyday</IonLabel>
                            </IonItem>

                            <IonItem className="plan-item-right">
                                <IonRadio slot="start" value="weekly" />
                                <IonLabel>Every week</IonLabel>
                            </IonItem>

                            <IonItem className="plan-item-right">
                                <IonRadio slot="start" value="monthly" />
                                <IonLabel>Every month</IonLabel>
                            </IonItem>

                            <IonItem className="plan-item-right">
                                <IonRadio slot="start" value="custom" />
                                <IonLabel>Custom</IonLabel>
                            </IonItem>
                        </IonRadioGroup>

                        {frequency === "custom" && (
                            <div className="custom-frequency">
                                <p>Repeats every:</p>

                                <IonInput
                                    type="number"
                                    value={customNumber}
                                    onIonInput={(e) =>
                                        setCustomNumber(Number(e.detail.value!))
                                    }
                                />
                                <IonItem className='repeat-plan-item-right'>
                                    <IonRadioGroup
                                        value={customPeriod}
                                        onIonChange={(e) => setCustomPeriod(e.detail.value)}
                                    >
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
                                <p>OR</p>

                                <p>Repeats on:</p>

                                <div className="weekdays-buttons">
                                    {weekDays.map((day) => (
                                        <IonButton
                                            key={day.id}
                                            color={
                                                selectedWeekdays.includes(day.id)
                                                    ? "primary"
                                                    : "medium"
                                            }
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
                                history.goBack()}}>
                                Cancel
                            </IonButton>
                            <IonButton color="primary" onClick={saveChanges}>
                                Save Changes
                            </IonButton>
                        </div>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default EditStudyPlan;