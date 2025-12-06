import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useParams } from 'react-router';

import useSound from 'use-sound';
import click from "/sounds/click.mp3";
import { useHistory, useLocation } from 'react-router';
import { Room } from "./Room";
import { getRooms } from "./CleaningApi";
import './Cleaning.css';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import { add } from 'ionicons/icons';
import { useEffect, useState } from 'react';

const Cleaning: React.FC = () => {

    const [playClick] = useSound(click);

    const history = useHistory();
    const location = useLocation();

    const [rooms, setRooms] = useState<Room[]>([]);

    const loadRooms = async () => {
        const data = await getRooms();
        setRooms(data);
    };
    
    useEffect(() => {
        loadRooms();  // refresca al volver
    }, [location.key]);

    const toCreateRoom = () => {
        history.push("/folder/Cleaning/CreateRoom");
    };

    const openRoom = (id: string) => {
        history.push(`/folder/Cleaning/Room/${id}`);
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
                <h1>CLEANING</h1>

                <div className="rooms-container">
                    {rooms.map(room => (
                        <div
                            key={room.id}
                            className="room-card"
                            onClick={() => openRoom(room.id!)}
                        >
                            {room.name}
                        </div>
                    ))}

                    <div className='createRoom-btn'>
                        <IonButton
                            onClick={() => {
                                playClick();
                                toCreateRoom()}}
                            color='dark'
                            fill="clear"
                            className="add-btn-room"
                        >
                            Create new room
                        </IonButton>
                        <p></p>
                    </div>
                   
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Cleaning;
