import {
    IonPage,
    IonContent,
    IonInput,
    IonButton,
    IonText,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonMenuButton,
    IonIcon,
    IonImg
} from '@ionic/react';
import { useHistory, useParams } from 'react-router';
import ExploreContainer from '../../components/ExploreContainer';
import { useState } from 'react';
import { colorFill, handLeft, logoGoogle } from 'ionicons/icons';
import LogoImg from "../../components/imagenes/ForgetMeNot_Logo.png";
import './AuthEmail.css'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/firebaseConfig';
import { toast } from 'react-toastify';

const AuthEmail: React.FC = () => {
    const history = useHistory();
    const backToAuth = () => {
        history.push('/signin');
    }


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log("User logged in succesfully")
            toast.success("User logged in succesfully!", { position: 'top-center' });
            history.push("/folder/Home");
        } catch (err: any) {
            console.error(err.message);
            toast.error(err.message, { position: 'bottom-center' });
        }
    }


    return (
        <IonPage >
            <IonContent fullscreen >
                <div className='container' >
                    <div className='left-panel'>
                        <IonImg src={LogoImg}  />
                    </div>
                    <div className='right-panel'>
                        <h2>Sign in</h2>

                        <div className='top'>
                            <IonInput
                                label="Email"
                                type="email"
                                label-placement="floating"
                                fill="solid"
                                placeholder="Enter text" 
                                onIonChange={(e) => setEmail(e.detail.value!)}
                                />

                            <IonInput
                                label="Password"
                                type="password"
                                label-placement="floating"
                                fill="solid"
                                placeholder="Enter text" 
                                onIonChange={(e) => setPassword(e.detail.value!)}
                                />

                            <div className="center">
                                <IonButton onClick={handleLogin} shape="round" fill="solid" className='continue-btn'>Continue</IonButton>
                            </div>
                        </div>
                        <div className='bottom'>
                            <IonButton onClick={backToAuth} size='small' fill="clear" className='back-btn'>Back</IonButton>
                        </div>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default AuthEmail;
