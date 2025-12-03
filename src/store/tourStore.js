import { create } from 'zustand';

export const useTourStore = create((set) => ({
  isTourActive: false, 
  
  startTour: () => set({ isTourActive: true }),
  stopTour: () => set({ isTourActive: false }),
}));
