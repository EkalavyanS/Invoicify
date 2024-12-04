import React, { useRef } from 'react';
import { Upload } from 'lucide-react';
import { Button } from './ui/button';

interface LogoUploaderProps {
  logo: string | null;
  setLogo: (logo: string | null) => void;
}

export const LogoUploader: React.FC<LogoUploaderProps> = ({ logo, setLogo }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center">
      {logo ? (
        <img src={logo} alt="Company Logo" className="w-32 h-32 object-contain mb-2" />
      ) : (
        <div className="w-32 h-32 border-2 border-dashed border-gray-300 flex items-center justify-center mb-2">
          <Upload className="text-gray-400" />
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        onChange={handleLogoUpload}
        className="hidden"
        ref={fileInputRef}
      />
      <Button variant="outline" className="cursor-pointer" onClick={handleButtonClick}>
        {logo ? 'Change Logo' : 'Upload Logo'}
      </Button>
    </div>
  );
};