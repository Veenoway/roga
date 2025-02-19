"use client";
import { WalletConnection } from "@/components/connector";
import { useRelayer } from "@/hook/useRelayer";
import { useOpenStore } from "@/store/useConnectionStore";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useAccount } from "wagmi";

interface SpecialImageData {
  src: string;
  probability: number;
}

interface SpecialImage extends SpecialImageData {
  triggered: boolean;
}

interface SpecialImageOnScreen {
  id: number;
  src: string;
  x: number;
  y: number;
}

interface Track {
  src: string;
  lyrics: string[];
}

interface DiscoImageState {
  src: string;
  x: number;
  y: number;
}

interface ZoneDimensions {
  top: number;
  left: number;
  width: number;
  height: number;
}

const DISCO_IMAGES = [
  { src: "image1.png", zone: 2 },
  { src: "image2.png", zone: 3 },
  { src: "image3.png", zone: 1 },
  { src: "image4.png", zone: 2 },
  { src: "image5.png", zone: 2 },
  { src: "image6.png", zone: 2 },
  { src: "image7.png", zone: 3 },
  { src: "image8.png", zone: 1 },
  { src: "image9.png", zone: 2 },
  { src: "image10.png", zone: 1 },
  { src: "image11.png", zone: 2 },
  { src: "image12.png", zone: 2 },
  { src: "image13.png", zone: 2 },
  { src: "image14.png", zone: 2 },
  { src: "image15.png", zone: 3 },
  { src: "image16.png", zone: 3 },
];

const SPECIAL_IMAGES_DATA = [
  { src: "special1.png", probability: 10 },
  { src: "special2.png", probability: 5 },
  { src: "special3.png", probability: 2 },
  { src: "special4.png", probability: 1 },
  { src: "special5.png", probability: 0.1 },
  { src: "special6.png", probability: 0.01 },
  { src: "special7.png", probability: 0.001 },
  { src: "special8.png", probability: 0.0001 },
];

// Exemples de morceaux et lyrics
const TRACKS: Track[] = [
  {
    src: "song1.mp3",
    lyrics: [
      "[Verse 1]",
      "Monad",
      "Monad purple",
      "Monad wonderful world",
      "Monad",
      "Monad's testnet time",
      "All others people clic",
      "10k TPS",
      "Let's dance",
      "",
      "[Chorus]",
      "(oo-yeah!) Monad (oo)",
      "(oo-yeah!) Testnet (oo)",
      "(oo-yeah!) TPS (heh)",
      "(oo-yeah!) Let's dance (x2)",
      "Who are you?",
      "I'm Monada",
      "Who's that?",
      "Monada",
      "I don't understand",
      "Another diamond!",
      "Let's dance!",
      "",
      "[Verse 2]",
      "All nads",
      "All monoanimals",
      "Let's dance",
      "",
      "[Chorus]",
      "NPC",
      "Woah",
      "(oo-yeah) Valid",
      "NPC",
      "Woah",
      "Nading (oo)",
      "NPC",
      "Woah",
      "So valid",
      "Ennoda (AI drunk)",
      "Selloda (AI on crack)",
      "Nad",
      "",
      "[Bridge]",
      "Hey Monada",
      "What's that?",
      "“Beep-bop”",
      "Ko nikuka gero",
      "Monoanimals walking on 'nads (ofc)",
      "Perform loader (?)",
      "Performer (!)",
      "",
      "[Verse 3]",
      "Gos and cloudbuzz (AI on blunt)",
      "Ciccles and lolyers (AI on cocaine)",
      "Dance !",
      "",
      "[Chorus]",
      "(oo-yeah!) Monad (oo)",
      "(oo-yeah!) Testnet (oo)",
      "(oo-yeah!) TPS (heh)",
      "(oo-yeah!) Let's dance (x2)",
      "",
      "[Final]",
      "All nads,",
      "Monad",
      "All nads,",
      "Monad",
      "Let's dance !",
    ],
  },
  {
    src: "song2.mp3",
    lyrics: [
      "Listen to the ground",
      "There is movement all around",
      "There is something goin' down",
      "And I can feel it",
      "",
      "On the waves of the air",
      "There is dancin' out there",
      "If it's somethin' we can share",
      "We can steal it",
      "",
      "And that sweet city woman",
      "She moves through the light",
      "Controlling my mind and my soul",
      "When you reach out for me",
      "Yeah, and the feelin' is right",
      "",
      "Then I get night fever, night fever",
      "We know how to do it",
      "Gimme that night fever, night fever",
      "We know how to show it",
      "",
      "Here I am",
      "Prayin' for this moment to last",
      "Livin' on the music so fine",
      "Borne on the wind",
      "Makin' it mine",
      "",
      "Night fever, night fever",
      "We know how to do it",
      "Gimme that night fever, night fever",
      "We know how to show it",
      "",
      "In the heat of our love",
      "Don't need no help for us to make it",
      "Gimme just enough to take us to the mornin'",
      "I got fire in my mind",
      "I get higher in my walkin'",
      "And I'm glowin' in the dark",
      "Give you warnin'",
      "",
      "And that sweet city woman",
      "She moves through the night",
      "Controlling my mind and my soul",
      "When you reach out for me",
      "Yeah, and the feelin' is right",
      "",
      "That night fever, night fever",
      "We know how to do it",
      "Gimme that night fever, night fever",
      "We know how to show it",
      "",
      "Here I am",
      "Prayin' for this moment to last",
      "Livin' on the music so fine",
      "Borne on the wind",
      "Makin' it mine",
      "",
      "Night fever, night fever",
      "We know how to do it",
      "Gimme that night fever, night fever",
      "We know how to show it",
      "",
      "Gimme that night fever, night fever",
      "We know how to do it",
    ],
  },
  {
    src: "song3.mp3",
    lyrics: [
      "Dance, Boogie Wonderland, hey, hey",
      "Dance, Boogie Wonderland",
      "",
      "Midnight creeps so slowly into hearts of men",
      "Who need more than they get",
      "Daylight deals a bad hand to a woman",
      "Who has laid too many bets",
      "",
      "The mirror stares you in the face and says",
      '"Baby, uh, uh, it don’t work"',
      "You say your prayers though you don't care",
      "You dance and shake the hat",
      "",
      "Dance, Boogie Wonderland, hey, hey",
      "Dance, Boogie Wonderland",
      "",
      "Sound fly through the night",
      "I chase my vinyl dreams to Boogie Wonderland",
      "I find romance when I start to dance in Boogie Wonderland",
      "I find romance when I start to dance in Boogie Wonderland",
      "",
      "All the love in the world can't be gone",
      "All the need to be loved can't be wrong",
      "All the records are playing and my heart keeps saying",
      '"Boogie Wonderland, Wonderland"',
      "",
      "Dance, Boogie Wonderland, hey, hey",
      "Dance, Boogie Wonderland, hey, hey",
      "",
      "I find romance when I start to dance in Boogie Wonderland",
      "I find romance when I start to dance in Boogie Wonderland",
      "Dance, dance (Boogie Wonderland), dance, dance",
      "Dance, dance (Boogie Wonderland), dance, dance",
      "",
      "Wonderland",
      "Wonderland",
      "",
      "All the love in the world can't be gone (love in the world can't be gone)",
      "All the need to be loved can't be wrong (need to be loved can't be wrong)",
      "All the records are playing and my heart keeps saying",
      "Boogie Wonderland, Wonderland",
      "",
      "Dance, Boogie Wonderland, hey, hey",
      "Dance, Boogie Wonderland, hey, hey",
      "",
      "I find romance when I start to dance in Boogie Wonderland",
      "I find romance when I start to dance in Boogie Wonderland",
      "Dance, dance, dance (Boogie Wonderland), dance, dance, dance, dance",
      "Dance, dance (Boogie Wonderland), dance",
    ],
  },
  {
    src: "song4.mp3",
    lyrics: [
      "Do you remember",
      "The 21st night of September?",
      "Love was changin' the minds of pretenders",
      "While chasin' the clouds away",
      "",
      "Our hearts were ringin'",
      "In the key that our souls were singin'",
      "As we danced in the night, remember",
      "How the stars stole the night away, oh, yeah",
      "",
      "Hey, hey, hey",
      "Ba-dee-ya, say, do you remember?",
      "Ba-dee-ya, dancin' in September",
      "Ba-dee-ya, never was a cloudy day",
      "",
      "Ba-du-da, ba-du-da, ba-du-da, ba-du",
      "Ba-du-da, ba-du, ba-du-da, ba-du",
      "Ba-du-da, ba-du, ba-du-da",
      "",
      "My thoughts are with you",
      "Holdin' hands with your heart to see you",
      "Only blue talk and love, remember",
      "How we knew love was here to stay",
      "",
      "Now December",
      "Found the love that we shared in September",
      "Only blue talk and love, remember",
      "The true love we share today",
      "",
      "Hey, hey, hey",
      "Ba-dee-ya, say, do you remember?",
      "Ba-dee-ya, dancin' in September",
      "Ba-dee-ya, never was a cloudy day",
      "There was a",
      "Ba-dee-ya (dee-ya, dee-ya), say, do you remember?",
      "Ba-dee-ya (dee-ya, dee-ya), dancin' in September",
      "Ba-dee-ya (dee-ya, dee-ya), golden dreams were shiny days",
      "",
      "The bell was ringin', oh, oh",
      "Our souls were singin'",
      "Do you remember never a cloudy day? Yow",
      "",
      "There was a",
      "Ba-dee-ya (dee-ya, dee-ya), say, do you remember?",
      "Ba-dee-ya (dee-ya, dee-ya), dancin' in September",
      "Ba-dee-ya (dee ya, dee-ya), golden dreams were shiny days",
      "",
      "Ba-dee-ya, dee-ya, dee-ya",
      "Ba-dee-ya, dee-ya, dee-ya",
      "Ba-dee-ya, dee-ya, dee-ya, dee-ya!",
      "Ba-dee-ya, dee-ya, dee-ya",
      "Ba-dee-ya, dee-ya, dee-ya",
      "Ba-dee-ya, dee-ya, dee-ya, dee-ya!",
    ],
  },
];

const TILE_COLORS = [
  "#FF00FF",
  "#DA70D6",
  "#9370DB",
  "#8A2BE2",
  "#4B0082",
  "#0000FF",
  "#1E90FF",
  "#00FFFF",
];

const BACKGROUND_COLORS = [
  "#FF1493",
  "#FF69B4",
  "#FF00FF",
  "#FFB6C1",
  "#FF69B4",
  "#FF82AB",
  "#8A2BE2",
  "#9400D3",
  "#9932CC",
  "#BA55D3",
  "#DA70D6",
  "#EE82EE",
  "#0000FF",
  "#1E90FF",
  "#00BFFF",
  "#87CEFA",
  "#00CED1",
  "#48D1CC",
  "#00FF00",
  "#7FFF00",
  "#00FF7F",
  "#98FB98",
  "#FFD700",
  "#FFA500",
  "#FF8C00",
  "#FF7F50",
  "#FF0000",
  "#FF4500",
  "#FF6347",
  "#FF00FF",
  "#00FFFF",
  "#FF1493",
  "#14FFB1",
  "#F4C2C2",
  "#C2F4E7",
  "#C2C2F4",
  "#F4C2F4",
];

const useLastImageIndex = () => {
  return useRef<{ [zone: number]: number }>({});
};

export const Home: React.FC = () => {
  const { address } = useAccount();
  const { setOpen } = useOpenStore();
  const { click } = useRelayer();

  // Références pour le conteneur principal et la grille du dancefloor
  const containerRef = useRef<HTMLDivElement>(null);
  const dancefloorRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const lastImageIndexPerZone = useLastImageIndex();

  const [clickCount, setClickCount] = useState<number>(0);
  const [gridSize, setGridSize] = useState<number>(
    window.innerWidth <= 768 ? 12 : 15
  );
  const [tileColors, setTileColors] = useState<string[]>(
    Array.from(
      { length: gridSize * gridSize },
      () => TILE_COLORS[Math.floor(Math.random() * TILE_COLORS.length)]
    )
  );
  const [backgroundGradient, setBackgroundGradient] = useState<string>(
    "linear-gradient(30deg, #836EF9, #FF00FF)"
  );
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [collectionImages, setCollectionImages] = useState<string[]>([]);
  const [discoImage, setDiscoImage] = useState<DiscoImageState | null>(null);
  const [specialImagesOnScreen, setSpecialImagesOnScreen] = useState<
    SpecialImageOnScreen[]
  >([]);
  const [showPopup, setShowPopup] = useState<boolean>(true);

  const specialImagesRef = useRef<SpecialImage[]>(
    SPECIAL_IMAGES_DATA.map((img) => ({ ...img, triggered: false }))
  );

  // Recalcule la grille lors d'un redimensionnement
  useEffect(() => {
    const handleResize = () => {
      const newSize = window.innerWidth <= 768 ? 12 : 15;
      setGridSize(newSize);
      setTileColors(
        Array.from(
          { length: newSize * newSize },
          () => TILE_COLORS[Math.floor(Math.random() * TILE_COLORS.length)]
        )
      );
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getRandomColor = useCallback((colors: string[]): string => {
    return colors[Math.floor(Math.random() * colors.length)];
  }, []);

  const updateTileColors = () => {
    setTileColors(
      Array.from({ length: gridSize * gridSize }, () =>
        getRandomColor(TILE_COLORS)
      )
    );
  };

  const setRandomGradient = () => {
    const color1 = getRandomColor(BACKGROUND_COLORS);
    const color2 = getRandomColor(BACKGROUND_COLORS);
    const angle = Math.floor(Math.random() * 360);
    setBackgroundGradient(`linear-gradient(${angle}deg, ${color1}, ${color2})`);
  };

  // Calcule les dimensions (en viewport) d'une zone sur la grille
  const getZoneDimensions = (zoneNumber: number): ZoneDimensions | null => {
    if (!dancefloorRef.current) return null;
    const rect = dancefloorRef.current.getBoundingClientRect();
    const zoneHeight = rect.height / 3;
    const verticalShift = 20;
    const extraUpShift = 40;
    const zone: ZoneDimensions = {
      top: rect.top - verticalShift - extraUpShift,
      left: rect.left,
      width: rect.width,
      height: zoneHeight,
    };
    if (zoneNumber === 1) {
      zone.width = rect.width * 0.4;
      zone.left = rect.left + (rect.width - zone.width) / 2;
      zone.top += 40;
    } else if (zoneNumber === 2) {
      zone.width = rect.width * 0.7;
      zone.left = rect.left + (rect.width - zone.width) / 2;
      zone.top = rect.top + zoneHeight - verticalShift - extraUpShift;
    } else if (zoneNumber === 3) {
      zone.width = rect.width * 0.9;
      zone.left = rect.left + (rect.width - zone.width) / 2;
      zone.top = rect.top + 2 * zoneHeight - verticalShift - extraUpShift;
      zone.height = zone.height * 0.5;
    }
    return zone;
  };

  // Sélectionne séquentiellement une image disco dans une zone
  const createSingleImage = () => {
    const zoneNumber = Math.floor(Math.random() * 3) + 1;
    const zone = getZoneDimensions(zoneNumber);
    if (!zone || !dancefloorRef.current || !containerRef.current) return;
    const availableImages = DISCO_IMAGES.filter(
      (img) => img.zone === zoneNumber
    );

    // Initialisation de l'indice pour la zone si nécessaire
    if (lastImageIndexPerZone.current[zoneNumber] === undefined) {
      lastImageIndexPerZone.current[zoneNumber] = 0;
    } else {
      // Incrémente l'indice et boucle
      lastImageIndexPerZone.current[zoneNumber] =
        (lastImageIndexPerZone.current[zoneNumber] + 1) %
        availableImages.length;
    }
    const chosenImage =
      availableImages[lastImageIndexPerZone.current[zoneNumber]];

    const imgWidth = 250;
    const imgHeight = 135;
    const randomFactor = 1 - Math.pow(Math.random(), 2);
    // Calcul en viewport basé sur la zone
    const randomX =
      zone.left + randomFactor * Math.max(0, zone.width - imgWidth);
    const randomY =
      zone.top + Math.random() * Math.max(0, zone.height - imgHeight);
    // Conversion en coordonnées relatives au conteneur principal
    const containerRect = containerRef.current.getBoundingClientRect();
    const relativeX = randomX - containerRect.left;
    const relativeY = randomY - containerRect.top;
    setDiscoImage({
      src: chosenImage.src,
      x: relativeX,
      y: relativeY,
    });
  };

  const spawnSpecialImages = () => {
    specialImagesRef.current.forEach((special, index) => {
      if (!special.triggered && Math.random() * 100 < special.probability) {
        specialImagesRef.current[index].triggered = true;
        createSpecialImage(special);
      }
    });
  };

  const createSpecialImage = (special: SpecialImage) => {
    const zone = getZoneDimensions(3);
    if (!zone || !dancefloorRef.current || !containerRef.current) return;
    const imgWidth = 200;
    const imgHeight = 200;
    const randomFactor = 1 - Math.pow(Math.random(), 2);
    const randomX =
      zone.left + randomFactor * Math.max(0, zone.width - imgWidth);
    const randomY =
      zone.top + Math.random() * Math.max(0, zone.height - imgHeight);
    const containerRect = containerRef.current.getBoundingClientRect();
    const relativeX = randomX - containerRect.left;
    const relativeY = randomY - containerRect.top;
    const specialObj: SpecialImageOnScreen = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      src: special.src,
      x: relativeX,
      y: relativeY - 50, // même ajustement vertical
    };
    setSpecialImagesOnScreen((prev) => [...prev, specialObj]);
    setTimeout(() => {
      setSpecialImagesOnScreen((prev) =>
        prev.filter((img) => img.id !== specialObj.id)
      );
    }, 5000);
  };

  const collectSpecialImage = (
    id: number,
    src: string,
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setSpecialImagesOnScreen((prev) => prev.filter((img) => img.id !== id));
    setCollectionImages((prev) => [...prev, src]);
  };

  const handleContainerClick = async () => {
    if (!address) {
      setOpen(true);
      return;
    }
    setClickCount((prev) => prev + 1);
    updateTileColors();
    setRandomGradient();
    createSingleImage();
    spawnSpecialImages();
    click(address as `0x${string}`);
  };

  const handleMusicToggle = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play().catch((err) => console.error(err));
    } else {
      audioRef.current.pause();
    }
  };

  const handleNextTrack = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  };

  const handlePrevTrack = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = TRACKS[currentTrackIndex].src;
      audioRef.current.play().catch((err) => console.error(err));
    }
  }, [currentTrackIndex]);

  const handleTwitterLogoClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.stopPropagation();
  };

  return (
    <>
      <WalletConnection />
      <div
        ref={containerRef}
        style={{
          margin: 0,
          minHeight: "100vh",
          width: "100vw",
          position: "relative",
          background: backgroundGradient || "black",
          overflow: "hidden",
        }}
        onClick={handleContainerClick}
      >
        {showPopup && (
          <div
            id="popup-overlay"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10000,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              id="popup"
              style={{
                background: "#222",
                padding: "30px",
                border: "3px solid #FF00FF",
                borderRadius: "10px",
                textAlign: "center",
                fontFamily: "'Luckiest Guy', cursive",
                color: "#fff",
                boxShadow: "0 0 20px #FF00FF",
                maxWidth: "90%",
              }}
            >
              <h1 style={{ margin: "0 0 20px", fontSize: "32px" }}>
                Discomon is Here to Get You Moving!
              </h1>
              <p>Are you ready to lose yourself on the dance floor?</p>
              <p>Crank up the volume and let the beat groove!</p>
              <p>
                Click on the screen to make us dance, and collect the 8 special
                partygoers that will join the party!
              </p>
              <p>
                Our amazing partners have awesome prizes lined up for you every
                week!
              </p>
              <p>
                So now, show Mon Travolta you&apos;re better than him by
                unleashing our best choreography!
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowPopup(false);
                  handleContainerClick();
                }}
                style={{
                  background: "linear-gradient(45deg, #FF00FF, #00FFFF)",
                  border: "none",
                  color: "#fff",
                  fontSize: "16px",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  boxShadow: "0 0 10px #FF00FF, 0 0 20px #FF00FF",
                }}
              >
                Start Game
              </button>
            </div>
          </div>
        )}
        <img
          src="Encart.png"
          alt="Votre Description"
          id="top-left-image"
          style={{
            position: "fixed",
            top: 20,
            left: 20,
            width: 240,
            zIndex: 1000,
          }}
          onClick={(e) => e.stopPropagation()}
        />
        <img
          src="discologo.png"
          alt="Logo Disco"
          className="header-image"
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "25vw",
            minWidth: 150,
            maxWidth: 300,
            zIndex: 900,
          }}
          onClick={(e) => e.stopPropagation()}
        />
        {/* Conteneur du dancefloor transformé */}
        <div
          className="main-container"
          style={{
            perspective: "2000px",
            width: "98vw",
            height: "90vh",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            position: "absolute",
            bottom: "-20vh",
          }}
        >
          <div
            className="dancefloor-container"
            style={{
              position: "relative",
              transform: "rotateX(75deg)",
              transformStyle: "preserve-3d",
              width: "min(95vh,95vw)",
              height: "min(95vh,95vw)",
            }}
          >
            {/* Grille du dancefloor */}
            <div
              className="dancefloor"
              ref={dancefloorRef}
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                gap: "0.3%",
                width: "100%",
                height: "100%",
                backgroundColor: "black",
                padding: "0.3%",
                position: "relative",
                zIndex: 1,
              }}
            >
              {Array.from({ length: gridSize * gridSize }).map((_, i) => (
                <div
                  key={i}
                  className={`tile ${i < gridSize ? "first-row" : ""}`}
                  style={{
                    position: "relative",
                    backgroundColor: tileColors[i],
                    border: "1px solid rgba(255,255,255,0.2)",
                    transition: "background-color 0.3s",
                    aspectRatio: "1",
                    zIndex: 1,
                  }}
                >
                  {i < gridSize && (
                    <div
                      style={{
                        position: "absolute",
                        width: "100%",
                        height: 20,
                        backgroundColor: "inherit",
                        bottom: -20,
                        transform: "rotateX(-90deg)",
                        transformOrigin: "top",
                        filter: "brightness(0.7)",
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Overlay pour les images, placé directement dans le conteneur principal */}
        {discoImage && (
          <img
            src={discoImage.src}
            alt="Disco"
            style={{
              position: "absolute",
              transform: "translate(-50%, -50%)",
              zIndex: 9999,
              width: 250,
              height: "auto",
              objectFit: "contain",
              left: discoImage.x,
              top: discoImage.y,
              pointerEvents: "none",
            }}
          />
        )}
        {specialImagesOnScreen.map((img) => (
          <img
            key={img.id}
            src={img.src}
            alt="Special"
            style={{
              position: "absolute",
              transform: "translate(-50%, -50%)",
              zIndex: 9999,
              cursor: "pointer",
              width: 200,
              height: "auto",
              objectFit: "contain",
              left: img.x,
              top: img.y,
            }}
            onClick={(e) => collectSpecialImage(img.id, img.src, e)}
          />
        ))}
        <div
          id="tx-counter"
          style={{
            position: "fixed",
            bottom: 480,
            right: 20,
            width: 220,
            background: "linear-gradient(45deg, #00FFFF, #FF00FF)",
            color: "#fff",
            padding: "5px 10px",
            borderRadius: "5px",
            fontFamily: "'Luckiest Guy', cursive",
            fontSize: 20,
            textAlign: "center",
            zIndex: 10000,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          tx number: {clickCount}
        </div>
        <div
          id="collection"
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            background: "linear-gradient(45deg, #FF00FF, #00FFFF)",
            color: "#fff",
            width: 240,
            height: 450,
            padding: 10,
            borderRadius: 5,
            zIndex: 10000,
            display: "flex",
            flexDirection: "column",
            boxSizing: "border-box",
            fontFamily: "'Luckiest Guy', cursive",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="collection-title"
            style={{
              fontSize: 24,
              textAlign: "center",
              marginBottom: 5,
              textShadow: "0 0 5px #FF00FF, 0 0 10px #FF00FF, 0 0 20px #FF00FF",
            }}
          >
            character collection
          </div>
          <div
            className="collection-imgs"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gridAutoRows: "auto",
              gap: 5,
              flexGrow: 1,
              overflowY: "auto",
            }}
          >
            {collectionImages.map((src, index) => (
              <img
                key={index}
                src={src}
                alt="Collected"
                style={{
                  maxWidth: 80,
                  maxHeight: 80,
                  objectFit: "contain",
                  width: "100%",
                  height: "auto",
                }}
              />
            ))}
          </div>
        </div>
        <div
          id="music-container"
          style={{
            position: "fixed",
            bottom: 480,
            left: 20,
            width: 240,
            display: "flex",
            justifyContent: "center",
            gap: 10,
            zIndex: 10000,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handlePrevTrack}
            style={{
              background: "linear-gradient(45deg, #FF00FF, #00FFFF)",
              border: "none",
              color: "#fff",
              fontSize: 20,
              padding: "10px 15px",
              borderRadius: 5,
              cursor: "pointer",
              boxShadow: "0 0 10px #FF00FF, 0 0 20px #FF00FF",
            }}
          >
            ⏮
          </button>
          <button
            onClick={handleMusicToggle}
            style={{
              background: "linear-gradient(45deg, #FF00FF, #00FFFF)",
              border: "none",
              color: "#fff",
              fontSize: 20,
              padding: "10px 15px",
              borderRadius: 5,
              cursor: "pointer",
              boxShadow: "0 0 10px #FF00FF, 0 0 20px #FF00FF",
            }}
          >
            🎵
          </button>
          <button
            onClick={handleNextTrack}
            style={{
              background: "linear-gradient(45deg, #FF00FF, #00FFFF)",
              border: "none",
              color: "#fff",
              fontSize: 20,
              padding: "10px 15px",
              borderRadius: 5,
              cursor: "pointer",
              boxShadow: "0 0 10px #FF00FF, 0 0 20px #FF00FF",
            }}
          >
            ⏭
          </button>
        </div>
        <div
          id="lyrics"
          style={{
            position: "fixed",
            bottom: 20,
            left: 20,
            background: "linear-gradient(45deg, #FF00FF, #00FFFF)",
            color: "#fff",
            width: 240,
            height: 450,
            padding: 10,
            borderRadius: 5,
            zIndex: 1000000,
            display: "flex",
            flexDirection: "column",
            boxSizing: "border-box",
            overflowY: "auto",
            fontFamily: "'Luckiest Guy', cursive",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="lyrics-title"
            style={{
              fontSize: 24,
              textAlign: "center",
              marginBottom: 5,
              textShadow: "0 0 5px #FF00FF, 0 0 10px #FF00FF, 0 0 20px #FF00FF",
            }}
          >
            Lyrics
          </div>
          <div
            className="lyrics-content"
            style={{
              flexGrow: 1,
              fontSize: 16,
              lineHeight: 1.4,
              whiteSpace: "pre-wrap",
            }}
          >
            {TRACKS[currentTrackIndex].lyrics.join("\n")}
          </div>
        </div>
        <audio ref={audioRef} loop style={{ display: "none" }} />
        <a
          href="https://twitter.com/VotreCompteTwitter"
          target="_blank"
          rel="noopener noreferrer"
          id="twitter-logo"
          onClick={handleTwitterLogoClick}
          style={{
            position: "fixed",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10000,
          }}
        >
          <img src="twitter-logo.png" alt="Twitter" style={{ width: 50 }} />
        </a>
        <style>{`
          .tile.first-row::after {
            content: '';
            position: absolute;
            width: 100%;
            height: 20px;
            background-color: inherit;
            bottom: -20px;
            transform: rotateX(-90deg);
            transform-origin: top;
            filter: brightness(0.7);
          }
        `}</style>
      </div>
    </>
  );
};
