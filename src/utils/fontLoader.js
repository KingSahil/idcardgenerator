/**
 * Font Preloader to ensure custom web fonts are ready before canvas context drawing
 */

export async function ensureFontsLoaded() {
  if (!document.fonts) return true;

  try {
    // Force loading of key display fonts used in canvas drawing
    const fontsToLoad = [
      '400 48px "Instrument Serif"',
      '900 68px "Instrument Serif"',
      '700 18px "Share Tech Mono"',
      '800 32px "Outfit"'
    ];

    await Promise.allSettled(
      fontsToLoad.map((fontSpec) => document.fonts.load(fontSpec))
    );
    await document.fonts.ready;
    return true;
  } catch (err) {
    console.warn('Font loading warning:', err);
    return false;
  }
}
