import { redirect } from 'next/navigation';

export default function PublicNotificationsRedirect() {
  // The public /notifications route previously showed static marketing content.
  // The real inbox lives in the dashboard — send users there (it bounces to
  // /login when signed out).
  redirect('/dashboard/notifications');
}
