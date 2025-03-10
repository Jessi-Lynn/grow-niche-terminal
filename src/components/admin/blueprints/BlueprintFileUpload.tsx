
import { Upload } from 'lucide-react';

interface BlueprintFileUploadProps {
  file: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const BlueprintFileUpload = ({ file, onFileChange }: BlueprintFileUploadProps) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-terminal-white mb-4">Blueprint File</h2>
      <div className="border-2 border-dashed border-terminal-red/30 rounded-md p-6 text-center">
        <label className="cursor-pointer block w-full">
          <input 
            type="file" 
            accept=".json"
            className="hidden" 
            onChange={onFileChange}
          />
          
          {!file ? (
            <div className="space-y-2">
              <Upload className="mx-auto h-12 w-12 text-terminal-red" />
              <p className="text-terminal-white">
                Drag & drop your JSON file here or <span className="text-terminal-red underline">browse</span>
              </p>
              <p className="text-sm text-terminal-white/60">
                Accepts .json files only
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-terminal-white">
                <span className="font-medium">{file.name}</span> ({(file.size / 1024).toFixed(2)} KB)
              </p>
              <p className="text-sm text-terminal-red underline cursor-pointer">
                Change file
              </p>
            </div>
          )}
        </label>
      </div>
    </div>
  );
};

export default BlueprintFileUpload;
