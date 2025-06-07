const api_host = "localhost";
const sharp_api_port = 5046;
const python_api_port = 8000;

const config = {
    teacherUrl: `http://${api_host}:${sharp_api_port}/api/Teacher`,
    groupUrl: `http://${api_host}:${sharp_api_port}/api/Group`,
    studentUrl: `http://${api_host}:${sharp_api_port}/api/Student`,
    variantUrl: `http://${api_host}:${sharp_api_port}/api/Variant`,
    examTaskUrl: `http://${api_host}:${sharp_api_port}/api/ExamTask`,
    resultUrl: `http://${api_host}:${sharp_api_port}/api/Result`,
    pdfUrl: `http://${api_host}:${sharp_api_port}/api/PDF`,

    ocrUrl: `http://${api_host}:${python_api_port}/api/v1/recognize`,
    postprocessUrl: `http://${api_host}:${python_api_port}/api/v1/postprocess-text`,
    getFileUrl: `http://${api_host}:${python_api_port}/api/v1/get-file-url`,

    staticAnalysisUrl: `http://${api_host}:${sharp_api_port}/api/Analysis`,
    aiAnalysisUrl: `http://${api_host}:${python_api_port}/api/v1/analyze-code`
};

export default config;
