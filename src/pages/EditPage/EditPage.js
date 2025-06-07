import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './EditPage.css';
import config from '../../config';
import axios from 'axios';

const EditPage = () => {
    const navigate = useNavigate();

    const savedForm = JSON.parse(localStorage.getItem('formData'));
    const [form] = useState({
        assignment_id: savedForm.assignment_id
    });

    const [code, setCode] = useState('');
    useEffect(() => {
        const savedCode = localStorage.getItem("formattedResult");
        setCode(savedCode);
    }, []);

    const workUrl = localStorage.getItem("workUrl");
    const filesNum = localStorage.getItem("filesNum");
    const [urls, setUrls] = useState([]);
    useEffect(() => {
        const fetchUrls = async () => {
            try {
                const response = await axios.post(
                    config.getFileUrl,
                    {
                        file_num: filesNum,
                        object_key: workUrl
                    }
                );
                setUrls(response.data.urls);
            } catch (error) {
                console.error("Ошибка при формировании ссылок:", error);
                alert("Не удалось сформировать ссылки");
            }
        };
        fetchUrls();
    }, [filesNum, workUrl]);

    const [activeImage, setActiveImage] = useState(null);

    const [task, setTask] = useState("");
    useEffect(() => {
        const fetchTask = async () => {
            try {
                const response = await axios.get(`${config.examTaskUrl}/id/${form.assignment_id}`);
                setTask(response.data.taskText);
            } catch (error) {
                console.error("Ошибка при загрузке задания:", error);
                alert("Не удалось загрузить задание");
            }
        };
        fetchTask();
    }, []);

    const toggleImage = (index) => {
        if (activeImage === index) {
            setActiveImage(null);
        } else {
            setActiveImage(index);
        }
    };

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const staticResult = await axios.post(
                config.staticAnalysisUrl,
                {
                    code: code
                }
            );
            const aiResult = await axios.post(
                config.aiAnalysisUrl,
                {
                    task: task,
                    code: code
                }
            );
            localStorage.setItem("staticResult", JSON.stringify(staticResult.data.errors));
            localStorage.setItem("aiResult", JSON.stringify(aiResult.data.response));
            localStorage.setItem("formattedResult", code);
            localStorage.setItem("urls", JSON.stringify(urls));
            navigate('/result')
        }
        catch (error) {
            alert("Ошибка: " + (error?.response?.data?.detail || error.message));
        }
        finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="edit-page-container">
            {isLoading && (
                <div className="loading-overlay">
                    <div className="loading-message">Выполняется анализ кода...</div>
                </div>
            )}
            <h1 className="upload-title">Редактор кода C#</h1>

            <div className="editor-container">
                <div className="code-section">
                    <textarea
                        id="codeEditor"
                        className="code-editor"
                        spellCheck="false"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />
                    <button
                        className="upload-button"
                        onClick={handleSubmit}
                    >
                        Подтвердить
                    </button>
                </div>

                <div className="samples-section">
                    <h3>Загруженные файлы:</h3>
                    <div className="samples-list">
                        {urls.map((url, index) => (
                            <div key={index} className="sample-item-container">
                                <div
                                    className={`sample-item ${activeImage === index ? 'active' : ''}`}
                                    onClick={() => toggleImage(index)}
                                >
                                    Изображение {index + 1}
                                </div>

                                {activeImage === index && (
                                    <div className="image-preview">
                                        <img
                                            src={url}
                                            alt={`Preview ${index + 1}`}
                                            className="preview-image"
                                        />
                                        <button
                                            className="close-preview"
                                            onClick={() => setActiveImage(null)}
                                        >
                                            Закрыть
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditPage;
