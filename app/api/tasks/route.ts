import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDatabase } from '@/app/api/_lib/mongodb';
import { requireAuth } from '@/app/api/_lib/auth';
import { createTaskSchema, updateTaskSchema } from '@/app/lib/schemas/task';
import { z } from 'zod';
import { debug } from 'console';


/**
 * GET /api/tasks
 * Fetch all tasks for the authenticated user
 * on the body there is a userId field
 */
export async function GET(request: NextRequest) {
  try {

    const { userId } = await requireAuth(request);

    // Connect to MongoDB
    const db = await getDatabase();
    const tasksCollection = db.collection('tasks');

    // Query tasks for this user, sorted by creation date (newest first)
    const tasks = await tasksCollection
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();

    // Transform MongoDB _id to string for JSON serialization
    const serializedTasks = tasks.map(task => ({
      ...task,
      _id: task._id.toString(),
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    }));

    return NextResponse.json({ tasks: serializedTasks }, { status: 200 });
  } catch (error) {

    debug('Error fetching tasks:', error);

    return NextResponse.json(
        { error: 'Unauthorized', details: 'There was an error fetching tasks' },
        { status: 401 }
      );

  }
}

/**
 * POST /api/tasks
 * Create a new task for the authenticated user
 */
export async function POST(request: NextRequest) {
  try {
    // Validate authentication
    const { userId } = await requireAuth(request);

    // Parse and validate request body
    const body = await request.json();
    const validatedData = createTaskSchema.parse(body);

    // Connect to MongoDB
    const db = await getDatabase();
    const tasksCollection = db.collection('tasks');

    // Create new task document
    const newTask = {
      userId,
      title: validatedData.title,
      completed: validatedData.completed || false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert into database
    const result = await tasksCollection.insertOne(newTask);

    // Return created task with _id
    const createdTask = {
      ...newTask,
      _id: result.insertedId.toString(),
    };

    return NextResponse.json(
      { task: createdTask },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating task:', error);
    
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized', details: 'Valid authentication token required' },
        { status: 401 }
      );
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: 'Invalid request data' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error', details: 'Failed to create task' },
      { status: 500 }
    );
  }
}

/*
  * PUT /api/tasks?id=TASK_ID
  * Update an existing task for the authenticated user
  * You need to receive the task id on the query params
  */
export async function PUT(request: NextRequest) {
  try {
    // Validate authentication
    const { userId } = await requireAuth(request);

    // Get task ID from query params
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('id');
    if (!taskId) {
      return NextResponse.json(
        { error: 'Bad Request', details: 'Task ID is required' },
        { status: 400 }
      );
    }

    if (!ObjectId.isValid(taskId)) {
      return NextResponse.json(
        { error: 'Bad Request', details: 'Invalid task ID' },
        { status: 400 }
      );
    }
    const objectId = new ObjectId(taskId);

    // Parse and validate request body
    const body = await request.json();
    const validatedData = updateTaskSchema.parse(body);

    // Connect to MongoDB
    const db = await getDatabase();
    const tasksCollection = db.collection('tasks');

    // Update task document
    const updateResult = await tasksCollection.updateOne(
      { _id: objectId, userId },
      { $set: { ...validatedData, updatedAt: new Date() } }
    );

    if (updateResult.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Not Found', details: 'Task not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Task updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating task:', error);
    
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized', details: 'Valid authentication token required' },
        { status: 401 }
      );
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: 'Invalid request data' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error', details: 'Failed to update task' },
      { status: 500 }
    );
  }
}

/*
  * DELETE /api/tasks?id=TASK_ID
  * Delete an existing task for the authenticated user
  * You need to receive the task id on the query params
  */
export async function DELETE(request: NextRequest) {
  try {
    // Validate authentication
    const { userId } = await requireAuth(request);

    // Get task ID from query params
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('id');
    if (!taskId) {
      return NextResponse.json(
        { error: 'Bad Request', details: 'Task ID is required' },
        { status: 400 }
      );
    }

    if (!ObjectId.isValid(taskId)) {
      return NextResponse.json(
        { error: 'Bad Request', details: 'Invalid task ID' },
        { status: 400 }
      );
    }
    const objectId = new ObjectId(taskId);

    // Connect to MongoDB
    const db = await getDatabase();
    const tasksCollection = db.collection('tasks');

    // Delete task document
    const deleteResult = await tasksCollection.deleteOne(
      { _id: objectId, userId }
    );

    if (deleteResult.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Not Found', details: 'Task not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Task deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting task:', error);
    
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized', details: 'Valid authentication token required' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error', details: 'Failed to delete task' },
      { status: 500 }
    );
  }
}

