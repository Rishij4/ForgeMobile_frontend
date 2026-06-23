export const calculateDependencies = (config) => {
  let effects = {
    performance: 0,
    thermal: 0,
    battery: 0,
    camera: 0,
    connectivity: 0,
    audio: 0,
    buildQuality: 0
  };

  // Processor

  if (config.processor) {
    effects.performance += config.processor.performanceScore || 0;
    effects.thermal += config.processor.thermalScore || 0;
    effects.battery += config.processor.batteryScore || 0;
  }

  // Battery

  if (config.battery) {
    effects.battery += config.battery.batteryScore || 20;
  }

  // Camera

  if (config.camera) {
    effects.camera += config.camera.cameraScore || 40;
  }

  // Connectivity

  if (config.connectivity) {
    effects.connectivity +=
      config.connectivity.network?.speedScore || 30;
  }

  // Audio

  if (config.audio) {
    effects.audio += config.audio.audioScore || 35;
  }

  effects.buildQuality =
    Math.round(
      (
        effects.performance +
        effects.thermal +
        effects.battery +
        effects.camera +
        effects.connectivity +
        effects.audio
      ) / 6
    );

  return effects;
};