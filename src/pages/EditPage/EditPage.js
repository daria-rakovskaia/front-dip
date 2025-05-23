// CodeEditor.jsx
import React, { useState, useCallback, useEffect } from 'react';
import './EditPage.css'; // Импорт стилей

export default function CodeEditor() {
    const [code, setCode] = useState('');
    const [isMounted, setIsMounted] = useState(false);

    // Инициализация начального кода
    useEffect(() => {
        const initialCode = `using System;

class Program
{
    static void Main()
    {
        Console.WriteLine("Hello World!");
    }
}`;
        setCode(initialCode);
        setIsMounted(true);
    }, []);

    const handleSubmit = useCallback(() => {
        console.log('Отправлен код:', code);
        alert('Код успешно принят!');
    }, [code]);

    if (!isMounted) return null;

    return (
        <div className="upload-container">
            <h1 className="upload-title">Редактор кода C#</h1>
            <div className="form-fields">
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
        </div>
    );
}