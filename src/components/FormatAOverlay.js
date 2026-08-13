import { drawRoundedRect, drawDashedCircle, drawPalmTreeIcon, applyCanvasFilter } from '../utils/canvasHelpers';

/**
 * Renders Format A: PFP Overlay Frame onto Canvas (1080x1080)
 */
export function renderFormatA(ctx, canvasWidth, canvasHeight, state) {
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

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

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

  // 1. Background Fill & Texture
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Decorative Subtle Radial Palm Lines
  ctx.save();
  ctx.strokeStyle = theme === 'retro_cream' ? 'rgba(11, 90, 54, 0.05)' : 'rgba(255, 253, 240, 0.04)';
  ctx.lineWidth = 1.5;
  for (let i = -canvasWidth; i < canvasWidth * 2; i += 70) {
    ctx.beginPath();
    ctx.arc(i, canvasHeight / 2, 350, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();

  // 2. Render Header Branding (HACKER HOUSE + Devanagari "गोवा")
  renderHeaderBranding(ctx, canvasWidth, canvasHeight, { textColor, accentColor, badgeColor, theme });

  // 3. Render Central Photo Circle (Single or Multi)
  const allImages = imageObj ? [imageObj, ...teammates.filter(Boolean)] : [];

  if (allImages.length <= 1) {
    renderSinglePFP(ctx, canvasWidth, canvasHeight, imageObj, { panX, panY, zoom, rotation, filter, bgColor, accentColor, badgeColor, textColor });
  } else {
    renderMultiPFP(ctx, canvasWidth, canvasHeight, allImages, { bgColor, accentColor, badgeColor, textColor });
  }

  // 4. Render Footer Event Banner
  renderFooterBranding(ctx, canvasWidth, canvasHeight, { textColor, accentColor, badgeColor, customCaption });
}

function renderHeaderBranding(ctx, width, height, options) {
  const { accentColor, badgeColor } = options;

  ctx.save();

  // Top Left: 2:47PM STUDIO Pixel Badge
  drawRoundedRect(ctx, 40, 35, 140, 36, 6, '#FFDF00', '#121814', 2);
  ctx.font = '700 13px "Share Tech Mono", monospace';
  ctx.fillStyle = '#121814';
  ctx.textAlign = 'center';
  ctx.fillText('2:47PM STUDIO', 110, 58);

  // Top Right: Event Hashtag
  ctx.font = '700 16px "Share Tech Mono", monospace';
  ctx.fillStyle = accentColor;
  ctx.textAlign = 'right';
  ctx.fillText('#FrameInGoa', width - 40, 58);

  // Main Header Title: "HACKER HOUSE"
  ctx.font = '900 64px "Instrument Serif", "Playfair Display", Georgia, serif';
  ctx.fillStyle = badgeColor;
  ctx.textAlign = 'center';
  ctx.shadowColor = 'rgba(0,0,0,0.4)';
  ctx.shadowBlur = 8;
  const headerY = 115;
  ctx.fillText('HACKER HOUSE', width / 2 - 25, headerY);
  ctx.shadowBlur = 0;

  // Devanagari overlay badge "गोवा" positioned right beside "HACKER HOUSE"
  ctx.save();
  ctx.translate(width / 2 + 155, headerY - 20);
  ctx.rotate(-0.06);
  drawRoundedRect(ctx, -36, -18, 72, 36, 10, '#FF007A', '#FFFFFF', 2.5);
  ctx.font = '800 20px "Outfit", sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.fillText('गोवा', 0, 6);
  ctx.restore();

  ctx.restore();
}

function renderSinglePFP(ctx, width, height, imageObj, options) {
  const { panX, panY, zoom, rotation, filter, accentColor, badgeColor } = options;

  // Center Photo Circle Parameters (Resized and repositioned to avoid overlaps)
  const centerX = width / 2;
  const centerY = height / 2 + 15; // Centered with ample space from header and footer
  const radius = 290; // Balanced size

  // Outer Drop Shadow
  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX + 4, centerY + 6, radius, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.fill();
  ctx.restore();

  // Photo Crop Circle
  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.clip();

  // Dark Green Fill before photo load
  ctx.fillStyle = '#07331E';
  ctx.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);

  // Draw User Photo
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
    // Placeholder Text when no photo is uploaded
    ctx.font = '700 24px "Share Tech Mono", monospace';
    ctx.fillStyle = '#FFFDF0';
    ctx.textAlign = 'center';
    ctx.fillText('UPLOAD PHOTO', centerX, centerY);
  }

  ctx.restore(); // Restore clip

  // Electric Hot Pink Dashed Border Ring
  drawDashedCircle(ctx, centerX, centerY, radius + 8, accentColor, [12, 8], 5);

  // Sunshine Yellow Palm Tree Sticker Badge (Top Right of circle)
  const badgeAngle = -Math.PI / 4;
  const badgeX = centerX + Math.cos(badgeAngle) * (radius + 8);
  const badgeY = centerY + Math.sin(badgeAngle) * (radius + 8);
  const badgeRadius = 30;

  ctx.save();
  ctx.beginPath();
  ctx.arc(badgeX, badgeY, badgeRadius, 0, Math.PI * 2);
  ctx.fillStyle = badgeColor;
  ctx.fill();
  ctx.strokeStyle = '#121814';
  ctx.lineWidth = 3;
  ctx.stroke();

  drawPalmTreeIcon(ctx, badgeX, badgeY + 2, 1.3, '#0B5A36', '#0B5A36');
  ctx.restore();
}

function renderMultiPFP(ctx, width, height, images, options) {
  const { accentColor } = options;
  const count = Math.min(images.length, 4);
  const centerX = width / 2;
  const centerY = height / 2 + 15;

  let positions = [];
  const radius = count > 2 ? 140 : 170;

  if (count === 2) {
    positions = [
      { x: centerX - 130, y: centerY },
      { x: centerX + 130, y: centerY }
    ];
  } else if (count === 3) {
    positions = [
      { x: centerX, y: centerY - 100 },
      { x: centerX - 130, y: centerY + 100 },
      { x: centerX + 130, y: centerY + 100 }
    ];
  } else {
    positions = [
      { x: centerX - 130, y: centerY - 100 },
      { x: centerX + 130, y: centerY - 100 },
      { x: centerX - 130, y: centerY + 100 },
      { x: centerX + 130, y: centerY + 100 }
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

  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.fillRect(0, footerY, width, 110);

  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, footerY);
  ctx.lineTo(width, footerY);
  ctx.stroke();

  // Event Location & Dates
  ctx.font = '700 22px "Share Tech Mono", monospace';
  ctx.fillStyle = '#FFDF00';
  ctx.textAlign = 'center';
  ctx.fillText('GOA, INDIA  •  28 - 31 OCT 2026', width / 2, footerY + 42);

  // Sub caption
  ctx.font = '500 16px "Outfit", sans-serif';
  ctx.fillStyle = textColor;
  ctx.fillText(customCaption || 'OFFICIAL HACKATHON PARTICIPANT FRAME', width / 2, footerY + 78);

  ctx.restore();
}
