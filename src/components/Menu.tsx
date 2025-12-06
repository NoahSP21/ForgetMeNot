import {
  IonContent,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
} from '@ionic/react';

import { useLocation } from 'react-router-dom';
import { archiveOutline, homeOutline, home, archiveSharp, bookmarkOutline, heartOutline, heartSharp, mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, trashOutline, trashSharp, warningOutline, warningSharp, person, personOutline, calendar, calendarOutline, basket, basketOutline, book, bookOutline, cart, cartOutline, sparkles, sparklesOutline, school, schoolOutline, close } from 'ionicons/icons';
import './Menu.css';
import LogoImg from "../components/imagenes/ForgetMeNot_Logo.png";


interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const appPagesPersonal: AppPage[] = [
  {
    title: 'Home',
    url: '/folder/Home',
    iosIcon: homeOutline,
    mdIcon: home
  },
  {
    title: 'Profile',
    url: '/folder/Profile',
    iosIcon: personOutline,
    mdIcon: person
  }
];

const appPages: AppPage[] = [
  {
    title: 'To buy',
    url: '/folder/ToBuy',
    iosIcon: cartOutline,
    mdIcon: cart
  },
  {
    title: 'Cleaning',
    url: '/folder/Cleaning',
    iosIcon: sparklesOutline,
    mdIcon: sparkles
  },
  {
    title: 'Study',
    url: '/folder/Study',
    iosIcon: schoolOutline,
    mdIcon: school
  },
  {
    title: 'Appointment management',
    url: '/folder/AppointmentManagement',
    iosIcon: calendarOutline,
    mdIcon: calendar
  },
];


const Menu: React.FC = () => {
  const location = useLocation();

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>

        <IonList id="inbox-list">

          <div className='logoContainer'>
            <IonImg src={LogoImg} className='logo' />
          </div>
          <div className='questionsMenu'>
            <p>Your spaces</p>
          </div>

          {appPagesPersonal.map((appPagesPersonal, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem className={location.pathname === appPagesPersonal.url ? 'selected' : ''} routerLink={appPagesPersonal.url} routerDirection="none" lines="none" detail={false}>
                  <IonIcon aria-hidden="true" slot="start" ios={appPagesPersonal.iosIcon} md={appPagesPersonal.mdIcon} />
                  <IonLabel>{appPagesPersonal.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}

          <div className='questionsMenu'>
            <p>What do you need to do?</p>
          </div>

          {appPages.map((appPages, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem className={location.pathname === appPages.url ? 'selected' : ''} routerLink={appPages.url} routerDirection="none" lines="none" detail={false}>
                  <IonIcon aria-hidden="true" slot="start" ios={appPages.iosIcon} md={appPages.mdIcon} />
                  <IonLabel>{appPages.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </IonList>


      </IonContent>
    </IonMenu>
  );
};

export default Menu;
