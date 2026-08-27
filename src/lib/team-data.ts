import type { CSSProperties } from 'react';
import aidenImage from '@/assets/027189a00b21afa9a3c06baca936f81ca39a3e89.jpg';
import noahImage from '@/assets/8ee06f89fcb2cc02961b34226e63e63a73f4a3f6.jpg';
import seanImage from '@/assets/3fd5dc0d150c84d1b711b9d02daf057b44f80a37.jpg';
import derekImage from '@/assets/derek-hua-2.png';
import toshiImage from '@/assets/toshi-nagai-2.png';
import huaImage from '@/assets/doctorhua.jpg';

export type Person = { name: string; role: string; image: string; linkedin?: string; description: string };

export const teamPeople: Person[] = [
  { name: 'Aiden Pan', role: 'CEO & Co-Founder', image: aidenImage.src, linkedin: 'https://www.linkedin.com/in/aidenpan/', description: 'USC Biomedical Engineering' },
  { name: 'Toshi Nagai', role: 'Co-Founder', image: toshiImage.src, linkedin: 'https://www.linkedin.com/in/toshio-nagai2029/', description: 'USC Biomedical Engineering and Mechanical Engineering' },
  { name: 'Derek Hua', role: 'Co-Founder and Head of Clinical Affairs', image: derekImage.src, linkedin: 'https://www.linkedin.com/in/derekhuausc/', description: 'USC Biomedical Engineering and Pre-Medicine' },
  { name: 'Sean Lee', role: 'Co-Founder', image: seanImage.src, linkedin: 'https://www.linkedin.com/in/sean-long-siang-lee-9bbab8373/', description: 'Cornell University Biomedical Engineering' },
];

export const advisoryPeople: Person[] = [
  { name: 'Noah Pearson', role: 'Advisor', image: noahImage.src, linkedin: 'https://www.linkedin.com/in/noah-r-pearson/', description: 'PhD Mechanical Engineering' },
  { name: 'Xiaoyang Hua', role: 'Advisor', image: huaImage.src, description: 'MD, PhD, FACS, Otolaryngology (ENT) Surgeon' },
];

/** Name-keyed crop/zoom for the full-bleed portrait, since source photos aren't consistently framed
 * or shot at the same distance — this keeps everyone's head reading at roughly the same size. */
export const teamPhotoStyle = (name: string): CSSProperties | undefined => {
  switch (name) {
    case 'Sean Lee':
      return { objectPosition: 'center 10%' };
    default:
      return { objectPosition: 'center 15%' };
  }
};
