import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonInput,
    IonItem,
    IonLabel,
    IonButton,
    IonCard,
    IonCardContent,
    IonIcon,
    IonButtons,
    IonMenuButton
} from "@ionic/react";

import { trashOutline, add, close } from "ionicons/icons";

import useSound from 'use-sound';
import click from "/sounds/click.mp3";
import success from "/sounds/success2.mp3";
import { useState } from "react";
import { addGroceryList } from "./ToBuyApi";
import { GrocerySection, GroceryList } from "./ToBuyList";
import "./CreateToBuy.css";
import { useHistory } from "react-router";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import { toast } from "react-toastify";

const PREDEFINED_SECTIONS = ["Food", "Hygiene", "Cleaning", "Gardening", "Pet"];

const CreateToBuy: React.FC = () => {
    const [playClick] = useSound(click);
    const [playSuccess] = useSound(success);

    const history = useHistory();

    const [title, setTitle] = useState("");
    const [sections, setSections] = useState<GrocerySection[]>([]);
    const [customName, setCustomName] = useState("");

    // Reset values
    const resetForm = () => {
        setTitle("");
        setSections([]);
        setCustomName("");
    };
    
    const addSection = (name: string) => {
        if (!name.trim()) return;

        setSections([
            ...sections,
            {
                name,
                items: [{ name: "", quantity: 1, checked: false }]
            }
        ]);

        setCustomName("");
    };

    // Remove section
    const removeSection = (index: number) => {
        const arr = [...sections];
        arr.splice(index, 1);
        setSections(arr);
    };

    // Update item inside a section
    const updateItem = (secIndex: number, itemIndex: number, field: string, value: any) => {
        const updated = [...sections];
        (updated[secIndex] as any).items[itemIndex][field] = value;
        setSections(updated);
    };

    // Add new item to section
    const addItem = (secIndex: number) => {
        const updated = [...sections];
        updated[secIndex].items.push({ name: "", quantity: 1, checked: false });
        setSections(updated);
    };

    // Remove item (but keep at least one)
    const removeItem = (secIndex: number, itemIndex: number) => {
        const updated = [...sections];
        if (updated[secIndex].items.length > 1) {
            updated[secIndex].items.splice(itemIndex, 1);
            setSections(updated);
        }
    };

    // Save list to Firestore
    const handleSave = async () => {

        //Title must not be empty
        if (!title.trim()) {
            toast.error("List must have a title.");
            return;
        }

        // At least one section required
        if (sections.length === 0) {
            toast.error("Add at least one section.");
            return;
        }

        // Check each section
        for (let sec of sections) {

            // Section must have at least 1 item
            if (sec.items.length === 0) {
                toast.error(`Section "${sec.name}" must have at least one item.`);
                return;
            }

            // Check every item in the section
            for (let item of sec.items) {

                if (!item.name.trim()) {
                    toast.error(`Some items in section "${sec.name}" are empty.`);
                    return;
                }

                if (!item.quantity || item.quantity < 1) {
                    toast.error(`Invalid quantity in section "${sec.name}".`);
                    return;
                }
            }
        }

        const newList: GroceryList = {
            title,
            sections
        };

        try {
            await addGroceryList(newList); // espera a que se guarde en Firestore
            toast.success("List created!");
            playSuccess();

            resetForm();
            history.push("/folder/ToBuy");  // vuelve a ToBuy, que al montarse recargará las listas
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

            <IonContent >
                <Breadcrumbs />
                <h1>Create list</h1>
                <div className="create-grocery-container">
                    {/* LEFT SIDE*/}
                    <div className="left-grocery-panel">
                        {sections.map((sec, secIndex) => (
                            <IonCard key={secIndex} className="section-card">
                                <div className="section-header">
                                    <h3>{sec.name}</h3>

                                    <IonIcon
                                        icon={trashOutline}
                                        className="delete-section"
                                        onClick={() => removeSection(secIndex)}
                                    />
                                </div>

                                <IonCardContent>
                                    {sec.items.map((item, itemIndex) => (
                                        <div key={itemIndex} className="item-row">
                                            <IonInput
                                                className="itemInput"
                                                placeholder="Item name"
                                                value={item.name}
                                                onIonInput={(e) =>
                                                    updateItem(secIndex, itemIndex, "name", e.detail.value!)
                                                }
                                            />

                                            <IonInput
                                                className="itemInput"
                                                type="number"
                                                placeholder="Qty"
                                                value={item.quantity}
                                                onIonInput={(e) =>
                                                    updateItem(secIndex, itemIndex, "quantity", Number(e.detail.value))
                                                }
                                            />

                                            {itemIndex === sec.items.length - 1 ? (
                                                <IonIcon
                                                    icon={add}
                                                    className="icon-add"
                                                    onClick={() => addItem(secIndex)}
                                                />
                                            ) : (
                                                <IonIcon
                                                    icon={close}
                                                    className="icon-remove"
                                                    onClick={() => removeItem(secIndex, itemIndex)}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </IonCardContent>
                            </IonCard>
                        ))}
                    </div>

                    {/* RIGHT SIDE → Form */}
                    <div className="right-grocery-panel">

                        <IonItem>
                            <IonLabel position="stacked" className="listName">List Name</IonLabel>
                            <IonInput
                                className="listNameInput"
                                placeholder="  Enter list title"
                                value={title}
                                onIonInput={(e) => setTitle(e.detail.value!)}
                            />
                        </IonItem>

                        <h2 className="sections-title">ADD SECTIONS</h2>

                        {/* Predefined section buttons */}
                        <div className="sections-buttons">
                            {PREDEFINED_SECTIONS.map((sec) => (
                                <IonButton fill="outline" key={sec} onClick={() => addSection(sec)}>
                                    {sec}
                                </IonButton>
                            ))}
                        </div>

                        {/* Custom section input */}
                        <IonItem className="custom-section">
                            <IonInput
                                placeholder="Custom section..."
                                value={customName}
                                onIonInput={(e) => setCustomName(e.detail.value!)}
                            />
                            <IonButton onClick={() => addSection(customName)}>Add</IonButton>
                        </IonItem>

                        {/* Bottom buttons */}
                        <div className="action-createList-buttons">
                            <IonButton
                                color="danger"
                                onClick={() => {
                                    playClick();
                                    history.goBack()
                                }}
                            >
                                Discard
                            </IonButton>

                            <IonButton
                                color="primary"
                                onClick={handleSave}
                            >
                                Save
                            </IonButton>
                        </div>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default CreateToBuy;
