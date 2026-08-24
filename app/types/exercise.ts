export type Exercise = {
    id: string;
    name: string;
    force: string | null;
    level: string | null;
    mechanic: string | null;
    equipment: string | null;
    category: string | null;
    primary_muscles: string[];
    secondary_muscles: string[] | null;
    instructions: string[] | null;
    images: string[] | null;
};