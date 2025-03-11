import React, { useRef, useState, useEffect } from 'react';
import Hls from 'hls.js';
import ReactPlayer from 'react-player';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import { Box, IconButton, Slider, Typography, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const PlayerContainer = styled(Paper)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.05)',
  borderRadius: '20px',
  padding: theme.spacing(4),
  width: '100%',
  maxWidth: '500px',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
  backdropFilter: 'blur(15px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.02)',
  },
}));

const ControlButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  margin: theme.spacing(1.5),
  padding: theme.spacing(1.5),
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const App: React.FC = () => {
  const playerRef = useRef<ReactPlayer>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState<boolean>(false);
  const [muted, setMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.5);
  const [progress, setProgress] = useState<number>(0);
  const [hlsSupported, setHlsSupported] = useState<boolean>(false);

  const HLS_URL = '............m3u8';

  useEffect(() => {
    // Check if HLS is supported natively or via hls.js
    if (Hls.isSupported()) {
      setHlsSupported(true);
      const hls = new Hls();
      if (audioRef.current) {
        hls.loadSource(HLS_URL);
        hls.attachMedia(audioRef.current);
      }
    } else if (audioRef.current?.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS support (e.g., Safari)
      setHlsSupported(true);
      if (audioRef.current) {
        audioRef.current.src = HLS_URL;
      }
    }
  }, []);

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleMute = () => {
    setMuted(!muted);
  };

  const handleVolumeChange = (_event: Event, newValue: number | number[]) => {
    const newVolume = (newValue as number) / 100;
    setVolume(newVolume);
    setMuted(newVolume === 0);
  };

  const handleProgress = (state: { played: number }) => {
    setProgress(state.played * 100);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(to bottom right, #0d1a26, #1a2a44)',
        backgroundImage: 'url(https://images.unsplash.com/photo-1554050855-c84a7d7d5256?q=80&w=1887&auto=format&fit=crop)', // Optional background image
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: 4,
      }}
    >
      <PlayerContainer elevation={5}>
        <Typography variant="h4" align="center" sx={{ color: 'white', mb: 4, fontWeight: 'bold', letterSpacing: '1px' }}>
           HLS Player
        </Typography>
        {hlsSupported ? (
          <>
            <audio ref={audioRef} style={{ display: 'none' }} />
            <ReactPlayer
              ref={playerRef}
              url={HLS_URL}
              playing={playing}
              muted={muted}
              volume={volume}
              width="0px"
              height="0px"
              onProgress={handleProgress}
              config={{
                file: {
                  forceHLS: true,
                },
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <ControlButton onClick={handlePlayPause}>
                {playing ? <FaPause size={24} /> : <FaPlay size={24} />}
              </ControlButton>
              <ControlButton onClick={handleMute}>
                {muted ? <FaVolumeMute size={24} /> : <FaVolumeUp size={24} />}
              </ControlButton>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', px: 3, mb: 3 }}>
              <Slider
                value={volume * 100}
                onChange={handleVolumeChange}
                min={0}
                max={100}
                sx={{
                  color: '#1976d2',
                  '& .MuiSlider-thumb': {
                    backgroundColor: '#fff',
                    width: 16,
                    height: 16,
                  },
                  '& .MuiSlider-track': {
                    height: 6,
                  },
                  '& .MuiSlider-rail': {
                    height: 6,
                    opacity: 0.3,
                  },
                }}
              />
              <Typography sx={{ color: 'white', ml: 3, minWidth: '40px' }}>
                {Math.round(volume * 100)}%
              </Typography>
            </Box>
            <Box sx={{ px: 3 }}>
              <Slider
                value={progress}
                min={0}
                max={100}
                disabled
                sx={{
                  color: '#1976d2',
                  '& .MuiSlider-thumb': {
                    display: 'none',
                  },
                  '& .MuiSlider-track': {
                    height: 6,
                  },
                  '& .MuiSlider-rail': {
                    height: 6,
                    opacity: 0.3,
                  },
                }}
              />
              <Typography sx={{ color: 'white', textAlign: 'center', mt: 2, fontSize: '14px' }}>
                {Math.round(progress)}% played
              </Typography>
            </Box>
          </>
        ) : (
          <Typography sx={{ color: 'white', textAlign: 'center' }}>
            HLS playback is not supported in this browser.
          </Typography>
        )}
      </PlayerContainer>
    </Box>
  );
};

export default App;