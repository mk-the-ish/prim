import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAI, getGenerativeModel, GoogleAIBackend, Schema } from "firebase/ai";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const ai = getAI(app, { backend: new GoogleAIBackend() });

// Define the response schema for the AI report
const reportSchema = Schema.object({
  properties: {
    summary: Schema.string(),
    totals: Schema.object({
      properties: {
        usd: Schema.number(),
        zwg: Schema.number(),
      },
    }),
    byType: Schema.object({
      properties: {
        tuition: Schema.object({
          properties: {
            usd: Schema.number(),
            zwg: Schema.number(),
          },
        }),
        levy: Schema.object({
          properties: {
            usd: Schema.number(),
            zwg: Schema.number(),
          },
        }),
      },
    }),
    notable: Schema.array({ items: Schema.string() }),
  },
});

// Create a `GenerativeModel` instance with JSON output and schema
const model = getGenerativeModel(ai, {
  model: "gemini-2.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: reportSchema,
  },
});

// Generic helper to generate a structured fee report for any period
export async function generateFeeReportWithAI({ periodLabel, periodType, feePayments }) {
    const prompt = `You are a school finance assistant. Given the following fee payment records for the ${periodType} (${periodLabel}), generate a JSON summary of the collections.`;
    const result = await model.generateContent({
      contents: [
        { role: "user", parts: [{ text: prompt + "\nFee payments:\n" + JSON.stringify(feePayments, null, 2) }] }
      ]
    });
    // Log the full result for debugging
    console.log('Full Gemini SDK fee report result:', result);
    // Try to return the parsed JSON from the SDK
    if (result && result.response && result.response.data) {
      return result.response.data;
    }
    // Fallback: try to parse text if present
    if (result && result.response && result.response.text) {
      try {
        const text = typeof result.response.text === 'function'
          ? result.response.text()
          : result.response.text;
        return JSON.parse(text);
      } catch (e) {
        return { summary: typeof result.response.text === 'function'
          ? result.response.text()
          : result.response.text };
      }
    }
    return undefined;
}

// Define the response schema for the AI cashflow report
const cashflowReportSchema = Schema.object({
  properties: {
    summary: Schema.string(),
    totals: Schema.object({
      properties: {
        totalIn: Schema.number(),
        totalOut: Schema.number(),
        net: Schema.number(),
      },
    }),
    byType: Schema.object({
      properties: {
        incoming: Schema.object({
          properties: {
            cbz: Schema.number(),
            zb: Schema.number(),
            other: Schema.number(),
          },
        }),
        outgoing: Schema.object({
          properties: {
            cbz: Schema.number(),
            zb: Schema.number(),
            other: Schema.number(),
          },
        }),
      },
    }),
    notable: Schema.array({ items: Schema.string() }),
  },
});

// Create a GenerativeModel instance for cashflow reports
const cashflowModel = getGenerativeModel(ai, {
  model: "gemini-2.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: cashflowReportSchema,
  },
});

// Generic helper to generate a structured cashflow report for any period
export async function generateCashflowReportWithAI({ periodLabel, periodType, incoming, outgoing }) {
  const prompt = `You are a school finance assistant. Given the following incoming and outgoing bank transactions for the ${periodType} (${periodLabel}), generate a JSON summary of the cashflow. Include totals, breakdown by bank/type, net cashflow, and any notable items.`;
  const result = await cashflowModel.generateContent({
    contents: [
      { role: "user", parts: [{ text: prompt +
        "\nIncoming transactions:\n" + JSON.stringify(incoming, null, 2) +
        "\nOutgoing transactions:\n" + JSON.stringify(outgoing, null, 2)
      }] }
    ]
  });
  // Log the full result for debugging
  console.log('Full Gemini SDK cashflow result:', result);
  // Try to return the parsed JSON from the SDK
  if (result && result.response && result.response.data) {
    return result.response.data;
  }
  // Fallback: try to parse text if present
  if (result && result.response && result.response.text) {
    try {
      const text = typeof result.response.text === 'function'
        ? result.response.text()
        : result.response.text;
      return JSON.parse(text);
    } catch (e) {
      return { summary: typeof result.response.text === 'function'
        ? result.response.text()
        : result.response.text };
    }
  }
  return undefined;
}

export { model };
