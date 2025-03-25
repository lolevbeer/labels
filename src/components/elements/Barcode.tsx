"use client";

import React, { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';

interface BarcodeProps {
  upc: string;
  textColor?: string;
}

const Barcode: React.FC<BarcodeProps> = ({ upc, textColor = 'currentColor' }) => {
  const barcodeRef = useRef<SVGSVGElement>(null);

  const isValidUPC = (code: string): boolean => {
    return /^\d{12}$/.test(code) || code === '';
  };

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Poppins&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    if (upc && isValidUPC(upc) && barcodeRef.current) {
      JsBarcode(barcodeRef.current, upc, {
        format: "upc",
        width: 1,
        height: 15,
        textMargin: 0,
        font: "Poppins",
        fontOptions: "normal",
        background: "transparent",
        lineColor: textColor,
        margin: 0
      });
    }
  }, [upc, textColor]);

  return (
    <svg 
      ref={barcodeRef}
      id="barcode"
      jsbarcode-format="upc"
      jsbarcode-value={upc}
      jsbarcode-textmargin="0"
      jsbarcode-fontoptions="normal"
      jsbarcode-background="transparent"
      jsbarcode-font="Poppins"
      jsbarcode-height="15"
      jsbarcode-width="2"
      jsbarcode-linecolor="currentColor"
    />
  );
};

export default Barcode;
