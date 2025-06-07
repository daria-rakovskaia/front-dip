import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './UploadPage.css';
import Select from 'react-select';
import axios from 'axios';
import config from '../../config.js';

const UploadPage = () => {
    const navigate = useNavigate();

    const [teachers, setTeachers] = useState([]);
    const [groups, setGroups] = useState([]);
    const [students, setStudents] = useState([]);
    const [variants, setVariants] = useState([]);
    const [assignments, setAssignments] = useState([]);

    const [form, setForm] = useState({
        teacher_id: null,
        teacher_name: null,
        group_id: null,
        group_name: null,
        student_id: null,
        student_name: null,
        work_code: null,
        assignment_id: null,
        assignment_num: null
    });

    const handleTeacherChange = (selectedOption) => {
        const newValue = selectedOption ? selectedOption : null;
        setForm((prev) => ({
            ...prev,
            teacher_id: newValue ? newValue.value : null,
            teacher_name: newValue ? newValue.label : null
        }));
    };

    const handleGroupChange = (selectedOption) => {
        const newValue = selectedOption ? selectedOption : null;
        setForm((prev) => ({
            ...prev,
            group_id: newValue ? newValue.value : null,
            group_name: newValue ? newValue.label : null,
            student_id: null
        }));
    };

    const handleStudentChange = (selectedOption) => {
        const newValue = selectedOption ? selectedOption : null;
        setForm((prev) => ({
            ...prev,
            student_id: newValue ? newValue.value : null,
            student_name: newValue ? newValue.label : null
        }));
    };

    const handleVariantChange = (selectedOption) => {
        const newValue = selectedOption ? selectedOption.value : null;
        setForm((prev) => ({
            ...prev,
            work_code: newValue,
            assignment_id: null,
            assignment_num: null
        }));
    };

    const handleAssignmentChange = (selectedOption) => {
        const newValue = selectedOption ? selectedOption : null;
        setForm((prev) => ({
            ...prev,
            assignment_id: newValue ? newValue.value : null,
            assignment_num: newValue ? newValue.label : null
        }));
    };

    // get список преподавателей
    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const response = await axios.get(config.teacherUrl);
                const formattedTeachers = response.data.map(teacher => ({
                    value: teacher.id,
                    label: `${teacher.surname} ${teacher.name} ${teacher.patronymic}`
                }));
                setTeachers(formattedTeachers);
            } catch (error) {
                console.error("Ошибка при загрузке преподавателей:", error);
                alert("Не удалось загрузить список преподавателей");
            }
        };
        fetchTeachers();
    }, []);

    // get список групп
    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await axios.get(config.groupUrl);
                const formattedGroups = response.data.map(group => ({
                    value: group.id,
                    label: group.name
                }));
                setGroups(formattedGroups);
            } catch (error) {
                console.error("Ошибка при загрузке групп:", error);
                alert("Не удалось загрузить список групп");
            }
        };
        fetchGroups();
    }, []);

    // get список студентов выбранной группы
    useEffect(() => {
        const fetchStudents = async () => {
            if (!form.group_id) {
                setStudents([]);
                return;
            }
            try {
                const response = await axios.get(`${config.studentUrl}/${form.group_id}`);
                const formattedStudents = response.data.map(student => ({
                    value: student.id,
                    label: `${student.surname} ${student.name} ${student.patronymic}`
                }));
                setStudents(formattedStudents);
            } catch (error) {
                console.error("Ошибка при загрузке студентов:", error);
                alert("Не удалось загрузить список студентов");
            }
        };
        fetchStudents();
    }, [form.group_id]);

    // get список вариантов (кодов работ)
    useEffect(() => {
        const fetchVariants = async () => {
            try {
                const response = await axios.get(config.variantUrl);
                const formattedVariants = response.data.map(variant => ({
                    value: variant.id,
                    label: variant.id
                }));
                setVariants(formattedVariants);
            } catch (error) {
                console.error("Ошибка при загрузке кодов работ:", error);
                alert("Не удалось загрузить список кодов работ");
            }
        };
        fetchVariants();
    }, []);

    // get список заданий выбранной работы
    useEffect(() => {
        const fetchAssignments = async () => {
            if (!form.work_code) {
                setAssignments([]);
                return;
            }
            try {
                const response = await axios.get(`${config.examTaskUrl}/variant/${form.work_code}`);
                const formattedAssignments = response.data.map(assignment => ({
                    value: assignment.id,
                    label: assignment.taskNum
                }));
                setAssignments(formattedAssignments);
            } catch (error) {
                console.error("Ошибка при загрузке заданий:", error);
                alert("Не удалось загрузить список заданий");
            }
        };
        fetchAssignments();
    }, [form.work_code]);

    const [files, setFiles] = useState([]);
    const [dragActive, setDragActive] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [progressMessage, setProgressMessage] = useState("");
    const [result, setResult] = useState(null);
    const isImage = (file) => file.type.startsWith("image/");

    const handleFileChange = (e) => {
        const selected = Array.from(e.target.files).filter(isImage);
        if (selected.length < e.target.files.length) {
            alert("Можно загружать только изображения (JPG, PNG)");
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

    const handleUpload = async () => {
        if (!form.teacher_id || !form.group_id || !form.student_id || !form.work_code || !form.assignment_id || files.length === 0) {
            alert("Пожалуйста, заполните все поля и выберите хотя бы одно изображение.");
            return;
        }

        localStorage.setItem("filesNum", files.length);

        const formData = new FormData();
        files.forEach((file) => {
            formData.append("images", file);
        });
        formData.append("student_id", form.student_id);
        formData.append("work_code", form.work_code);
        formData.append("assignment_id", form.assignment_id);

        setIsLoading(true);
        setResult(null);

        try {
            setProgressMessage("Обработка изображений...");
            const recognizeRes = await axios.post(config.ocrUrl, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            const { results, work_url } = recognizeRes.data;
            localStorage.setItem("workUrl", work_url);

            setProgressMessage("Постобработка текста...");
            const postprocessRes = await axios.post(config.postprocessUrl, {
                results,
                work_url
            });

            setResult(postprocessRes.data);
            const formattedJSON = JSON.stringify(postprocessRes.data?.response, null, 2)
                .slice(1, -2)
                .replace(/\\n/g, '\n');

            localStorage.setItem("formattedResult", formattedJSON);
            localStorage.setItem('formData', JSON.stringify(form));
            navigate('/editCode');

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
                    options={teachers}
                    value={teachers.find(teacher => teacher.value === form.teacher_id)}
                    onChange={handleTeacherChange}
                    placeholder="Выберите преподавателя"
                    isClearable
                    isLoading={teachers.length === 0}
                />

                <Select
                    name="group"
                    options={groups}
                    value={groups.find(group => group.value === form.group_id)}
                    onChange={handleGroupChange}
                    placeholder="Выберите группу"
                    isClearable
                    isLoading={groups.length === 0}
                />

                <Select
                    name="student"
                    options={students}
                    value={form.student_id ? students.find(student => student.value === form.student_id) : null}
                    onChange={handleStudentChange}
                    placeholder="Выберите студента"
                    isClearable
                    isDisabled={!form.group_id}
                    isLoading={students.length === 0 && form.group_id}
                />

                <Select
                    name="work_code"
                    options={variants}
                    value={variants.find(variant => variant.value === form.variant)}
                    onChange={handleVariantChange}
                    placeholder="Выберите код работы"
                    isClearable
                    isLoading={variants.length === 0}
                />

                <Select
                    name="assignment"
                    options={assignments}
                    value={assignments.find(assignment => assignment.value === form.assignment_id)}
                    onChange={handleAssignmentChange}
                    placeholder="Выберите номер задания"
                    isClearable
                    isDisabled={!form.work_code}
                    isLoading={variants.length === 0 && form.work_code}
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

            <button className="upload-button" onClick={handleUpload}>
                Загрузить
            </button>
        </div>
    );
};

export default UploadPage;
