import { useState, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './components/LanguageSwitcher';
import './App.css';

interface Address {
  address: string;
  lat: number;
  lng: number;
  status: 'pending' | 'success' | 'error';
}

const containerStyle = {
  width: '100%',
  height: '100%'
};

const center = {
  lat: 25.0330, // Default to Taipei, Taiwan
  lng: 121.5654
};

function App() {
  const { t } = useTranslation();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [inputAddresses, setInputAddresses] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<number | null>(null);
  const [selectedMarkerIndex, setSelectedMarkerIndex] = useState<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const geocodeAddress = async (address: string): Promise<Address> => {
    return new Promise((resolve) => {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const location = results[0].geometry.location;
          resolve({
            address,
            lat: location.lat(),
            lng: location.lng(),
            status: 'success'
          });
        } else {
          resolve({
            address,
            lat: 0,
            lng: 0,
            status: 'error'
          });
        }
      });
    });
  };

  const addAddresses = async () => {
    const addressList = inputAddresses
      .split('\n')
      .map(addr => addr.trim())
      .filter(addr => addr.length > 0);

    if (addressList.length === 0) return;

    setError('');
    setIsLoading(true);
    setProgress({ current: 0, total: addressList.length });

    const newAddresses: Address[] = [];

    for (let i = 0; i < addressList.length; i++) {
      const result = await geocodeAddress(addressList[i]);
      newAddresses.push(result);
      setProgress({ current: i + 1, total: addressList.length });

      // Update progress in real-time
      setAddresses(prev => [...prev, result]);
    }

    setIsLoading(false);
    setInputAddresses('');
    setProgress({ current: 0, total: 0 });

    // Show summary
    const successCount = newAddresses.filter(addr => addr.status === 'success').length;
    const errorCount = newAddresses.filter(addr => addr.status === 'error').length;

    if (errorCount > 0) {
      setError(`${t('errors.addedSuccessfully', { count: successCount })} ${errorCount} ${t('errors.addressesNotFound')}`);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError(t('errors.geolocationNotSupported'));
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setIsLoading(false);

        // Add current location as an address
        const currentAddress: Address = {
          address: `Current Location (${latitude.toFixed(6)}, ${longitude.toFixed(6)})`,
          lat: latitude,
          lng: longitude,
          status: 'success'
        };
        setAddresses(prev => [...prev, currentAddress]);
      },
      (error) => {
        setIsLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError(t('errors.locationAccessDenied'));
            break;
          case error.POSITION_UNAVAILABLE:
            setError(t('errors.locationUnavailable'));
            break;
          case error.TIMEOUT:
            setError(t('errors.locationTimeout'));
            break;
          default:
            setError(t('errors.unknownError'));
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  const clearAllAddresses = () => {
    setAddresses([]);
    setUserLocation(null);
    setError('');
  };

  const removeAddress = (index: number) => {
    setAddresses(addresses.filter((_, i) => i !== index));
  };

  const selectAddress = (index: number) => {
    const address = addresses[index];
    if (address && address.status === 'success') {
      setSelectedAddressIndex(index);
      setSelectedMarkerIndex(null); // Clear marker selection when selecting from list
    }
  };

  const handleMarkerClick = (index: number) => {
    setSelectedMarkerIndex(index);
    setSelectedAddressIndex(null); // Clear list selection when clicking marker
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey && !isLoading) {
      addAddresses();
    }
  };

  return (
    <div className="app-container">
      <div className="main-content">
        <header className="header">
          <div className="header-content">
            <h1>🗺️ {t('app.title')}</h1>
            <LanguageSwitcher />
          </div>
          <p>{t('app.subtitle')}</p>
        </header>

        <div className="content-wrapper">
          {/* Map Section - Top */}
          <section className="map-section">
            <div className="map-container">
              <div className="map-wrapper">
                <LoadScript googleMapsApiKey={apiKey}>
                  <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={
                      selectedAddressIndex !== null && addresses[selectedAddressIndex]?.status === 'success'
                        ? { lat: addresses[selectedAddressIndex].lat, lng: addresses[selectedAddressIndex].lng }
                        : userLocation
                        ? userLocation
                        : addresses.length > 0
                        ? { lat: addresses[0].lat, lng: addresses[0].lng }
                        : center
                    }
                    zoom={
                      selectedAddressIndex !== null && addresses[selectedAddressIndex]?.status === 'success'
                        ? 15
                        : userLocation
                        ? 15
                        : addresses.length > 0
                        ? Math.max(8, 12 - Math.log10(addresses.length))
                        : 10
                    }
                    options={{
                      zoomControl: true,
                      streetViewControl: false,
                      mapTypeControl: false,
                      fullscreenControl: true,
                    }}
                  >
                    {addresses
                      .filter(addr => addr.status === 'success')
                      .map((addr, index) => (
                        <Marker
                          key={index}
                          position={{ lat: addr.lat, lng: addr.lng }}
                          title={addr.address}
                          onClick={() => handleMarkerClick(index)}
                          icon={{
                            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                              <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                                <text x="16" y="24" text-anchor="middle" fill="${
                                  addr.address.includes('Current Location') ? '#10b981' : '#6366f1'
                                }" font-family="Arial" font-size="24" font-weight="bold">📍</text>
                              </svg>
                            `)}`,
                            scaledSize: new window.google.maps.Size(32, 32),
                            anchor: new window.google.maps.Point(16, 32)
                          }}
                        />
                      ))}
                      {selectedMarkerIndex !== null && addresses[selectedMarkerIndex] && (
                        <InfoWindow
                          position={{
                            lat: addresses[selectedMarkerIndex].lat,
                            lng: addresses[selectedMarkerIndex].lng
                          }}
                          onCloseClick={() => setSelectedMarkerIndex(null)}
                        >
                          <div style={{ padding: '8px', maxWidth: '200px' }}>
                            <h4 style={{ margin: '0 0 8px 0', color: '#6366f1' }}>
                              📍 {addresses[selectedMarkerIndex].address}
                            </h4>
                            <p style={{ margin: '0', fontSize: '14px', color: '#64748b' }}>
                              {t('app.latitude')}: {addresses[selectedMarkerIndex].lat.toFixed(6)}<br/>
                              {t('app.longitude')}: {addresses[selectedMarkerIndex].lng.toFixed(6)}
                            </p>
                          </div>
                        </InfoWindow>
                      )}
                  </GoogleMap>
                </LoadScript>
              </div>
            </div>
          </section>

          {/* Input Section - Middle */}
          <section className="input-section">
            <div className="button-group-top">
              <button
                className={`add-btn ${isLoading ? 'loading' : ''}`}
                onClick={addAddresses}
                disabled={!inputAddresses.trim() || isLoading}
              >
                {isLoading ? `🔍 ${t('app.processing')} (${progress.current}/${progress.total})` : `➕ ${t('app.addAddresses')}`}
              </button>
              <button
                className="location-btn"
                onClick={getCurrentLocation}
                disabled={isLoading}
                title={t('buttons.getLocation')}
              >
                📍 {t('app.currentLocation')}
              </button>
              {addresses.length > 0 && (
                <button
                  className="clear-btn"
                  onClick={clearAllAddresses}
                  disabled={isLoading}
                  title={t('buttons.clearAllTitle')}
                >
                  🗑️ {t('app.clearAll')}
                </button>
              )}
            </div>
            <div className="input-group">
              <textarea
                ref={textareaRef}
                className="textarea-field"
                value={inputAddresses}
                onChange={(e) => setInputAddresses(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`${t('app.placeholder')}\n${t('app.placeholderExamples')}`}
                disabled={isLoading}
                rows={6}
              />
            </div>
            <div className="input-help">
              💡 <strong>{t('app.tips')}:</strong> {t('app.tipsContent')}
            </div>
            {error && <div className="error-message">⚠️ {error}</div>}
          </section>

          {/* Address List Section - Bottom */}
          <section className="address-list">
            <h3>
              📍 {t('app.savedAddresses')}
              <span className="address-count">{addresses.length}</span>
            </h3>
            {addresses.length === 0 ? (
              <div className="empty-state">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <p>{t('app.noAddresses')}<br/>{t('app.startMessage')}</p>
              </div>
            ) : (
              <div className="address-stats">
                <div className="stat-item">
                  ✅ {t('app.success')}: {addresses.filter(addr => addr.status === 'success').length}
                </div>
                <div className="stat-item">
                  ❌ {t('app.failed')}: {addresses.filter(addr => addr.status === 'error').length}
                </div>
              </div>
            )}
            <div className="address-items">
              {addresses.map((addr, index) => (
                <div 
                  key={index} 
                  className={`address-item ${addr.status} ${selectedAddressIndex === index ? 'selected' : ''}`}
                  onClick={() => selectAddress(index)}
                  style={{ cursor: addr.status === 'success' ? 'pointer' : 'default' }}
                >
                  <div className="address-content">
                    <div className="address-text">
                      {addr.status === 'error' ? '❌ ' : '✅ '}{addr.address}
                    </div>
                    {addr.status === 'success' && (
                      <div className="coordinates">
                        {addr.lat.toFixed(6)}, {addr.lng.toFixed(6)}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering address selection
                      removeAddress(index);
                    }}
                    className="remove-btn"
                    title={t('buttons.remove')}
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default App;