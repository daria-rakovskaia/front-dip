import React, { useState } from "react";
import './UploadPage.css';
import Select from 'react-select';
import axios from 'axios';

const UploadPage = () => {
    const [files, setFiles] = useState([]);
    const [dragActive, setDragActive] = useState(false);
    const [form, setForm] = useState({
        year: null,
        module: null,
        student_id: null,
        assignment_id: null
    });
    const [previewImage, setPreviewImage] = useState(null);

    const [isLoading, setIsLoading] = useState(false);
    const [progressMessage, setProgressMessage] = useState("");
    const [result, setResult] = useState(null);

    const modules = [
        { value: 2, label: "2" },
        { value: 4, label: "4" }
    ];

    const students = [
        { value: 1, label: "Студент 1" },
        { value: 2, label: "Студент 2" },
        { value: 3, label: "Студент 3" },
        { value: 4, label: "Студент 4" },
        { value: 5, label: "Студент 5" },
        { value: 6, label: "Тест студент" }
    ];

    const assignments = [
        { value: 3, label: "3" },
        { value: 4, label: "4" },
        { value: 5, label: "5" },
        { value: 6, label: "6" },
        { value: 7, label: "7" },
        { value: 8, label: "8" },
        { value: 9, label: "9" }
    ];

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 10 }, (_, i) => {
        const year = currentYear - i;
        return { value: year, label: year.toString() };
    });

    const isImage = (file) => file.type.startsWith("image/");

    const handleFileChange = (e) => {
        const selected = Array.from(e.target.files).filter(isImage);
        if (selected.length < e.target.files.length) {
            alert("Можно загружать только изображения (JPG, PNG, BMP)");
        }
        setFiles((prev) => [...prev, ...selected]);
    };

    const removeFile = (indexToRemove) => {
        setFiles((prev) => prev.filter((_, i) => i !== indexToRemove));
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const dropped = Array.from(e.dataTransfer.files).filter(isImage);
        if (dropped.length < e.dataTransfer.files.length) {
            alert("Можно загружать только изображения");
        }
        setFiles((prev) => [...prev, ...dropped]);
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleStudentChange = (selectedOption) => {
        setForm((prev) => ({
            ...prev,
            student_id: selectedOption ? selectedOption.value : ""
        }));
    };

    const handleAssignmentChange = (selectedOption) => {
        setForm((prev) => ({
            ...prev,
            assignment_id: selectedOption
        }));
    };

    const handleModuleChange = (selectedOption) => {
        setForm((prev) => ({
            ...prev,
            module: selectedOption
        }));
    };

    const handleYearChange = (selectedOption) => {
        setForm((prev) => ({
            ...prev,
            year: selectedOption
        }));
    };

    const handleUpload = async () => {
        if (!form.year || !form.module || !form.student_id || !form.assignment_id || files.length === 0) {
            alert("Пожалуйста, заполните все поля и выберите хотя бы одно изображение.");
            return;
        }

        const formData = new FormData();
        files.forEach((file) => {
            formData.append("images", file);
        });
        formData.append("year", form.year.value);
        formData.append("module", form.module.value);
        formData.append("student_id", form.student_id);
        formData.append("assignment_id", form.assignment_id.value);

        setIsLoading(true);
        setResult(null);

        try {
            setProgressMessage("Обработка изображений...");
            const recognizeRes = await axios.post("http://localhost:8000/api/v1/recognize", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            const { results, work_url } = recognizeRes.data;

            setProgressMessage("Постобработка текста...");
            const postprocessRes = await axios.post("http://localhost:8000/api/v1/postprocess-text", {
                results,
                work_url
            });

            setResult(postprocessRes.data);
            const formattedJSON = JSON.stringify(postprocessRes.data?.response, null, 2)
                .slice(1, -2)
                .replace(/\\n/g, '\n');

            localStorage.setItem("formattedResult", formattedJSON);

        } catch (error) {
            alert("Ошибка: " + (error?.response?.data?.detail || error.message));
        } finally {
            setIsLoading(false);
            setProgressMessage("");
        }
    };

    return (
        <div className="upload-container">
            <h1 className="upload-title">Загрузка работы</h1>

            <div className="form-fields">
                <Select
                    name="teacher"
                    options={years}
                    value={form.year}
                    onChange={handleYearChange}
                    placeholder="Выберите преподавателя"
                    isClearable
                />

                <Select
                    name="group"
                    options={years}
                    value={form.year}
                    onChange={handleYearChange}
                    placeholder="Выберите группу"
                    isClearable
                />

                <Select
                    name="module"
                    options={modules}
                    value={form.module}
                    onChange={handleModuleChange}
                    placeholder="Выберите модуль"
                    isClearable
                />

                <Select
                    name="student_id"
                    options={students}
                    value={students.find((student) => student.value === form.student_id)}
                    onChange={handleStudentChange}
                    placeholder="Выберите студента"
                    isClearable
                />

                <Select
                    name="assignment"
                    options={assignments}
                    value={form.assignment_id}
                    onChange={handleAssignmentChange}
                    placeholder="Выберите вариант"
                    isClearable
                />

                <Select
                    name="assignment"
                    options={assignments}
                    value={form.assignment_id}
                    onChange={handleAssignmentChange}
                    placeholder="Выберите номер задания"
                    isClearable
                />
            </div>

            <div
                className={`dropzone ${dragActive ? "active" : ""}`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
            >
                <p>Перетащите файлы сюда или нажмите, чтобы выбрать</p>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="file-input"
                />
            </div>

            {files.length > 0 && (
                <div className="file-list">
                    <h3>Выбранные файлы:</h3>
                    <ul>
                        {files.map((file, index) => (
                            <li key={index}>
                                <span
                                    style={{ cursor: "pointer", textDecoration: "underline", marginRight: "10px" }}
                                    onClick={() => setPreviewImage(URL.createObjectURL(file))}
                                >
                                    {file.name}
                                </span>
                                <button onClick={() => removeFile(index)} style={{ color: "red", cursor: "pointer" }}>
                                    ❌
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {previewImage && (
                <div className="image-preview">
                    <h3>Просмотр изображения:</h3>
                    <img src={previewImage} alt="Предпросмотр" style={{ maxWidth: "100%", maxHeight: "400px" }} />
                    <button onClick={() => setPreviewImage(null)}>Закрыть</button>
                </div>
            )}

            {isLoading && (
                <div className="loading-overlay">
                    <div className="spinner" />
                    <p>{progressMessage}</p>
                </div>
            )}

            {result && (
                <div style={{ padding: '20px', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
                    <pre style={{ whiteSpace: 'pre-wrap', overflowX: 'auto' }}>
                        <code>
                            {JSON.stringify(result?.response, null, 2).slice(1, -2).replace(/\\n/g, '\n')}
                        </code>
                    </pre>
                </div>
            )}

            <button className="upload-button" onClick={handleUpload}>
                Загрузить
            </button>
        </div>
    );
};

export default UploadPage;
