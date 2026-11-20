import React, { FC, useState } from 'react';
import { ImageProductType } from '@/types/types';

type Props = {
    productName: string;
    productImages: ImageProductType[];
};

const ProductGallery: FC<Props> = ({ productName, productImages }) => {
    const [activeImage, setActiveImage] = useState(0);
    return (
        <div className="min-w-0">
            <div className="group relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-[#E2E6ED] bg-[#F1F3F7] p-6 sm:p-10 lg:p-12">
                <img
                    src={productImages[activeImage].image}
                    alt={productName}
                    className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
            </div>

            {/* Thumbnails */}
            <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                {productImages.map((image, index) => (
                    <button
                        key={`${image.id}-${index}`}
                        type="button"
                        onClick={() => setActiveImage(index)}
                        aria-label={`Lihat gambar ${index + 1}`}
                        aria-pressed={activeImage === index}
                        className={`flex aspect-square w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 bg-[#F1F3F7] p-2 transition-all sm:w-24 ${
                            activeImage === index
                                ? 'border-[#203452]'
                                : 'border-[#E2E6ED] hover:border-[#526B91]'
                        }`}
                    >
                        <img
                            src={image.image}
                            alt=""
                            className="h-full w-full object-contain"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ProductGallery;
