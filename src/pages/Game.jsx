import { useEffect, useState } from "react";

import { MapContainer, TileLayer, ZoomControl, useMapEvents, Marker, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { Spinner } from "@/components/ui/spinner"

import data from "@/assets/data.json";

import L from "leaflet"

export default function Game() {
    let [loading, setLoading] = useState(true);
    let [gameData, setGameData] = useState();

    // Haversine distance in kilometers
    function haversine(lat1, lon1, lat2, lon2) {
        const toRad = (deg) => deg * Math.PI / 180;
        const R = 6371; // km
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
                            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    const markerStrokedIcon = L.divIcon({
      className: "",
      html: `
        <svg fill="#000000" width="50" height="50" viewBox="0 0 15 15" id="marker-stroked" xmlns="http://www.w3.org/2000/svg">
          <path id="Layer_7" d="M7.5,14.941l-.4-.495c-.973-1.189-4.9-6.556-4.9-9.16A5.066,5.066,0,0,1,7.036,0q.222-.01.445,0a5.066,5.066,0,0,1,5.286,4.836q.01.225,0,.45c0,2.213-2.669,6.111-4.678,8.851ZM7.481.986a4.077,4.077,0,0,0-4.3,4.3c0,1.832,2.759,6.038,4.286,8.034,1.25-1.71,4.315-5.989,4.315-8.034a4.077,4.077,0,0,0-4.3-4.3Z"/>
        </svg>
      `,
      iconSize: [50, 50],
      iconAnchor: [25, 50]
    })

    const markerIcon = L.divIcon({
      className: "",
      html: `
        <svg width="50" height="50" viewBox="0 0 15 15" version="1.1" id="marker" xmlns="http://www.w3.org/2000/svg">
          <path id="path4133" d="M7.5,0C5.0676,0,2.2297,1.4865,2.2297,5.2703&#xA;&#x9;C2.2297,7.8378,6.2838,13.5135,7.5,15c1.0811-1.4865,5.2703-7.027,5.2703-9.7297C12.7703,1.4865,9.9324,0,7.5,0z"/>
        </svg>
      `,
      iconSize: [50, 50],
      iconAnchor: [25, 50]
    })

    function ClickedMarker() {
      useMapEvents({
        click(e) {
          if (gameData.guessed) return;
          setGameData(prevGameData => ({
            ...prevGameData,
            marker: e.latlng
          }))
        }
      })

      return gameData.marker === null ? null : (
        <Marker position={gameData.marker} icon={markerStrokedIcon}/>
      )
    }

    function RevealController({ bounds }) {
      const map = useMap()

      useEffect(() => {
        if (!bounds) return

        map.fitBounds(bounds, {
          padding: [150, 150],
          animate: true
        })
      }, [bounds, map])

      return null
    }

    useEffect(() => {
      setupGame();
    }, []);

    function genRandomId() {
      const randomId = Array.from({ length: 8 }, () => Math.floor(Math.random() * 10)).join('');
      return `${randomId.slice(0, 4)}-${randomId.slice(4)}`;
    }

    function setupGame() {
      console.log("Game setup initialized");
      setLoading(true);

      const randomIndex = Math.floor(Math.random() * data.length);

      const newGameData = {
        objectiveId: genRandomId(),
        objective: data[randomIndex],
        marker: null,
        guessed: false,
        guessedDistance: null,
        wikipediaData: null
      };

      async function fetchWikiSummary(title) {
        const res = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
        )
        return res.json()
      }

      fetchWikiSummary(newGameData.objective.wikipedia).then((data) => {
        setGameData(prevGameData => ({
          ...prevGameData,
          wikipediaData: data
        }));
        console.log("Fetched Wikipedia data", data);
        setLoading(false);
      });

      setGameData(newGameData);
      console.log("Game setup completed", newGameData);
    }

    function submitGuess() {
      if (!gameData.marker) return;

      // Compute distance
      const dkm = haversine(gameData.marker.lat, gameData.marker.lng, gameData.objective.coordinates[0], gameData.objective.coordinates[1]);
      const meters = dkm < 1 ? Math.round(dkm * 1000) + ' m' : dkm.toFixed(2) + ' km';

      setGameData(prevGameData => ({
        ...prevGameData,
        guessed: true,
        guessedDistance: meters
      }))

    }

    return (
      <div style={{ height: "100vh", width: "100vw", position: "relative" }}>
        <MapContainer
          center={[20, 0]}
          zoom={3}
          minZoom={3}
          maxZoom={10}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom
          zoomControl={false}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickedMarker />
          {gameData?.guessed  && <Marker position={gameData.objective.coordinates} icon={markerIcon}/>}
          {gameData?.guessed && <Polyline positions={[gameData.marker, gameData.objective.coordinates]} color="black" />}
          <RevealController bounds={gameData?.guessed ? [
            gameData.marker,
            gameData.objective.coordinates
          ] : null} />
          <ZoomControl position="bottomright" />
        </MapContainer>

        <Card className="absolute top-8 left-8 transform z-1000 min-w-[220px]">
          {loading ? (
            <CardContent className="flex justify-center">
              <Spinner className="size-8"/>
            </CardContent>
          ) : (
            <>
              <CardHeader>
                <CardTitle>Your objective</CardTitle>
              </CardHeader>
              <CardContent>
                <h1 className="text-4xl font-extrabold tracking-tight text-balance">
                  { gameData.objectiveId }
                </h1>
                <div className="mt-4 flex">
                  {gameData.guessed ? (
                    <div className="max-w-xs">
                      <img
                        src={gameData.wikipediaData?.thumbnail?.source}
                        fill
                        className="rounded-lg object-cover dark:brightness-[0.2] dark:grayscale max-w-3xs"
                      />
                      <h2 className="mt-4 border-b pb-2 text-3xl font-semibold tracking-tight">{gameData.wikipediaData?.title}</h2>
                      <p className="leading-7 [&:not(:first-child)]:mt-2">{gameData.wikipediaData?.extract}</p>
                      <a href={`https://en.wikipedia.org/wiki/${gameData.objective.wikipedia}`} target="_blank" rel="noreferrer" className="underline">View on Wikipedia</a>
                      <p className="mt-2 font-semibold">You were {gameData.guessedDistance} away!</p>
                      <div className="mt-2">
                        <Button className="w-full" onClick={setupGame}>Play Again</Button>
                      </div>
                    </div>
                  ) : (
                    <Button className="w-full" disabled={!gameData.marker} onClick={submitGuess}>Submit</Button>
                  )}
                </div>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    )
}