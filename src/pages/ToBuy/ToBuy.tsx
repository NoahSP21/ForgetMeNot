import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCheckbox, IonContent, IonDatetime, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonMenuButton, IonModal, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useEffect, useState } from 'react';

import useSound from 'use-sound';
import click from "/sounds/click.mp3";
import deleteSound from "/sounds/delete.mp3";

import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import { useHistory, useLocation } from 'react-router';
import './ToBuy.css';
import { GroceryList } from './ToBuyList';
import {
    getGroceryLists,
    deleteGroceryList,
    updateGroceryList
} from "./ToBuyApi";

const ToBuy: React.FC = () => {
    const [playClick] = useSound(click);
    const [playDelete] = useSound(deleteSound);

    const [lists, setLists] = useState<GroceryList[]>([]);
    const history = useHistory();

    const toCreateList = () => {
        history.push("/folder/ToBuy/CreateToBuy");
    };

    const goToEditList = (id: string) => {
        history.push(`/folder/ToBuy/EditListToBuyPage/${id}`);
    };

    // Load lists when page is opened
    const loadLists = async () => {
        const data = await getGroceryLists();
        setLists(data);
    };

    const location = useLocation();


    useEffect(() => {
        loadLists(); // cada vez que la ubicación cambia, recarga la lista
    }, [location.key]);

    // Marcar/desmarcar item
    const handleToggleItem = async (
        listId: string,
        sectionIndex: number,
        itemIndex: number,
        checked: boolean
    ) => {
        const list = lists.find((l) => l.id === listId);
        if (!list) return;

        list.sections[sectionIndex].items[itemIndex].checked = checked;
        await updateGroceryList(listId, { sections: list.sections });
        loadLists();
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
                <h1>TO BUY</h1>
                <div className='main-container'>
                    <div className='lists-groceries'>
                        {lists.map((list) => (
                            <IonCard
                                key={list.id}
                                className="tobuy-card"
                            >
                                <IonCardHeader>
                                    <IonCardTitle className="tobuy-title">{list.title}</IonCardTitle>
                                </IonCardHeader>
                                <div
                                    onClick={(e) => e.stopPropagation()}
                                    className='tobuy-btns-wrapper'
                                >
                                    <IonCardContent>
                                        {list.sections?.map((section, secIndex) => (
                                            <div key={secIndex} className="section-container">
                                                <h3 className="section-title">{section.name}</h3>

                                                <IonList className='groceryList'>
                                                    {section.items?.map((item, itemIndex) => (
                                                        <IonItem key={itemIndex}>
                                                            <IonCheckbox
                                                                slot="start"
                                                                checked={item.checked}
                                                                onIonChange={(e) =>
                                                                    handleToggleItem(
                                                                        list.id!,
                                                                        secIndex,
                                                                        itemIndex,
                                                                        e.detail.checked
                                                                    )
                                                                }
                                                            />
                                                            <IonLabel>
                                                                {item.name} — <strong>{item.quantity}</strong>
                                                            </IonLabel>
                                                        </IonItem>
                                                    ))}
                                                </IonList>
                                            </div>
                                        ))}

                                        <div className="tobuy-card-buttons">
                                            {/* DELETE */}
                                            <IonButton
                                                size='small'
                                                shape="round"
                                                color="danger"
                                                onClick={async () => {
                                                    playDelete(); 
                                                    await deleteGroceryList(list.id!);
                                                    loadLists();
                                                }}
                                            >
                                                Delete
                                            </IonButton>
                                            {/* EDIT */}

                                            
                                            <IonButton
                                                size='small'
                                                shape="round"
                                                color="primary"
                                                onClick={() => {
                                                    playClick(); // 🔊 PLAY SOUND
                                                    goToEditList(list.id!);
                                                }}
                                            >
                                                Edit
                                            </IonButton>
                                            
                                        </div>
                                    </IonCardContent>
                                </div>

                            </IonCard>
                        ))}
                    </div>
                    <div className='createList-container'>
                        <IonButton
                            onClick={() => {
                                playClick(); // 🔊 PLAY SOUND
                                toCreateList();
                            }}
                            color='dark'
                            fill="clear"
                            className="add-btn-tobuy"
                        >
                            Create new list
                        </IonButton>
                    </div>
                </div>

            </IonContent>
        </IonPage>
    );
};

export default ToBuy;
