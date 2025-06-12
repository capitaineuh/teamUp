import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow, useJsApiLoader, Libraries } from '@react-google-maps/api';
import { getEvents } from '../services/events';
import { Event } from '../types/event';

interface MapProps {
  apiKey: string;
}

const libraries: Libraries = ['places'];

const Map: React.FC<MapProps> = ({ apiKey }) => {
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [markers, setMarkers] = useState<{ [key: string]: google.maps.LatLngLiteral }>({});

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
    libraries: libraries
  });

  const mapContainerStyle = {
    width: '100%',
    height: '400px'
  };

  const defaultCenter = {
    lat: 48.8566,
    lng: 2.3522
  };

  const geocodeAddress = useCallback(async (address: string) => {
    if (!window.google) return null;
    
    const geocoder = new window.google.maps.Geocoder();
    return new Promise<google.maps.LatLngLiteral | null>((resolve) => {
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const location = results[0].geometry.location;
          resolve({
            lat: location.lat(),
            lng: location.lng()
          });
        } else {
          resolve(null);
        }
      });
    });
  }, []);

  useEffect(() => {
    // Obtenir la position de l'utilisateur
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Erreur de géolocalisation:", error);
        }
      );
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    const loadEvents = async () => {
      try {
        const eventsData = await getEvents();
        setEvents(eventsData);
        
        const newMarkers: { [key: string]: google.maps.LatLngLiteral } = {};
        
        for (const event of eventsData) {
          if (event.lieu) {
            const location = await geocodeAddress(event.lieu);
            if (location) {
              newMarkers[event.id] = location;
            }
          }
        }
        
        setMarkers(newMarkers);
      } catch (error) {
        console.error("Erreur lors du chargement des événements:", error);
      }
    };

    loadEvents();
  }, [isLoaded, geocodeAddress]);

  if (!isLoaded) {
    return <div>Chargement de la carte...</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={userLocation || defaultCenter}
      zoom={12}
    >
      {/* Marqueur de la position de l'utilisateur */}
      {userLocation && (
        <Marker
          position={userLocation}
          icon={{
            url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
          }}
        />
      )}

      {/* Marqueurs des événements */}
      {Object.entries(markers).map(([eventId, position]) => {
        const event = events.find(e => e.id === eventId);
        if (!event) return null;

        return (
          <Marker
            key={eventId}
            position={position}
            onClick={() => setSelectedEvent(event)}
          />
        );
      })}

      {/* InfoWindow pour afficher les détails de l'événement */}
      {selectedEvent && markers[selectedEvent.id] && (
        <InfoWindow
          position={markers[selectedEvent.id]}
          onCloseClick={() => setSelectedEvent(null)}
        >
          <div>
            <h3>{selectedEvent.titre}</h3>
            <p><strong>Sport:</strong> {selectedEvent.sport}</p>
            <p><strong>Niveau:</strong> {selectedEvent.niveau}</p>
            <p><strong>Participants:</strong> {selectedEvent.participantsList.length}/{selectedEvent.required_participants}</p>
            <p><strong>Lieu:</strong> {selectedEvent.lieu}</p>
            <p>{selectedEvent.description}</p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default Map; 