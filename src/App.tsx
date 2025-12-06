import { IonApp, IonRouterOutlet, IonSplitPane, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import Menu from './components/Menu';
import Page from './pages/Page';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import './theme/variables.css';

/* Pages */
import AuthPage from './pages/Authentication/AuthPage';
import HomeReminders from './pages/Home/HomeReminders';
import AuthEmail from './pages/Auth Email/AuthEmail';
import AuthSignUp from './pages/Auth Email/AuthSignUp';
import { Bounce, ToastContainer } from 'react-toastify';
import { useEffect, useState } from 'react';
import { auth } from './firebase/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import Profile from './pages/Profile/Profile';
import EditProfile from './pages/Profile/EditProfile';
import ToBuy from './pages/ToBuy/ToBuy';
import CreateToBuy from './pages/ToBuy/CreateToBuyPage';
import EditListToBuyPage from './pages/ToBuy/EditListToBuyPage';
import Cleaning from './pages/Cleaning/Cleaning';
import CreateRoom from './pages/Cleaning/CreateRoom';
import RoomPage from './pages/Cleaning/RoomPage';
import EditRoom from './pages/Cleaning/EditRoom';
import Study from './pages/Study/Study';
import CreateStudyPlan from './pages/Study/CreateStudyPlan';
import EditStudyPlan from './pages/Study/EditStudyPlan';
import AppointmentManagement from './pages/AppointmentManagement/AppointmentManagement';
import CreateAppointment from './pages/AppointmentManagement/CreateAppointment';
import EditAppointment from './pages/AppointmentManagement/EditAppointment';


setupIonicReact();

const App: React.FC = () => {
// Later you’ll replace this with Firebase’s auth state listener
const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

useEffect(() => {
  const unsub = onAuthStateChanged(auth, (user) => {
    setIsAuthenticated(!!user);
  });
  return () => unsub();
}, []);

if (isAuthenticated === null) {
  return (
    <div style={{padding: "40px", textAlign: "center"}}>
      Loading...
    </div>
  );
}


  return (
    <IonApp>
      <IonReactRouter>
        {!isAuthenticated ? (
          // AUTH ROUTES (no menu)
          <IonRouterOutlet id="main">
            <Route path="/signin" exact>
              <AuthPage />
            </Route>
            <Route path="/loginEmail" exact>
              <AuthEmail />
            </Route>
            <Route path="/signupEmail" exact>
              <AuthSignUp />
            </Route>
            <Route exact path="/">
              <Redirect to="/signin" />
            </Route>
          </IonRouterOutlet>
        ) : (
          // APP ROUTES (with menu)
          <IonSplitPane contentId="main">
          <Menu />
          <IonRouterOutlet id="main">
            <Route path="/" exact={true}>
              <Redirect to="/folder/Home" />
            </Route>

            <Route path="/folder/Home" exact={true}>
              <HomeReminders />
            </Route>

            <Route path="/folder/Email" exact={true}>
              <AuthEmail />
            </Route>

            <Route path="/folder/Profile" exact={true}>
              <Profile />
            </Route>

            <Route path="/folder/Profile/EditProfile" exact={true}>
              <EditProfile />
            </Route>

            <Route path="/folder/ToBuy" exact={true}>
              <ToBuy />
            </Route>

            <Route path="/folder/ToBuy/CreateToBuy" exact={true}>
              <CreateToBuy />
            </Route>

            <Route path="/folder/ToBuy/EditListToBuyPage/:id" exact={true}>
              <EditListToBuyPage />
            </Route>

            <Route path="/folder/Cleaning" exact={true}>
              <Cleaning />
            </Route>

            <Route path="/folder/Cleaning/CreateRoom" exact={true}>
              <CreateRoom />
            </Route>

            <Route path="/folder/Cleaning/Room/:id" exact={true}>
              <RoomPage />
            </Route>

            <Route path="/folder/Cleaning/EditRoom/:id" exact={true}>
              <EditRoom />
            </Route>

            <Route path="/folder/Study" exact={true}>
              <Study />
            </Route>

            <Route path="/folder/Study/CreateStudyPlan" exact={true}>
              <CreateStudyPlan />
            </Route>

            <Route path="/folder/Study/EditStudyPlan/:id" exact={true}>
              <EditStudyPlan />
            </Route>

            <Route path="/folder/AppointmentManagement" exact={true}>
              <AppointmentManagement />
            </Route>

            <Route path='/folder/AppointmentManagement/CreateAppointment' exact={true}>
              <CreateAppointment />
            </Route>
            
            <Route path='/folder/AppointmentManagement/EditAppointment/:id' exact={true}>
              <EditAppointment />
            </Route>

          </IonRouterOutlet>
        </IonSplitPane>
        )}  
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce}
        />
      </IonReactRouter>
    </IonApp>


  );
};

export default App;
