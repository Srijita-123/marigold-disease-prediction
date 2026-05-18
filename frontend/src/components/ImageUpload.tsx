import { useCallback, useState } from "react";
import "./ImageUpload.css";

const ACCEPT = ["image/jpeg", "image/png", "image/jpg"];

interface Props {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export default function ImageUpload({ onFileSelect, disabled }: Props) {
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validate = (file: File): string | null => {
    if (!ACCEPT.includes(file.type)) return "Only JPG and PNG images are allowed";
    return null;
  };

  const handleFile = useCallback(
    (file: File) => {
      const err = validate(file);
      if (err) {
        setError(err);
        setPreview(null);
        return;
      }
      setError(null);
      setPreview(URL.createObjectURL(file));
      onFileSelect(file);
    },
    [onFileSelect]
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (disabled) return;
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="upload-wrap">
      <label
        className={`dropzone ${dragOver ? "drag-over" : ""} ${disabled ? "disabled" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
      >
        <input
          type="file"
          accept=".jpg,.jpeg,.png"
          onChange={onChange}
          disabled={disabled}
          hidden
        />
        {preview ? (
          <img src={preview} alt="Preview" className="preview" />
        ) : (
          <div className="dropzone-content">
            <span className="upload-icon">📷</span>
            <p>Drag & drop a marigold image here</p>
            <span className="hint">JPG or PNG only</span>
          </div>
        )}
      </label>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
