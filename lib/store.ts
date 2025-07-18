import { create } from "zustand"

export interface storeType {
    dashboardScreen: string;
    setDashboardScreen: (newScreen: string) => void;

    resThumbnailUrl: string | null;
    setResThumbnailUrl: (newThumbnailUrl: string | null) => void;

    resReadmeText: string | null;
    setResReadmeText: (newText: string | null) => void;

    currentRepoDetails: { owner: string, repo: string, branch: string } | null;
    setCurrentRepoDetails: (newDetails: { owner: string, repo: string, branch: string }) => void;

    makingStatus: string | null;
    setMakingStatus: (newStatus: string | null) => void;

}

export const useStore = create<storeType>((set) => ({
    dashboardScreen: "newReadme",
    setDashboardScreen: (newScreen: string) => set(() => ({ dashboardScreen: newScreen })),

    resThumbnailUrl: null,
    setResThumbnailUrl: (newUrl: string | null) => set(() => ({ resThumbnailUrl: newUrl })),

    resReadmeText: null,
    setResReadmeText: (newText: string | null) => set(() => ({ resReadmeText: newText })),

    currentRepoDetails: null,
    setCurrentRepoDetails: (newDetails: { owner: string, repo: string, branch: string }) => set(() => ({ currentRepoDetails: newDetails })),

    makingStatus: null,
    setMakingStatus: (newStatus: string | null) => set(() => ({ makingStatus: newStatus }))
}))
