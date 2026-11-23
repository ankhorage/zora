import {
  Carousel,
  type CarouselSlide,
  type CarouselTransition,
} from '@ankhorage/zora/web/carousel';
import { ZoraProvider } from '@ankhorage/zora/web/runtime';
import React from 'react';
import { createRoot } from 'react-dom/client';

interface Story {
  readonly key: string;
  readonly image: string;
  readonly number: string;
  readonly category: string;
  readonly title: string;
  readonly description: string;
  readonly signature: string;
}

const stories: readonly Story[] = [
  {
    key: 'horizon',
    image: '/media/01-horizon.svg',
    number: '01',
    category: 'FIND YOUR PERSPECTIVE',
    title: 'Beyond the ordinary.',
    description:
      'The best ideas start where the familiar ends. Make room for discovery, exploration, and the next big thing.',
    signature: 'EXPLORATION / UNLIMITED',
  },
  {
    key: 'orbit',
    image: '/media/02-orbit.svg',
    number: '02',
    category: 'DESIGNED FOR MOMENTUM',
    title: 'Make every moment move.',
    description:
      'Fluid interactions, deliberate motion, and beautiful details. Experiences that feel as good as they look.',
    signature: 'MOTION / WITH PURPOSE',
  },
  {
    key: 'form',
    image: '/media/03-form.svg',
    number: '03',
    category: 'A NEW KIND OF CREATIVE',
    title: 'Ideas deserve a stage.',
    description:
      'Give bold thinking a memorable presence. Every frame is an invitation to discover what comes next.',
    signature: 'CREATIVE / NO COMPROMISE',
  },
  {
    key: 'platform',
    image: '/media/04-platform.svg',
    number: '04',
    category: 'ONE VISION. EVERYWHERE.',
    title: 'Beautiful on every screen.',
    description:
      'Create once, delight everywhere. Native interaction and the open web, built on one shared experience.',
    signature: 'NATIVE + WEB / ONE SYSTEM',
  },
];

/*** A complete four-scene public API example with live Carousel configuration. */
function CarouselExample() {
  const [index, setIndex] = React.useState(0);
  const [transition, setTransition] = React.useState<CarouselTransition>('fade');
  const [intervalMs, setIntervalMs] = React.useState(6000);
  const [autoPlay, setAutoPlay] = React.useState(true);
  const [showArrows, setShowArrows] = React.useState(true);
  const [showProgress, setShowProgress] = React.useState(true);
  const [showIndicators, setShowIndicators] = React.useState(true);
  const [reducedMotion, setReducedMotion] = React.useState(false);

  const slides: readonly CarouselSlide[] = stories.map((story) => ({
    key: story.key,
    source: story.image,
    alt: '',
    content: (
      <article className="scene" key={story.key}>
        <div className="scene__shade" />
        <div className="scene__top">
          <span className="scene__eyebrow">
            <span className="scene__pulse" />
            {story.category}
          </span>
          <span className="scene__edition">ZORA / EDITION 2026</span>
        </div>
        <div className="scene__body">
          <p className="scene__number">{story.number} / 04</p>
          <h2>{story.title}</h2>
          <p className="scene__description">{story.description}</p>
          <button
            className="scene__cta"
            onClick={() => setIndex((current) => (current + 1) % 4)}
          >
            Explore the next story <span aria-hidden="true">↗</span>
          </button>
        </div>
        <div className="scene__bottom">
          <span>ANKHORAGE / ZORA</span>
          <span>{story.signature}</span>
        </div>
      </article>
    ),
  }));

  return (
    <main className="page">
      <header className="masthead">
        <div className="brand">
          <span className="brand__mark">Z</span>
          <span className="brand__name">
            ZORA <small>COMPONENT LAB</small>
          </span>
        </div>
        <span className="masthead__meta">
          REACT NATIVE <b>+</b> WEB / INTERACTIVE EXAMPLE
        </span>
      </header>
      <div className="intro">
        <div>
          <div className="kicker">
            <span /> THE PRESENTATION COLLECTION
          </div>
          <h1>
            Stories in motion<span>.</span>
          </h1>
          <p>
            One reusable Carousel. Four original visual worlds. Infinite ways to tell your story.
          </p>
        </div>
        <div className="intro__counter">
          <span>NOW SHOWING</span>
          <strong>
            0{index + 1} <i>/ 04</i>
          </strong>
        </div>
      </div>
      <div className="carousel-frame">
        <Carousel
          slides={slides}
          index={index}
          onIndexChange={setIndex}
          autoPlay={autoPlay}
          paused={false}
          loop
          intervalMs={intervalMs}
          transition={transition}
          enterDurationMs={1200}
          exitDurationMs={800}
          initialScale={1.06}
          reducedMotion={reducedMotion}
          showArrows={showArrows}
          showProgress={showProgress}
          showIndicators={showIndicators}
          progressHeight={3}
          progressTrackColor="rgba(255,255,255,.28)"
          progressIndicatorColor="#6be6ef"
          controlColor="#ffffff"
          controlBackgroundColor="rgba(6,21,40,.58)"
          activeIndicatorColor="#6be6ef"
          inactiveIndicatorColor="rgba(255,255,255,.48)"
          testID="showcase-carousel"
        />
      </div>
      <div className="studio-bar">
        <div>
          <strong>LIVE PLAYGROUND</strong>
          <span>Change the options and watch the Carousel react.</span>
        </div>
        <div className="active-story">
          <span>ACTIVE STORY</span>
          <b>{stories[index]?.category}</b>
        </div>
      </div>
      <section aria-label="Carousel configuration" className="settings">
        <div className="settings__group">
          <span className="settings__label">TRANSITION</span>
          <div className="segmented">
            {(['fade', 'slide', 'none'] as const).map((value) => (
              <button
                key={value}
                aria-pressed={transition === value}
                className={transition === value ? 'selected' : ''}
                onClick={() => setTransition(value)}
              >
                {value.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <div className="settings__group">
          <span className="settings__label">AUTOPLAY INTERVAL</span>
          <div className="segmented">
            {[3000, 6000, 9000].map((value) => (
              <button
                key={value}
                aria-pressed={intervalMs === value}
                className={intervalMs === value ? 'selected' : ''}
                onClick={() => setIntervalMs(value)}
              >
                {value / 1000}S
              </button>
            ))}
          </div>
        </div>
        <div className="settings__group settings__group--toggles">
          <span className="settings__label">DISPLAY & BEHAVIOR</span>
          <div className="toggles">
            <Toggle label="Autoplay" value={autoPlay} onChange={setAutoPlay} />
            <Toggle label="Arrows" value={showArrows} onChange={setShowArrows} />
            <Toggle label="Dots" value={showIndicators} onChange={setShowIndicators} />
            <Toggle label="Progress" value={showProgress} onChange={setShowProgress} />
            <Toggle label="Reduce motion" value={reducedMotion} onChange={setReducedMotion} />
          </div>
        </div>
      </section>
      <footer className="footer">
        <span>DESIGNED TO MOVE / BUILT WITH ZORA</span>
        <span>FOUR SCENES. ONE PUBLIC COMPONENT.</span>
      </footer>
    </main>
  );
}

interface ToggleProps {
  readonly label: string;
  readonly value: boolean;
  readonly onChange: (value: boolean) => void;
}

/*** Accessible option control for the executable example only. */
function Toggle({ label, value, onChange }: ToggleProps) {
  return (
    <button className="toggle" role="switch" aria-checked={value} onClick={() => onChange(!value)}>
      <span className={value ? 'toggle__switch is-on' : 'toggle__switch'} />
      {label}
    </button>
  );
}

const root = document.getElementById('root');
if (!root) throw new Error('Carousel example root is missing');
createRoot(root).render(
  <React.StrictMode>
    <ZoraProvider mode="dark">
      <CarouselExample />
    </ZoraProvider>
  </React.StrictMode>,
);
