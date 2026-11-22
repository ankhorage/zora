import { Carousel, type CarouselProps } from '@ankhorage/zora/web/carousel';
import { ZoraProvider } from '@ankhorage/zora/web/runtime';
import { expect, test } from 'bun:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

/*** Render the published browser facade inside its real theme provider. */
function renderCarousel(props: CarouselProps): string {
  return renderToStaticMarkup(
    React.createElement(ZoraProvider, undefined, React.createElement(Carousel, props)),
  );
}

test('renders no slides or progress with an empty collection', () => {
  const html = renderCarousel({ slides: [] });
  expect(html).not.toContain('<img');
  expect(html).not.toContain('progress');
});

test('renders images through the consumer renderer without a Next.js dependency', () => {
  const html = renderCarousel({
    slides: [{ key: 'one', source: '/original.jpg', alt: 'Image' }],
    renderImage: (slide) =>
      React.createElement('img', {
        src: typeof slide.source === 'string' ? slide.source : '',
        alt: '',
      }),
    testID: 'carousel',
  });
  expect(html).toContain('/original.jpg');
  expect(html).not.toContain('carousel-progress');
});

test('supports arbitrary React content without requiring image sources', () => {
  const html = renderCarousel({
    slides: [
      { key: 'one', content: React.createElement('span', undefined, 'Discover your next idea') },
      { key: 'two', content: React.createElement('span', undefined, 'Create what matters') },
    ],
    transition: 'none',
  });
  expect(html).toContain('Discover your next idea');
  expect(html).toContain('Create what matters');
});

test('renders configurable accessible arrows, indicators and progress', () => {
  const slides = [{ key: 'one', source: '/one.jpg' }, { key: 'two', source: '/two.jpg' }];
  const html = renderCarousel({
    slides,
    showArrows: true,
    showIndicators: true,
    testID: 'carousel',
  });
  expect(html).toContain('carousel-previous');
  expect(html).toContain('carousel-next');
  expect(html).toContain('carousel-indicator-0');
  expect(html).toContain('carousel-indicator-1');
  expect(html).toContain('carousel-progress');
  expect(html).toContain('Go to slide 1 of 2');
  const minimal = renderCarousel({ slides, showProgress: false });
  expect(minimal).not.toContain('progress');
  expect(minimal).not.toContain('indicator-0');
});
