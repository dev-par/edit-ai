"use client"

import React, { useState } from 'react'
import { useParams } from 'next/navigation';
import { CanvasContext } from '@/context/context';
import { Monitor } from 'lucide-react';
import { useConvexQuery } from '@/hooks/use-convex-query'
import { api } from '@/convex/_generated/api';
import { Loader2 } from 'lucide-react'; 

const Editor = () => {
    const params = useParams();
    const projectId = params.projectId;

    const [canvasEditor, setCanvasEditor] = useState(null);
    const [processingMessage, setProcessingMessage] = useState(null);

    const [activeTool, setActiveTool] = useState("resize");

  // Get project data
  const {
    data: project,
    isLoading,
    error,
  } = useConvexQuery(api.projects.getProject, { projectId });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
          <p className="text-white/70">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <CanvasContext.Provider value={{
        canvasEditor, 
        setCanvasEditor, 
        activeTool, 
        onToolChange: setActiveTool,
        processingMessage, 
        setProcessingMessage
      }}
      >
      
      {/* Mobile Message - Show on screens smaller than lg (1024px) */}
      <div className="lg:hidden min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <Monitor className="h-16 w-16 text-cyan-400 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-white mb-4">
            Desktop Required
          </h1>
          <p className="text-white/70 text-lg mb-2">
            This editor is only usable on desktop.
          </p>
          <p className="text-white/50 text-sm">
            Please use a larger screen to access the full editing experience.
          </p>
        </div>
      </div>


      <div>Editor: {projectId}</div>
    </CanvasContext.Provider>
  )
}

export default Editor