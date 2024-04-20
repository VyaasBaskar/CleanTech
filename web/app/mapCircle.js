"use client";
import { Marker } from "react-leaflet";
import ReactTooltip from "react-tooltip";

const MapCircle = ({ coords, info }) => {
  return (
    <Marker position={coords} data-tip={info}>
      <ReactTooltip />
    </Marker>
  );
};

export default MapCircle;
