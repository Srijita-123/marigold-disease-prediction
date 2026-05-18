import type { PredictionResult } from "../types";
import "./ResultPanel.css";

interface Props {
  result: PredictionResult | null;
  loading?: boolean;
}

export default function ResultPanel({ result, loading }: Props) {
  if (loading) {
    return (
      <div className="result-panel loading">
        <div className="spinner" />
        <p>Analyzing image…</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="result-panel empty">
        <p>Upload an image and click Analyze to see results.</p>
      </div>
    );
  }

  const healthy = result.is_healthy;
  const confidencePct =
    result.confidence != null ? `${Math.round(result.confidence * 100)}%` : null;

  return (
    <div className={`result-panel ${healthy ? "healthy" : "diseased"}`}>
      <div className="result-badge">{healthy ? "✓ Healthy" : "⚠ Disease detected"}</div>
      <h2>{result.disease_name}</h2>
      {confidencePct && (
        <p className="confidence">Confidence: <strong>{confidencePct}</strong></p>
      )}
      {result.note && <p className="details">{result.note}</p>}
      {!healthy && result.details && <p className="details">{result.details}</p>}
    </div>
  );
}
