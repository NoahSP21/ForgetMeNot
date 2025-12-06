import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonDatetime, IonHeader, IonIcon, IonInput, IonMenuButton, IonModal, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { add, close, pencil, save } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import './HomeReminders.css';
import Reminder from './Reminder';
import { db, uid, auth } from '../../firebase/firebaseConfig';
import { addReminder, deleteReminder, getUserReminders, updateReminder } from './HomeApi';
import { toast } from 'react-toastify';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';

const HomeReminders: React.FC = () => {

    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);

    const uid = auth.currentUser?.uid;

    if (!uid) {
        toast.error("Problem with user log in");
    }

    // Load reminders on page load
    useEffect(() => {
        if (!uid) return;

        getUserReminders(uid).then(setReminders);
    }, [uid]);

    // Add or Edit
    const saveReminder = async () => {
        if (!uid || !editingReminder) return;

        if (editingReminder.id) {
            // UPDATE
            await updateReminder(uid, editingReminder);
        } else {
            // ADD NEW
            await addReminder(uid, editingReminder);
        }

        // Refresh list
        const updated = await getUserReminders(uid);
        setReminders(updated);

        setShowModal(false);
        setEditingReminder(null);
    };

    const startAdd = () => {
        setEditingReminder({ title: "", description: "" });
        setShowModal(true);
    };

    const startEdit = (rem: Reminder) => {
        setEditingReminder(rem);
        setShowModal(true);
    };

    const removeReminder = async (id?: string) => {
        if (!id || !uid) return;
        await deleteReminder(uid, id);

        // Refresh list
        const updated = await getUserReminders(uid);
        setReminders(updated);
    };


    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>Forget Me Not</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen>

                <Breadcrumbs />
                <h1>REMINDERS</h1>
                <div className='main-container'>
                    <div className='left-panel'>
                        {reminders.map((rem) => (
                            <IonCard key={rem.id} className="reminder-card">

                                <div className="card-actions">
                                    <IonButton
                                        color='dark' fill="clear" size='default'
                                        onClick={() => startEdit(rem)}
                                    >
                                        <IonIcon icon={pencil} />
                                    </IonButton>

                                    <IonButton
                                        color='dark' fill="clear" size='default'
                                        onClick={() => removeReminder(rem.id)}
                                    >
                                        <IonIcon icon={close} />
                                    </IonButton>
                                </div>

                                <IonCardHeader>
                                    <IonCardTitle>{rem.title}</IonCardTitle>
                                    <IonCardSubtitle>{rem.description}</IonCardSubtitle>
                                </IonCardHeader>


                            </IonCard>
                        ))}

                        <IonButton
                            onClick={startAdd}
                            color='dark'
                            fill="clear"
                            className="add-btn"
                        >
                            <IonIcon icon={add} />
                        </IonButton>
                    </div>
                    <div className='right-panel'>
                        <div className="calendar-placeholder">
                            <IonDatetime presentation="date" ></IonDatetime>
                        </div>
                    </div>
                </div>

                {/* Modal for Add/Edit */}
                <IonModal id="modal" isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
                    <div className="modal-card">
                        <h2>{editingReminder?.id ? "Edit Reminder" : "New Reminder"}</h2>

                        <IonInput
                            className='inputReminder'
                            label="Title"
                            value={editingReminder?.title}
                            onIonChange={(e) =>
                                setEditingReminder({ ...editingReminder!, title: e.detail.value! })
                            }
                        />

                        <IonInput
                            className='inputReminder'
                            label="Description"
                            value={editingReminder?.description}
                            onIonChange={(e) =>
                                setEditingReminder({ ...editingReminder!, description: e.detail.value! })
                            }
                        />

                        <IonButton color="secondary" shape="round" onClick={saveReminder}>
                            Save
                        </IonButton>
                        <IonButton color="danger" fill="clear" onClick={() => setShowModal(false)}>
                            Cancel
                        </IonButton>

                    </div>
                </IonModal>
            </IonContent>
        </IonPage>
    );
};

export default HomeReminders;
