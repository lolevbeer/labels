"use client";

import React, { useEffect, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';

const BeerQR: React.FC = () => {
  const qrRef = useRef<HTMLDivElement>(null);
  const qrCode = useRef<QRCodeStyling | null>(null);
  const variant = 'variant';
  useEffect(() => {
    if (variant) {
      const qrValue = `https://lolev.beer/beer/${variant}`;
      
      qrCode.current = new QRCodeStyling({
        width: 50,
        height: 50,
        type: 'svg',
        data: qrValue,
        image: '',
        dotsOptions: {
          color: 'currentColor',
          type: 'dots'
        },
        backgroundOptions: {
          color: 'transparent',
        },
        imageOptions: {
          crossOrigin: 'anonymous',
          imageSize: 0.4,
          margin: 0
        },
        qrOptions: {
          typeNumber: 0,
          errorCorrectionLevel: 'L'
        },
        cornersSquareOptions: {
          type: 'dot',
        }
      });

      if (qrRef.current) {
        qrRef.current.innerHTML = '';
        qrCode.current.append(qrRef.current);
      }
    }
  }, [variant]);

  const handleDownload = () => {
    if (qrCode.current) {
      qrCode.current.download({ extension: 'svg' });
    }
  };

  return (
    <span>
      <div ref={qrRef} className="beer-qr-code" />
      <button className='btn btn--style-primary' onClick={handleDownload}>Download QR Code</button>
    </span>
  );
};

export default BeerQR;
