import * as React from "react";
import { cn } from "../../../lib/utils";
import { Paperclip, X, File, Image as ImageIcon } from "lucide-react";

interface InputProps extends React.ComponentProps<"input"> {
  allowAttachment?: boolean;
  onAttachmentChange?: (files: File[]) => void;
  maxFiles?: number;
  acceptedFileTypes?: string;
  showPreview?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type, 
    allowAttachment = false,
    onAttachmentChange,
    maxFiles = 5,
    acceptedFileTypes = "image/*,application/pdf,.doc,.docx,.txt",
    showPreview = true,
    ...props 
  }, ref) => {
    const [attachedFiles, setAttachedFiles] = React.useState<File[]>([]);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleAttachmentClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Resetar o input para permitir selecionar o mesmo arquivo novamente
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
        fileInputRef.current.click();
      }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      
      if (files.length === 0) return;

      const totalFiles = attachedFiles.length + files.length;
      if (totalFiles > maxFiles) {
        alert(`Você pode anexar no máximo ${maxFiles} arquivo(s)`);
        // Limpar o input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      const newFiles = [...attachedFiles, ...files];
      setAttachedFiles(newFiles);
      onAttachmentChange?.(newFiles);
      
      // Limpar o input após processar
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    const removeFile = (index: number, e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      
      const newFiles = attachedFiles.filter((_, i) => i !== index);
      setAttachedFiles(newFiles);
      onAttachmentChange?.(newFiles);
    };

    const formatFileSize = (bytes: number) => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    const getFileIcon = (file: File) => {
      if (file.type.startsWith('image/')) {
        return <ImageIcon className="w-4 h-4" />;
      }
      return <File className="w-4 h-4" />;
    };

    const getFilePreview = (file: File) => {
      if (file.type.startsWith('image/')) {
        return URL.createObjectURL(file);
      }
      return null;
    };

    return (
      <div className="w-full">
        <div className="relative flex items-center">
          <input
            type={type}
            className={cn(
              "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
              allowAttachment && "pr-10",
              className,
            )}
            ref={ref}
            {...props}
          />
          
          {allowAttachment && (
            <>
              <button
                type="button"
                onClick={handleAttachmentClick}
                className="absolute right-2 p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                title="Anexar arquivo"
                aria-label="Anexar arquivo"
              >
                <Paperclip className="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
              </button>
              
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={acceptedFileTypes}
                onChange={handleFileChange}
                className="hidden"
                style={{ display: 'none' }}
                tabIndex={-1}
              />
            </>
          )}
        </div>

        {/* Preview dos arquivos anexados */}
        {showPreview && attachedFiles.length > 0 && (
          <div className="mt-2 space-y-2">
            {attachedFiles.map((file, index) => {
              const preview = getFilePreview(file);
              
              return (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center gap-2 p-2 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
                >
                  {preview ? (
                    <img
                      src={preview}
                      alt={file.name}
                      className="w-10 h-10 rounded object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      {getFileIcon(file)}
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate text-gray-900 dark:text-gray-100">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  
                  <button
                    type="button"
                    onClick={(e) => removeFile(index, e)}
                    className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                    title="Remover arquivo"
                    aria-label={`Remover ${file.name}`}
                  >
                    <X className="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-red-500" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Contador de arquivos */}
        {allowAttachment && attachedFiles.length > 0 && (
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {attachedFiles.length} de {maxFiles} arquivo(s) anexado(s)
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input };