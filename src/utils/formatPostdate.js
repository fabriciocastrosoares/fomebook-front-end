  export default function formatPostDate(isoDate) {
        const date = new Date(isoDate);
        const formattedDate = date.toLocaleDateString('pt-BR');
        const formattedTime = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

        return `${formattedDate} às ${formattedTime}`;
    }