import { BUILDER_TITLES } from '../constants/titles';

export function getRandomTitle(currentTitle = '') {
  const filtered = BUILDER_TITLES.filter(t => t !== currentTitle);
  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex] || BUILDER_TITLES[0];
}
