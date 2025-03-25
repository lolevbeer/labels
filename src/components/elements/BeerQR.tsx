"use client";

import React, { useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface BeerQRProps {
  variant: string;
  textColor?: string;
}

const BeerQR: React.FC<BeerQRProps> = ({ variant, textColor = 'currentColor' }) => {
  return (
    <QRCodeSVG
      value={`https://lolev.beer/beer/${variant}`}
      size={415}
      level="L"
      fgColor={textColor}
      bgColor="transparent"
    />
  );
};

export default BeerQR;