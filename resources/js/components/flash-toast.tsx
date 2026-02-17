import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

type ToastFlash = {
    toast?: {
        type: 'success' | 'error' | 'warning' | 'info';
        message: string;
    };
};

export default function FlashToast() {
    const { props } = usePage<ToastFlash>();

    useEffect(() => {
        // console.log('props.toast =>', props.toast);
        if (props.toast?.message) {
            toast[props.toast.type ?? 'success'](props.toast.message);
        }
    }, [props.toast]);

    return null;
}
