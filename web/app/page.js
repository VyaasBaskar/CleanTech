"use client";
import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "!mapbox-gl";
import * as turf from "@turf/turf";
import EventBox from "./eventBox";
import SideBar from "./sideBar";
import MiniEventBox from "./miniEventBox";

mapboxgl.accessToken =
  "token";

const App = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(null);
  const [lat, setLat] = useState(null);
  const [zoom, setZoom] = useState(18);
  const [address, setAddress] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [visible, setVisible] = useState(false);
  const [boxVisible, setBoxVisible] = useState(false);

  const [events, setEvents] = useState([
    {
      eventName: "Massachusets cupertino party",
      address: "1280 Vista Dr,95013",
      time: "May 1, 5PM-6PM",
      description:
        "Bring water, gloves sanitation and anything else you need to clean up the street",
    },
    {
      eventName: "Massachusets cupertino party",
      address: "1280 Vista Dr, 95013",
      time: "May 1, 5PM-6PM",
      description:
        "Bring water, gloves sanitation and anything else you need to clean up the street",
    },
    {
      eventName: "Massachusets cupertino party",
      address: "1280 Vista Dr,95013",
      time: "May 1, 5PM-6PM",
      description:
        "Bring water, gloves sanitation and anything else you need to clean up the street",
    },
  ]);

  const [miniBoxData, setMiniBoxData] = useState({});
  const [cityCoordsList, setCityCoordsList] = useState([
    {
      coords: [0, 0],
      r: 1000,
      color: "#FF3A3A",
    },
    // { coords: [-200, 40], r: 100000, color: "#FF3A3A" },
    // { coords: [-60, 10], r: 100000, color: "#FF3A3A" },
  ]);
  useEffect(() => {
    // get events from server http://127.0.0.1:5000/getEvents
    fetch("http://127.0.0.1:5000/getEvents")
      .then((response) => response.json())
      .then((data) => {
        setEvents(data.events);
        console.log(data.events);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/getCoords")
      .then((response) => response.json())
      .then((data) => {
        setCityCoordsList(data.coords);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  useEffect(() => {
    console.log("cityCoordsList:", cityCoordsList);
  }, [cityCoordsList]);

  function hashCodeFunc(string) {
    var hash = 0;
    for (var i = 0; i < string.length; i++) {
      var code = string.charCodeAt(i);
      hash = (hash << 5) - hash + code;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLng(position.coords.longitude);
        setLat(position.coords.latitude);
        console.log("Got location:", position.coords);
      },
      (error) => {
        console.error("Error getting location:", error);
      }
    );
  }, []);

  useEffect(() => {
    if (map.current) return;
    if (!lng || !lat) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [lng, lat],
      zoom: zoom,
    });
  }, [lng, lat]);

  useEffect(() => {
    if (!map.current) return;

    map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });

    for (let i = 0; i < cityCoordsList.length; i++) {
      const hashCode = hashCodeFunc(
        cityCoordsList[i].coords[0].toString() +
          cityCoordsList[i].coords[1].toString()
      );
      console.log("hashCode:", hashCode);
      map.current.on("style.load", () => {
        const radius = cityCoordsList[i].r;
        console.log("cityCoordsList[i]:", cityCoordsList[i].coords);
        const cityCircle = turf.circle(cityCoordsList[i].coords, radius, {
          steps: 100,
          units: "meters",
        });
        if (map.current.getSource("city-circle" + hashCode)) {
          map.current.getSource("city-circle" + hashCode).setData(cityCircle);
        } else {
          map.current.addSource("city-circle" + hashCode, {
            type: "geojson",
            data: cityCircle,
          });
          map.current.addLayer({
            id: "city-circle-layer" + hashCode,
            type: "fill",
            source: "city-circle" + hashCode,
            paint: {
              "fill-color": cityCoordsList[i].color,
              "fill-opacity": 0.5,
            },
          });
        }
      });
    }

    map.current.on("click", (e) => {
      setVisible(true);
    });
  }, [lng, lat, cityCoordsList]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (address.trim().length > 0) {
        try {
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
              address
            )}.json?access_token=${mapboxgl.accessToken}`
          );
          const data = await response.json();
          setSuggestions(data.features.map((feature) => feature.place_name));
        } catch (error) {
          console.error("Error fetching suggestions:", error);
        }
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [address]);

  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };

  const handleAddressSelect = (suggestion) => {
    setAddress(suggestion);
    geocodeAddress(suggestion);
    setSuggestions([]);
  };

  const geocodeAddress = async (address) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          address
        )}.json?access_token=${mapboxgl.accessToken}`
      );
      const data = await response.json();
      if (data.features.length) {
        const [lng, lat] = data.features[0].geometry.coordinates;
        setLng(lng);
        setLat(lat);
        map.current.flyTo({ center: [lng, lat], zoom: 14 });
      }
    } catch (error) {
      console.error("Error geocoding address:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <SideBar visible={visible} />
      <img
        src="/logo.svg"
        alt="logo"
        className="w-[15vw] absolute top-8 right-10 z-10"
      />
      <div
        className="flex flex-row absolute z-10 top-8 left-8 rounded-full pl-5 w-[40vw] items-center gap-4 p-2"
        style={{
          backdropFilter: "blur(3px)",
          background: "rgba(255, 255, 255, 0.4)",
        }}
      >
        <img src="/map-pin.svg" alt="search" className="w-6 h-6" />
        <div className="relative">
          <input
            type="text"
            placeholder="Showing locations near you..."
            className="w-[36vw] text-[24px] bg-transparent text-white outline-none placeholder:text-white placeholder:opacity-80"
            value={address}
            onChange={handleAddressChange}
          />
          {suggestions.length > 0 && (
            <ul
              className="absolute z-10 w-ful rounded shadow"
              style={{
                backdropFilter: "blur(3px)",
                background: "rgba(255, 255, 255, 0.4)",
              }}
            >
              {suggestions.map((suggestion, index) => {
                if (index > 3) return null;
                return (
                  <li
                    key={index}
                    className="px-4 py-2 cursor-pointer hover:bg-[#ffffff62]"
                    onClick={() => handleAddressSelect(suggestion)}
                  >
                    {suggestion}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
      <div
        className="z-10 absolute bottom-10 left-8 w-[293px] h-[350px] bg-white rounded-[26px] p-4"
        style={{
          background: "rgba(255, 255, 255, 0.4)",
          backdropFilter: "blur(3px)",
        }}
      >
        <h2 className="text-[32px] font-bold text-white opacity-80">
          Where to help
        </h2>
        <div>
          {events.map((event, index) => {
            return (
              <EventBox
                eventName={event.eventName}
                distance={event.distance}
                onClick={() => {
                  console.log("Clicked event box");
                  setBoxVisible(true);
                  console.log("event:", event);
                  setMiniBoxData(event);
                }}
              />
            );
          })}
        </div>
      </div>
      <MiniEventBox
        boxVisible={boxVisible}
        onClickX={() => {
          console.log("Clicked event box");
          setBoxVisible(false);
        }}
        miniBoxData={miniBoxData}
      />
      <div className="flex-1 relative">
        <div ref={mapContainer} className="h-full" />
      </div>
    </div>
  );
};

export default App;
