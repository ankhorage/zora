import { HeroBackgroundSlider } from '@ankhorage/zora/web/hero-background-slider';
import { expect, test } from 'bun:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

test('renders no background or progress when there are no slides', () => {
  const output = renderToStaticMarkup(React.createElement(HeroBackgroundSlider, { slides: [] }));
  expect(output).toBe('');
});

test('supports consumer-owned optimized images and hides progress for a single slide', () => {
  const output = renderToStaticMarkup(
    React.createElement(HeroBackgroundSlider, {
      slides: [{ source: '/one.jpg', alt: 'One' }],
      testID: 'hero',
      renderImage: (slide) =>
        React.createElement('img', {
          src: typeof slide.source === 'string' ? slide.source : '',
          alt: '',
        }),
    }),
  );
  expect(output).toContain('/one.jpg');
  expect(output).not.toContain('hero-progress');
});

test('renders all image layers and an optional progress indicator for a slideshow', () => {
  const slides = [{ source: '/one.jpg' }, { source: '/two.jpg' }];
  const renderImage = (slide: { source: unknown }) =>
    React.createElement('img', {
      src: typeof slide.source === 'string' ? slide.source : '',
      alt: '',
    });
  const output = renderToStaticMarkup(
    React.createElement(HeroBackgroundSlider, {
      slides,
      testID: 'hero',
      renderImage,
    }),
  );
  expect(output).toContain('/one.jpg');
  expect(output).toContain('/two.jpg');
  expect(output).toContain('hero-progress');

  const withoutProgress = renderToStaticMarkup(
    React.createElement(HeroBackgroundSlider, {
      slides,
      showProgress: false,
      testID: 'hero',
      renderImage,
    }),
  );
  expect(withoutProgress).not.toContain('hero-progress');
});
