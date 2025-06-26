import { tool } from '@openai/agents-realtime';
import { z } from 'zod';
import axios from 'axios';

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';

// Client-side proxy for server-side tools
export const analyzeSymptoms = tool({
  name: 'analyze_symptoms',
  description: 'Analyze user symptoms using the medical model and guideline context.',
  parameters: z.object({
    symptoms: z.string().describe('Comma-separated symptoms like chest pain, nausea'),
    guidelineContext: z.array(z.object({
      text: z.string(),
      section: z.string(),
      category: z.string(),
      entity: z.string(),
      severity_level: z.string().nullable()
    })).nullable().describe('Retrieved guideline chunks from STG')
  }),
  execute: async ({ symptoms, guidelineContext }) => {
    const response = await axios.post(`${serverUrl}/api/analyze-symptoms`, { symptoms, guidelineContext });
    return response.data;
  }
});

export const writePrescription = tool({
  name: 'write_prescription',
  description: 'Generate an e-prescription for the patient',
  parameters: z.object({
    patientId: z.string(),
    medications: z.array(z.string()),
    dosage: z.string(),
    needsModeration: z.boolean().default(false).describe('Flag for human review')
  }),
  execute: async ({ patientId, medications, dosage, needsModeration }) => {
    const response = await axios.post(`${serverUrl}/api/write-prescription`, {
      patientId,
      medications,
      dosage,
      needsModeration
    });
    return response.data;
  }
});

export const generateLabOrder = tool({
  name: 'generate_lab_order',
  description: 'Create lab test orders based on analyzed symptoms',
  parameters: z.object({
    patientId: z.string().describe('Unique patient identifier'),
    tests: z.array(z.string()).describe('List of required lab tests')
  }),
  execute: async ({ patientId, tests }) => {
    const response = await axios.post(`${serverUrl}/api/generate-lab-order`, { patientId, tests });
    return response.data;
  }
});

export const referToProvider = tool({
  name: 'refer_to_provider',
  description: 'Refer patient to a healthcare provider based on symptoms',
  parameters: z.object({
    patientId: z.string().describe('Unique patient identifier'),
    specialty: z.string().describe('Medical specialty required'),
    urgency: z.enum(['routine', 'urgent', 'emergency']).describe('Referral urgency level')
  }),
  execute: async ({ patientId, specialty, urgency }) => {
    const response = await axios.post(`${serverUrl}/api/refer-to-provider`, { patientId, specialty, urgency });
    return response.data;
  }
});

export const sendViaWhatsApp = tool({
  name: 'send_via_whatsapp',
  description: 'Send notification to patient via WhatsApp',
  parameters: z.object({
    phoneNumber: z.string().describe('Patient WhatsApp number in E.164 format'),
    message: z.string().describe('Content to send')
  }),
  execute: async ({ phoneNumber, message }) => {
    const response = await axios.post(`${serverUrl}/api/send-via-whatsapp`, { phoneNumber, message });
    return response.data;
  }
});

export const saveToRecord = tool({
  name: 'save_to_record',
  description: 'Save medical data to persistent storage',
  parameters: z.object({
    type: z.enum(['prescription', 'lab_order', 'referral', 'symptom_check']),
    data: z.object({}).passthrough().strict()
  }),
  execute: async ({ type, data }) => {
    const response = await axios.post(`${serverUrl}/api/save-to-record`, { type, data });
    return response.data;
  }
});

export const flagForModeration = tool({
  name: 'flag_for_moderation',
  description: 'Send prescription for doctor approval',
  parameters: z.object({
    prescriptionId: z.string(),
    reason: z.string()
  }),
  execute: async ({ prescriptionId, reason }) => {
    const response = await axios.post(`${serverUrl}/api/flag-for-moderation`, { prescriptionId, reason });
    return response.data;
  }
});

export const retrieveGuideline = tool({
  name: 'retrieve_guideline',
  description: 'Retrieve relevant guideline chunks based on the patient\'s input',
  parameters: z.object({
    query: z.string().describe('The patient\'s input or question')
  }),
  execute: async ({ query }) => {
    const response = await axios.post(`${serverUrl}/api/retrieve-guideline`, { query });
    return response.data;
  }
});

export const medicalModelQuery = tool({
  name: 'medical_model_query',
  description: 'Query the medical model for symptom extraction or question generation',
  parameters: z.object({
    task: z.enum(['extract_symptoms', 'generate_question']).describe('The task to perform'),
    input: z.string().describe('The input text for the task')
  }),
  execute: async ({ task, input }) => {
    const response = await axios.post(`${serverUrl}/api/medical-model-query`, { task, input });
    return response.data;
  }
});

export const agentTools = [
  analyzeSymptoms,
  writePrescription,
  generateLabOrder,
  referToProvider,
  sendViaWhatsApp,
  saveToRecord,
  flagForModeration,
  retrieveGuideline,
  medicalModelQuery
];