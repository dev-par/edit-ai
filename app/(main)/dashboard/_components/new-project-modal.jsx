import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { usePlanAccess } from '@/hooks/use-plan-access'
import { useConvexQuery } from '@/hooks/use-convex-query'
import { api } from '@/convex/_generated/api'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Crown, Trash2, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useConvexMutation } from '@/hooks/use-convex-query'
import { useDropzone } from 'react-dropzone'
import { Upload } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { UpgradeModal } from '@/components/upgrade-modal'

const NewProjectModal = ({ isOpen, onClose }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [projectTitle, setProjectTitle] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [planSyncError, setPlanSyncError] = useState(false);
    const router = useRouter();

    const handleClose = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setProjectTitle("");
        setIsUploading(false);
        setPlanSyncError(false);
        onClose();
    };

    const { isFree, canCreateProject, isPro, syncPlan } = usePlanAccess();
    const { data:projects } = useConvexQuery(api.projects.getUserProjects)
    const { mutate: createProject } = useConvexMutation(api.projects.create)

    const currentProjectCount = projects?.length || 0;
    const canCreate = canCreateProject(currentProjectCount);

    const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];

        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));

            const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");

            setProjectTitle(nameWithoutExt || "Untitled Project")
        }
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
        },
        maxFiles: 1,
        maxSize: 20 * 1024 * 1024, // 20MB
    });

    const handleCreateProject = async () => {

        if (!canCreate) {
            // Check if user has pro plan but is getting limited
            setShowUpgradeModal(true);
            return;
        }

        if (!selectedFile || !projectTitle.trim()) {
            toast.error("Please select a file and enter a project title");
            return;
        }

        setIsUploading(true);

        try{
            const formData = new FormData();
            formData.append("file", selectedFile);
            formData.append("fileName", selectedFile.name);

            const uploadResponse = await fetch("/api/imagekit/upload", {
                method: "POST",
                body: formData,
            });

            const uploadData = await uploadResponse.json();

            if (!uploadData.success) {
                throw new Error(uploadData.error || "Failed to upload image");
            }

            const projectId = await createProject({
                title: projectTitle,
                originalImageUrl: uploadData.url,
                currentImageUrl: uploadData.url,
                thumbnailUrl: uploadData.thumbnailUrl,
                width: uploadData.width || 800,
                height: uploadData.height || 600,
                canvasState: null,
            });

            toast.success("Project created successfully!");
            router.push(`/editor/${projectId}`);
        }
        catch (error) {
            console.error("Error creating project:", error);
            
            // Check if it's a plan-related error
            if (error.message?.includes("maximum number of projects") && isPro) {
                setPlanSyncError(true);
            } else {
                toast.error(error.message || "Failed to create project. Please try again.");
            }
        }
        finally {
            setIsUploading(false);
        }
    };


    return (
        <>
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-white">
                        Create New Project
                    </DialogTitle>

                    {isFree && (
                        <Badge variant="secondary" className="bg-slate-700 text-white/70">
                            {currentProjectCount}/3 projects created
                        </Badge>
                    )}    
                </DialogHeader>

                <div className='space-y-6'>

                    {isFree && currentProjectCount >= 2 && !planSyncError && (
                    <Alert className="bg-amber-500/10 border-amber-500/20">
                        <Crown />
                        <AlertTitle>Heads up!</AlertTitle>
                        <AlertDescription className='text-amber-300/80'>
                            <div className='font-semibold text-amber-400 mb-1'>
                                {currentProjectCount === 2
                                    ? "Last Free Project"
                                    : "Project Limit Reached"
                                }

                                {currentProjectCount === 2
                                    ? "This will be your last free project. Upgrade to EditAI Pro to create more projects."
                                    : "Free plan is limited to 3 projects. Upgrade to EditAI Pro to create more projects."
                                }
                            </div>
                        </AlertDescription>
                    </Alert>
                    )}

                    {/* Upload Area */}
                    {!selectedFile ? (
                    <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
                        isDragActive 
                            ? "border-cyan-400 bg-cyan-400/5"
                            : "border-white/20 hover:border-white/40"
                    }
                    ${(!canCreate && !planSyncError) ? "opacity-50 pointer-events-none" : ""}`}
                    >
                        <input {...getInputProps()} />
                        <Upload className="h-12 w-12 text-white/50 mx-auto mb-4" />
                        <h3 className='text-xl font-semibold text-white mb-2'>
                            {isDragActive ? "Drop your image here" : "Upload an Image"}
                        </h3>

                        <p className='text-white/70 mb-4'>
                            {canCreate || planSyncError ? "Upload an image to get started" : "Upgrade to EditAI Pro to upload more images"}
                        </p>{" "}
                        <p className='text-sm text-white/50'>
                            Supports PNG, JPG, JPEG, GIF, WEBP
                        </p>

                    </div>
                    ) : (
                        <div className='space-y-6'>
                            <div className='relative'>
                                <img
                                    src={previewUrl}
                                    alt="preview"
                                    className="w-full h-64 object-cover rounded-xl border border-white/10"
                                />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-2 right-2 bg-black/50 text-white/70 hover:bg-black/70"
                                    onClick={() => {
                                        setSelectedFile(null);
                                        setPreviewUrl(null);
                                        setProjectTitle("");
                                    }}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                            
                            <div className='space-y-2'>
                                <Label htmlFor="project-title" className='text-white'>
                                    Project Title
                                </Label>
                                <Input
                                    id="project-title"
                                    type="text"
                                        value={projectTitle}
                                        onChange={(e) => setProjectTitle(e.target.value)}
                                        placeholder="Enter project title"
                                        className="bg-slate-700 border-white/20 text-white placeholder-white/50 focus:border-cyan-400 focus:ring-cyan-400"
                                />
                            </div>

                            <div className="bg-slate-700/50 rounded-lg p-4">
                                <div className='flex items-center gap-3'>
                                    <ImageIcon className="h-5 w-5 text-cyan-400" />
                                    <div>
                                        <p className='font-medium text-white'>
                                            {selectedFile.name}
                                        </p>
                                        <p className='text-sm text-white/70'>
                                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={handleClose} className="text-white/70 hover:text-white" disabled={isUploading}>
                        Cancel
                    </Button>

                    <Button 
                        variant="primary" 
                        onClick={handleCreateProject} 
                        disabled={isUploading || (!canCreate && !planSyncError) || !projectTitle.trim() || !selectedFile}
                    >
                        {isUploading ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Uploading...
                        </>
                        ) : (
                        "Create Project"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        {/* Upgrade Modal */}
        <UpgradeModal 
            isOpen={showUpgradeModal}
            onClose={() => setShowUpgradeModal(false)}
            restrictedTool="projects"
            reason="Free plan is limited to 3 projects. Upgrade to Pro for unlimited projects"
            />
        </>
    )
}

export default NewProjectModal