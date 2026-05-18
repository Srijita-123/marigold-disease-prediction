import { useCallback, useEffect, useState } from "react";
import { fetchHealth, fetchHistory, predictImage } from "../api";
import ImageUpload from "../components/ImageUpload";
import ResultPanel from "../components/ResultPanel";
import StatsChart from "../components/StatsChart";
import type { HealthStatus, HistoryEntry, PredictionResult } from "../types";
import "./Dashboard.css";

export default function Dashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [health, setHealth] = useState<HealthStatus | null>(null);

  const loadHistory = useCallback(async () => {
    try {
      const data = await fetchHistory();
      setHistory(data);
    } catch {
      /* ignore on dashboard */
    }
  }, []);

  useEffect(() => {
    fetchHealth().then(setHealth).catch(() => null);
    loadHistory();
  }, [loadHistory]);

  const handleAnalyze = async () => {
    if (!file) {
      setError("Please select an image first");
      return;
    }
    setError(null);
    setLoading(true);
    setResult(null);
    try {
      const data = await predictImage(file);
      setResult(data);
      await loadHistory();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  const modelReady = health?.ml?.model_loaded ?? false;

  return (
    <div className="dashboard">
      {!modelReady && (
        <div className="banner warning">
          Model not loaded. Train with <code>notebooks/train_model.ipynb</code> and place{" "}
          <code>ml/model.h5</code> before analyzing.
        </div>
      )}

      <div className="dashboard-grid">
        <section className="card upload-section">
          <h2>Upload image</h2>
          <ImageUpload onFileSelect={setFile} disabled={loading} />
          <button
            type="button"
            className="btn-primary"
            onClick={handleAnalyze}
            disabled={!file || loading || !modelReady}
          >
            {loading ? "Analyzing…" : "Analyze"}
          </button>
          {error && <p className="form-error">{error}</p>}
        </section>

        <section className="card">
          <h2>Result</h2>
          <ResultPanel result={result} loading={loading} />
        </section>
      </div>

      <section className="card stats-section">
        <h2>Statistics</h2>
        <div className="stat-pills">
          <span className="pill">Total scans: {history.length}</span>
          <span className="pill healthy">
            Healthy: {history.filter((h) => h.is_healthy).length}
          </span>
          <span className="pill diseased">
            Diseased: {history.filter((h) => !h.is_healthy).length}
          </span>
        </div>
        <StatsChart history={history} />
      </section>
    </div>
  );
}
