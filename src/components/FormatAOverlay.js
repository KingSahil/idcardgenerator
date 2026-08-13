import { drawRoundedRect, drawDashedCircle, drawPalmTreeIcon, applyCanvasFilter } from '../utils/canvasHelpers';

/**
 * Renders Format A: PFP Overlay Frame onto Canvas (1080x1080)
 */
export function renderFormatA(ctx, width, height, state) {
  const {
    imageObj,
    panX = 0,
    panY = 0,
    zoom = 1,
    rotation = 0,
    filter = 'none',
    teammates = [],
    theme = 'dark_green',
    customCaption = ''
  } = state;

  ctx.clearRect(0, 0, width, height);

  // Theme Palette
  let bgColor = '#0B5A36';
  let accentColor = '#FF007A';
  let badgeColor = '#FFDF00';
  let textColor = '#FFFDF0';

  if (theme === 'retro_cream') {
    bgColor = '#FFFDF0';
    textColor = '#0B5A36';
  } else if (theme === 'cyber_neon') {
    bgColor = '#08120E';
    accentColor = '#00FFCC';
  }

  // 1. Outer Background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  // Outer Gold Edge Border
  ctx.strokeStyle = badgeColor;
  ctx.lineWidth = 6;
  ctx.strokeRect(3, 3, width - 6, height - 6);

  // Radial Background Pattern
  ctx.save();
  ctx.strokeStyle = theme === 'retro_cream' ? 'rgba(11, 90, 54, 0.06)' : 'rgba(255, 253, 240, 0.05)';
  ctx.lineWidth = 1.5;
  for (let i = -width; i < width * 2; i += 75) {
    ctx.beginPath();
    ctx.arc(i, height / 2, 400, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();

  // 2. Header Section (Specific fonts: Rubik Mono One, Bodoni Moda, Yatra One)
  renderHeaderBranding(ctx, width, height, { textColor, accentColor, badgeColor, theme });

  // 3. Central Photo Circle
  const allImages = imageObj ? [imageObj, ...teammates.filter(Boolean)] : [];

  if (allImages.length <= 1) {
    renderSinglePFP(ctx, width, height, imageObj, { panX, panY, zoom, rotation, filter, bgColor, accentColor, badgeColor, textColor });
  } else {
    renderMultiPFP(ctx, width, height, allImages, { bgColor, accentColor, badgeColor, textColor });
  }

  // 4. Footer Banner (Strictly Bounded Caption)
  renderFooterBranding(ctx, width, height, { textColor, accentColor, badgeColor, customCaption });
}

function renderHeaderBranding(ctx, width, height, options) {
  const { accentColor, badgeColor } = options;

  ctx.save();

  // Top-Left Badge: "2:47PM STUDIO" (190x44px)
  drawRoundedRect(ctx, 35, 30, 190, 44, 8, '#FFDF00', '#121814', 2.5);
  ctx.font = '700 14px "Rubik Mono One", "Share Tech Mono", monospace';
  ctx.fillStyle = '#121814';
  ctx.textAlign = 'center';
  ctx.fillText('2:47PM STUDIO', 130, 57);

  // Center Devanagari Badge "गोवा" (Cleanly positioned between badges)
  ctx.save();
  ctx.translate(width / 2, 52);
  ctx.rotate(-0.04);
  drawRoundedRect(ctx, -42, -20, 84, 40, 10, '#FF007A', '#FFFFFF', 2.5);
  ctx.font = '400 22px "Yatra One", "Rozha One", "Outfit", sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.fillText('गोवा', 0, 7);
  ctx.restore();

  // Top-Right Badge: Prominent Hot-Pink Pill "#FrameInGoa" (190x44px)
  drawRoundedRect(ctx, width - 225, 30, 190, 44, 22, '#FF007A', '#FFFFFF', 2.5);
  ctx.font = '800 18px "Share Tech Mono", monospace';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.fillText('#FrameInGoa', width - 130, 58);

  // Main Header Title: "HACKER HOUSE" (Positioned at Y=148 with zero collision)
  const headerY = 148;
  ctx.font = '900 64px "Bodoni Moda", "Instrument Serif", "Playfair Display", Georgia, serif';
  ctx.fillStyle = badgeColor;
  ctx.textAlign = 'center';
  ctx.shadowColor = 'rgba(0,0,0,0.4)';
  ctx.shadowBlur = 6;
  ctx.fillText('HACKER HOUSE', width / 2, headerY);
  ctx.shadowBlur = 0;

  ctx.restore();
}

function renderSinglePFP(ctx, width, height, imageObj, options) {
  const { panX, panY, zoom, rotation, filter, accentColor, badgeColor } = options;

  const centerX = width / 2;
  const centerY = height / 2 + 25;
  const radius = 330; // 660px diameter

  // Outer Shadow
  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX + 4, centerY + 6, radius, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.fill();
  ctx.restore();

  // Photo Circular Clip
  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.clip();

  ctx.fillStyle = '#07331E';
  ctx.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);

  if (imageObj) {
    ctx.save();
    applyCanvasFilter(ctx, filter);

    ctx.translate(centerX + panX, centerY + panY);
    if (rotation !== 0) {
      ctx.rotate((rotation * Math.PI) / 180);
    }

    const imgWidth = imageObj.width || imageObj.naturalWidth;
    const imgHeight = imageObj.height || imageObj.naturalHeight;
    const scaleFactor = Math.max((radius * 2) / imgWidth, (radius * 2) / imgHeight) * zoom;

    const dw = imgWidth * scaleFactor;
    const dh = imgHeight * scaleFactor;

    ctx.drawImage(imageObj, -dw / 2, -dh / 2, dw, dh);
    ctx.restore();
  } else {
    ctx.font = '700 24px "Share Tech Mono", monospace';
    ctx.fillStyle = '#FFDF00';
    ctx.textAlign = 'center';
    ctx.fillText('CLICK OR DROP PHOTO', centerX, centerY - 8);

    ctx.font = '600 15px "Outfit", sans-serif';
    ctx.fillStyle = '#FFFDF0';
    ctx.fillText('(PNG, JPG, WebP, HEIC)', centerX, centerY + 24);
  }

  ctx.restore(); // Restore clip

  // Electric Hot Pink Dashed Outer Ring
  drawDashedCircle(ctx, centerX, centerY, radius + 10, accentColor, [14, 8], 6);

  // Palm Tree Sticker Badge (Top Right of circle)
  const badgeAngle = -Math.PI / 4;
  const badgeX = centerX + Math.cos(badgeAngle) * (radius + 10);
  const badgeY = centerY + Math.sin(badgeAngle) * (radius + 10);
  const badgeRadius = 34;

  ctx.save();
  ctx.beginPath();
  ctx.arc(badgeX, badgeY, badgeRadius, 0, Math.PI * 2);
  ctx.fillStyle = badgeColor;
  ctx.fill();
  ctx.strokeStyle = '#121814';
  ctx.lineWidth = 3;
  ctx.stroke();

  drawPalmTreeIcon(ctx, badgeX, badgeY + 2, 1.4, '#0B5A36', '#0B5A36');
  ctx.restore();
}

function renderMultiPFP(ctx, width, height, images, options) {
  const { accentColor } = options;
  const count = Math.min(images.length, 4);
  const centerX = width / 2;
  const centerY = height / 2 + 25;

  let positions = [];
  const radius = count > 2 ? 160 : 190;

  if (count === 2) {
    positions = [
      { x: centerX - 145, y: centerY },
      { x: centerX + 145, y: centerY }
    ];
  } else if (count === 3) {
    positions = [
      { x: centerX, y: centerY - 105 },
      { x: centerX - 145, y: centerY + 105 },
      { x: centerX + 145, y: centerY + 105 }
    ];
  } else {
    positions = [
      { x: centerX - 145, y: centerY - 105 },
      { x: centerX + 145, y: centerY - 105 },
      { x: centerX - 145, y: centerY + 105 },
      { x: centerX + 145, y: centerY + 105 }
    ];
  }

  images.slice(0, count).forEach((imgObj, idx) => {
    const pos = positions[idx];

    ctx.save();
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
    ctx.clip();

    ctx.fillStyle = '#07331E';
    ctx.fillRect(pos.x - radius, pos.y - radius, radius * 2, radius * 2);

    if (imgObj) {
      const imgWidth = imgObj.width || imgObj.naturalWidth;
      const imgHeight = imgObj.height || imgObj.naturalHeight;
      const scaleFactor = Math.max((radius * 2) / imgWidth, (radius * 2) / imgHeight);
      const dw = imgWidth * scaleFactor;
      const dh = imgHeight * scaleFactor;
      ctx.drawImage(imgObj, pos.x - dw / 2, pos.y - dh / 2, dw, dh);
    }
    ctx.restore();

    drawDashedCircle(ctx, pos.x, pos.y, radius + 6, accentColor, [10, 6], 4);
  });
}

function renderFooterBranding(ctx, width, height, options) {
  const { textColor, accentColor, customCaption } = options;

  ctx.save();
  const footerY = height - 110;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
  ctx.fillRect(0, footerY, width, 110);

  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, footerY);
  ctx.lineTo(width, footerY);
  ctx.stroke();

  // Event Location & Dates
  ctx.font = '700 24px "Share Tech Mono", monospace';
  ctx.fillStyle = '#FFDF00';
  ctx.textAlign = 'center';
  ctx.fillText('GOA, INDIA  •  28 - 31 OCT 2026', width / 2, footerY + 44);

  // Sub caption (Strictly Bounded)
  const cleanCaption = (customCaption || 'OFFICIAL HACKATHON PARTICIPANT FRAME').trim().toUpperCase().substring(0, 42);
  ctx.font = '600 17px "Outfit", sans-serif';
  ctx.fillStyle = textColor;
  ctx.fillText(cleanCaption, width / 2, footerY + 80);

  ctx.restore();
}
