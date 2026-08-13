/**
 * Preloads specific Google Fonts before canvas drawing
 */

export async function ensureFontsLoaded() {
  if (!document.fonts) return true;

  try {
    const fontsToLoad = [
      '900 68px "Bodoni Moda"',
      '900 68px "Instrument Serif"',
      '400 24px "Yatra One"',
      '400 14px "Rubik Mono One"',
      '700 18px "Share Tech Mono"',
      '800 32px "Outfit"'
    ];

    await Promise.allSettled(
      fontsToLoad.map((fontSpec) => document.fonts.load(fontSpec))
    );
    await document.fonts.ready;
    return true;
  } catch (err) {
    console.warn('Font preloader notice:', err);
    return false;
  }
}
