import './MainPage.css';
import { useNavigate } from "react-router-dom";

const MainPage = () => {
    const navigate = useNavigate();

    return (
        <div className="container">
            <h1 className="title">Сервис для проверки рукописных работ на C# (v 1.0)</h1>
            <button
                className="button"
                onClick={() => navigate('/upload')}>
                Загрузить работу
            </button>
            <button
                className="button"
                onClick={() => navigate("/reports")}>
                Результаты проверки
            </button>
        </div>
    );
};

export default MainPage;
