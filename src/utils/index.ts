import ColorThief from 'colorthief'
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserDoc } from '../types';

// Device Sizes
export const sizes = {
  mobileSm: '320px',
  mobileMd: '375px',
  mobileLg: '425px',
  tablet: '768px',
  laptop: '1024px',
  laptopL: '1440px',
  desktop: '2560px',
}

// CSS Media Queries
export const mq = {
  mobileSm: `screen and (min-width: ${sizes.mobileSm})`,
  mobileMd: `screen and (min-width: ${sizes.mobileMd})`,
  mobileLg: `screen and (min-width: ${sizes.mobileLg})`,
  tablet: `screen and (min-width: ${sizes.tablet})`,
  laptop: `screen and (min-width: ${sizes.laptop})`,
  laptopL: `screen and (min-width: ${sizes.laptopL})`,
  desktop: `screen and (min-width: ${sizes.desktop})`,
};

// Convert rgb to hex
export const rgbToHex = (r: number, g: number, b: number) => '#' + [r, g, b].map(x => {
  const hex = x.toString(16)
  return hex.length === 1 ? '0' + hex : hex
}).join('')

// Convert bytes to human readable format
export const toMegaBytes = (num: number): string => `${(num / 1024 / 1024).toFixed(2)}MB`

// Get dominant color from image
export const getImageColor = (image: HTMLImageElement): string | undefined => {
  const colorthief = new ColorThief()

  if (image?.complete) {
    const [r, g, b] = colorthief.getPalette(image)[0]
    const colorHex = rgbToHex(r, g, b)

    return colorHex;
  }
  // Return null if image is not loaded
  return undefined
}

// env variable: Google Client ID
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
// export const GOOGLE_CLIENT_SECRET = process.env.REACT_APP_GOOGLE_CLIENT_SECRET


export const getUserDoc = async (uid: string): Promise<UserDoc> => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  // if (docSnap.exists()) {
  //   return docSnap.data() as UserDoc;
  // }
  return docSnap.data() as UserDoc;
}