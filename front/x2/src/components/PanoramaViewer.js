import React, { useEffect, useRef } from 'react';
import * as PANOLENS from 'panolens';
import PropTypes from 'prop-types';

const PanoramaViewer = ({ imageUrl }) => {
  const viewerRef = useRef(null);  // Reference to hold the Panolens viewer

  useEffect(() => {
    // Create a panorama and viewer only after component is mounted
    const panorama = new PANOLENS.ImagePanorama(imageUrl); // Pass the image URL to Panolens
    const viewer = new PANOLENS.Viewer({
      container: viewerRef.current,  // Attach viewer to the div
      autoRotate: true,  // Enable auto-rotation
      autoRotateSpeed: 1.0,  // Set the rotation speed
      controlBar: true,  // Display control bar
      cameraFov: 75,  // Set field of view
    });

    viewer.add(panorama);  // Add the panorama to the viewer

    return () => {
      // Cleanup when component unmounts
      viewer.dispose();  // Remove the viewer to prevent memory leaks
    };
  }, [imageUrl]);

  return (
    <div>
      <div ref={viewerRef} style={{ width: '100%', height: '500px' }}></div> {/* Set the size of the viewer */}
    </div>
  );
};

// PropTypes validation for PanoramaViewer component
PanoramaViewer.propTypes = {
  imageUrl: PropTypes.string.isRequired,  // imageUrl should be a string and is required
};

export default PanoramaViewer;
