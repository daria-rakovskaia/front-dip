import { useState, useEffect } from 'react';
import axios from 'axios';
import './ReportsPage.css';
import config from '../../config.js';

const ResultsPage = () => {
    const [filteredResults, setFilteredResults] = useState([]);
    const [results, setResults] = useState([]);
    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await axios.get(config.resultUrl);
                const formattedResults = response.data.map(result => ({
                    student: `${result.student.surname} ${result.student.name} ${result.student.patronymic}`,
                    group: result.student.group.name,
                    module: result.task.variant.module,
                    workCode: result.task.variantId,
                    task: result.task.taskNum,
                    workResult: result.analysisRes
                }));
                setResults(formattedResults);
                setFilteredResults(formattedResults);
            }
            catch (error) {
                console.error("Ошибка при получении результатов:", error);
                alert("Не удалось получить результаты");
            }
        };
        fetchResults();
    }, []);

    const [fioFilter, setFioFilter] = useState('');
    const [moduleFilter, setModuleFilter] = useState('');
    useEffect(() => {
        const filtered = results.filter(result => {
            const matchesFio = fioFilter ?
                result.student.toLowerCase().includes(fioFilter.toLowerCase()) : true;
            const matchesModule = moduleFilter ?
                result.module.toString().includes(moduleFilter) : true;
            return matchesFio && matchesModule;
        });
        setFilteredResults(filtered);
    }, [fioFilter, moduleFilter, results]);

    const [selectedResult, setSelectedResult] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleViewResult = (result) => {
        setSelectedResult(result);
        setIsModalOpen(true);
    };

    const handleExportPDF = async () => {
        try {
            const baseName = `${selectedResult.group}_${selectedResult.student}_${selectedResult.workCode}_${selectedResult.task}.pdf`;
            const response = await axios.post(
                config.pdfUrl,
                {
                    result: selectedResult.workResult,
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

    return (
        <div className="reports-container">
            <h1 className="reports-title">Результаты проверки</h1>
            <div className="filters-container">
                <div>
                    <input
                        type="text"
                        className="filter-input"
                        placeholder="Введите ФИО"
                        value={fioFilter}
                        onChange={(e) => setFioFilter(e.target.value)}
                    />
                </div>
                <div>
                    <input
                        type="text"
                        className="filter-input"
                        placeholder="Введите номер модуля"
                        value={moduleFilter}
                        onChange={(e) => setModuleFilter(e.target.value)}
                    />
                </div>
            </div>
            <div className="table-container">
                <table className="assignments-table">
                    <thead>
                        <tr>
                            <th>Студент</th>
                            <th>Модуль</th>
                            <th>Код работы</th>
                            <th>Задача</th>
                            <th>Результат</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredResults.map((item, index) => (
                            <tr key={index}>
                                <td>{item.student}</td>
                                <td>{item.module}</td>
                                <td>{item.workCode}</td>
                                <td>{item.task}</td>
                                <td>
                                    <button
                                        className="result-link"
                                        onClick={() => handleViewResult(item)}
                                    >
                                        Посмотреть результат
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isModalOpen && selectedResult && (
                <div className="fullscreen-modal">
                    <div className="modal-header">
                        <h2 className="modal-title">
                            Результат работы: {selectedResult.student}, {selectedResult.group}
                        </h2>
                        <div className="modal-actions">
                            <button
                                className="PDF-button"
                                onClick={handleExportPDF}
                            >
                                PDF
                            </button>
                            <button
                                className="upload-button"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Закрыть
                            </button>
                        </div>
                    </div>
                    <div className="modal-content">
                        <pre className="result-content">{selectedResult.workResult}</pre>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResultsPage;
