/**
 * Scale width/height/any box model value from the Figma mockups
 * to the mobile app. Using the measurments directly from Figma
 * won't translate accurately. Hence the need for scale.
 *
 * Use an arbitrary scale factor. A key advantage with this, is that
 * we have a single location to scale widths/heights should the need arise.
 */
const scaleFactor = 1.5;

export const scaleWidth = (width: number): number => {
  return scaleFactor * width;
};

export const scaleHeight = (height: number): number => {
  return scaleFactor * height;
};
