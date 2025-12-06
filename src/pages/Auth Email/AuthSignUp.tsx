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
} from '@ionic/react'; import { useHistory, useParams } from 'react-router';
import LogoImg from "../../components/imagenes/ForgetMeNot_Logo.png";
import ExploreContainer from '../../components/ExploreContainer';
import { useState } from 'react';
import { auth, db } from '../../firebase/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { Bounce, toast } from "react-toastify";

const AuthSignUp: React.FC = () => {

  const history = useHistory();
  const backToAuth = () => {
    history.push('/signin');
  }

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [error, setError] = useState('');

  const handleRegister = async () => {
    setError('');
    try {

      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;

      console.log(user);
      if (user) {
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          firstName: fname,
          lastName: lname
        });
      }

      toast.success("User Registered succesfully!", { position: 'top-center' });
      console.log('User Registered succesfully!');
    } catch (err: any) {
      console.error(err.message);
      toast.error(err.message, { position: 'bottom-center' });
    }
  };

  return (
    <IonPage >
      <IonContent fullscreen >
        <div className='container' >
          <div className='left-panel'>
            <IonImg src={LogoImg} />
          </div>
          <div className='right-panel'>
            <h2>Create account</h2>

            <div className='top'>

              <IonInput
                label="Email"
                labelPlacement="stacked"
                onIonChange={e => setEmail(e.detail.value!)}
                type="email"
              />
              <IonInput
                label="Name"
                labelPlacement="stacked"
                onIonChange={e => setFname(e.detail.value!)}
                type='text'
              />
              <IonInput
                label="Last name"
                labelPlacement="stacked"
                onIonChange={e => setLname(e.detail.value!)}
                type='text'
              />
              <IonInput
                label="Password"
                labelPlacement="stacked"
                onIonChange={e => setPassword(e.detail.value!)}
                type="password"
              />

              <div className="center">
                <IonButton onClick={handleRegister}  shape="round" fill="solid" className='continue-btn'>Create account</IonButton>
              </div>
            </div>
            <div className='bottom'>
              <IonButton onClick={backToAuth}  size='small' fill="clear" className='back-btn'>Back</IonButton>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AuthSignUp;
