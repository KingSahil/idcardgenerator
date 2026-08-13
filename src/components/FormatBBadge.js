import { drawRoundedRect, drawDashedCircle, drawPalmTreeIcon, drawBarcode, applyCanvasFilter } from '../utils/canvasHelpers';

/**
 * Renders Format B: Builder ID Card Badge onto Canvas (1200x640)
 */
export function renderFormatB(ctx, width, height, state) {
  const {
    imageObj,
    panX = 0,
    panY = 0,
    zoom = 1,
    rotation = 0,
    filter = 'none',
    name = 'SATOSHI NAKAMOTO',
    stack = 'FULLSTACK & RUST',
    teamName = 'TEAM ANTIGRAVITY',
    builderTitle = 'GOA VIBE CODER 🌴',
    badgeId = 'HHGOA-2026-8924'
  } = state;

  ctx.clearRect(0, 0, width, height);

  // 1. Entire Canvas is the Badge Card Base (Deep Forest Green)
  ctx.fillStyle = '#0B5A36';
  ctx.fillRect(0, 0, width, height);

  // Outer Gold Edge Line
  ctx.strokeStyle = '#FFDF00';
  ctx.lineWidth = 6;
  ctx.strokeRect(3, 3, width - 6, height - 6);

  // Background Palm Leaf Silhouettes
  drawPalmTreeIcon(ctx, 60, height - 70, 2.8, 'rgba(255, 253, 240, 0.05)', 'rgba(255, 253, 240, 0.05)');
  drawPalmTreeIcon(ctx, width - 70, 180, 2.8, 'rgba(255, 253, 240, 0.05)', 'rgba(255, 253, 240, 0.05)');

  // 2. Top Header Banner Bar (Yellow Bar)
  const headerHeight = 90;
  ctx.save();
  ctx.fillStyle = '#FFDF00';
  ctx.fillRect(0, 0, width, headerHeight);

  // Header Left Badge: "2:47PM STUDIO" (Specific font Rubik Mono One or Bungee)
  drawRoundedRect(ctx, 28, 24, 160, 42, 8, '#121814');
  ctx.font = '700 13px "Rubik Mono One", "Share Tech Mono", monospace';
  ctx.fillStyle = '#FFE600';
  ctx.textAlign = 'center';
  ctx.fillText('2:47PM STUDIO', 108, 50);

  // Header Center Title: "HACKER HOUSE GOA 2026" (Specific ultra-condensed Bodoni Moda / Instrument Serif)
  ctx.font = '900 48px "Bodoni Moda", "Instrument Serif", "Playfair Display", Georgia, serif';
  ctx.fillStyle = '#0B5A36';
  ctx.textAlign = 'center';
  ctx.fillText('HACKER HOUSE GOA 2026', width / 2 + 5, 58);

  // Header Right Tag: "OFFICIAL BADGE"
  drawRoundedRect(ctx, width - 190, 24, 160, 42, 21, '#FF007A');
  ctx.font = '800 15px "Outfit", sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.fillText('OFFICIAL BADGE', width - 110, 50);

  ctx.restore();

  // Header Accent Divider Line
  ctx.save();
  ctx.strokeStyle = '#FF007A';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(0, headerHeight);
  ctx.lineTo(width, headerHeight);
  ctx.stroke();
  ctx.restore();

  // 3. Left Column: Large Photo Avatar Frame
  const avatarCenterX = 200;
  const avatarCenterY = 345;
  const avatarRadius = 145; // 290px diameter

  // Outer Dashed Pink Ring
  drawDashedCircle(ctx, avatarCenterX, avatarCenterY, avatarRadius + 10, '#FF007A', [12, 8], 5);

  // Circular Photo Clip
  ctx.save();
  ctx.beginPath();
  ctx.arc(avatarCenterX, avatarCenterY, avatarRadius, 0, Math.PI * 2);
  ctx.clip();

  ctx.fillStyle = '#07331E';
  ctx.fillRect(avatarCenterX - avatarRadius, avatarCenterY - avatarRadius, avatarRadius * 2, avatarRadius * 2);

  if (imageObj) {
    ctx.save();
    applyCanvasFilter(ctx, filter);

    const cx = avatarCenterX + panX;
    const cy = avatarCenterY + panY;

    ctx.translate(cx, cy);
    if (rotation !== 0) {
      ctx.rotate((rotation * Math.PI) / 180);
    }

    const imgWidth = imageObj.width || imageObj.naturalWidth;
    const imgHeight = imageObj.height || imageObj.naturalHeight;
    const scaleFactor = Math.max((avatarRadius * 2) / imgWidth, (avatarRadius * 2) / imgHeight) * zoom;
    const dw = imgWidth * scaleFactor;
    const dh = imgHeight * scaleFactor;

    ctx.drawImage(imageObj, -dw / 2, -dh / 2, dw, dh);
    ctx.restore();
  } else {
    ctx.font = '700 17px "Share Tech Mono", monospace';
    ctx.fillStyle = '#FFDF00';
    ctx.textAlign = 'center';
    ctx.fillText('CLICK / DROP PHOTO', avatarCenterX, avatarCenterY - 6);

    ctx.font = '600 13px "Outfit", sans-serif';
    ctx.fillStyle = '#FFFDF0';
    ctx.fillText('(PNG, JPG, HEIC)', avatarCenterX, avatarCenterY + 18);
  }

  ctx.restore(); // Restore clip

  // "✓ VERIFIED BUILDER" Pill under Photo
  drawRoundedRect(ctx, avatarCenterX - 105, avatarCenterY + avatarRadius + 16, 210, 36, 18, '#FFDF00', '#121814', 2.5);
  ctx.font = '800 13px "Share Tech Mono", monospace';
  ctx.fillStyle = '#0B5A36';
  ctx.textAlign = 'center';
  ctx.fillText('✓ VERIFIED BUILDER', avatarCenterX, avatarCenterY + avatarRadius + 39);

  // 4. Right Column: User Information (Strictly Bounded text scaling)
  const detailX = 390;
  const startY = headerHeight + 35;

  // BUILDER NAME LABEL & BIG TEXT
  ctx.save();
  ctx.font = '700 14px "Share Tech Mono", monospace';
  ctx.fillStyle = '#FFDF00';
  ctx.textAlign = 'left';
  ctx.fillText('BUILDER NAME', detailX, startY);

  const cleanName = (name || 'SATOSHI NAKAMOTO').trim().toUpperCase().substring(0, 25);
  const nameFontSize = cleanName.length > 17 ? 36 : 46;
  ctx.font = `800 ${nameFontSize}px "Outfit", sans-serif`;
  ctx.fillStyle = '#FFFDF0';
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 6;
  ctx.fillText(cleanName, detailX, startY + (nameFontSize > 40 ? 46 : 38));
  ctx.shadowBlur = 0;

  // ROLE / GENERATED BUILDER TITLE (Full-width Hot Pink Badge)
  const titleY = startY + 68;
  const rawTitle = (builderTitle || 'GOA VIBE CODER 🌴').trim().toUpperCase().substring(0, 35);
  const displayTitle = `ROLE: ${rawTitle}`;
  const titleFontSize = displayTitle.length > 28 ? 18 : 22;

  drawRoundedRect(ctx, detailX, titleY, 760, 48, 10, '#FF007A');
  ctx.font = `800 ${titleFontSize}px "Outfit", sans-serif`;
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'left';
  ctx.fillText(displayTitle, detailX + 16, titleY + (titleFontSize < 20 ? 30 : 32));

  // TECH STACK / SKILLS
  const stackY = titleY + 76;
  ctx.font = '700 14px "Share Tech Mono", monospace';
  ctx.fillStyle = '#FFDF00';
  ctx.fillText('TECH STACK / SKILLS', detailX, stackY);

  const cleanStack = (stack || 'FULLSTACK & RUST').trim().toUpperCase().substring(0, 30);
  const stackFontSize = cleanStack.length > 22 ? 19 : 24;
  ctx.font = `600 ${stackFontSize}px "Share Tech Mono", monospace`;
  ctx.fillStyle = '#FFFDF0';
  ctx.fillText(cleanStack, detailX, stackY + 28);

  // TEAM / SQUAD
  const teamY = stackY + 68;
  ctx.font = '700 14px "Share Tech Mono", monospace';
  ctx.fillStyle = '#FFDF00';
  ctx.fillText('TEAM / SQUAD', detailX, teamY);

  const cleanTeam = (teamName || 'TEAM ANTIGRAVITY').trim().toUpperCase().substring(0, 30);
  const teamFontSize = cleanTeam.length > 22 ? 19 : 24;
  ctx.font = `600 ${teamFontSize}px "Share Tech Mono", monospace`;
  ctx.fillStyle = '#FFFDF0';
  ctx.fillText(cleanTeam, detailX, teamY + 28);

  ctx.restore();

  // 5. Card Bottom Footer (Barcode + Dates & Location + Devanagari Yatra One Badge)
  const footerY = height - 85;

  // Barcode Graphic on Left of Details
  drawBarcode(ctx, detailX, footerY + 5, 270, 56, badgeId);

  // Dates & Location in Middle
  ctx.save();
  ctx.font = '700 16px "Share Tech Mono", monospace';
  ctx.fillStyle = '#FFDF00';
  ctx.textAlign = 'left';
  ctx.fillText('LOCATION: GOA, INDIA', detailX + 300, footerY + 26);
  ctx.fillText('DATES: 28 - 31 OCT 2026', detailX + 300, footerY + 48);
  ctx.restore();

  // Devanagari "गोवा" Badge on Bottom Right (Specific Yatra One / Rozha One Font!)
  ctx.save();
  ctx.translate(width - 95, footerY + 30);
  ctx.rotate(-0.06);
  drawRoundedRect(ctx, -40, -22, 80, 44, 10, '#FF007A', '#FFFFFF', 2.5);
  ctx.font = '400 24px "Yatra One", "Rozha One", "Outfit", sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.fillText('गोवा', 0, 8);
  ctx.restore();
}
