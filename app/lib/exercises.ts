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

export async function getExerciseByName(name: string) {
    const { data, error } = await supabase
    .from('exercises')
    .select('*')
    .ilike('name', `%${name}%`)
    .limit(10);
    if (error) {
        console.error(`Error fetching exercise with name ${name}:`, error);
        return null;
    }
    return data;
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