import { useState, useRef, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './components/LanguageSwitcher';
import './App.css';

interface Address {
  address: string;
  lat: number;
  lng: number;
  status: 'pending' | 'success' | 'error';
  groupId?: number;
}

interface AddressGroup {
  id: number;
  addresses: Address[];
  color: string;
  center: { lat: number; lng: number };
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

  // Grouping states
  const [isGroupingEnabled, setIsGroupingEnabled] = useState(false);
  const [groupingMode, setGroupingMode] = useState<'distance' | 'time' | 'cluster'>('distance');
  const [distanceThreshold, setDistanceThreshold] = useState(5); // km
  const [timeThreshold, setTimeThreshold] = useState(30); // minutes
  const [radiusThreshold, setRadiusThreshold] = useState(2); // km - radius for circular grouping
  const [clusterThreshold, setClusterThreshold] = useState(1); // km - minimum distance for clustering
  const [addressGroups, setAddressGroups] = useState<AddressGroup[]>([]);

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

  // Grouping functions
  const calculateDistance = useCallback((lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }, []);

  const generateColor = useCallback((index: number): string => {
    // Generate distinct colors using HSL color space
    const hue = (index * 137.5) % 360; // Golden angle approximation for good distribution
    const saturation = 70 + (index % 3) * 10; // Vary saturation slightly
    const lightness = 45 + (index % 2) * 10; // Vary lightness slightly
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }, []);

  const performClustering = useCallback((addresses: Address[]): AddressGroup[] => {
    const groups: AddressGroup[] = [];

    for (const address of addresses) {
      let bestGroup: AddressGroup | null = null;
      let minDistance = Infinity;

      // Find the closest group
      for (const group of groups) {
        const distance = calculateDistance(
          address.lat, address.lng,
          group.center.lat, group.center.lng
        );

        if (distance < minDistance && distance <= clusterThreshold) {
          minDistance = distance;
          bestGroup = group;
        }
      }

      if (bestGroup) {
        // Add to existing group
        bestGroup.addresses.push(address);

        // Recalculate center
        const newLat = bestGroup.addresses.reduce((sum, addr) => sum + addr.lat, 0) / bestGroup.addresses.length;
        const newLng = bestGroup.addresses.reduce((sum, addr) => sum + addr.lng, 0) / bestGroup.addresses.length;
        bestGroup.center = { lat: newLat, lng: newLng };
      } else {
        // Create new group
        groups.push({
          id: groups.length,
          addresses: [address],
          color: generateColor(groups.length),
          center: { lat: address.lat, lng: address.lng }
        });
      }
    }

    return groups;
  }, [clusterThreshold, calculateDistance, generateColor]);

  const applyRadiusConstraint = useCallback((groups: AddressGroup[]): AddressGroup[] => {
    const finalGroups: AddressGroup[] = [];
    const processedAddresses = new Set<string>();

    for (const group of groups) {
      const groupAddresses = group.addresses.filter(addr => !processedAddresses.has(addr.address));
      if (groupAddresses.length === 0) continue;

      // Calculate initial center
      let centerLat = groupAddresses.reduce((sum, addr) => sum + addr.lat, 0) / groupAddresses.length;
      let centerLng = groupAddresses.reduce((sum, addr) => sum + addr.lng, 0) / groupAddresses.length;

      // Filter addresses within radius
      const withinRadius = groupAddresses.filter(addr => {
        const distance = calculateDistance(centerLat, centerLng, addr.lat, addr.lng);
        return distance <= radiusThreshold;
      });

      if (withinRadius.length > 0) {
        // Recalculate center with addresses within radius
        const newCenterLat = withinRadius.reduce((sum, addr) => sum + addr.lat, 0) / withinRadius.length;
        const newCenterLng = withinRadius.reduce((sum, addr) => sum + addr.lng, 0) / withinRadius.length;

        finalGroups.push({
          id: finalGroups.length,
          addresses: withinRadius,
          color: generateColor(finalGroups.length),
          center: { lat: newCenterLat, lng: newCenterLng }
        });

        // Mark processed addresses
        withinRadius.forEach(addr => processedAddresses.add(addr.address));
      }
    }

    // Handle any remaining ungrouped addresses
    const remainingAddresses = addresses.filter(addr =>
      addr.status === 'success' && !processedAddresses.has(addr.address)
    );

    for (const addr of remainingAddresses) {
      finalGroups.push({
        id: finalGroups.length,
        addresses: [addr],
        color: generateColor(finalGroups.length),
        center: { lat: addr.lat, lng: addr.lng }
      });
    }

    return finalGroups;
  }, [addresses, radiusThreshold, calculateDistance, generateColor]);

  const groupAddresses = useCallback(() => {
    const successAddresses = addresses.filter(addr => addr.status === 'success');
    if (successAddresses.length === 0) return;

    let groups: AddressGroup[] = [];

    if (groupingMode === 'cluster') {
      // Minimum distance clustering algorithm
      groups = performClustering(successAddresses);
    } else {
      // Original distance/time based grouping
      const visited = new Set<number>();

      for (let i = 0; i < successAddresses.length; i++) {
        if (visited.has(i)) continue;

        const currentGroup: Address[] = [successAddresses[i]];
        visited.add(i);

        for (let j = i + 1; j < successAddresses.length; j++) {
          if (visited.has(j)) continue;

          const distance = calculateDistance(
            successAddresses[i].lat, successAddresses[i].lng,
            successAddresses[j].lat, successAddresses[j].lng
          );

          let shouldGroup = false;
          if (groupingMode === 'distance') {
            shouldGroup = distance <= distanceThreshold;
          } else {
            // Estimate time based on distance (assuming average speed of 30 km/h for urban areas)
            const estimatedTime = (distance / 30) * 60; // Convert to minutes
            shouldGroup = estimatedTime <= timeThreshold;
          }

          if (shouldGroup) {
            currentGroup.push(successAddresses[j]);
            visited.add(j);
          }
        }

        if (currentGroup.length > 0) {
          // Calculate group center
          const avgLat = currentGroup.reduce((sum, addr) => sum + addr.lat, 0) / currentGroup.length;
          const avgLng = currentGroup.reduce((sum, addr) => sum + addr.lng, 0) / currentGroup.length;

          groups.push({
            id: groups.length,
            addresses: currentGroup,
            color: generateColor(groups.length),
            center: { lat: avgLat, lng: avgLng }
          });
        }
      }
    }

    // Apply radius constraint to refine groups (only for distance/time modes)
    const refinedGroups = groupingMode === 'cluster' ? groups : applyRadiusConstraint(groups);

    // Update addresses with refined group IDs
    const updatedAddresses = addresses.map(addr => {
      if (addr.status === 'success') {
        const group = refinedGroups.find(g => g.addresses.some(a => a.address === addr.address));
        return { ...addr, groupId: group?.id };
      }
      return addr;
    });

    setAddresses(updatedAddresses);
    setAddressGroups(refinedGroups);
  }, [addresses, groupingMode, distanceThreshold, timeThreshold, radiusThreshold, clusterThreshold, calculateDistance, generateColor, performClustering, applyRadiusConstraint]);

  const toggleGrouping = useCallback(() => {
    if (!isGroupingEnabled) {
      groupAddresses();
    } else {
      // Clear grouping
      const clearedAddresses = addresses.map(addr => ({ ...addr, groupId: undefined }));
      setAddresses(clearedAddresses);
      setAddressGroups([]);
    }
    setIsGroupingEnabled(!isGroupingEnabled);
  }, [isGroupingEnabled, groupAddresses, addresses]);

  const updateGrouping = useCallback(() => {
    if (isGroupingEnabled) {
      groupAddresses();
    }
  }, [isGroupingEnabled, groupAddresses]);

  // Calculate address count from input
  const getInputAddressCount = useCallback(() => {
    const lines = inputAddresses.split('\n').filter(line => line.trim().length > 0);
    return lines.length;
  }, [inputAddresses]);

  // Export functions
  const exportAsCSV = useCallback(() => {
    const csvContent = [
      ['Address', 'Latitude', 'Longitude'].join(','),
      ...addresses.map(addr => [addr.address, addr.lat, addr.lng].join(','))
    ].join('\n');

    // Add UTF-8 BOM to fix Chinese character encoding issues in Excel
    const BOM = '\uFEFF';
    const csvWithBOM = BOM + csvContent;

    const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'addresses.csv';
    link.click();
  }, [addresses]);

  const exportAsJSON = useCallback(() => {
    const jsonContent = JSON.stringify(addresses, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'addresses.json';
    link.click();
  }, [addresses]);

  const generateStaticMapURL = useCallback(() => {
    if (addresses.length === 0) return '';

    const center = addresses.length === 1
      ? `${addresses[0].lat},${addresses[0].lng}`
      : '25.0330,121.5654'; // Default Taipei center

    const markers = addresses.map(addr =>
      `markers=color:red%7C${addr.lat},${addr.lng}`
    ).join('&');

    return `https://maps.googleapis.com/maps/api/staticmap?center=${center}&zoom=12&size=800x600&${markers}&key=${apiKey}`;
  }, [addresses, apiKey]);

  const exportStaticMap = useCallback(() => {
    const staticMapURL = generateStaticMapURL();
    if (staticMapURL) {
      // Open in new tab instead of downloading
      window.open(staticMapURL, '_blank');
    }
  }, [generateStaticMapURL]);

  const exportAsKML = useCallback(() => {
    const kmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>Address Map Export</name>
    ${addresses.map((addr) => `
    <Placemark>
      <name>${addr.address}</name>
      <Point>
        <coordinates>${addr.lng},${addr.lat},0</coordinates>
      </Point>
    </Placemark>`).join('')}
  </Document>
</kml>`;

    const blob = new Blob([kmlContent], { type: 'application/vnd.google-earth.kml+xml;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'addresses.kml';
    link.click();
  }, [addresses]);

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
                      .map((addr, index) => {
                        const groupColor = addr.groupId !== undefined && addressGroups[addr.groupId] 
                          ? addressGroups[addr.groupId].color 
                          : (addr.address.includes('Current Location') ? '#10b981' : '#6366f1');
                        
                        return (
                          <Marker
                            key={index}
                            position={{ lat: addr.lat, lng: addr.lng }}
                            title={addr.address}
                            onClick={() => handleMarkerClick(index)}
                            icon={{
                              url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                                <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                                  <circle cx="16" cy="16" r="14" fill="${groupColor}" stroke="white" stroke-width="2"/>
                                  <text x="16" y="22" text-anchor="middle" fill="white" font-family="Arial" font-size="16" font-weight="bold">📍</text>
                                </svg>
                              `)}`,
                              scaledSize: new window.google.maps.Size(32, 32),
                              anchor: new window.google.maps.Point(16, 32)
                            }}
                          />
                        );
                      })}
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
            {/* Export Section - Only show when addresses exist */}
            {addresses.length > 0 && (
              <div className="export-section">
                <h3>📤 {t('export.title')}</h3>
                <div className="export-buttons">
                  <button
                    className="export-btn"
                    onClick={exportAsCSV}
                    title={t('export.csvTitle')}
                  >
                    📊 {t('export.csv')}
                  </button>
                  <button
                    className="export-btn"
                    onClick={exportAsJSON}
                    title={t('export.jsonTitle')}
                  >
                    📄 {t('export.json')}
                  </button>
                  <button
                    className="export-btn"
                    onClick={exportStaticMap}
                    title={t('export.mapTitle')}
                  >
                    🗺️ {t('export.map')}
                  </button>
                  <button
                    className="export-btn"
                    onClick={exportAsKML}
                    title={t('export.kmlTitle')}
                  >
                    🌍 {t('export.kml')}
                  </button>
                </div>
              </div>
            )}

            {/* Grouping Section - Only show when addresses exist */}
            {addresses.length > 0 && (
              <div className="grouping-section">
                <h3>🎯 {t('grouping.title')}</h3>
                <div className="grouping-controls">
                  <div className="grouping-toggle">
                    <label className="toggle-label">
                      <input
                        type="checkbox"
                        checked={isGroupingEnabled}
                        onChange={toggleGrouping}
                      />
                      <span className="toggle-slider"></span>
                      {t('grouping.enable')}
                    </label>
                  </div>
                  {isGroupingEnabled && (
                    <div className="grouping-options">
                      <div className="grouping-mode">
                        <label>{t('grouping.mode')}:</label>
                        <select
                          value={groupingMode}
                          onChange={(e) => setGroupingMode(e.target.value as 'distance' | 'time' | 'cluster')}
                        >
                          <option value="distance">{t('grouping.distance')}</option>
                          <option value="time">{t('grouping.time')}</option>
                          <option value="cluster">{t('grouping.cluster')}</option>
                        </select>
                      </div>
                      {groupingMode === 'distance' && (
                        <div className="threshold-control">
                          <label>{t('grouping.distanceThreshold')}: {distanceThreshold} km</label>
                          <input
                            type="range"
                            min="0.1"
                            max="10"
                            step="0.1"
                            value={distanceThreshold}
                            onChange={(e) => {
                              setDistanceThreshold(parseFloat(e.target.value));
                              setTimeout(updateGrouping, 300); // Debounce updates
                            }}
                          />
                        </div>
                      )}
                      {groupingMode === 'time' && (
                        <div className="threshold-control">
                          <label>{t('grouping.timeThreshold')}: {timeThreshold} min</label>
                          <input
                            type="range"
                            min="1"
                            max="60"
                            step="1"
                            value={timeThreshold}
                            onChange={(e) => {
                              setTimeThreshold(parseInt(e.target.value));
                              setTimeout(updateGrouping, 300); // Debounce updates
                            }}
                          />
                        </div>
                      )}
                      {groupingMode === 'cluster' && (
                        <div className="threshold-control">
                          <label>{t('grouping.clusterThreshold')}: {clusterThreshold} km</label>
                          <input
                            type="range"
                            min="0.1"
                            max="5"
                            step="0.1"
                            value={clusterThreshold}
                            onChange={(e) => {
                              setClusterThreshold(parseFloat(e.target.value));
                              setTimeout(updateGrouping, 300); // Debounce updates
                            }}
                          />
                        </div>
                      )}
                      {(groupingMode === 'distance' || groupingMode === 'time') && (
                        <div className="threshold-control">
                          <label>{t('grouping.radiusThreshold')}: {radiusThreshold} km</label>
                          <input
                            type="range"
                            min="0.1"
                            max="5"
                            step="0.1"
                            value={radiusThreshold}
                            onChange={(e) => {
                              setRadiusThreshold(parseFloat(e.target.value));
                              setTimeout(updateGrouping, 300); // Debounce updates
                            }}
                          />
                        </div>
                      )}
                      <div className="group-stats">
                        <span>{t('grouping.groups')}: {addressGroups.length}</span>
                        <span>{t('grouping.totalAddresses')}: {addresses.filter(addr => addr.status === 'success').length}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

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
              {/* Address Count Display */}
              <div className="address-count-display">
                <span className="address-count-text">
                  📝 {t('input.addressCount')}: <strong>{getInputAddressCount()}</strong>
                </span>
                {getInputAddressCount() > 0 && (
                  <span className="address-count-hint">
                    {t('input.addressCountHint')}
                  </span>
                )}
              </div>
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
              {addresses.map((addr, index) => {
                const groupColor = addr.groupId !== undefined && addressGroups[addr.groupId] 
                  ? addressGroups[addr.groupId].color 
                  : 'transparent';
                
                return (
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
                          {addr.groupId !== undefined && (
                            <span className="group-indicator" style={{ backgroundColor: groupColor }}>
                              Group {addr.groupId + 1}
                            </span>
                          )}
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
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default App;