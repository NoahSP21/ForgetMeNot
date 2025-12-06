import { IonButton, IonButtons, IonContent, IonDatetime, IonHeader, IonInput, IonItem, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useHistory, useParams } from 'react-router';
import { useEffect, useState } from 'react';
import './Profile.css';
import { getUserProfile } from './ProfileApi';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import { auth, uid } from '../../firebase/firebaseConfig';

const Profile: React.FC = () => {

  const history = useHistory();

  const goToEdit = () => {
    history.push("/folder/Profile/EditProfile");
  };

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: ""
  });

  // Load data from API/database
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        console.log("No user logged in");
        return;
      }

      console.log("User logged in:", user.uid);

      try {
        const data = await getUserProfile();
        console.log("Loaded profile:", data);

        setProfile({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || ""
        });
      } catch (err) {
        console.error(err);
      }
    });

    return () => unsubscribe();
  }, []);

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
        <h1>PROFILE</h1>
        <div className='main-container'>
          <div className='left-panel-profile'>
            <div className='profile-container'>
              <IonItem className='profile-data-container'>
                <IonInput
                  label="Name:"
                  labelPlacement="fixed"
                  value={profile.firstName}
                  readonly
                />
              </IonItem>

              <IonItem className='profile-data-container'>
                <IonInput
                  label="Last name:"
                  labelPlacement="fixed"
                  value={profile.lastName}
                  readonly
                />
              </IonItem>

              <IonItem className='profile-data-container'>
                <IonInput
                  label="Email:"
                  labelPlacement="fixed"
                  value={profile.email}
                  readonly
                />
              </IonItem>
            </div>
            <div className='profile-btn-wrapper'>
              <IonButton shape="round" onClick={goToEdit} size='small'>
                Edit
              </IonButton>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
