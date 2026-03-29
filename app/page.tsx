import { Metadata } from 'next';
import LoginForm from '@/components/LoginForm';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login to the Jaiz Admin Dashboard',
};

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 font-sans">
      <LoginForm />
    </div>
  );
};

export default Index;
