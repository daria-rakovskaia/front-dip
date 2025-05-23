import React, { useState } from 'react';
import './CodeAnalysisPage.css';

export default function CodeAnalysisPage() {
    const initialContent = `Иванов Иван Иванович, 2 модуль, вариант 1, задание 3\n
=== Распознанный код ===
using System;

public class Program
{
    static void Main()
    {
        string s = null;
        Console.WriteLine(s.Length);
        
        int unused;
        
        for(int i = 0; i < 10; i--) 
        {
            Console.WriteLine(i);
        }
        
        OldMethod();
    }
    
    static void OldMethod() {}
}

=== Результаты статического анализа ===
1. [ОШИБКА] Строка 7: NullReferenceException - обращение к свойству null объекта
2. [ПРЕДУПРЕЖДЕНИЕ] Строка 9: Неинициализированная переменная 'unused'
3. [ОШИБКА] Строка 11: Бесконечный цикл - инкремент с уменьшением счетчика
4. [ПРЕДУПРЕЖДЕНИЕ] Строка 16: Неиспользуемый метод 'OldMethod'
5. [ОШИБКА] Строка 5: Отсутствует возвращаемое значение в методе Main`;

    const [editorContent, setEditorContent] = useState(initialContent);

    const handleSave = () => {
        alert('Содержимое сохранено:\n' + editorContent);
    };

    const generatePDF = () => {
        alert('PDF сгенерирован на основе текущего содержимого');
    };

    return (
        <div className="fullscreen-editor">
            <h1 className="editor-title">Результат проверки</h1>
            
            <textarea
                className="unified-editor"
                value={editorContent}
                onChange={(e) => setEditorContent(e.target.value)}
                spellCheck="false"
            />
            
            <div className="editor-buttons">
                <button className="save-button" onClick={handleSave}>
                    Сохранить
                </button>
                <button className="pdf-button" onClick={generatePDF}>
                    PDF
                </button>
            </div>
        </div>
    );
}