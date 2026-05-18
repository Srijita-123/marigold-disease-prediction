import { useEffect, useState } from "react";
import { fetchHistory } from "../api";
import type { HistoryEntry } from "../types";
import "./History.css";

export default function History() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHistory()
      .then(setEntries)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="history-status">Loading history…</p>;
  if (error) return <p className="history-status error">{error}</p>;
  if (entries.length === 0) {
    return (
      <div className="history-empty card">
        <p>No predictions yet. Go to Detect and analyze a marigold image.</p>
      </div>
    );
  }

  return (
    <div className="history-page">
      <h2>Prediction history</h2>
      <ul className="history-list">
        {entries.map((entry) => (
          <li key={entry.id} className="history-item card">
            <img
              src={`/${entry.thumbnail}`}
              alt={entry.prediction}
              className="thumb"
            />
            <div className="history-meta">
              <span
                className={`status ${entry.is_healthy ? "healthy" : "diseased"}`}
              >
                {entry.is_healthy ? "Healthy" : "Diseased"}
              </span>
              <h3>{entry.prediction}</h3>
              {entry.confidence && (
                <p className="conf">Confidence: {entry.confidence}</p>
              )}
              {entry.details && <p className="details">{entry.details}</p>}
              <time dateTime={entry.timestamp}>
                {new Date(entry.timestamp).toLocaleString()}
              </time>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
