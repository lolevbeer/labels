"use client";

import React, { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';

const Barcode: React.FC = () => {
  const { value: upc } = useField<string>({ path: 'upc' });
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
        lineColor: "currentColor"
      });
    }
  }, [upc]);

  const handleDownload = () => {
    if (barcodeRef.current) {
      // Temporarily set the color to black for download
      barcodeRef.current.querySelectorAll('rect, text').forEach(el => {
        el.setAttribute('fill', 'black');
      });

      const svgData = new XMLSerializer().serializeToString(barcodeRef.current);
      const svgBlob = new Blob([svgData], {type: "image/svg+xml;charset=utf-8"});
      const svgUrl = URL.createObjectURL(svgBlob);
      const downloadLink = document.createElement("a");
      downloadLink.href = svgUrl;
      downloadLink.download = `barcode_${upc}.svg`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      // Reset the color back to currentColor
      barcodeRef.current.querySelectorAll('rect, text').forEach(el => {
        el.setAttribute('fill', 'currentColor');
      });
    }
  };

  if (!upc) {
    return <div><i>No UPC provided</i></div>;
  }

  return (
    <span>
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
      ></svg>
      <div>
        <button className="btn btn--style-primary" onClick={handleDownload}>Download Barcode</button>
      </div>
    </span>
  );
};

export default Barcode;
