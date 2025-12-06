import { IonButton, IonButtons, IonContent, IonDatetime, IonHeader, IonInput, IonItem, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useHistory, useParams } from 'react-router';
import { useEffect, useState } from 'react';
import './Profile.css';
import { getUserProfile, updateUserProfile } from './ProfileApi';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import { uid } from '../../firebase/firebaseConfig';
import { toast } from 'react-toastify';

const EditProfile: React.FC = () => {
  const goToProfile = () => {
    history.push("/folder/Profile");
  };

  const history = useHistory();

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: ""
  });

  // Load data from API/database
  useEffect(() => {
    getUserProfile()
      .then((data) => {
        setProfile({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || ""
        });
      })
      .catch(console.error);
  }, []);

  const saveChanges = async () => {
    try {
      await updateUserProfile(profile); // espera a que se guarde en Firebase
      toast.success("Profile updated!");
      history.push("folder/Profile");        // ahora sí se navegará cuando ya esté actualizado
    } catch (err) {
      toast.error("Error updating profile");
    }
  }

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
        <h1>Edit profile</h1>
        <div className='main-container'>
          <div className='left-panel-profile'>
            <div className='profile-container'>
              <IonItem className='profile-data-container'>
                <IonInput
                  label="Name:"
                  labelPlacement="fixed"
                  value={profile.firstName}
                  onIonChange={(e) =>
                    setProfile({ ...profile, firstName: e.detail.value! })
                  }
                />
              </IonItem>

              <IonItem className='profile-data-container'>
                <IonInput
                  label="Last name:"
                  labelPlacement="fixed"
                  value={profile.lastName}
                  onIonChange={(e) =>
                    setProfile({ ...profile, lastName: e.detail.value! })
                  }
                />
              </IonItem>

              <IonItem className='profile-data-container'>
                <IonInput
                  label="Email:"
                  labelPlacement="fixed"
                  value={profile.email}
                  onIonChange={(e) =>
                    setProfile({ ...profile, email: e.detail.value! })
                  }
                />
              </IonItem>
            </div>
            <div className='profile-btn-wrapper'>
              <IonButton color="danger" shape="round" onClick={goToProfile} size='small'>
                Discard
              </IonButton>
              <IonButton shape="round" onClick={saveChanges} size='small'>
                Save
              </IonButton>
            </div>

          </div>
          <div className='right-panel'>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default EditProfile;
