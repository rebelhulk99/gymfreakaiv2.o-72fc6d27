import { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { WorkoutSelection, Workout } from './components/WorkoutSelection';
import { CameraInterface } from './components/CameraInterface';

type AppState = 'login' | 'selection' | 'camera';

function App() {
  const [appState, setAppState] = useState<AppState>('login');
  const [username, setUsername] = useState('');
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);

  const handleLogin = (name: string) => {
    setUsername(name);
    setAppState('selection');
  };

  const handleSelectWorkout = (workout: Workout) => {
    setSelectedWorkout(workout);
    setAppState('camera');
  };

  const handleLogout = () => {
    setAppState('login');
    setUsername('');
    setSelectedWorkout(null);
  };

  const handleBackToSelection = () => {
    setAppState('selection');
    setSelectedWorkout(null);
  };

  return (
    <div className="bg-gym-black min-h-screen">
      {appState === 'login' && <LoginPage onLogin={handleLogin} />}
      {appState === 'selection' && (
        <WorkoutSelection
          username={username}
          onSelectWorkout={handleSelectWorkout}
          onLogout={handleLogout}
        />
      )}
      {appState === 'camera' && selectedWorkout && (
        <CameraInterface
          workout={selectedWorkout}
          username={username}
          onBack={handleBackToSelection}
        />
      )}
    </div>
  );
}

export default App;
