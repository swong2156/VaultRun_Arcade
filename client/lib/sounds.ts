// Enhanced Sound System for VaultRun
export type SoundType =
  | "click"
  | "play"
  | "win"
  | "loss"
  | "coin_flip"
  | "dice_roll"
  | "crash"
  | "countdown"
  | "notification"
  | "error"
  | "success";

interface SoundConfig {
  frequency: number[];
  duration: number;
  volume: number;
  type: OscillatorType;
  envelope?: {
    attack: number;
    decay: number;
    sustain: number;
    release: number;
  };
}

const soundConfigs: Record<SoundType, SoundConfig> = {
  click: {
    frequency: [800],
    duration: 0.1,
    volume: 0.3,
    type: "sine",
  },

  play: {
    frequency: [440, 554, 659],
    duration: 0.5,
    volume: 0.4,
    type: "sine",
    envelope: {
      attack: 0.1,
      decay: 0.2,
      sustain: 0.7,
      release: 0.2,
    },
  },

  win: {
    frequency: [523, 659, 784, 1047, 1319], // C major pentatonic
    duration: 1.5,
    volume: 0.5,
    type: "sine",
    envelope: {
      attack: 0.1,
      decay: 0.3,
      sustain: 0.6,
      release: 0.6,
    },
  },

  loss: {
    frequency: [196, 175, 147], // Descending minor
    duration: 1.0,
    volume: 0.4,
    type: "sawtooth",
    envelope: {
      attack: 0.1,
      decay: 0.4,
      sustain: 0.5,
      release: 0.5,
    },
  },

  coin_flip: {
    frequency: [880, 1047, 880, 659],
    duration: 0.8,
    volume: 0.4,
    type: "triangle",
    envelope: {
      attack: 0.05,
      decay: 0.1,
      sustain: 0.8,
      release: 0.15,
    },
  },

  dice_roll: {
    frequency: [200, 300, 400, 300, 200],
    duration: 0.6,
    volume: 0.3,
    type: "square",
    envelope: {
      attack: 0.02,
      decay: 0.08,
      sustain: 0.7,
      release: 0.2,
    },
  },

  crash: {
    frequency: [1000, 800, 600, 400, 200],
    duration: 2.0,
    volume: 0.6,
    type: "sawtooth",
    envelope: {
      attack: 0.0,
      decay: 0.5,
      sustain: 0.3,
      release: 1.5,
    },
  },

  countdown: {
    frequency: [440],
    duration: 0.2,
    volume: 0.3,
    type: "sine",
  },

  notification: {
    frequency: [659, 784],
    duration: 0.4,
    volume: 0.4,
    type: "sine",
    envelope: {
      attack: 0.05,
      decay: 0.1,
      sustain: 0.8,
      release: 0.25,
    },
  },

  error: {
    frequency: [220, 196],
    duration: 0.6,
    volume: 0.4,
    type: "square",
    envelope: {
      attack: 0.0,
      decay: 0.2,
      sustain: 0.6,
      release: 0.4,
    },
  },

  success: {
    frequency: [523, 659, 784],
    duration: 0.8,
    volume: 0.5,
    type: "sine",
    envelope: {
      attack: 0.1,
      decay: 0.2,
      sustain: 0.6,
      release: 0.5,
    },
  },
};

class SoundEngine {
  private audioContext: AudioContext | null = null;
  private masterVolume = 1.0;
  private enabled = true;

  constructor() {
    this.initAudioContext();
  }

  private initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn("Web Audio API not supported:", error);
    }
  }

  private async ensureAudioContext() {
    if (!this.audioContext) {
      this.initAudioContext();
      return;
    }

    if (this.audioContext.state === "suspended") {
      try {
        await this.audioContext.resume();
      } catch (error) {
        console.warn("Failed to resume audio context:", error);
      }
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  setMasterVolume(volume: number) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
  }

  async playSound(
    soundType: SoundType,
    options?: { volume?: number; pitch?: number },
  ) {
    if (!this.enabled || !this.audioContext) return;

    try {
      await this.ensureAudioContext();

      const config = soundConfigs[soundType];
      if (!config) return;

      const volume = (options?.volume ?? 1) * config.volume * this.masterVolume;
      const pitchMultiplier = options?.pitch ?? 1;

      if (config.frequency.length === 1) {
        // Single note
        this.playNote(
          config.frequency[0] * pitchMultiplier,
          config.duration,
          volume,
          config.type,
          config.envelope,
        );
      } else {
        // Sequence of notes
        config.frequency.forEach((freq, index) => {
          setTimeout(
            () => {
              this.playNote(
                freq * pitchMultiplier,
                config.duration / config.frequency.length,
                volume,
                config.type,
                config.envelope,
              );
            },
            (index * config.duration * 1000) / config.frequency.length,
          );
        });
      }
    } catch (error) {
      console.warn("Failed to play sound:", error);
    }
  }

  private playNote(
    frequency: number,
    duration: number,
    volume: number,
    type: OscillatorType,
    envelope?: SoundConfig["envelope"],
  ) {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(
      frequency,
      this.audioContext.currentTime,
    );
    oscillator.type = type;

    const currentTime = this.audioContext.currentTime;

    if (envelope) {
      // ADSR envelope
      gainNode.gain.setValueAtTime(0, currentTime);
      gainNode.gain.linearRampToValueAtTime(
        volume,
        currentTime + envelope.attack,
      );
      gainNode.gain.linearRampToValueAtTime(
        volume * envelope.sustain,
        currentTime + envelope.attack + envelope.decay,
      );
      gainNode.gain.setValueAtTime(
        volume * envelope.sustain,
        currentTime + duration - envelope.release,
      );
      gainNode.gain.linearRampToValueAtTime(0, currentTime + duration);
    } else {
      // Simple volume envelope
      gainNode.gain.setValueAtTime(volume, currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + duration);
    }

    oscillator.start(currentTime);
    oscillator.stop(currentTime + duration);
  }

  // Special effect sounds
  async playRandomizedSound(soundType: SoundType, variations = 3) {
    const randomPitch = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
    const randomVolume = 0.7 + Math.random() * 0.3; // 0.7 to 1.0

    await this.playSound(soundType, {
      pitch: randomPitch,
      volume: randomVolume,
    });
  }

  async playSequence(sounds: { type: SoundType; delay: number }[]) {
    for (const { type, delay } of sounds) {
      await this.playSound(type);
      if (delay > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  // Game-specific sound combinations
  async playGameStart() {
    await this.playSequence([
      { type: "countdown", delay: 300 },
      { type: "countdown", delay: 300 },
      { type: "play", delay: 0 },
    ]);
  }

  async playBigWin() {
    await this.playSequence([
      { type: "win", delay: 200 },
      { type: "success", delay: 0 },
    ]);
  }

  async playDramaticLoss() {
    await this.playSequence([
      { type: "crash", delay: 500 },
      { type: "loss", delay: 0 },
    ]);
  }
}

// Global sound engine instance
export const soundEngine = new SoundEngine();

// Convenience functions
export const playSound = (
  type: SoundType,
  options?: { volume?: number; pitch?: number },
) => soundEngine.playSound(type, options);

export const enableSounds = (enabled: boolean) =>
  soundEngine.setEnabled(enabled);
export const setSoundVolume = (volume: number) =>
  soundEngine.setMasterVolume(volume);

// Initialize with user preferences
if (typeof window !== "undefined") {
  const savedSoundSetting = localStorage.getItem("vaultrun_sound");
  if (savedSoundSetting !== null) {
    enableSounds(savedSoundSetting === "true");
  }
}
