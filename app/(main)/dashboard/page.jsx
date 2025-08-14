"use client"

import React, { useState } from 'react'
import { api } from '@/convex/_generated/api'
import { useConvexQuery } from '@/hooks/use-convex-query'
import { Button } from '@/components/ui/button'
import { Plus, Sparkles } from 'lucide-react'
import { useStoreUser } from '@/hooks/use-store-user'
import ClipLoader from 'react-spinners/ClipLoader'
import NewProjectModal from './_components/new-project-modal'

// Wrapper component that only renders the query when authenticated
const AuthenticatedDashboard = () => {
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);


  const { data: projects, isLoading } = useConvexQuery(
    api.projects.getUserProjects
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <ClipLoader 
            color="#ffffff" 
            size={50}
            loading={true}
          />
          <p className="text-white/70 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen pt-32 pb-16'>
      <div className='container mx-auto px-6'>
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
          onClick={() => setShowNewProjectModal(true)}
          variant='primary' 
          size='lg' 
          className='gap-2'>
            <Plus className='w-5 h-5' />
            New Project
          </Button>
        </div>

        {projects && projects.length > 0 ? ( 
          <></>
        ) : (
          <div className='flex flex-col items-center justify-center py-20 text-center'>
            <h3 className='text-2xl font-semibold text-white mb-3'>
              Create Your First Project
            </h3>

            <p className='text-white/70 mb-8 max-w-md'>
              Upload an image to start editing today
            </p>

          <Button 
            onClick={() => setShowNewProjectModal(true)}
            variant='primary' 
            size='xl' 
            className='gap-2'
            >
              <Sparkles className='w-5 h-5' />
              Start Creating
          </Button>
          </div>
        )}

        <NewProjectModal 
        isOpen={showNewProjectModal}
        onClose={()=> setShowNewProjectModal(false)}
        />
      </div>
    </div>
  )
}

const Dashboard = () => {
  const { isLoading: authLoading, isAuthenticated } = useStoreUser();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <ClipLoader 
            color="#ffffff" 
            size={50}
            loading={true}
          />
          <p className="text-white/70 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  return <AuthenticatedDashboard />
}

export default Dashboard