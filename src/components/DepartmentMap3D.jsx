import React from 'react';

export const DCS_COORDS = {
  lat: 6.855016278514475,
  lng: 79.90344492791185,
};

export const DCS_MAPS_LINK = 'https://maps.app.goo.gl/BWx2VfZVpQDDvVuu5';
const GOOGLE_TERRAIN_EMBED_URL = `https://www.google.com/maps/embed?origin=mfe&pb=!1m4!2m1!1s${DCS_COORDS.lat},${DCS_COORDS.lng}!5e4!6i17`;

export default function DepartmentMap3D() {
  return (
    <div className="glass-card rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
      <iframe
        title="Department of Computer Science — University of Sri Jayewardenepura (Google Maps Terrain)"
        src={GOOGLE_TERRAIN_EMBED_URL}
        className="w-full h-[380px] sm:h-[440px] border-0 block"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
}
