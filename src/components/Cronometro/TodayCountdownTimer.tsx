import { useState, useEffect, useRef } from "react";
import { IonInput, IonButton, IonIcon } from "@ionic/react";
import './TodayTimer.css';
import { pauseCircle, playCircle, reloadCircle } from "ionicons/icons";

interface TodayCountdownTimerProps {
    onFinishSound?: string; // path opcional al sonido
}

const TodayCountdownTimer: React.FC<TodayCountdownTimerProps> = ({ onFinishSound }) => {

    const [hours, setHours] = useState<number>(0);
    const [minutes, setMinutes] = useState<number>(0);
    const [seconds, setSeconds] = useState<number>(0);
  
    const [totalSeconds, setTotalSeconds] = useState<number>(0);
    const [running, setRunning] = useState<boolean>(false);
    const [initialSeconds, setInitialSeconds] = useState<number>(0);
  
    const intervalRef = useRef<any>(null);

    // Start or resume timer
  const startTimer = () => {
    // If there's remaining time, resume
    if (totalSeconds > 0) {
      setRunning(true);
      return;
    }

    // Otherwise compute from inputs and start fresh
    const sec = Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
    if (sec <= 0) return;

    setTotalSeconds(sec);
    setInitialSeconds(sec);
    setRunning(true);
  };

  // Pause timer (stop interval) and sync inputs to current remaining time
  const pauseTimer = () => {
    setRunning(false);

    // Derive h:m:s from totalSeconds and write back to inputs so UI shows paused state
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    setHours(h);
    setMinutes(m);
    setSeconds(s);
  };

  // Main countdown loop
  useEffect(() => {
    if (!running) return;

    intervalRef.current = setInterval(() => {
      setTotalSeconds((prev) => {
        if (prev <= 1) {
          // finished
          clearInterval(intervalRef.current);
          setRunning(false);

          // play sound
          if (onFinishSound) {
            try {
              const audio = new Audio(onFinishSound);
              audio.play().catch(() => { /* ignore promise rejection */ });
            } catch (e) {
              // nothing
            }
          }

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [running, onFinishSound]);

  // Convert seconds to HH:MM:SS for display while running
  const displayHours = Math.floor(totalSeconds / 3600);
  const displayMinutes = Math.floor((totalSeconds % 3600) / 60);
  const displaySeconds = totalSeconds % 60;

  const resetTimer = () => {
    setRunning(false);
    setTotalSeconds(initialSeconds);
    // sync inputs so they show initial value after reset
    const h = Math.floor(initialSeconds / 3600);
    const m = Math.floor((initialSeconds % 3600) / 60);
    const s = initialSeconds % 60;
    setHours(h);
    setMinutes(m);
    setSeconds(s);
  };

  return (
    <div className="timer-wrapper">
      {/* TIME INPUTS (disable when running) */}
      <div className="time-inputs">
        <IonInput
          type="number"
          className="time-input"
          value={running ? displayHours : hours}
          disabled={running}
          onIonChange={(e) => setHours(Number(e.detail.value ?? 0))}
        />

        <span className="colon">:</span>

        <IonInput
          type="number"
          className="time-input"
          value={running ? displayMinutes : minutes}
          disabled={running}
          onIonChange={(e) => setMinutes(Number(e.detail.value ?? 0))}
        />

        <span className="colon">:</span>

        <IonInput
          type="number"
          className="time-input"
          value={running ? displaySeconds : seconds}
          disabled={running}
          onIonChange={(e) => setSeconds(Number(e.detail.value ?? 0))}
        />
      </div>

      {/* START / PAUSE button */}
      {!running ? (
        <IonIcon icon={playCircle} className="timer-btn" color="primary" onClick={startTimer} />
      ) : (
        <IonIcon icon={pauseCircle} className="timer-btn" color="warning" onClick={pauseTimer} />
      )}

      {/* Reset button (only appears after finishing or pausing with difference) */}
      {!running && totalSeconds !== initialSeconds && totalSeconds !== 0 && (
        <IonIcon icon={reloadCircle} className="reset-btn" onClick={resetTimer} />
      )}

      {/* Reset after reaching 0 */}
      {!running && totalSeconds === 0 && initialSeconds > 0 && (
        <IonIcon icon={reloadCircle} className="reset-btn" onClick={() => setTotalSeconds(initialSeconds)} />
      )}
    </div>
  );
};

export default TodayCountdownTimer;