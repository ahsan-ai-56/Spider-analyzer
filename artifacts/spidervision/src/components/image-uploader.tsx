import { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Camera, X, Loader2, AlertCircle, ZoomIn } from "lucide-react";

interface ImageUploaderProps {
  onAnalyze: (base64: string) => void;
  isLoading: boolean;
  error?: string | null;
  analyzeLabel?: string;
}

export default function ImageUploader({
  onAnalyze,
  isLoading,
  error,
  analyzeLabel = "Analyze Image",
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
    }
    setCameraActive(false);
  }, [stream]);

  useEffect(() => {
    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, [stream]);

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    stopCamera();
    const b64 = await fileToBase64(file);
    setPreview(b64);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const startCamera = async () => {
    setCameraError(null);
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      setStream(s);
      setCameraActive(true);
      setPreview(null);
      setTimeout(() => {
        if (videoRef.current) videoRef.current.srcObject = s;
      }, 50);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Camera unavailable";
      if (msg.includes("Permission") || msg.includes("denied")) {
        setCameraError("Camera permission denied. Please allow camera access in your browser settings.");
      } else {
        setCameraError("Could not access camera. Please use file upload instead.");
      }
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    setPreview(dataUrl);
    stopCamera();
  };

  const clearImage = () => {
    setPreview(null);
    stopCamera();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAnalyze = () => {
    if (preview) onAnalyze(preview);
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone / Preview */}
      <div
        className={`relative rounded-2xl border-2 border-dashed transition-all overflow-hidden cursor-pointer ${
          isDragging
            ? "border-green-400 bg-green-50"
            : preview || cameraActive
            ? "border-gray-200 bg-white"
            : "border-gray-200 bg-gray-50 hover:border-green-300 hover:bg-green-50/30"
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        style={{ minHeight: 280 }}
      >
        <AnimatePresence mode="wait">
          {preview ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative"
            >
              <img
                src={preview}
                alt="Preview"
                className="w-full max-h-96 object-contain bg-white"
                style={{ display: "block" }}
              />
              <button
                onClick={(e) => { e.stopPropagation(); clearImage(); }}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-white border border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-200 shadow-sm transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ) : cameraActive ? (
            <motion.div key="camera" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full max-h-96 object-cover bg-gray-100"
              />
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3">
                <button
                  onClick={capturePhoto}
                  className="px-6 py-2.5 rounded-full btn-green font-semibold text-sm shadow-lg"
                >
                  Capture Photo
                </button>
                <button
                  onClick={stopCamera}
                  className="px-6 py-2.5 rounded-full bg-white border border-gray-200 text-gray-700 font-semibold text-sm shadow-sm hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-16 px-6 text-center"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-16 h-16 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center mb-4">
                <Upload className="w-7 h-7 text-green-500" />
              </div>
              <p className="text-gray-700 font-semibold mb-1">Drop image here or click to upload</p>
              <p className="text-gray-400 text-sm">Supports JPG, PNG, WEBP</p>
              {isDragging && (
                <p className="text-green-600 font-medium text-sm mt-2">Release to upload</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <canvas ref={canvasRef} className="hidden" />

      {/* Camera error */}
      <AnimatePresence>
        {cameraError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm"
          >
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-500" />
            <span>{cameraError}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* API error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm"
          >
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-500" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 text-sm font-medium transition-colors shadow-sm"
        >
          <Upload className="w-4 h-4 text-green-500" />
          Upload Image
        </button>
        <button
          onClick={cameraActive ? stopCamera : startCamera}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 text-sm font-medium transition-colors shadow-sm"
        >
          <Camera className="w-4 h-4 text-green-500" />
          {cameraActive ? "Stop Camera" : "Take Photo"}
        </button>
        <motion.button
          onClick={handleAnalyze}
          disabled={!preview || isLoading}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl btn-green font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed ml-auto shadow-sm"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <ZoomIn className="w-4 h-4" />
              {analyzeLabel}
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}
