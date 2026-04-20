const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

const AI_BASE_URL = "http://127.0.0.1:5001";

exports.transcribe = async (filePath) => {
  const formData = new FormData();
  formData.append("file", fs.createReadStream(filePath));

  const response = await axios.post(
    `${AI_BASE_URL}/transcribe`,
    formData,
    { headers: formData.getHeaders() }
  );

  return response.data;
};

exports.summarize = async (text) => {
  const response = await axios.post(
    `${AI_BASE_URL}/summarize`,
    { text }
  );
  return response.data;
};

exports.generateQuiz = async (text) => {
  const response = await axios.post(
    `${AI_BASE_URL}/generate-quiz`,
    { text }
  );
  return response.data;
};
