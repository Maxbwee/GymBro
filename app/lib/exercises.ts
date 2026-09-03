import {supabase} from './supabase';

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

    const { data, error, count } = await supabase
        .from('exercises')
        .select('*', { count: 'exact' })
        .ilike('name', `%${name}%`)
        .range(from, to);

    if (error) {
        console.error(`Error fetching exercise with name ${name}:`, error);
        return { data: null, count: 0 };
    }
    return { data, count: count ?? 0 };
};

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