import { useState } from 'react';
import { Dumbbell, Home, LogOut, Play } from 'lucide-react';

export interface Workout {
  id: string;
  name: string;
  description: string;
  icon: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  reps?: number;
}

const WORKOUTS: Workout[] = [
  {
    id: 'pushups',
    name: 'Push-ups',
    description: 'Classic chest and triceps builder',
    icon: '💪',
    difficulty: 'Beginner',
    reps: 20,
  },
  {
    id: 'squats',
    name: 'Squats',
    description: 'Build those legs with intensity',
    icon: '🦵',
    difficulty: 'Beginner',
    reps: 25,
  },
  {
    id: 'plank',
    name: 'Plank',
    description: 'Core strength and stability',
    icon: '📏',
    difficulty: 'Intermediate',
    reps: 60,
  },
  {
    id: 'burpees',
    name: 'Burpees',
    description: 'Full body explosive movement',
    icon: '🔥',
    difficulty: 'Advanced',
    reps: 15,
  },
  {
    id: 'lunges',
    name: 'Lunges',
    description: 'Leg strength and balance',
    icon: '🚶',
    difficulty: 'Intermediate',
    reps: 20,
  },
  {
    id: 'situps',
    name: 'Sit-ups',
    description: 'Abdominal and core training',
    icon: '⬆️',
    difficulty: 'Beginner',
    reps: 30,
  },
];

interface WorkoutSelectionProps {
  username: string;
  onSelectWorkout: (workout: Workout) => void;
  onLogout: () => void;
}

export function WorkoutSelection({ username, onSelectWorkout, onLogout }: WorkoutSelectionProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<'All' | 'Beginner' | 'Intermediate' | 'Advanced'>('All');

  const filteredWorkouts = selectedDifficulty === 'All'
    ? WORKOUTS
    : WORKOUTS.filter(w => w.difficulty === selectedDifficulty);

  const difficultyColor = {
    Beginner: 'text-green-400 border-green-400',
    Intermediate: 'text-yellow-400 border-yellow-400',
    Advanced: 'text-gym-red border-gym-red',
  };

  return (
    <div className="min-h-screen bg-gym-black">
      <header className="bg-gradient-to-r from-gym-dark to-gym-black border-b-2 border-gym-gold/30">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Dumbbell className="w-8 h-8 text-gym-gold" />
            <div>
              <h1 className="text-gym-gold text-2xl font-bold tracking-wide">GYM FREAK AI</h1>
              <p className="text-gym-silver text-xs uppercase tracking-widest">Welcome, {username}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 bg-gym-red/20 border border-gym-red text-gym-red px-4 py-2 rounded-lg hover:bg-gym-red/30 transition-all duration-300"
          >
            <LogOut size={18} />
            <span className="font-semibold">Logout</span>
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h2 className="text-gym-gold text-4xl font-bold mb-2 tracking-wide">CHOOSE YOUR WEAPON</h2>
          <p className="text-gym-silver">Select a home workout and let AI perfect your form</p>
          <div className="h-1 w-16 bg-gym-red mt-4"></div>
        </div>

        <div className="flex gap-3 mb-10 flex-wrap">
          {['All', 'Beginner', 'Intermediate', 'Advanced'].map((level) => (
            <button
              key={level}
              onClick={() => setSelectedDifficulty(level as any)}
              className={`px-6 py-2 rounded-lg font-semibold uppercase text-sm tracking-wider transition-all duration-300 ${
                selectedDifficulty === level
                  ? 'bg-gym-gold text-gym-black shadow-lg shadow-gym-gold/50'
                  : 'bg-gym-dark border border-gym-gold/30 text-gym-gold hover:border-gym-gold'
              }`}
            >
              {level}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkouts.map((workout) => (
            <div
              key={workout.id}
              className="bg-gym-dark border border-gym-gold/20 rounded-lg p-6 hover:border-gym-gold/60 transition-all duration-300 group cursor-pointer"
              onClick={() => onSelectWorkout(workout)}
            >
              <div className="mb-4 flex items-start justify-between">
                <span className="text-4xl">{workout.icon}</span>
                <span className={`text-xs font-bold border px-2 py-1 rounded uppercase tracking-wider ${difficultyColor[workout.difficulty]}`}>
                  {workout.difficulty}
                </span>
              </div>

              <h3 className="text-gym-gold text-xl font-bold mb-2 group-hover:text-gym-red transition-colors">
                {workout.name}
              </h3>
              <p className="text-gym-silver text-sm mb-4">{workout.description}</p>

              <div className="flex items-center justify-between pt-4 border-t border-gym-gold/10">
                <span className="text-gym-gold font-semibold text-sm">
                  Target: {workout.reps} {typeof workout.reps === 'number' && workout.reps >= 60 ? 'sec' : 'reps'}
                </span>
                <button className="bg-gym-gold/20 border border-gym-gold text-gym-gold p-2 rounded-lg group-hover:bg-gym-gold group-hover:text-gym-black transition-all duration-300">
                  <Play size={20} fill="currentColor" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
