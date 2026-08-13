/**
 * Canvas Helpers for HH Goa 2026 Graphics Rendering
 */

export function drawRoundedRect(ctx, x, y, width, height, radius = 8, fillStyle = null, strokeStyle = null, strokeWidth = 1) {
  ctx.save();
  ctx.beginPath();
  if (typeof radius === 'number') {
    radius = { tl: radius, tr: radius, br: radius, bl: radius };
  } else {
    radius = { tl: 0, tr: 0, br: 0, bl: 0, ...radius };
  }
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();

  if (fillStyle) {
    ctx.fillStyle = fillStyle;
    ctx.fill();
  }

  if (strokeStyle) {
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = strokeWidth;
    ctx.stroke();
  }
  ctx.restore();
}

export function drawDashedCircle(ctx, x, y, radius, color = '#FF007A', dashArray = [8, 6], lineWidth = 4) {
  ctx.save();
  ctx.beginPath();
  ctx.setLineDash(dashArray);
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
  ctx.restore();
}

/**
 * Renders a stylized tropical palm tree icon onto canvas
 */
export function drawPalmTreeIcon(ctx, cx, cy, scale = 1, fillPrimary = '#0B5A36', fillLeaves = '#0B5A36') {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  // Trunk
  ctx.beginPath();
  ctx.moveTo(-2, 12);
  ctx.quadraticCurveTo(-1, 0, -4, -8);
  ctx.quadraticCurveTo(0, -8, 2, 12);
  ctx.closePath();
  ctx.fillStyle = fillPrimary;
  ctx.fill();

  // Palm Leaves (5 fronds)
  const drawFrond = (angle, length, curve) => {
    ctx.save();
    ctx.rotate(angle * Math.PI / 180);
    ctx.beginPath();
    ctx.moveTo(0, -8);
    ctx.quadraticCurveTo(length / 2, -8 - curve, length, -2);
    ctx.quadraticCurveTo(length / 2, -2, 0, -8);
    ctx.fillStyle = fillLeaves;
    ctx.fill();
    ctx.restore();
  };

  drawFrond(0, 16, 8);
  drawFrond(-45, 14, 6);
  drawFrond(45, 14, 6);
  drawFrond(-90, 12, 4);
  drawFrond(90, 12, 4);

  ctx.restore();
}

/**
 * Draws a realistic barcode pattern with event ID text
 */
export function drawBarcode(ctx, x, y, width, height, text = 'HHGOA-2026-BUILDER') {
  ctx.save();
  ctx.fillStyle = '#0B5A36';
  const numBars = 36;
  const barWidth = width / numBars;

  let currentX = x;
  // Seeded deterministic pseudo-random bars for realistic barcode aesthetic
  for (let i = 0; i < numBars; i++) {
    const isWide = (i * 7 + 3) % 5 === 0;
    const isGap = (i * 11 + 2) % 4 === 0;
    const w = isWide ? barWidth * 1.5 : barWidth * 0.7;

    if (!isGap || i < 3 || i > numBars - 4) {
      ctx.fillRect(currentX, y, w, height - 14);
    }
    currentX += barWidth;
  }

  // Label text under barcode
  ctx.font = '10px "Share Tech Mono", monospace';
  ctx.fillStyle = '#0B5A36';
  ctx.textAlign = 'center';
  ctx.fillText(text, x + width / 2, y + height - 2);
  ctx.restore();
}

/**
 * Applies optional image filter adjustments on canvas
 */
export function applyCanvasFilter(ctx, filterType = 'none') {
  switch (filterType) {
    case 'warm_sunset':
      ctx.filter = 'contrast(1.08) saturate(1.25) sepia(0.15)';
      break;
    case 'cyber_glow':
      ctx.filter = 'contrast(1.15) saturate(1.3) hue-rotate(-10deg)';
      break;
    case 'retro_film':
      ctx.filter = 'contrast(0.95) saturate(0.9) sepia(0.25) brightness(1.05)';
      break;
    case 'high_contrast':
      ctx.filter = 'contrast(1.3) saturate(1.1)';
      break;
    case 'monochrome':
      ctx.filter = 'grayscale(1) contrast(1.2)';
      break;
    default:
      ctx.filter = 'none';
      break;
  }
}
