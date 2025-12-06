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
import './AuthPage.css'
import { colorFill, logoGoogle } from 'ionicons/icons';
import LogoImg from "../../components/imagenes/ForgetMeNot_Logo.png";


const AuthPage: React.FC = () => {
  const history = useHistory();
  
  const logMail = () => {
    history.push('/loginEmail');
  }

  const createAcc = () => {
    history.push('/signupEmail');
  }

  return (
    <IonPage >
      <IonContent fullscreen >
        <div className='container' >
          <div className='left-panel'>
            <IonImg src={LogoImg} />
          </div>
          <div className='right-panel'>
            <h2>Sign in</h2>

            <div className='top'>

              <IonButton onClick={logMail} expand="block" fill="outline" color={'dark'} className='emailLogIn-btn'>
                Log in with Email
              </IonButton>


              <div className="center">
                <IonButton  shape="round" fill="solid" className='continue-btn'>Continue</IonButton>
              </div>
            </div>
            <div className='bottom'>
              <IonButton onClick={createAcc} size='small' fill="clear" className='createAcount-btn' >Create account</IonButton>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AuthPage;
