import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import './ResultPage.css';
import config from '../../config';
import axios from 'axios';

const ResultPage = () => {
    const navigate = useNavigate();

    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    const formattedDate = `${day}.${month}.${year}`;

    const formData = JSON.parse(localStorage.getItem("formData"));
    const urls = JSON.parse(localStorage.getItem("urls"));
    const staticResult = JSON.parse(localStorage.getItem("staticResult"));
    const aiResult = JSON.parse(localStorage.getItem("aiResult"));

    const formatCodeWithLineNumbers = (code) => {
        const lines = code.trim().split('\n');
        const maxLineNumWidth = String(lines.length).length;
        return lines.map((line, index) => {
            const lineNumber = index + 1;
            return `${String(lineNumber).padStart(maxLineNumWidth, ' ')}: ${line}`;
        }).join('\n');
    };

    const [result, setResult] = useState("");
    const formatStaticResult = (errors) => {
        return errors.map(err => {
            return `[${err.severity}] ${err.id}: ${err.message} (строка ${err.line}, колонка ${err.column})`;
        }).join('\n');
    };
    const formattedStatic = formatStaticResult(staticResult);

    const [workResult, setWorkResult] = useState({
        studentId: formData.student_id,
        teacherId: formData.teacher_id,
        taskId: formData.assignment_id,
        recognizedCode: localStorage.getItem("formattedResult"),
        analysisRes: null,
        scanPath: localStorage.getItem("workUrl")
    });

    useEffect(() => {
        const formattedLinesNumCode = formatCodeWithLineNumbers(localStorage.getItem("formattedResult"));

        setResult(
            `Дата проверки: ${formattedDate}
Преподаватель: ${formData.teacher_name}, Студент: ${formData.student_name}, Группа: ${formData.group_name}
Код работы: ${formData.work_code}, Номер задания: ${formData.assignment_num}

===Загруженные файлы===
${urls}

===Распознанный код===
${formattedLinesNumCode}

===Результат статического анализа===
${formattedStatic}

===Результат интеллектуального анализа (носит рекомендательный характер)===
${aiResult}`
        );
    }, []);

    useEffect(() => {
        setWorkResult((prev) => ({
            ...prev,
            analysisRes: result
        }));
    }, [result]);

    const handleSave = async () => {
        const postResult = async () => {
            try {
                const response = await axios.post(
                    config.resultUrl, workResult
                );
                console.log(response);
            } catch (error) {
                console.error("Ошибка при сохранении отчёта:", error);
                alert("Не удалось сохранить отчёт");
            }
        };
        alert("Результат сохранён");
        postResult();
    };

    const handlePDF = async () => {
        try {
            const baseName = `${formData.group_name}_${formData.student_name}_${formData.work_code}_${formData.assignment_num}.pdf`;
            const response = await axios.post(
                config.pdfUrl,
                {
                    result: result,
                    outputPath: baseName
                },
                {
                    responseType: 'blob'
                }
            );
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            let fileName = baseName;
            if (response.headers['content-disposition']) {
                const headerFileName = response.headers['content-disposition']
                    .split('filename=')[1]
                    .replace(/["']/g, '');
                if (headerFileName) fileName = headerFileName;
            }
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Ошибка при формировании PDF:", error);
            alert("Не удалось сформировать PDF");
        }
    };

    const handleExit = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <div className="result-page-container">
            <h1 className="upload-title">Результат проверки</h1>
            <div className="result-section">
                <textarea
                    id="result"
                    className="result"
                    spellCheck="false"
                    value={result}
                    onChange={(e) => setResult(e.target.value)}
                />
            </div>
            <div className='buttons'>
                <button
                    className="upload-button"
                    onClick={handleSave}
                >
                    Сохранить
                </button>
                <button
                    className="PDF-button"
                    onClick={handlePDF}
                >
                    PDF
                </button>
                <button
                    className="exit-button"
                    onClick={handleExit}
                >
                    Главное меню
                </button>
            </div>
        </div>
    );
};

export default ResultPage;
