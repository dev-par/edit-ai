"use client"

import React, { useState } from 'react'
import { api } from '@/convex/_generated/api'
import { useConvexQuery } from '@/hooks/use-convex-query'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useStoreUser } from '@/hooks/use-store-user'

// Wrapper component that only renders the query when authenticated
const AuthenticatedDashboard = () => {
  const { data: projects, isLoading, error } = useConvexQuery(
    api.projects.getUserProjects
  );

  if (isLoading) {
    return <div>Loading projects...</div>
  }

  if (error) {
    return <div>Error loading projects: {error.message}</div>
  }

  return (
    <div>
      <div>
        <div className='flex justify-between items-center mb-8'>
          <div>
            <h1 className='text-4xl font-bold text-white mb-2'>
              Your Projects
            </h1>
            <p className='text-white/70'>
              Create and manage your projects here
            </p>
          </div>

          <Button 
          onClick={() => {}} // TODO: Add modal functionality
          variant='primary' 
          size='lg' 
          className='gap-2'>
            <Plus className='w-5 h-5' />
            New Project
          </Button>
        </div>
      </div>
      
      {/* Display projects */}
      <div className='mt-8'>
        {projects && projects.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {projects.map((project) => (
              <div key={project._id} className='bg-white/10 rounded-lg p-6'>
                <h3 className='text-xl font-semibold mb-2'>{project.title}</h3>
                <p className='text-white/70 text-sm'>
                  Created: {new Date(project.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className='text-center py-12'>
            <p className='text-white/70 text-lg'>No projects yet. Create your first project!</p>
          </div>
        )}
      </div>
    </div>
  )
}

const Dashboard = () => {
  const { isLoading: authLoading, isAuthenticated } = useStoreUser();

  if (authLoading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    return <div>Please sign in to view your projects.</div>
  }

  return <AuthenticatedDashboard />
}

export default Dashboard