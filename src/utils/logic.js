import apiAuth from "../services/apiAuth";
 
 export default function handleLogout(token, setName, setToken, navigate) {
        apiAuth.logout(token)
            .then(() => {
                setName(undefined);
                setToken(undefined);
                localStorage.clear();
                navigate("/");
            })
            .catch(err => {
                alert(err.response?.data || "Erro ao fazer logout.");
            });
    };