
import React, { useState, useRef } from 'react';
import { geminiService } from '../services/geminiService';

const ImageEditor: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMimeType(file.type);
      const reader = new FileReader();
      reader.onload = () => {
        setOriginalImage(reader.result as string);
        setEditedImage(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!originalImage || !prompt) return;

    setIsProcessing(true);
    setError(null);
    try {
      // Extract base64 part
      const base64Data = originalImage.split(',')[1];
      const result = await geminiService.editImage(base64Data, mimeType, prompt);
      if (result) {
        setEditedImage(result);
      } else {
        setError("Could not generate edited image. Please try a different prompt.");
      }
    } catch (err: any) {
      console.error(err);
      setError("An error occurred during image processing. Please ensure your API key is valid.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
          Image Alchemist <span className="text-indigo-600">✨</span>
        </h2>
        <p className="text-gray-500 mb-8 text-center">
          Upload a photo and use AI to transform it. Try "Add a retro filter" or "Make it look like a rainy night".
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Original View */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-700">Source Image</h3>
            <div className="aspect-square bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden relative">
              {originalImage ? (
                <img src={originalImage} alt="Original" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-4">
                  <span className="block text-4xl mb-2">📸</span>
                  <p className="text-sm text-gray-400">Click below to upload</p>
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
            >
              {originalImage ? 'Change Image' : 'Choose File'}
            </button>
          </div>

          {/* Result View */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-700">Magical Result</h3>
            <div className="aspect-square bg-indigo-50 rounded-2xl border-2 border-indigo-100 flex items-center justify-center overflow-hidden relative">
              {editedImage ? (
                <img src={editedImage} alt="Edited" className="w-full h-full object-cover" />
              ) : isProcessing ? (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                  <p className="text-indigo-600 font-medium">Alchemizing...</p>
                </div>
              ) : (
                <div className="text-center p-4">
                  <span className="block text-4xl mb-2 opacity-30">✨</span>
                  <p className="text-sm text-gray-400">Result will appear here</p>
                </div>
              )}
            </div>
            <button
              disabled={!editedImage}
              onClick={() => {
                const link = document.createElement('a');
                link.href = editedImage!;
                link.download = 'edited_image.png';
                link.click();
              }}
              className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors disabled:opacity-50"
            >
              Download Result
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-bold text-gray-700">Transformation Prompt</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder='e.g., "Add a cyberpunk neon effect"'
              className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-indigo-500 outline-none transition-colors"
            />
            <button
              onClick={handleEdit}
              disabled={!originalImage || !prompt || isProcessing}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Generate
            </button>
          </div>
          {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;
