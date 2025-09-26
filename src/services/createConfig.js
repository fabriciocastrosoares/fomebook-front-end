export default function createConfig(token) {
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};