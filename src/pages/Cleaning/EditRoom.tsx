import {
    IonButton, IonContent, IonHeader, IonInput, IonItem, IonLabel,
    IonPage, IonTitle, IonToolbar, IonIcon, IonButtons, IonMenuButton
} from "@ionic/react";

import { add, close } from "ionicons/icons";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";

import { getRoom, updateRoom } from "./CleaningApi";
import { Room } from "./Room";

import useSound from 'use-sound';
import click from "/sounds/click.mp3";
import success from "/sounds/success2.mp3";

import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import "./CreateRoom.css";
import { toast } from "react-toastify";

const EditRoom: React.FC = () => {
    const [playClick] = useSound(click);
    const [playSuccess] = useSound(success);

    const { id } = useParams<{ id: string }>();
    const history = useHistory();

    const [room, setRoom] = useState<Room | null>(null);
    const [roomName, setRoomName] = useState("");
    const [items, setItems] = useState<{ name: string }[]>([]);

    // Load room
    useEffect(() => {
        const load = async () => {
            const data = await getRoom(id);

            if (!data) return;

            setRoom(data);
            setRoomName(data.name);
            setItems(data.items.map(i => ({ name: i.name })));
        };

        load();
    }, [id]);

    const updateItem = (index: number, value: string) => {
        const newItems = [...items];
        newItems[index].name = value;
        setItems(newItems);
    };

    const addItem = () => {
        setItems([...items, { name: "" }]);
    };

    const removeItem = (index: number) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    const saveChanges = async () => {

        //  No permitir nombre vacío
        if (!roomName.trim()) {
            toast.error("Room name cannot be empty");
            return;
        }

        //  No permitir que no haya items
        if (items.length === 0) {
            toast.error("Add at least one item");
            return;
        }

        //  No permitir items vacíos
        const emptyItem = items.find(i => !i.name.trim());
        if (emptyItem) {
            toast.error("Items cannot be empty");
            return;
        }


        try {
            await updateRoom(id, {
                name: roomName,
                items: items.map(i => ({ name: i.name, checked: false }))
            });

            toast.success("Room updated!");
            playSuccess();
            
            history.push(`/folder/Cleaning/Room/${id}`);
        } catch (err) {
            console.error("Error updating list:", err);
            toast.error("Error updating list");
          }
    };

    if (!room) return null;

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>Edit room</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent>
            {room && <Breadcrumbs hideSegments={["Room"]} dynamicNames={{ [room.id!]: room.name }} />}

                <h1>Edit room</h1>

                <div className="createRoom-container">

                    {/* LEFT: Items */}
                    <div className="left-side-create-room">
                        <IonButton className="ToDo-title" color={"dark"}>
                            TO DO
                        </IonButton>

                        {items.map((item, index) => (
                            <div key={index} className="item-row">

                                <IonItem className="chores-row">
                                    <IonInput
                                        placeholder="Chore"
                                        value={item.name}
                                        onIonInput={(e) =>
                                            updateItem(index, e.detail.value!)
                                        }
                                    />
                                </IonItem>

                                {index === items.length - 1 ? (
                                    <IonIcon icon={add} className="add-chore" onClick={addItem} />
                                ) : (
                                    <IonIcon icon={close} className="delete-chore" onClick={() => removeItem(index)} />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* RIGHT: Room Name */}
                    <div className="right-side-create-room">

                        <IonItem>
                            <IonLabel position="stacked" className="roomName">
                                Room Name
                            </IonLabel>

                            <IonInput
                                className="roomNameInput"
                                value={roomName}
                                placeholder="Enter room name"
                                onIonInput={(e) => setRoomName(e.detail.value!)}
                            />
                        </IonItem>

                        <div className="action-createRoom-buttons">
                            <IonButton color="danger" onClick={() => {
                                playClick();
                                history.goBack()}}>
                                Discard
                            </IonButton>

                            <IonButton color="primary" onClick={saveChanges}>
                                Save
                            </IonButton>
                        </div>

                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default EditRoom;
