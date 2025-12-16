import { useEffect, useRef, useState } from 'react';
import { Workout } from './WorkoutSelection';
import { X, Pause, Play, RotateCcw } from 'lucide-react';

interface CameraInterfaceProps {
  workout: Workout;
  username: string;
  onBack: () => void;
}

interface WorkoutSession {
  reps: number;
  calories: number;
  duration: number;
  formAccuracy: number;
}

export function CameraInterface({ workout, username, onBack }: CameraInterfaceProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [reps, setReps] = useState(0);
  const [formAccuracy, setFormAccuracy] = useState(95);
  const [duration, setDuration] = useState(0);
  const [sessionData, setSessionData] = useState<WorkoutSession | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsActive(true);
        }
      } catch (err) {
        console.error('Camera access denied:', err);
        alert('Please allow camera access to use form detection');
      }
    };

    initCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isPaused && isActive) {
      timerRef.current = setInterval(() => {
        setDuration(d => d + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, isActive]);

  const handleSimulateRep = () => {
    setReps(r => r + 1);
    setFormAccuracy(Math.max(85, formAccuracy - Math.random() * 2));
  };

  const handleFinishWorkout = () => {
    const calories = Math.floor((reps * 2.5) + (duration * 0.1));
    setSessionData({
      reps,
      calories,
      duration,
      formAccuracy: Math.round(formAccuracy),
    });
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
    setIsActive(false);
  };

  const handleReset = () => {
    setReps(0);
    setFormAccuracy(95);
    setDuration(0);
    setSessionData(null);
    setIsPaused(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (sessionData) {
    return (
      <div className="min-h-screen bg-gym-black flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-gym-dark border-2 border-gym-gold rounded-lg p-8 text-center">
          <div className="mb-8">
            <h2 className="text-gym-gold text-4xl font-bold mb-2">WORKOUT COMPLETE!</h2>
            <p className="text-gym-silver text-xl">Great job, {username}!</p>
          </div>

          <div className="space-y-6 mb-8">
            <div className="bg-gym-black rounded-lg p-6 border border-gym-gold/20">
              <p className="text-gym-silver text-sm mb-1">REPS COMPLETED</p>
              <p className="text-gym-gold text-5xl font-bold">{sessionData.reps}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gym-black rounded-lg p-4 border border-gym-gold/20">
                <p className="text-gym-silver text-xs mb-1 uppercase">DURATION</p>
                <p className="text-gym-red text-2xl font-bold">{formatTime(sessionData.duration)}</p>
              </div>
              <div className="bg-gym-black rounded-lg p-4 border border-gym-gold/20">
                <p className="text-gym-silver text-xs mb-1 uppercase">CALORIES</p>
                <p className="text-gym-gold text-2xl font-bold">{sessionData.calories}</p>
              </div>
            </div>

            <div className="bg-gym-black rounded-lg p-6 border border-gym-gold/20">
              <p className="text-gym-silver text-sm mb-2">FORM ACCURACY</p>
              <div className="relative h-8 bg-gym-black border border-gym-gold/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-gym-gold to-gym-red transition-all duration-300 flex items-center justify-center"
                  style={{ width: `${sessionData.formAccuracy}%` }}
                >
                  {sessionData.formAccuracy >= 40 && (
                    <span className="text-gym-black font-bold text-sm">{sessionData.formAccuracy}%</span>
                  )}
                </div>
                {sessionData.formAccuracy < 40 && (
                  <span className="absolute inset-0 flex items-center justify-center text-gym-gold font-bold text-sm">
                    {sessionData.formAccuracy}%
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleReset}
              className="w-full bg-gradient-to-r from-gym-gold to-gym-red text-gym-black font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-gym-gold/50 transition-all duration-300 uppercase tracking-wider"
            >
              NEXT EXERCISE
            </button>
            <button
              onClick={onBack}
              className="w-full bg-gym-dark border border-gym-gold text-gym-gold font-bold py-3 rounded-lg hover:bg-gym-gold hover:text-gym-black transition-all duration-300 uppercase tracking-wider"
            >
              BACK TO MENU
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gym-black flex flex-col">
      <header className="bg-gym-dark border-b border-gym-gold/30 p-4 flex items-center justify-between">
        <div className="text-center flex-1">
          <h2 className="text-gym-gold text-2xl font-bold">{workout.name}</h2>
          <p className="text-gym-silver text-sm">AI Form Detection & Rep Counting</p>
        </div>
        <button
          onClick={onBack}
          className="text-gym-gold hover:text-gym-red transition-colors"
        >
          <X size={28} />
        </button>
      </header>

      <div className="flex-1 flex gap-6 p-6 max-w-7xl mx-auto w-full">
        <div className="flex-1 relative bg-gym-dark rounded-lg overflow-hidden border-2 border-gym-gold/30">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          <canvas ref={canvasRef} className="hidden" />

          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gym-black/50"></div>
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex gap-2">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="flex-1 bg-gym-gold/20 border border-gym-gold text-gym-gold py-2 rounded-lg hover:bg-gym-gold hover:text-gym-black transition-all duration-300 flex items-center justify-center gap-2 font-semibold"
            >
              {isPaused ? <Play size={20} /> : <Pause size={20} />}
              {isPaused ? 'RESUME' : 'PAUSE'}
            </button>
            <button
              onClick={handleSimulateRep}
              disabled={isPaused}
              className="flex-1 bg-gym-red/20 border border-gym-red text-gym-red py-2 rounded-lg hover:bg-gym-red hover:text-gym-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              REP +
            </button>
          </div>
        </div>

        <div className="w-80 bg-gym-dark rounded-lg border-2 border-gym-gold/30 p-6 flex flex-col gap-6">
          <div>
            <h3 className="text-gym-gold text-xs font-bold uppercase tracking-widest mb-4">LIVE STATS</h3>

            <div className="space-y-4">
              <div className="bg-gym-black rounded-lg p-4 border border-gym-gold/20">
                <p className="text-gym-silver text-xs mb-1">REPS COUNTED</p>
                <p className="text-gym-gold text-4xl font-bold">{reps}</p>
                <p className="text-gym-silver text-xs mt-1">Target: {workout.reps}</p>
              </div>

              <div className="bg-gym-black rounded-lg p-4 border border-gym-gold/20">
                <p className="text-gym-silver text-xs mb-1">DURATION</p>
                <p className="text-gym-red text-3xl font-bold">{formatTime(duration)}</p>
              </div>

              <div className="bg-gym-black rounded-lg p-4 border border-gym-gold/20">
                <p className="text-gym-silver text-xs mb-2 flex items-center justify-between">
                  <span>FORM ACCURACY</span>
                  <span className="text-gym-gold">{Math.round(formAccuracy)}%</span>
                </p>
                <div className="relative h-6 bg-gym-dark border border-gym-gold/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-gym-gold to-gym-red transition-all duration-300"
                    style={{ width: `${formAccuracy}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-3 justify-end">
            <button
              onClick={handleFinishWorkout}
              className="w-full bg-gradient-to-r from-gym-gold to-gym-red text-gym-black font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-gym-gold/50 transition-all duration-300 uppercase tracking-wider text-sm"
            >
              FINISH WORKOUT
            </button>
            <button
              onClick={onBack}
              className="w-full bg-gym-dark border border-gym-gold text-gym-gold font-bold py-3 rounded-lg hover:bg-gym-gold hover:text-gym-black transition-all duration-300 uppercase tracking-wider text-sm"
            >
              CANCEL
            </button>
          </div>

          <div className="pt-4 border-t border-gym-gold/20 text-center">
            <p className="text-gym-silver text-xs font-light">
              Keep your camera steady for best results
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
