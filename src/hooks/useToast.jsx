import { toast } from 'react-toastify';

export const useToast = () => {
    const success = (message) =>
        toast.success(message, {
            position: 'top-right',
            autoClose: 3000,
            theme: 'colored',
        });

    const error = (message) =>
        toast.error(message, {
            position: 'top-right',
            autoClose: 3000,
            theme: 'colored',
        });

    const info = (message) =>
        toast.info(message, {
            position: 'top-right',
            autoClose: 3000,
            theme: 'colored',
        });

    return { success, error, info };
};
