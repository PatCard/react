import toast from 'react-hot-toast';

export const handleError = (error) => {
    if (error.response?.status === 429) {
        toast.error(
            '🐶 ¡Ups! Muchos intentos.\nEspera 1 minuto y vuelve a intentar.',
            {
                duration: 6000,
                style: {
                    background: '#fee2e2',
                    color: '#991b1b',
                    fontSize: '16px',
                    fontWeight: '600',
                },
            }
        );
    } 
};