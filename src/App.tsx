import React from 'react'
import { Label } from './components/Label'

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
    primary: "#FFFFFF",
    secondary: "#EEEEEE",
    black: "#000000",
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
  const [openSections, setOpenSections] = React.useState({
    basic: true,
    tasting: true,
    customization: false,
    advanced: false
  })

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
        primary: primary || "#FFFFFF",
        secondary: secondary || "#EEEEEE",
        black: black || "#000000",
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
    Object.entries(labelColors).forEach(([key, value]) => {
      params.append(key, value);
    });

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setBeerDetails((prev) => {
      // If name is being changed, also update variant
      if (name === 'name') {
        const processedVariant = value
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
          .replace(/\s+/g, '-')          // Replace spaces with hyphens
          .replace(/-+/g, '-')           // Replace multiple hyphens with single hyphen
          .replace(/^-|-$/g, '');        // Remove hyphens from start and end
        return {
          ...prev,
          [name]: value,
          variant: processedVariant
        }
      }
      return { ...prev, [name]: value }
    })
  }

  const handleColorChange = (colorType: "primary" | "secondary" | "black", value: string) => {
    setLabelColors((prev) => ({ ...prev, [colorType]: value }))
  }

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3))
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5))
  const handleResetZoom = () => setZoom(1)

  // Handle panning
  const handleMouseDown = (e: React.MouseEvent) => {
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
                        onChange={handleInputChange}
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
                        onChange={handleInputChange}
                        placeholder="Enter beer style"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="variant" className="block text-sm font-medium text-gray-700 mb-1">
                        Variant
                      </label>
                      <input
                        id="variant"
                        name="variant"
                        value={beerDetails.variant}
                        onChange={handleInputChange}
                        placeholder="Enter variant"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        onChange={handleInputChange}
                        placeholder="Enter UPC"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

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
                    <div>
                      <label htmlFor="abv" className="block text-sm font-medium text-gray-700 mb-1">
                        ABV
                      </label>
                      <input
                        id="abv"
                        name="abv"
                        value={beerDetails.abv}
                        onChange={handleInputChange}
                        placeholder="Enter ABV"
                        type="number"
                        step="0.1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                        Tasting Notes
                      </label>
                      <textarea
                        id="notes"
                        name="notes"
                        value={beerDetails.notes}
                        onChange={handleInputChange}
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
                        onChange={handleInputChange}
                        placeholder="Enter hop varieties"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={4}
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
                        onChange={handleInputChange}
                        placeholder="Enter serving temperature"
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
                        Background
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          id="primaryColor"
                          type="color"
                          value={labelColors.primary}
                          onChange={(e) => handleColorChange("primary", e.target.value)}
                          className="w-8 h-8 p-1 border border-gray-300 rounded-md"
                        />
                        <input
                          type="text"
                          value={labelColors.primary}
                          onChange={(e) => handleColorChange("primary", e.target.value)}
                          className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="secondaryColor" className="block text-sm font-medium text-gray-700 mb-1">
                        Secondary Background
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          id="secondaryColor"
                          type="color"
                          value={labelColors.secondary}
                          onChange={(e) => handleColorChange("secondary", e.target.value)}
                          className="w-8 h-8 p-1 border border-gray-300 rounded-md"
                        />
                        <input
                          type="text"
                          value={labelColors.secondary}
                          onChange={(e) => handleColorChange("secondary", e.target.value)}
                          className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="blackColor" className="block text-sm font-medium text-gray-700 mb-1">
                        Text Color
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          id="blackColor"
                          type="color"
                          value={labelColors.black}
                          onChange={(e) => handleColorChange("black", e.target.value)}
                          className="w-8 h-8 p-1 border border-gray-300 rounded-md"
                        />
                        <input
                          type="text"
                          value={labelColors.black}
                          onChange={(e) => handleColorChange("black", e.target.value)}
                          className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <label htmlFor="showLagerTriangle" className="text-sm font-medium text-gray-700">
                        Show Lager Triangle
                      </label>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={showLagerTriangle}
                          onChange={(e) => setShowLagerTriangle(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <label htmlFor="showMarlboro" className="text-sm font-medium text-gray-700">
                        Show Marlboro
                      </label>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={showMarlboro}
                          onChange={(e) => setShowMarlboro(e.target.checked)}
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
                      <label htmlFor="showQR" className="text-sm font-medium text-gray-700">
                        QR Code Guide
                      </label>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={showQR}
                          onChange={(e) => setShowQR(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <label htmlFor="showBarcode" className="text-sm font-medium text-gray-700">
                        Barcode Guide
                      </label>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={showBarcode}
                          onChange={(e) => setShowBarcode(e.target.checked)}
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
                  temp={beerDetails.temperature}
                  primaryColor={labelColors.primary}
                  secondaryColor={labelColors.secondary}
                  blackColor={labelColors.black}
                  showMargins={showMargins}
                  showQR={showQR}
                  showBarcode={showBarcode}
                  showBleed={showBleed}
                  showLagerTriangle={showLagerTriangle}
                  showMarlboro={showMarlboro}
                  warningFontSize={60}
                  variant={beerDetails.variant}
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
                  <span>Share</span>
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
