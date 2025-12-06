import {
    IonButton,
    IonCheckbox,
    IonContent,
    IonHeader,
    IonItem,
    IonLabel,
    IonList,
    IonPage,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonIcon
} from "@ionic/react";

import { useEffect, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";

import useSound from 'use-sound';
import click from "/sounds/click.mp3";
import deleteSound from "/sounds/delete.mp3";

import { Room } from "./Room";
import { getRoom, updateRoom, deleteRoom } from "./CleaningApi";
import "./RoomPage.css";
import { refreshOutline } from "ionicons/icons";

const RoomPage: React.FC = () => {

    const [playClick] = useSound(click);
    const [playDelete] = useSound(deleteSound);

    const history = useHistory();

    const { id } = useParams<{ id: string }>();

    const [room, setRoom] = useState<Room | null>(null);

    // Cargar la sala desde Firebase
    const loadRoom = async () => {
        const data = await getRoom(id);
        setRoom(data);
    };

    const location = useLocation();


    useEffect(() => {
        loadRoom(); // cada vez que la ubicación cambia, recarga la lista
    }, [location.key]);

    if (!room) return null;

    // ITEMS
    const uncheckedItems = room.items.filter(i => !i.checked);
    const checkedItems = room.items.filter(i => i.checked);

    // Toggle item (mover izquierda <-> derecha)
    const toggleItem = async (index: number) => {
        const updatedItems = [...room.items];
        updatedItems[index].checked = !updatedItems[index].checked;

        setRoom({ ...room, items: updatedItems });

        await updateRoom(id, { items: updatedItems });
    };

    // Revert changes
    const revertChanges = async () => {
        const resetItems = room.items.map(i => ({ ...i, checked: false }));

        setRoom({ ...room, items: resetItems });

        await updateRoom(id, { items: resetItems });
    };

    const goToEditRoom = async () => {
        history.push(`/folder/Cleaning/EditRoom/${id}`);
    };

    const goToCleaning = async () => {
        history.push("/folder/Cleaning");
    };

    const handleDeleteRoom = async () => {
        await deleteRoom(id);
        history.push("/folder/Cleaning");
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

                {room && <Breadcrumbs hideSegments={["Room"]} dynamicNames={{ [room.id!]: room.name }} />}

                <div className="roomPage-container">

                    {/* TITLE */}
                    <div className="roomPage-header">
                        <h1>{room.name}</h1>
                    </div>

                    <div className="room-container">

                        {/* LEFT column: unchecked items */}
                        <div className="left-side-room">
                            <div className="todo-revert-container">
                                <IonButton className="ToDo-title" color={"dark"}>
                                    TO DO
                                </IonButton>
                                <IonIcon className="revert-btn" icon={refreshOutline} onClick={revertChanges} />

                            </div>

                            {uncheckedItems.length > 0 && (
                            <IonList className="chores-list">
                                {uncheckedItems.map((item, i) => {
                                    const realIndex = room.items.findIndex(
                                        x => x === item
                                    );

                                    return (
                                        <IonItem className="chores-row" key={i}>
                                            <IonCheckbox
                                                slot="start"
                                                checked={false}
                                                onIonChange={() => toggleItem(realIndex)}
                                            />
                                            <IonLabel>{item.name}</IonLabel>
                                        </IonItem>
                                    );
                                })}
                            </IonList>
                            )}
                            <IonButton className="backRoom-btn" color="medium" onClick={() => {
                                playClick();
                                goToCleaning()}}>
                                Back
                            </IonButton>
                        </div>

                        {/* RIGHT column: checked items */}
                        <div className="right-side-room">
                            <IonButton className="ToDo-title" color={"dark"}>
                                DONE
                            </IonButton>

                            {checkedItems.length > 0 && (
                                <IonList className="chores-list">
                                    {checkedItems.map((item, i) => {
                                        const realIndex = room.items.findIndex(x => x === item);

                                        return (
                                            <IonItem className="chores-row-checked" key={i}>
                                                <IonCheckbox
                                                    slot="start"
                                                    checked={true}
                                                    onIonChange={() => toggleItem(realIndex)}
                                                />
                                                <IonLabel className="checked-label">
                                                    {item.name}
                                                </IonLabel>
                                            </IonItem>
                                        );
                                    })}
                                </IonList>
                            )}

                            {/* Buttons */}
                            <div className="action-createRoom-buttons">
                                <IonButton color="danger" onClick={() => {
                                    playDelete();
                                    handleDeleteRoom()}}>
                                        
                                    Delete
                                </IonButton>

                                <IonButton color="primary" onClick={goToEditRoom}>
                                    Edit
                                </IonButton>
                            </div>
                        </div>

                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default RoomPage;
