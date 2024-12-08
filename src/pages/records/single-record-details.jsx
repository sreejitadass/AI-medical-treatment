import React from "react";
import {
  IconFileUpload,
  IconChevronRight,
  IconProgress,
} from "@tabler/icons-react";
import RecordDetailsHeader from "./components/RecordDetailsHeader";
import { useLocation, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { useStateContext } from "../../context";
import { useState } from "react";
import FileUploadModal from "./components/FileUploadModal";
import { GoogleGenerativeAI } from "@google/generative-ai";

const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

const SingleRecordDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [processing, setIsProcessing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(
    state.analysisResult || "",
  );
  const [filename, setFilename] = useState("");
  const [filetype, setFileType] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { updateRecord } = useStateContext();

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log("Selected file:", file);
    setFileType(file.type);
    setFilename(file.name);
    setFile(file);
  };

  const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async () => {
    setUploading(true);
    setUploadSuccess(false);

    const genAI = new GoogleGenerativeAI(geminiApiKey);

    try {
      const base64Data = await readFileAsBase64(file);

      const imageParts = [
        {
          inlineData: {
            data: base64Data,
            mimeType: filetype,
          },
        },
      ];

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

      const prompt = `You are an expert cancer and any disease diagnosis analyst. Use your knowledge base to answer questions about giving personalized recommended treatments.
        Give a detailed treatment plan for me. Make it more readable, clear, and easy to understand, with paragraphs to enhance readability.
        `;

      const result = await model.generateContent([prompt, ...imageParts]);
      const response = await result.response;
      const text = await response.text();
      setAnalysisResult(text);

      const updatedRecord = await updateRecord({
        documentID: state.id,
        analysisResult: text,
        kanbanRecords: "",
      });
      setUploadSuccess(true);
      setIsModalOpen(false);
      setFilename("");
      setFile(null);
      setFileType("");
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadSuccess(false);
    } finally {
      setUploading(false);
    }
  };

  const processTreatmentPlan = async () => {
    setIsProcessing(true);

    const genAI = new GoogleGenerativeAI(geminiApiKey);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

      const prompt = `Your role and goal is to be an expert that will be using this treatment plan ${analysisResult} to create Columns:
                    - Todo: Tasks that need to be started
                    - Doing: Tasks that are in progress
                    - Done: Tasks that are completed
                    
                    Each task should include a brief description. The tasks should be categorized appropriately based on the stage of the treatment process.
  
                    Please provide the results in the following format for easy front-end display:
                    {
                      "columns": [
                        { "id": "todo", "title": "Todo" },
                        { "id": "doing", "title": "Work in progress" },
                        { "id": "done", "title": "Done" }
                      ],
                      "tasks": [
                        { "id": "1", "columnId": "todo", "content": "Example task 1" },
                        { "id": "2", "columnId": "todo", "content": "Example task 2" },
                        { "id": "3", "columnId": "doing", "content": "Example task 3" },
                        { "id": "4", "columnId": "doing", "content": "Example task 4" },
                        { "id": "5", "columnId": "done", "content": "Example task 5" }
                      ]
                    }`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = await response.text();

      // Log raw response text for debugging
      console.log("Raw response:", text);

      // Remove markdown code block syntax (if present)
      const cleanedText = text.replace(/```json|```/g, "").trim();
      console.log("Cleaned response:", cleanedText);

      let parsedResponse;

      try {
        parsedResponse = JSON.parse(cleanedText); // Parse the sanitized response
      } catch (jsonError) {
        console.error("Error parsing JSON response:", jsonError);
        throw new Error(
          "The AI response is not in the expected format. Please check the prompt or AI configuration.",
        );
      }

      // Update record and navigate
      const updatedRecord = await updateRecord({
        documentID: state.id,
        kanbanRecords: cleanedText,
      });
      console.log("Updated Record:", updatedRecord);

      navigate("/screening-schedules", { state: parsedResponse });
    } catch (error) {
      console.error("Error processing treatment plan:", error);
      alert(
        "An error occurred while processing the treatment plan. Please try again later.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-[26px]">
      <button
        type="button"
        onClick={handleOpenModal}
        className="mt-6 inline-flex items-center gap-x-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-[#13131a] dark:text-white dark:hover:bg-neutral-800"
      >
        <IconFileUpload />
        Upload Reports
      </button>

      <FileUploadModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onFileChange={handleFileChange}
        onFileUpload={handleFileUpload}
        uploading={uploading}
        uploadSuccess={uploadSuccess}
        filename={filename}
      />

      <RecordDetailsHeader recordName={state.recordName} />

      <div className="w-full">
        <div className="flex flex-col">
          <div className="-m-1.5 overflow-x-auto">
            <div className="inline-block min-w-full p-1.5 align-middle">
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-[#13131a]">
                <div className="border-b border-gray-200 px-6 py-4 dark:border-neutral-700">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-neutral-200">
                    Personalized AI-Driven Treatment Plan
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-neutral-400">
                    A tailored medical strategy leveraging advanced AI insights.
                  </p>
                </div>
                <div className="flex w-full flex-col px-6 py-4 text-white">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                      Analysis Result
                    </h2>
                    <div className="space-y-2">
                      {analysisResult ? (
                        <ReactMarkdown>{analysisResult}</ReactMarkdown>
                      ) : (
                        <p className="text-gray-600 dark:text-neutral-400">
                          No analysis result available. Please upload a file to
                          generate a treatment plan.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-2 sm:flex">
        <button
          type="button"
          onClick={processTreatmentPlan}
          className="inline-flex items-center gap-x-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800"
        >
          View Treatment plan
          <IconChevronRight size={20} />
          {processing && (
            <IconProgress size={10} className="mr-3 h-5 w-5 animate-spin" />
          )}
        </button>
      </div>
    </div>
  );
};

export default SingleRecordDetails;
