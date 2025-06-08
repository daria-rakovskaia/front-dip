// const api_host = "localhost";
const sharp_api_port = 5000;
const python_api_port = 8000;
const sharp_api_host = "213.108.4.154";
const python_api_host = "45.144.175.171";

const config = {
    teacherUrl: `http://${sharp_api_host}:${sharp_api_port}/api/Teacher`,
    groupUrl: `http://${sharp_api_host}:${sharp_api_port}/api/Group`,
    studentUrl: `http://${sharp_api_host}:${sharp_api_port}/api/Student`,
    variantUrl: `http://${sharp_api_host}:${sharp_api_port}/api/Variant`,
    examTaskUrl: `http://${sharp_api_host}:${sharp_api_port}/api/ExamTask`,
    resultUrl: `http://${sharp_api_host}:${sharp_api_port}/api/Result`,
    pdfUrl: `http://${sharp_api_host}:${sharp_api_port}/api/PDF`,

    ocrUrl: `http://${python_api_host}:${python_api_port}/api/v1/recognize`,
    postprocessUrl: `http://${python_api_host}:${python_api_port}/api/v1/postprocess-text`,
    getFileUrl: `http://${python_api_host}:${python_api_port}/api/v1/get-file-url`,

    staticAnalysisUrl: `http://${sharp_api_host}:${sharp_api_port}/api/Analysis`,
    aiAnalysisUrl: `http://${python_api_host}:${python_api_port}/api/v1/analyze-code`
};

export default config;
