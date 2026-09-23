import { create } from "zustand";
import { workItems } from "@/content/work";

export interface TileRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface OpenOptions {
  /** True when the user tapped a video tile: that tap counts as the click that starts playback. */
  autoplay?: boolean;
  /** Where the tile is on screen, so the viewer can grow out of it. */
  rect?: TileRect;
  /** The tile's already-loaded image URL, shown under the full image so nothing is blank mid-flight. */
  thumb?: string;
}

interface ViewerState {
  /** The dialog is in the DOM (stays true while the exit animation runs). */
  mounted: boolean;
  /** The viewer is logically open. */
  open: boolean;
  index: number;
  /** 1 = moving forward, -1 = moving back, 0 = instant (keyboard, first open, closing). */
  direction: 1 | -1 | 0;
  /** True after the first swipe or arrow key. The grow-from-tile animation only runs before that. */
  navigated: boolean;
  autoplay: boolean;
  originRect: TileRect | null;
  originThumb: string | null;
  /** The tile that is currently covered by the viewer. It is hidden so the image is never shown twice. */
  hiddenTileId: string | null;
  openAt: (index: number, options?: OpenOptions) => void;
  close: () => void;
  goTo: (index: number, direction: 1 | -1 | 0) => void;
  unmount: () => void;
}

export const useViewer = create<ViewerState>((set) => ({
  mounted: false,
  open: false,
  index: 0,
  direction: 0,
  navigated: false,
  autoplay: false,
  originRect: null,
  originThumb: null,
  hiddenTileId: null,
  openAt: (index, options) =>
    set({
      mounted: true,
      open: true,
      index,
      direction: 0,
      navigated: false,
      autoplay: options?.autoplay ?? false,
      originRect: options?.rect ?? null,
      originThumb: options?.thumb ?? null,
      hiddenTileId: workItems[index]?.id ?? null,
    }),
  close: () => set({ open: false }),
  goTo: (index, direction) => {
    if (index < 0 || index >= workItems.length) return;
    set({ index, direction, navigated: true, autoplay: false, hiddenTileId: workItems[index].id });
  },
  unmount: () => set((state) => (state.open ? state : { mounted: false, hiddenTileId: null })),
}));
