import React, { useState } from 'react';
import './ReportsPage.css';

export default function ReportsPage() {
    // Состояния для фильтров
    const [selectedGroup, setSelectedGroup] = useState('');
    const [selectedStudent, setSelectedStudent] = useState('');
    const [selectedModule, setSelectedModule] = useState('');

    // Тестовые данные
    const groups = ['Группа 1', 'Группа 2', 'Группа 3'];
    const students = ['Иванов Иван Иванович', 'Петров Петр', 'Сидорова Анна'];
    const modules = ['Модуль 1: Основы', 'Модуль 2: Продвинутый', 'Модуль 3: Эксперт'];

    // Тестовые данные таблицы
    const [assignments] = useState([
        { student: 'Иванов Иван Иванович', task: 3, link: '/check/123', module: '2' },
        { student: 'Петров Петр Петрович', task: 5, link: '/check/124', module: '2' },
        { student: 'Сидорова Анна Александровна', task: 3, link: '/check/125', module: '4' },
        { student: 'Иванов Иван Иванович', task: 4, link: '/check/126', module: '2' },
    ]);

    // Фильтрация данных
    const filteredData = assignments.filter(item => {
        return (!selectedGroup || item.group === selectedGroup) &&
               (!selectedStudent || item.student === selectedStudent) &&
               (!selectedModule || item.module === selectedModule);
    });

    return (
        <div className="reports-container">
            <h1 className="reports-title">Результаты проверок</h1>
            
            {/* Блок фильтров */}
            <div className="filters-container">
                <select 
                    className="filter-select"
                    value={selectedGroup}
                    onChange={(e) => setSelectedGroup(e.target.value)}
                >
                    <option value="">Все группы</option>
                    {groups.map((group, index) => (
                        <option key={index} value={group}>{group}</option>
                    ))}
                </select>
                
                <select
                    className="filter-select"
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                >
                    <option value="">Все студенты</option>
                    {students.map((student, index) => (
                        <option key={index} value={student}>{student}</option>
                    ))}
                </select>
                
                <select
                    className="filter-select"
                    value={selectedModule}
                    onChange={(e) => setSelectedModule(e.target.value)}
                >
                    <option value="">Все модули</option>
                    {modules.map((module, index) => (
                        <option key={index} value={module}>{module}</option>
                    ))}
                </select>
            </div>

            {/* Таблица с результатами */}
            <div className="table-container">
                <table className="assignments-table">
                    <thead>
                        <tr>
                            <th>Студент</th>
                            <th>№ задания</th>
                            <th>Результат проверки</th>
                            <th>Модуль</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((item, index) => (
                            <tr key={index}>
                                <td>{item.student}</td>
                                <td>{item.task}</td>
                                <td>
                                    <a 
                                        href={item.link} 
                                        className="result-link"
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                    >
                                        Посмотреть результат
                                    </a>
                                </td>
                                <td>{item.module}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}