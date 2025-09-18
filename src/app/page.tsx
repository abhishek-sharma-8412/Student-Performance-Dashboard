import Dashboard from '@/components/Dashboard';
import { ThemeProvider } from '@/components/ThemeProvider';
import ThemeToggle from '@/components/ThemeToggle';

export default function Home() {
  return (
    <ThemeProvider>
      <div className="relative">
        <div className="absolute top-4 right-4 z-10">
          <ThemeToggle />
        </div>
        <Dashboard />
      </div>
    </ThemeProvider>
  );
}