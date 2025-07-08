import { supabase } from '@/config/supabase';
import { Task, CreateTaskInput, UpdateTaskInput } from '@/types/tasks';

/**
 * Fetch all tasks for the current authenticated user
 * RLS policies automatically filter by auth.uid()
 */
export const fetchTasks = async (): Promise<Task[]> => {
  console.log('🔍 Fetching tasks from Supabase...');
  
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Error fetching tasks:', error);
    throw new Error(`Failed to fetch tasks: ${error.message}`);
  }

  console.log(`✅ Fetched ${data?.length || 0} tasks`);
  return data || [];
};

/**
 * Create a new task for the current authenticated user
 * user_id will be automatically set by RLS to auth.uid()
 */
export const createTask = async (input: CreateTaskInput): Promise<Task> => {
  console.log('📝 Creating new task:', input);

  // Get current user to ensure we're authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    console.error('❌ User not authenticated:', authError);
    throw new Error('User must be authenticated to create tasks');
  }

  const { data, error } = await supabase
    .from('tasks')
    .insert({
      title: input.title,
      description: input.description,
      completed: false,
      user_id: user.id, // Explicitly set user_id for RLS
    })
    .select()
    .single();

  if (error) {
    console.error('❌ Error creating task:', error);
    throw new Error(`Failed to create task: ${error.message}`);
  }

  console.log('✅ Task created successfully:', data);
  return data;
};

/**
 * Update an existing task owned by the current authenticated user
 * RLS policies ensure user can only update their own tasks
 */
export const updateTask = async (id: string, input: Omit<UpdateTaskInput, 'id'>): Promise<Task> => {
  console.log(`🔄 Updating task ${id}:`, input);

  const { data, error } = await supabase
    .from('tasks')
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('❌ Error updating task:', error);
    throw new Error(`Failed to update task: ${error.message}`);
  }

  console.log('✅ Task updated successfully:', data);
  return data;
};

/**
 * Delete a task owned by the current authenticated user
 * RLS policies ensure user can only delete their own tasks
 */
export const deleteTask = async (taskId: string): Promise<void> => {
  console.log(`🗑️ Deleting task: ${taskId}`);

  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId);

  if (error) {
    console.error('❌ Error deleting task:', error);
    throw new Error(`Failed to delete task: ${error.message}`);
  }

  console.log('✅ Task deleted successfully');
};

/**
 * Toggle task completion status for the current authenticated user
 * RLS policies ensure user can only toggle their own tasks
 */
export const toggleTask = async (id: string): Promise<Task> => {
  console.log(`🔄 Toggling task completion: ${id}`);

  // First, get the current task to know its completion status
  const { data: currentTask, error: fetchError } = await supabase
    .from('tasks')
    .select('completed')
    .eq('id', id)
    .single();

  if (fetchError) {
    console.error('❌ Error fetching task for toggle:', fetchError);
    throw new Error(`Failed to fetch task: ${fetchError.message}`);
  }

  // Toggle the completion status
  return updateTask(id, { completed: !currentTask.completed });
}; 