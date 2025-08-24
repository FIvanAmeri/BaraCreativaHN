import React from "react";
import Image from "next/image";

interface CardProps {
  title: string;
  image: string;
  description: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  title,
  image,
  description,
  buttonText,
  onButtonClick,
}) => {
  return (
    <div className="w-full overflow-hidden flex flex-col h-full">
      
      <div className="relative w-full aspect-[16/9]">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>
      <div className="mt-0 px-4 py-3 bg-black bg-opacity-40 backdrop-blur-sm flex-grow">
        <h3 className="text-white text-xl font-semibold mb-1">{title}</h3>
        <p className="text-white text-sm">{description}</p>
        {buttonText && onButtonClick && (
          <button
            className="mt-4 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition duration-300"
            onClick={onButtonClick}
          >
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
};

export default Card;