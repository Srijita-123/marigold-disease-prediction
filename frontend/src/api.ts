import type { HealthStatus, HistoryEntry, PredictionResult } from "./types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://marigold-disease-prediction-backendd.onrender.com";

export async function predictImage(file: File): Promise<PredictionResult> {
  const form = new FormData();
  form.append("image", file);

  const res = await fetch(`${BASE_URL}/api/predict`, { method: "POST", body: form });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || data.detail || "Prediction failed");
  return data;
}

export async function fetchHistory(): Promise<HistoryEntry[]> {
  const res = await fetch(`${BASE_URL}/api/history`);
  if (!res.ok) throw new Error("Failed to load history");
  return res.json();
}

export async function fetchHealth(): Promise<HealthStatus> {
  const res = await fetch(`${BASE_URL}/api/health`);
  if (!res.ok) throw new Error("Health check failed");
  return res.json();
}
