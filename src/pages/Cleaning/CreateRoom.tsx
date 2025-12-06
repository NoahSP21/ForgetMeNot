import {
    IonButton, IonContent, IonHeader, IonInput, IonItem, IonLabel,
    IonPage, IonTitle, IonToolbar, IonIcon,
    IonButtons,
    IonMenuButton
} from "@ionic/react";

import useSound from 'use-sound';
import click from "/sounds/click.mp3";
import success from "/sounds/success2.mp3";

import { add, close } from "ionicons/icons";
import { useState } from "react";
import { useHistory } from "react-router";
import { addRoom } from "./CleaningApi";
import "./CreateRoom.css";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import { toast } from "react-toastify";

const CreateRoom: React.FC = () => {
    const [playClick] = useSound(click);
    const [playSuccess] = useSound(success);

    const history = useHistory();

    const [roomName, setRoomName] = useState("");
    const [items, setItems] = useState([{ name: "" }]);

    const resetForm = () => {
        setRoomName("");
        setItems([]);
    };

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

    const saveRoom = async () => {

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

        try {
            await addRoom({
                name: roomName,
                items: items.map(i => ({ name: i.name, checked: false }))
            });

            toast.success("Room created!");
            playSuccess();
            
            resetForm();
            history.push("/folder/Cleaning");
        } catch (err) {
            console.error("Error creating list:", err);
            toast.error("Error creating list");
        }
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

            <IonContent>
                <Breadcrumbs />
                <h1>Create new room</h1>
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
                                    <IonIcon
                                        icon={add}
                                        className="add-chore"
                                        onClick={addItem} />

                                ) : (
                                    <IonIcon
                                        icon={close}
                                        className="delete-chore"
                                        onClick={() => removeItem(index)} />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* RIGHT: Room Name */}
                    <div className="right-side-create-room">
                        <IonItem>
                            <IonLabel position="stacked" className="roomName">Room Name</IonLabel>
                            <IonInput
                                className="roomNameInput"
                                placeholder="Enter room name"
                                value={roomName}
                                onIonInput={(e) => setRoomName(e.detail.value!)}
                            />
                        </IonItem>

                        {/* Buttons */}
                        <div className="action-createRoom-buttons">
                            <IonButton color="danger" onClick={() => {
                                playClick();
                                history.goBack()
                            }}>

                                Discard
                            </IonButton>

                            <IonButton color="primary" onClick={saveRoom}>
                                Save
                            </IonButton>
                        </div>
                    </div>

                </div>
            </IonContent>
        </IonPage>
    );
};

export default CreateRoom;
