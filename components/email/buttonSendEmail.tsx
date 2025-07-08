import { Button } from 'react-native';
import { supabase } from '@/config/supabase';

export default function ButtonSendEmail() {
  return (
    <Button
      onPress={async () => {
        const { data, error } = await supabase.functions.invoke('resend-email', {
          body: { to: process.env.RESEND_FROM_EMAIL!, subject: 'Test', html: 'Test' },
        });
        console.log(data, error);
      }}
      title="Send Email"
    />
  );
}
