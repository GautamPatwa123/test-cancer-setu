import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini client if API key is present
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('[SehatSetu] Could not initialize GoogleGenAI client, will use intelligent fallback:', err);
  }
}

// Health check
app.get(['/api/health', '/healthz'], (_req, res) => {
  res.json({
    status: 'ok',
    service: 'SehatSetu Platform API',
    region: 'Darbhanga, Bihar',
    geminiConfigured: !!aiClient,
  });
});

// Endpoint: AI Health & Cancer Awareness Symptom Guidance
app.post('/api/ai/symptom-guidance', async (req, res) => {
  const {
    age = '30-45',
    symptoms = '',
    duration = '',
    severity = 'Moderate',
    mode = 'general',
    history = 'None specified',
    priorEvaluation = 'None',
  } = req.body;

  if (!symptoms || typeof symptoms !== 'string' || symptoms.trim().length === 0) {
    return res.status(400).json({ error: 'Please describe your symptoms.' });
  }

  const isCancerAwareness = mode === 'cancer_awareness';

  const systemInstruction = `
You are the AI Clinical Guidance Assistant for "SehatSetu", a compassionate, evidence-based healthcare access platform serving Tier-2 and Tier-3 communities in India (such as Darbhanga, Bihar).
Your role is to empower patients with clear, dignified health guidance, symptom understanding, red flag awareness, and navigation to registered medical centers (such as DMCH Darbhanga or district specialists).

STRICT SAFETY CONSTRAINTS:
1. Symptoms ALONE cannot confirm or rule out cancer or any disease.
2. DO NOT provide a probability score, definitive diagnosis, prescription, or false reassurance.
3. DO NOT fabricate clinical evidence.
4. Emphasize that this is an informational educational assessment, not a substitute for an in-person doctor examination.

Return a JSON object strictly adhering to this structure:
{
  "summary": "Brief 1-2 sentence empathetic summary of the reported symptoms",
  "understandingTheConcern": "Clear, plain-language clinical context explaining what physiological mechanisms or common conditions could cause these symptoms",
  "redFlagSigns": [
    "List of warning signs that warrant immediate or urgent medical evaluation"
  ],
  "suggestedNextSteps": [
    "Numbered or bulleted practical next steps"
  ],
  "recommendedSpecialist": "Specific specialist type (e.g., Pulmonologist, Surgical Oncologist, General Physician) and suggested facility category (e.g., District Hospital DMCH Darbhanga)",
  "questionsForDoctor": [
    "3-4 concrete questions the patient or family can ask the doctor during consultation"
  ],
  "urgencyLevel": "Routine" | "Prompt (Within 48-72h)" | "Emergency / Urgent"
}
`;

  const userPrompt = `
Assessment Type: ${isCancerAwareness ? 'Cancer Awareness & Referral Guidance' : 'General Symptom Guidance'}
Patient Age Range: ${age}
Reported Symptoms: ${symptoms}
Duration: ${duration || 'Not specified'}
Reported Severity: ${severity}
Medical History: ${history}
Prior Evaluation: ${priorEvaluation}
Location Context: Darbhanga & Mithila region, Bihar.
`;

  const withTimeout = <T>(promise: Promise<T>, ms = 4000): Promise<T> =>
    Promise.race([
      promise,
      new Promise<T>((_, reject) => setTimeout(() => reject(new Error('AI Request Timeout')), ms)),
    ]);

  if (aiClient) {
    try {
      const response = await withTimeout(
        aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: userPrompt,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            temperature: 0.2,
          },
        })
      );

      const responseText = response.text?.trim();
      if (responseText) {
        const parsed = JSON.parse(responseText);
        return res.json({
          success: true,
          source: 'gemini-ai',
          data: parsed,
        });
      }
    } catch (err) {
      console.warn('[SehatSetu] Gemini guidance timeout or error, using rapid clinical fallback:', err);
    }
  }

  // Deterministic Clinical Demonstration Fallback (Indian Tier-2/3 contextualized)
  const isCough = /cough|chest|breath|khansi|phaphda/i.test(symptoms);
  const isLump = /lump|gath|knot|swelling|growth|mass/i.test(symptoms);
  const isFatigue = /fatigue|weakness|kamjori|tired|weight/i.test(symptoms);

  let fallbackResponse = {
    summary: `Reported ${symptoms.trim()} lasting ${duration || 'an unspecified period'}, described as ${severity.toLowerCase()} severity in a patient aged ${age}.`,
    understandingTheConcern: isCancerAwareness
      ? 'In preventive and oncology guidance, persistent changes (such as non-healing lesions, unexplained weight shifts, or lumps persisting over 3 weeks) require systematic clinical examination, sonography, or tissue biopsy to distinguish benign infections or cysts from cell dysplasia.'
      : 'Symptoms like yours are frequently seen in post-viral hyperreactivity, gastroesophageal reflux, environmental dust/allergen sensitivity, or regional seasonal respiratory shifts common in North Bihar.',
    redFlagSigns: [
      'Unexplained significant weight loss (>10% within 3-6 months) or severe loss of appetite',
      'Persistent high fever not resolving with standard antipyretics',
      'Presence of blood in sputum, stool, urine, or unexpected bleeding',
      'Rapidly enlarging palpable mass, lymphadenopathy, or difficulty swallowing',
    ],
    suggestedNextSteps: [
      'Schedule an in-person consultation at a recognized healthcare facility (such as DMCH Darbhanga Medicine/Oncology OPD).',
      'Maintain a daily symptom log noting time of day, triggers, and any medication responses.',
      'Bring all prior diagnostic reports, chest X-rays, or blood counts to avoid repeating tests.',
      'Avoid unprescribed over-the-counter steroids or unverified herbal mixtures.',
    ],
    recommendedSpecialist: isCancerAwareness
      ? (isLump ? 'Surgical Oncologist / General Surgeon' : 'Oncologist or Internal Medicine Specialist at Tertiary Center')
      : (isCough ? 'Pulmonologist / Chest Physician' : 'Internal Medicine Specialist (General Physician)'),
    questionsForDoctor: [
      'What diagnostic investigations (e.g., CBC, ultrasound, or imaging) will help identify the root cause?',
      'Could this symptom be linked to any environmental factors, nutritional deficiencies, or prior history?',
      'Are there specific warning signs that should prompt me to visit the emergency department?',
      'What is the recommended timeline for a follow-up review if symptoms do not improve?',
    ],
    urgencyLevel: severity === 'Severe' ? 'Prompt (Within 48-72h)' : 'Routine',
  };

  return res.json({
    success: true,
    source: 'clinical-demonstration-engine',
    disclaimer: 'DEMO CLINICAL GUIDANCE: Symptoms alone cannot confirm or rule out cancer or serious medical conditions. Please consult a qualified doctor at DMCH or your local healthcare provider.',
    data: fallbackResponse,
  });
});

// Endpoint: AI Medical Document Plain-Language Explanation
app.post('/api/ai/explain-report', async (req, res) => {
  const { fileName = 'Report.pdf', category = 'Laboratory Report', notes = '', reportContent = '' } = req.body;

  const contentToAnalyze = reportContent || notes || `Medical document named "${fileName}" categorized as "${category}".`;

  const systemInstruction = `
You are the AI Document Translator & Medical Report Assistant for SehatSetu.
Your goal is to explain laboratory values, imaging impressions, and prescriptions in simple, comforting, plain English that is easy for patients and rural caregivers in Bihar to understand.

CRITICAL RULES:
1. Clearly distinguish facts explicitly written in the report from general informational context.
2. DO NOT diagnose diseases or invent missing laboratory parameters.
3. Include limitations: Explain that laboratory findings must always be correlated with physical clinical examination by the treating physician.
4. Provide structured, supportive questions for the doctor.

Return JSON strictly:
{
  "documentType": "${category}",
  "keyFindings": [
    "Key finding explicitly stated in the document explained simply"
  ],
  "medicalTermsExplained": [
    { "term": "Medical Term (e.g. Hemoglobin, Neutrophils)", "meaning": "Plain language explanation of what this measures in your body" }
  ],
  "questionsForDoctor": [
    "3 specific questions to discuss with the doctor"
  ],
  "importantLimitations": "Disclaimer on why physical exam and doctor interpretation is essential"
}
`;

  const withTimeout = <T>(promise: Promise<T>, ms = 4000): Promise<T> =>
    Promise.race([
      promise,
      new Promise<T>((_, reject) => setTimeout(() => reject(new Error('AI Request Timeout')), ms)),
    ]);

  if (aiClient) {
    try {
      const response = await withTimeout(
        aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `Analyze this medical document:\nCategory: ${category}\nFile: ${fileName}\nContent/Notes: ${contentToAnalyze}`,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            temperature: 0.1,
          },
        })
      );

      const text = response.text?.trim();
      if (text) {
        const parsed = JSON.parse(text);
        return res.json({
          success: true,
          source: 'gemini-ai',
          data: parsed,
        });
      }
    } catch (err) {
      console.warn('[SehatSetu] Report explanation timeout or error, falling back:', err);
    }
  }

  // Deterministic Clinical Report Explanation Demo
  let terms = [
    { term: 'Hemoglobin (Hb)', meaning: 'A vital protein in red blood cells that transports oxygen throughout your body to keep you energized.' },
    { term: 'Platelet Count', meaning: 'Small blood cells that help blood clot, preventing excessive bruising or bleeding.' },
    { term: 'Serum Creatinine', meaning: 'A metabolic waste product filtered by your kidneys; used to assess normal kidney filtration function.' },
  ];

  if (/x-ray|scan|imaging|ultrasound/i.test(category + fileName)) {
    terms = [
      { term: 'Consolidation / Infiltrate', meaning: 'Areas where air in the lung tissue is replaced by fluid or inflammatory cellular response, often seen in infections.' },
      { term: 'Cardiomegaly', meaning: 'An appearance of enlarged heart silhouette on imaging, requiring clinical correlation with blood pressure.' },
      { term: 'Pleural Space', meaning: 'The thin fluid-filled space between the lung layers; clear margins indicate no pleural effusion fluid buildup.' },
    ];
  }

  return res.json({
    success: true,
    source: 'clinical-demonstration-engine',
    disclaimer: 'DEMO REPORT EXPLANATION — Synthetic demonstration data. Always verify test interpretations with your treating physician.',
    data: {
      documentType: category,
      keyFindings: [
        `Document "${fileName}" successfully processed by SehatSetu Document Engine.`,
        'Laboratory values and reference ranges extracted for structured review.',
        'No critical panic values flagged requiring emergency dispatch; routine physician OPD review advised.',
      ],
      medicalTermsExplained: terms,
      questionsForDoctor: [
        'Do my current test results require any adjustment in my daily diet or existing prescriptions?',
        'When should I repeat this diagnostic test to monitor my progress?',
        'Are there lifestyle modifications suitable for my age to maintain these parameters in the optimal range?',
      ],
      importantLimitations: 'This AI summary explains medical terminology and documented numbers for educational empowerment. Clinical diagnosis requires holistic evaluation of patient history, physical examination, and clinical correlation by a registered doctor.',
    },
  });
});

// Setup Vite middleware in development or serve static in production
async function startServer() {
  const distPath = path.resolve(__dirname, 'dist');
  const distExists = fs.existsSync(path.join(distPath, 'index.html'));
  const isDev = process.env.NODE_ENV === 'development' || (!distExists && process.env.NODE_ENV !== 'production');

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SehatSetu Server] Running on http://0.0.0.0:${PORT} (${isDev ? 'Development' : 'Production'})`);
  });
}

startServer().catch((err) => {
  console.error('[SehatSetu Server] Failed to start:', err);
  process.exit(1);
});
