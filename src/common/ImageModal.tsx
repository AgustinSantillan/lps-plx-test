import { X } from 'lucide-react';

interface ImageModalProps {
    imageUrl: string;
    onClose: () => void;
}

export function ImageModal({ imageUrl, onClose }: ImageModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75">
            <div className="relative max-w-4xl w-full">
                <button
                    onClick={onClose}
                    className="absolute -top-10 right-0 p-2 text-white hover:text-gray-300"
                >
                    <X className="w-6 h-6" />
                </button>
                <img
                    src={imageUrl}
                    alt="Weekly plan attachment"
                    className="w-full h-auto rounded-lg"
                />
            </div>
        </div>
    );
}