// Hooks
import { useEffect, useRef, useState } from 'react'
// Image sources
import omniNormalImg from '/img/omniman.webp'
import omniThiccImg from '/img/omnithicc.webp'
// Audios
import introSound from '/audio/intro.mp3'
import bamSound from '/audio/bam.mp3'
// Styles
import './style.scss'


// Animation duration in milliseconds
const animationDuration = 500;
// Class name for each playing state
const stateClass = Object.freeze({
  normal: "normal",
  thicc: "thicc"
});

function App() {
  // Audio player for intro sound
  const introPlayer = useRef(null);
  // Audio player for BAM sound when Omniman is THICC
  const bamPlayer = useRef(null);

  // Determines if thicc animation is being played
  const [ isPlaying, setPlaying ] = useState(false);
  // Current source for Omniman image
  const [ imageSource, setImageSource ] = useState(omniNormalImg);
  // Last document visibility (used to prevent double call)
  const [ lastVisibility, setLastVisibility ] = useState(true);


  // Starts page load intro
  function onIntro() {
    setImageSource(omniNormalImg);
    introPlayer.current.play();
  }
  // Plays Omniman thicc animation and audio
  function playThicc() {
    if (isPlaying) return;
    // First, change image source to THICC and remember that we're playing 
    setPlaying(true);
    setImageSource(omniThiccImg);
    // Second, Every audio should be stopped and reset before playing bam sound, so no sound is being
    // playing at the same time or being started from wrong time.
    introPlayer.current.pause();
    introPlayer.current.currentTime = 0;
    bamPlayer.current.pause();
    bamPlayer.current.currentTime = 0;
    // Don't forget to play BAM audio when omniman is THICC
    bamPlayer.current.play();

    // After animation had been played, set image back to normal Omniman
    setTimeout(() => {
      setPlaying(false);
      setImageSource(omniNormalImg);
    }, animationDuration);
  }

  useEffect(() => {
    // Intro should be played on page load
    window.addEventListener('load', onIntro);
    // When tab is switched back, play THICC animation.
    // To prevent double call, we're checking if document visibility truly changed or not.
    document.addEventListener('visibilitychange', () => {
      if (document.hidden === lastVisibility) return;
      setLastVisibility(document.hidden);
      if (document.hidden) return;
      // Animation is played only when document is visible and visibility state changed.
      playThicc();
    });
  }, [])

  return (
    <div 
      id="container"
      className={isPlaying ? stateClass.thicc : stateClass.normal}>
      <img 
        id="omni_img"
        onClick={playThicc}
        className={isPlaying ? stateClass.thicc : stateClass.normal}
        src={imageSource}/>
      <audio 
        ref={introPlayer} 
        src={introSound}/>
      <audio 
        ref={bamPlayer}
        src={bamSound}/>
    </div>
  )
}

export default App
