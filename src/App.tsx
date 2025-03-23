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
  const [openSections, setOpenSections] = React.useState({
    basic: true,
    tasting: true,
    customization: false,
    advanced: false
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setBeerDetails((prev) => ({ ...prev, [name]: value }))
  }

  const handleColorChange = (colorType: "primary" | "secondary" | "black", value: string) => {
    setLabelColors((prev) => ({ ...prev, [colorType]: value }))
  }

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  return (
    <div className="container mx-auto">
      <div className="flex items-start">
        <div className="flex-grow">
          <div className="bg-white rounded-lg shadow-md">
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
              warningFontSize={60}
              variant={beerDetails.variant}
            />
          </div>
        </div>

        {showForm && (
          <div className="w-96 p-6 bg-gray-100 rounded-lg shadow-md">
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
                        Background Color
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          id="primaryColor"
                          type="color"
                          value={labelColors.primary}
                          onChange={(e) => handleColorChange("primary", e.target.value)}
                          className="w-12 h-12 p-1 border border-gray-300 rounded-md"
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
                        Lager Background Color
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          id="secondaryColor"
                          type="color"
                          value={labelColors.secondary}
                          onChange={(e) => handleColorChange("secondary", e.target.value)}
                          className="w-12 h-12 p-1 border border-gray-300 rounded-md"
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
                          className="w-12 h-12 p-1 border border-gray-300 rounded-md"
                        />
                        <input
                          type="text"
                          value={labelColors.black}
                          onChange={(e) => handleColorChange("black", e.target.value)}
                          className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
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
                        Show Margins
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
      </div>
    </div>
  )
}

export default App
