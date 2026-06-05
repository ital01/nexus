import { createFileRoute } from '@tanstack/react-router';
import { LoginScreen } from '../../features/login';

export const Route = createFileRoute('/login/')({
  component: LoginScreen,
});
