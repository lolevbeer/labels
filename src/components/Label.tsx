import React from 'react';
import { logo } from './icons/logo';
interface LabelProps {
  name: string;
  style: string;
  abv: string;
  notes?: string;
  hops?: string;
  temp: string;
  primaryColor: string;
  secondaryColor: string;
  blackColor: string;
  showMargins: boolean;
  showQR: boolean;
  showBarcode: boolean;
  showBleed: boolean;
  showLagerTriangle: boolean;
  showMarlboro: boolean;
  warningFontSize: number;
  variant?: string;
}

interface TextSection {
  title?: string;
  content: string;
  isBold?: boolean;
}

const wrapText = (text: string, maxWidth: number, fontSize: number, indent: number = 0): string[] => {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = words[0];
  let remainingWidth = maxWidth - indent;

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = currentLine.length * fontSize * 0.6;
    if (width + (word.length * fontSize * 0.6) < remainingWidth) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
      remainingWidth = maxWidth;
    }
  }
  lines.push(currentLine);
  return lines;
};

const LINE_HEIGHT = 100;

export const Label: React.FC<LabelProps> = ({
  name,
  style,
  abv,
  notes = "",
  hops = "",
  temp,
  primaryColor,
  secondaryColor,
  blackColor,
  showMargins,
  showQR,
  showBarcode,
  showBleed,
  showLagerTriangle,
  showMarlboro,
  warningFontSize = 60,
  variant
}) => {
  // Check for missing required fields
  const missingFields = [];
  if (!name) missingFields.push("Name");
  if (!style) missingFields.push("Style");
  if (!abv) missingFields.push("ABV");
  if (!temp) missingFields.push("Temperature");

  // If any required fields are missing, show a message
  if (missingFields.length > 0) {
    return (
      <div style={{ backgroundColor: primaryColor, padding: '20px', textAlign: 'center' }}>
        <p style={{ color: blackColor, fontFamily: 'Poppins', fontSize: '16px' }}>
          Please fill in the following required fields: {missingFields.join(", ")}
        </p>
      </div>
    );
  }

  const notesLines = wrapText(notes, 1000, 80, 0);
  
  // Split hops on newlines and wrap each line separately
  const hopsLines = hops
    .split('\n')
    .filter(line => line.trim()) // Remove empty lines
    .flatMap(line => wrapText(line, 600, 80, 0));

  const warningText = "(1) According to the Surgeon General, women should not drink alcoholic beverages during pregnancy because of the risk of birth defects. (2) Consumption of alcoholic beverages impairs your ability to drive a car or operate machinery, and may cause health problems.";
  
  // Calculate the width of "GOVERNMENT WARNING:" text
  const govWarningWidth = "GOVERNMENT WARNING:".length * warningFontSize * 0.6;
  const firstLineX = 2900 + govWarningWidth + 80;
  const warningLines = wrapText(warningText, 2800, warningFontSize, govWarningWidth + 10);

  // Calculate positions for text elements
  const getYPosition = (index: number) => 307 + (index * LINE_HEIGHT);

  // Define text sections
  const textSections: TextSection[] = [
    { title: "1 PINT", content: "", isBold: true },
    { content: `${abv}% alc by vol`, isBold: false },
    { content: "", isBold: false },
  ];

  // Add tasting notes if present
  if (notes.trim()) {
    textSections.push(
      { title: "TASTING NOTES", content: "", isBold: true },
      ...notesLines.map(line => ({ content: line, isBold: false })),
      { content: "", isBold: false }
    );
  }

  // Add hops if present
  if (hops.trim()) {
    textSections.push(
      { title: "HOPS", content: "", isBold: true },
      ...hopsLines.map(line => ({ content: line, isBold: false })),
      { content: "", isBold: false }
    );
  }

  // Add serve at temperature
  textSections.push(
    { title: "SERVE AT", content: "", isBold: true },
    { content: `${temp}°F`, isBold: false }
  );

  // Render text sections
  const renderTextSection = (section: TextSection, index: number) => {
    const y = getYPosition(index);
    const fontFamily = section.isBold ? "Poppins-Bold, Poppins" : "Poppins-Medium, Poppins";
    const fontWeight = section.isBold ? "bold" : "400";

    if (section.title) {
      return (
        <tspan key={`title-${index}`} x="250" y={y} fontFamily={fontFamily} fontWeight={fontWeight}>
          {section.title}
        </tspan>
      );
    }

    if (section.content) {
      return (
        <tspan key={`content-${index}`} x="250" y={y} fontFamily={fontFamily} fontWeight={fontWeight}>
          {section.content}
        </tspan>
      );
    }

    return <tspan key={`empty-${index}`} x="250" y={y}></tspan>;
  };

  return (
    <div style={{ backgroundColor: primaryColor }}>
      <svg id="label-svg" width="800px" height="504px" viewBox="0 0 4876 3076" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
        <g id="label" letterSpacing="none" fill="none" fillRule="evenodd">
          {/* Add background rectangle */}
          <rect width="4876" height="3076" fill={primaryColor} />
          <g id="optionalBackground" fill={secondaryColor}>
            {showLagerTriangle && (
              <polygon id="Lager-Triangle" points="4876 0 4876 3076 0 3076" />
            )}
            {showMarlboro && (
              <polygon id="Marlboro" points="0 0 4876 0 4876 3078 2441.94651 895.985939 0 3078" />
            )}
          </g>
          <g id="static" transform="translate(-2.000000, -3.000000)" fill={blackColor}>
            <text id="socialAddress" transform="translate(3855.295002, 1560.150088) rotate(-90.000000) translate(-3855.295002, -1560.150088) " fontFamily="Poppins" fontSize="125" fontWeight="bold">
              <tspan x="2580" y="1700">@lolevbeer</tspan>
              <tspan x="3470" y="1700" fontFamily="Poppins" fontWeight="500">Butler Street, Pittsburgh, PA</tspan>
            </text>
            <text id="warning" transform="translate(4142, 1550) rotate(-90.000000) translate(-4142.783559, -1566.616641) " fontFamily="Poppins" fontSize={warningFontSize} fontWeight="bold">
              <tspan id="government-warning" x="2862" y="1520">GOVERNMENT WARNING:</tspan>
              {warningLines.map((line, index) => (
                <tspan key={index} x={index === 0 ? firstLineX : "2864"} y={1520 + (index * 75)} fontFamily="Poppins" fontWeight="300">
                  {line}
                </tspan>
              ))}
            </text>
            <text id="StoreCold" fillRule="nonzero" transform="translate(4558.066583, 898.985939) rotate(-90.000000) translate(-4558.066583, -898.985939) " fontFamily="Poppins-Bold, Poppins" fontSize="175" letterSpacing="10">
              <tspan x="4040" y="970">STORE COLD</tspan>
            </text>
            <g id="logo" transform="translate(2016, 1100)" fill={blackColor} fillRule="nonzero">
              <g>
                {logo}
              </g>
            </g>
            <text id="LolevBeer" fontFamily="Poppins" fontSize="230" fontWeight="bold" letterSpacing="30" textAnchor="middle">
              <tspan x="2438" y="415">LOLEV BEER</tspan>
            </text>
          </g>
          {showBarcode && (
            <rect id="Barcode" stroke={blackColor} strokeDasharray="30" x="4345" y="2005" width="280" height="819" />
          )}
          {showQR && (
            <rect id="QR" stroke={blackColor} strokeDasharray="30" x="250" y="2410" width="415" height="415" />
          )}
          <text id="nameStyle" fontFamily="Poppins" fontSize="150" fontWeight="bold" letterSpacing="18" fill={blackColor} textAnchor="middle">
            <tspan x="2438" y="2606">{name.toUpperCase()}</tspan>
            <tspan x="2438" y="2822" fontFamily="Poppins" fontSize="130" fontWeight="500" letterSpacing="12">{style.toUpperCase()}</tspan>
          </text>
          <text id="abvNotesHopsTemp" fontFamily="Poppins" fontSize="80" fontWeight="bold" fill={blackColor}>
            {textSections.map((section, index) => renderTextSection(section, index))}
          </text>
          {showBleed && (
            <g id="bleed" stroke="#FF0000" strokeDasharray="20" strokeWidth="2">
              <line x1="0" y1="3036" x2="4876" y2="3036" id="bottomBleed" />
              <line x1="4836" y1="0" x2="4836" y2="3076" id="rightBleed" />
              <line x1="0" y1="40" x2="4876" y2="40" id="TopMargin" />
              <line x1="40" y1="0" x2="40" y2="3076" id="LeftMargin" />
            </g>
          )}
          {showMargins && (
            <g id="guides" stroke="#00FFFF" strokeDasharray="80" strokeWidth="2">
              <line x1="250" y1="0" x2="250" y2="3076" id="left" />
              <line x1="0" y1="250" x2="4876" y2="250" id="top" />
              <line x1="0" y1="1538" x2="4876" y2="1538" id="middle" />
              <line x1="2438" y1="0" x2="2438" y2="3076" id="center" />
              <line x1="0" y1="2826" x2="4876" y2="2826" id="bottom" />
              <line x1="4626" y1="0" x2="4626" y2="3076" id="right" />
            </g>
          )}
        </g>
      </svg>
    </div>
  );
}; 