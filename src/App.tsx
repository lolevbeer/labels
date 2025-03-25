import React from 'react'
import { Label } from './components/ui/label'
import { Sketch } from '@uiw/react-color'

function App() {
  const [beerDetails, setBeerDetails] = React.useState({
    name: "",
    style: "",
    abv: "0",
    notes: "",
    hops: "",
    temperature: "0",
    upc: "",
    variant: "",
  })

  const [labelColors, setLabelColors] = React.useState({
    primary: { c: 0, m: 0, y: 0, k: 0 },
    secondary: { c: 0, m: 0, y: 0, k: 10 },
    black: { c: 0, m: 0, y: 0, k: 100 },
  })

  const [showForm] = React.useState(true)
  const [showMargins, setShowMargins] = React.useState(false)
  const [showQR, setShowQR] = React.useState(false)
  const [showBarcode, setShowBarcode] = React.useState(false)
  const [showBleed, setShowBleed] = React.useState(true)
  const [showLagerTriangle, setShowLagerTriangle] = React.useState(true)
  const [showMarlboro, setShowMarlboro] = React.useState(false)
  const [zoom, setZoom] = React.useState(1)
  const [pan, setPan] = React.useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = React.useState(false)
  const previewRef = React.useRef<HTMLDivElement>(null)
  const [openSections, setOpenSections] = React.useState<{
    basic: boolean;
    tasting: boolean;
    customization: boolean;
    advanced: boolean;
  }>({
    basic: true,
    tasting: false,
    customization: false,
    advanced: false
  })
  const [openColorPicker, setOpenColorPicker] = React.useState<"primary" | "secondary" | "black" | null>(null)

  // CMYK to RGB conversion function
  const cmykToRgb = (cmyk: { c: number, m: number, y: number, k: number }) => {
    const { c, m, y, k } = cmyk
    const r = 255 * (1 - c/100) * (1 - k/100)
    const g = 255 * (1 - m/100) * (1 - k/100)
    const b = 255 * (1 - y/100) * (1 - k/100)
    return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`
  }

  // CMYK to Hex conversion function (for URL parameters)
  const cmykToHex = (cmyk: { c: number, m: number, y: number, k: number }) => {
    const rgb = cmykToRgb(cmyk)
    const result = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/.exec(rgb)
    if (!result) return '#000000'
    const r = parseInt(result[1])
    const g = parseInt(result[2])
    const b = parseInt(result[3])
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
  }

  // Hex to CMYK conversion function (for URL parameters)
  const hexToCmyk = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255
    const g = parseInt(hex.slice(3, 5), 16) / 255
    const b = parseInt(hex.slice(5, 7), 16) / 255
    
    const k = 1 - Math.max(r, g, b)
    const c = k === 1 ? 0 : ((1 - r - k) / (1 - k)) * 100
    const m = k === 1 ? 0 : ((1 - g - k) / (1 - k)) * 100
    const y = k === 1 ? 0 : ((1 - b - k) / (1 - k)) * 100
    
    return {
      c: Math.round(c),
      m: Math.round(m),
      y: Math.round(y),
      k: Math.round(k * 100)
    }
  }

  // RGB to CMYK conversion
  const rgbToCmyk = (r: number, g: number, b: number) => {
    const red = r / 255
    const green = g / 255
    const blue = b / 255
    
    const k = 1 - Math.max(red, green, blue)
    const c = k === 1 ? 0 : ((1 - red - k) / (1 - k)) * 100
    const m = k === 1 ? 0 : ((1 - green - k) / (1 - k)) * 100
    const y = k === 1 ? 0 : ((1 - blue - k) / (1 - k)) * 100
    
    return {
      c: Math.round(c),
      m: Math.round(m),
      y: Math.round(y),
      k: Math.round(k * 100)
    }
  }

  // Load configuration from URL parameters
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    
    // Load beer details
    const name = params.get('name');
    const style = params.get('style');
    const abv = params.get('abv');
    const notes = params.get('notes');
    const hops = params.get('hops');
    const temperature = params.get('temperature');
    const upc = params.get('upc');
    const variant = params.get('variant');

    if (name || style || abv || notes || hops || temperature || upc || variant) {
      setBeerDetails({
        name: name || "",
        style: style || "",
        abv: abv || "0",
        notes: notes || "",
        hops: hops || "",
        temperature: temperature || "0",
        upc: upc || "",
        variant: variant || "",
      });
    }

    // Load colors
    const primary = params.get('primary');
    const secondary = params.get('secondary');
    const black = params.get('black');

    if (primary || secondary || black) {
      setLabelColors({
        primary: primary ? hexToCmyk(primary) : { c: 0, m: 0, y: 0, k: 0 },
        secondary: secondary ? hexToCmyk(secondary) : { c: 0, m: 0, y: 0, k: 10 },
        black: black ? hexToCmyk(black) : { c: 0, m: 0, y: 0, k: 100 },
      });
    }

    // Load toggles
    setShowMargins(params.get('margins') === 'true');
    setShowQR(params.get('qr') === 'true');
    setShowBarcode(params.get('barcode') === 'true');
    setShowBleed(params.get('bleed') === 'true');
    setShowLagerTriangle(params.get('lager') === 'true');
    setShowMarlboro(params.get('marlboro') === 'true');
  }, []);

  // Function to generate share URL
  const generateShareUrl = () => {
    const params = new URLSearchParams();
    
    // Add beer details
    Object.entries(beerDetails).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });

    // Add colors
    params.append('primary', cmykToHex(labelColors.primary));
    params.append('secondary', cmykToHex(labelColors.secondary));
    params.append('black', cmykToHex(labelColors.black));

    // Add toggles
    params.append('margins', showMargins.toString());
    params.append('qr', showQR.toString());
    params.append('barcode', showBarcode.toString());
    params.append('bleed', showBleed.toString());
    params.append('lager', showLagerTriangle.toString());
    params.append('marlboro', showMarlboro.toString());

    return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  };

  // Function to copy URL to clipboard
  const handleShare = async () => {
    const url = generateShareUrl();
    try {
      await navigator.clipboard.writeText(url);
      alert('Configuration URL copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy URL:', err);
      alert('Failed to copy URL to clipboard');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setBeerDetails(prev => ({
      ...prev,
      [field]: value
    }));

    // Update variant when name changes
    if (field === 'name') {
      const variant = value.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setBeerDetails(prev => ({
        ...prev,
        variant
      }));
    }
  };

  const handleColorChange = (colorType: "primary" | "secondary" | "black", channel: "c" | "m" | "y" | "k", value: string) => {
    const numValue = Math.max(0, Math.min(100, Number(value) || 0))
    setLabelColors((prev) => ({
      ...prev,
      [colorType]: {
        ...prev[colorType],
        [channel]: numValue
      }
    }))
  }

  // Handle color picker change
  const handleColorPickerChange = (colorType: "primary" | "secondary" | "black", color: { hex: string }) => {
    // Convert hex to RGB
    const r = parseInt(color.hex.slice(1, 3), 16)
    const g = parseInt(color.hex.slice(3, 5), 16)
    const b = parseInt(color.hex.slice(5, 7), 16)
    
    // Convert RGB to CMYK
    const cmyk = rgbToCmyk(r, g, b)
    
    // Update color state
    setLabelColors(prev => ({
      ...prev,
      [colorType]: cmyk
    }))
  }

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => {
      // Create a new object with all sections set to false
      const allClosed = Object.keys(prev).reduce((acc, key) => ({
        ...acc,
        [key]: false
      }), {} as typeof prev);
      
      // Toggle the clicked section (if it was open, it will be closed; if it was closed, it will be opened)
      return {
        ...allClosed,
        [section]: !prev[section]
      };
    });
  }

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3))
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5))
  const handleResetZoom = () => setZoom(1)

  // Handle panning
  const handleMouseDown = () => {
    if (zoom > 1) {
      setIsPanning(true)
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning && zoom > 1) {
      setPan(prev => ({
        x: prev.x + e.movementX,
        y: prev.y + e.movementY
      }))
    }
  }

  const handleMouseUp = () => {
    setIsPanning(false)
  }

  // Reset pan when zoom is 1
  React.useEffect(() => {
    if (zoom === 1) {
      setPan({ x: 0, y: 0 })
    }
  }, [zoom])

  // Handle keyboard shortcuts
  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
          case '=':
          case '+':
            e.preventDefault();
            handleZoomIn();
            break;
          case '-':
            e.preventDefault();
            handleZoomOut();
            break;
          case '0':
            e.preventDefault();
            handleResetZoom();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Handle SVG download
  const handleDownload = () => {
    const svgElement = document.querySelector('#label-svg');
    if (!svgElement) return;

    // Create a clone of the SVG to modify for export
    const clonedSvg = svgElement.cloneNode(true) as SVGElement;
    
    // Remove any transform styles from the export
    const labelGroup = clonedSvg.querySelector('#label');
    if (labelGroup) {
      labelGroup.removeAttribute('style');
    }

    // Remove guides, QR, barcode, and bleed elements
    const elementsToRemove = [
      clonedSvg.querySelector('#guides'),
      clonedSvg.querySelector('#QR'),
      clonedSvg.querySelector('#Barcode'),
      clonedSvg.querySelector('#bleed')
    ];

    elementsToRemove.forEach(element => {
      if (element) {
        element.remove();
      }
    });

    const svgData = new XMLSerializer().serializeToString(clonedSvg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    
    // Create filename from name and variant
    const fileName = [
      beerDetails.name,
      beerDetails.variant
    ]
      .filter(Boolean)
      .join('-')
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || 'label';
    
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `${fileName}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(svgUrl);
  };

  return (
    <div className="container max-w-fit">
      <div className="flex items-start">
        {showForm && (
          <div className="w-96 p-6 bg-gray-100 rounded-lg shadow-md mr-4">
            <div className="space-y-4">
              {/* Tasting Details Section */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('tasting')}
                  className="w-full px-4 py-3 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-gray-900">Tasting Details</h3>
                  <svg
                    className={`w-5 h-5 transform transition-transform ${openSections.tasting ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className={`transition-all duration-300 ease-in-out ${openSections.tasting ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="p-4 space-y-4 bg-white">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="abv" className="block text-sm font-medium text-gray-700 mb-1">
                          ABV
                        </label>
                        <input
                          id="abv"
                          name="abv"
                          value={beerDetails.abv}
                          onChange={(e) => handleInputChange("abv", e.target.value)}
                          placeholder="Enter ABV"
                          type="number"
                          step="0.1"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="temperature" className="block text-sm font-medium text-gray-700 mb-1">
                          Serve At
                        </label>
                        <input
                          id="temperature"
                          name="temperature"
                          value={beerDetails.temperature}
                          onChange={(e) => handleInputChange("temperature", e.target.value)}
                          placeholder="Enter serving temperature"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                        Tasting Notes
                      </label>
                      <textarea
                        id="notes"
                        name="notes"
                        value={beerDetails.notes}
                        onChange={(e) => handleInputChange("notes", e.target.value)}
                        placeholder="Enter tasting notes"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={4}
                      />
                    </div>

                    <div>
                      <label htmlFor="hops" className="block text-sm font-medium text-gray-700 mb-1">
                        Hops
                      </label>
                      <textarea
                        id="hops"
                        name="hops"
                        value={beerDetails.hops}
                        onChange={(e) => handleInputChange("hops", e.target.value)}
                        placeholder="Enter hop varieties"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={4}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* Basic Information Section */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('basic')}
                  className="w-full px-4 py-3 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                  <svg
                    className={`w-5 h-5 transform transition-transform ${openSections.basic ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className={`transition-all duration-300 ease-in-out ${openSections.basic ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="p-4 space-y-4 bg-white">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        value={beerDetails.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Enter beer name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="style" className="block text-sm font-medium text-gray-700 mb-1">
                        Style
                      </label>
                      <input
                        id="style"
                        name="style"
                        value={beerDetails.style}
                        onChange={(e) => handleInputChange("style", e.target.value)}
                        placeholder="Enter beer style"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="variant" className="block text-sm font-medium text-gray-700 mb-1">
                        Variant (auto-generated)
                      </label>
                      <input
                        id="variant"
                        name="variant"
                        value={beerDetails.variant}
                        onChange={(e) => handleInputChange("variant", e.target.value)}
                        placeholder="Auto-generated from name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                        readOnly
                      />
                    </div>

                    <div>
                      <label htmlFor="upc" className="block text-sm font-medium text-gray-700 mb-1">
                        UPC
                      </label>
                      <input
                        id="upc"
                        name="upc"
                        value={beerDetails.upc}
                        onChange={(e) => handleInputChange("upc", e.target.value)}
                        placeholder="Enter UPC"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>


              {/* Label Customization Section */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('customization')}
                  className="w-full px-4 py-3 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-gray-900">Label Customization</h3>
                  <svg
                    className={`w-5 h-5 transform transition-transform ${openSections.customization ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className={`transition-all duration-300 ease-in-out ${openSections.customization ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="p-4 space-y-4 bg-white">
                    <div>
                      <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700 mb-1">
                        Background (CMYK)
                      </label>
                      <div className="flex items-center space-x-4">
                        <div 
                          className="w-10 h-9 rounded-md cursor-pointer border border-gray-300"
                          style={{ backgroundColor: cmykToRgb(labelColors.primary), marginTop: '24px' }}
                          onClick={() => setOpenColorPicker(openColorPicker === "primary" ? null : "primary")}
                        />
                        <div className="flex space-x-1">
                          <div>
                            <label className="text-xs text-gray-500">C</label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={labelColors.primary.c}
                              disabled
                              className="w-16 px-2 py-1 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-500">M</label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={labelColors.primary.m}
                              disabled
                              className="w-16 px-2 py-1 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-500">Y</label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={labelColors.primary.y}
                              disabled
                              className="w-16 px-2 py-1 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-500">K</label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={labelColors.primary.k}
                              disabled
                              className="w-16 px-2 py-1 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                            />
                          </div>
                        </div>
                        {openColorPicker === "primary" && (
                          <div className="absolute z-10 mt-2">
                            <div 
                              className="fixed inset-0" 
                              onClick={() => setOpenColorPicker(null)}
                            />
                            <div className="relative">
                              <Sketch
                                color={cmykToHex(labelColors.primary)}
                                onChange={(color) => handleColorPickerChange("primary", color)}
                                style={{ width: '300px' }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="secondaryColor" className="block text-sm font-medium text-gray-700 mb-1">
                        Secondary Background (CMYK)
                      </label>
                      <div className="flex items-center space-x-4">
                        <div 
                          className="w-10 h-9 rounded-md cursor-pointer border border-gray-300"
                          style={{ backgroundColor: cmykToRgb(labelColors.secondary), marginTop: '24px' }}
                          onClick={() => setOpenColorPicker(openColorPicker === "secondary" ? null : "secondary")}
                        />
                        <div className="flex space-x-1">
                          <div>
                            <label className="text-xs text-gray-500">C</label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={labelColors.secondary.c}
                              disabled
                              className="w-16 px-2 py-1 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-500">M</label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={labelColors.secondary.m}
                              disabled
                              className="w-16 px-2 py-1 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-500">Y</label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={labelColors.secondary.y}
                              disabled
                              className="w-16 px-2 py-1 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-500">K</label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={labelColors.secondary.k}
                              disabled
                              className="w-16 px-2 py-1 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                            />
                          </div>
                        </div>
                        {openColorPicker === "secondary" && (
                          <div className="absolute z-10 mt-2">
                            <div 
                              className="fixed inset-0" 
                              onClick={() => setOpenColorPicker(null)}
                            />
                            <div className="relative">
                              <Sketch
                                color={cmykToHex(labelColors.secondary)}
                                onChange={(color) => handleColorPickerChange("secondary", color)}
                                style={{ width: '300px' }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="blackColor" className="block text-sm font-medium text-gray-700 mb-1">
                        Text Color (CMYK)
                      </label>
                      <div className="flex items-center space-x-4">
                        <div 
                          className="w-10 h-9 rounded-md cursor-pointer border border-gray-300"
                          style={{ backgroundColor: cmykToRgb(labelColors.black), marginTop: '24px' }}
                          onClick={() => setOpenColorPicker(openColorPicker === "black" ? null : "black")}
                        />
                        <div className="flex space-x-1">
                          <div>
                            <label className="text-xs text-gray-500">C</label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={labelColors.black.c}
                              disabled
                              className="w-16 px-2 py-1 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-500">M</label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={labelColors.black.m}
                              disabled
                              className="w-16 px-2 py-1 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-500">Y</label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={labelColors.black.y}
                              disabled
                              className="w-16 px-2 py-1 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-500">K</label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={labelColors.black.k}
                              disabled
                              className="w-16 px-2 py-1 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                            />
                          </div>
                        </div>
                        {openColorPicker === "black" && (
                          <div className="absolute z-10 mt-2">
                            <div 
                              className="fixed inset-0" 
                              onClick={() => setOpenColorPicker(null)}
                            />
                            <div className="relative">
                              <Sketch
                                color={cmykToHex(labelColors.black)}
                                onChange={(color) => handleColorPickerChange("black", color)}
                                style={{ width: '300px' }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <label htmlFor="showLagerTriangle" className="text-sm font-medium text-gray-700">
                        Lager Triangle
                      </label>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={showLagerTriangle}
                          onChange={(e) => {
                            setShowLagerTriangle(e.target.checked);
                            if (e.target.checked) {
                              setShowMarlboro(false);
                            }
                          }}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <label htmlFor="showMarlboro" className="text-sm font-medium text-gray-700">
                        Marlboro
                      </label>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={showMarlboro}
                          onChange={(e) => {
                            setShowMarlboro(e.target.checked);
                            if (e.target.checked) {
                              setShowLagerTriangle(false);
                            }
                          }}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Advanced Section */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection('advanced')}
                  className="w-full px-4 py-3 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-gray-900">Advanced</h3>
                  <svg
                    className={`w-5 h-5 transform transition-transform ${openSections.advanced ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className={`transition-all duration-300 ease-in-out ${openSections.advanced ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="p-4 space-y-4 bg-white">
                    <div className="flex items-center justify-between">
                      <label htmlFor="showMargins" className="text-sm font-medium text-gray-700">
                        Show Guides
                      </label>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={showMargins}
                          onChange={(e) => setShowMargins(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <label htmlFor="showBleed" className="text-sm font-medium text-gray-700">
                        Show Bleed
                      </label>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={showBleed}
                          onChange={(e) => setShowBleed(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="flex-grow relative">
          <div className="sticky top-4 bg-white rounded-lg shadow-md overflow-hidden">
            {/* Label Preview */}
            <div 
              ref={previewRef}
              className={`overflow-hidden cursor-${zoom > 1 ? (isPanning ? 'grabbing' : 'grab') : 'default'}`}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <div 
                style={{ 
                  transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
                  transformOrigin: 'top left',
                  transition: isPanning ? 'none' : 'transform 0.2s ease-out'
                }}
              >
                <Label 
                  name={beerDetails.name}
                  style={beerDetails.style}
                  abv={beerDetails.abv}
                  notes={beerDetails.notes}
                  hops={beerDetails.hops}
                  temperature={beerDetails.temperature}
                  upc={beerDetails.upc}
                  primaryColor={cmykToRgb(labelColors.primary)}
                  secondaryColor={cmykToRgb(labelColors.secondary)}
                  textColor={cmykToRgb(labelColors.black)}
                  showMargins={showMargins}
                  showQR={showQR && !beerDetails.variant}
                  showBarcode={showBarcode && !(/^\d{12}$/.test(beerDetails.upc))}
                  showBleed={showBleed}
                  showLagerTriangle={showLagerTriangle}
                  showMarlboro={showMarlboro}
                  warningFontSize={60}
                />
              </div>
            </div>

            {/* Toolbar */}
            <div className="border-t border-gray-200 bg-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleZoomOut}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Zoom Out (Ctrl -)"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="px-2">{(zoom * 100).toFixed(0)}%</span>
                <button
                  onClick={handleZoomIn}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Zoom In (Ctrl +)"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
                <button
                  onClick={handleResetZoom}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Reset Zoom (Ctrl 0)"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleShare}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  title="Share Configuration"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  <span>Copy</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                  title="Download SVG"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Download SVG</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
