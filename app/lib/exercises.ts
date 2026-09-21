import {supabase} from './supabase';
import type { MuscleGroupFilter } from "../types/exercise";

export async function getExercises() {
    const { data, error } = await supabase
    .from('exercises')
    .select('*')
    .limit(20);
    if (error) {
        console.error('Error fetching exercises:', error);
        return [];
    }
    return data;
};

const PAGE_SIZE = 10;

export async function getExerciseByName(name: string, page: number = 0) {
    const from = page * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const words = name.trim().split(/\s+/).filter(Boolean);

    let query = supabase.from('exercises').select('*', { count: 'exact' });
    for (const word of words) {
        query = query.ilike('name', `%${word}%`);
    }

    const { data, error, count } = await query.range(from, to);

    if (error) {
        console.error(`Error fetching exercise with name ${name}:`, error);
        return { data: null, count: 0 };
    }
    return { data, count: count ?? 0 };
}

export async function getExercisesByEquipment(equipment: string) {
    const { data, error } = await supabase
    .from('exercises')
    .select('*')
    .like('equipment', `%${equipment}%`);
    if (error) {
        console.error(`Error fetching exercises with equipment ${equipment}:`, error);
        return [];
    }
    return data;
};

export async function getExercisesByMuscleGroup(primaryMuscle: MuscleGroupFilter, page: number = 0) {
    const from = page * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let query = supabase.from('exercises').select('*', { count: 'exact' });
    if (primaryMuscle !== 'all') {
        query = query.contains('primary_muscles', [primaryMuscle]);
    }

    const { data, error, count } = await query.order('name', { ascending: true }).range(from, to);
    if (error) {
        console.error(`Error fetching exercises with primary muscle group ${primaryMuscle}:`, error);
        return { data: null, count: 0 };
    }
    return { data, count: count ?? 0 };
}