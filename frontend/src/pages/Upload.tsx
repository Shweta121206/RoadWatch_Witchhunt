import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePotholeData } from "../contexts/PotholeDataContext";

const readJsonFile = (file: File) => new Promise<unknown>((resolve, reject) => {
  const reader = new FileReader();

  reader.onload = () => {
    try {
      resolve(JSON.parse(String(reader.result)));
    } catch {
      reject(new Error("Choose a valid JSON file."));
    }
  };

  reader.onerror = () => reject(new Error("Unable to read the JSON file."));
  reader.readAsText(file);
});

export default function Upload() {
  const navigate = useNavigate();
  const { isDatasetUploaded, potholes, uploadDataset, resetDataset } = usePotholeData();
  const [images, setImages] = useState<File[]>([]);
  const [jsonFile, setJsonFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleImageChange = (files: FileList | null) => {
    const nextImages = Array.from(files ?? []);
    setImages(nextImages.slice(0, 200));
    setMessage("");
    setError(nextImages.length > 200 ? "Only the first 200 images will be used." : "");
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage("");
    setError("");
    setIsUploading(true);

    try {
      if (!jsonFile) throw new Error("Upload one JSON file with latitude and longitude values.");

      const coordinates = await readJsonFile(jsonFile);
      uploadDataset({ coordinates, images });
      setMessage("Upload complete. The live map and pothole details are now active.");
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="upload-page">
      <div className="page-title-row">
        <div>
          <span className="eyebrow dark">Dataset</span>
          <h1>Upload</h1>
          <p>Upload pothole images and one JSON coordinate file to activate the platform data.</p>
        </div>
        <strong>{isDatasetUploaded ? `${potholes.length} detections active` : "No detections active"}</strong>
      </div>

      <section className="upload-grid">
        <form className="form-section upload-form" onSubmit={handleSubmit}>
          <h2>Detection files</h2>

          <label className="upload-dropzone">
            <span className="label-text">Images</span>
            <span className="label-description">Select up to 200 pothole images.</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(event) => handleImageChange(event.target.files)}
            />
            <strong>{images.length ? `${images.length} images selected` : "Choose images"}</strong>
          </label>

          <label className="upload-dropzone">
            <span className="label-text">JSON coordinates</span>
            <span className="label-description">Use one .json file containing latitude and longitude values.</span>
            <input
              type="file"
              accept="application/json,.json"
              onChange={(event) => setJsonFile(event.target.files?.[0] ?? null)}
            />
            <strong>{jsonFile ? jsonFile.name : "Choose JSON file"}</strong>
          </label>

          {error && <div className="input-error">{error}</div>}
          {message && <div className="form-success-box">{message}</div>}

          <div className="upload-actions">
            <button className="primary-button compact" disabled={isUploading} type="submit">
              {isUploading ? "Uploading..." : "Upload dataset"}
            </button>
            <button className="secondary-button" type="button" onClick={resetDataset}>
              Clear data
            </button>
            <button className="secondary-button" type="button" onClick={() => navigate("/")}>
              Open live map
            </button>
          </div>
        </form>

        <aside className="info-card upload-status-card">
          <h3>Activation status</h3>
          <div className="upload-status-list">
            <div>
              <span>Images</span>
              <strong>{images.length}/200</strong>
            </div>
            <div>
              <span>JSON file</span>
              <strong>{jsonFile ? "Ready" : "Missing"}</strong>
            </div>
            <div>
              <span>Platform data</span>
              <strong>{isDatasetUploaded ? "Visible" : "Hidden"}</strong>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
