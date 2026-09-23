export type Category = "realEstate" | "events" | "portraits" | "creative" | "food" | "street" | "gym" | "other";
export type WorkKind = "photo" | "video";

export interface WorkItem {
  /** Also the key for the localized title in messages: viewer.titles.<id> */
  id: string;
  kind: WorkKind;
  category: Category;
  /** Image path in /public. For a video this is the poster frame. */
  src: string;
  /** Pixel size of `src`. Only the ratio matters for layout. */
  width: number;
  height: number;
  /** Video files live in /public/video. */
  video?: { src: string };
  /** Remove this flag once the file is a real piece of work. */
  placeholder?: boolean;
}

/**
 * The portfolio. Order here is the order in the collage and in the viewer.
 * To use real work: drop files into /public/work (and /public/video), then
 * edit the matching entry below and delete `placeholder: true`.
 */
export const workItems: WorkItem[] = [
  { id: "re-01", kind: "photo", category: "realEstate", src: "/work/real-1.jpg", width: 1134, height: 756, placeholder: true },
  { id: "re-02", kind: "photo", category: "realEstate", src: "/work/real-2.jpg", width: 1134, height: 756, placeholder: true },
  { id: "re-03", kind: "photo", category: "realEstate", src: "/work/real-3.jpg", width: 1134, height: 756, placeholder: true },
  { id: "re-04", kind: "photo", category: "realEstate", src: "/work/real-4.jpg", width: 1134, height: 756, placeholder: true },

  { id: "fd-01", kind: "photo", category: "food", src: "/work/food-3.jpg", width: 4000, height: 6000, placeholder: true },
  { id: "fd-02", kind: "photo", category: "food", src: "/work/food-4.jpg", width: 3970, height: 5955, placeholder: true },
  { id: "fd-03", kind: "photo", category: "food", src: "/work/food-1.jpg", width: 4806, height: 3714, placeholder: true },
  { id: "fd-04", kind: "photo", category: "food", src: "/work/food-2.jpg", width: 4000, height: 5000, placeholder: true },
  
  { id: "gym-01", kind: "photo", category: "gym", src: "/work/gym-1.jpg", width: 2934, height: 4401, placeholder: true },
  { id: "gym-02", kind: "photo", category: "gym", src: "/work/gym-2.jpg", width: 3480, height: 4350, placeholder: true },
  { id: "gym-03", kind: "photo", category: "gym", src: "/work/gym-3.jpg", width: 4000, height: 5000, placeholder: true },
  
  { id: "pt-01", kind: "photo", category: "portraits", src: "/work/port5.webp", width: 1500, height: 1000, placeholder: true },
  { id: "pt-03", kind: "photo", category: "portraits", src: "/work/port2.webp", width: 1264, height: 1896, placeholder: true },
  { id: "pt-04", kind: "photo", category: "portraits", src: "/work/port3.webp", width: 1000, height: 1500, placeholder: true },
  { id: "pt-05", kind: "photo", category: "portraits", src: "/work/port6.webp", width: 4000, height: 6000, placeholder: true },

];

/** The tiles shown on the home page. */
export const homeWorkIds = ["re-01", "ev-01", "pt-01", "fd-01", "cr-01", "st-01", "gym-01"] as const;
