"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Wand2, Maximize2 } from "lucide-react";
import { useCanvas } from "@/context/context";
import { FabricImage } from "fabric";
import { useConvexMutation } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";

const DIRECTIONS = [
  { key: "top", label: "Top", icon: ArrowUp },
  { key: "bottom", label: "Bottom", icon: ArrowDown },
  { key: "left", label: "Left", icon: ArrowLeft },
  { key: "right", label: "Right", icon: ArrowRight },
];

const FOCUS_MAP = {
  left: "fo-right",
  right: "fo-left",
  top: "fo-bottom",
  bottom: "fo-top",
};

export function AIExtenderControls({ project }) {
  const { canvasEditor, setProcessingMessage } = useCanvas();
  const [selectedDirection, setSelectedDirection] = useState(null);
  const [extensionMode, setExtensionMode] = useState("auto"); // "auto" or "direction"
  const [extensionAmount, setExtensionAmount] = useState(200);
  const { mutate: updateProject } = useConvexMutation(
    api.projects.updateProject
  );

  const getMainImage = () =>
    canvasEditor?.getObjects().find((obj) => obj.type === "image") || null;

  const getImageSrc = (image) =>
    image?.getSrc?.() || image?._element?.src || image?.src;

  const hasBackgroundRemoval = () => {
    const imageSrc = getImageSrc(getMainImage());
    return (
      imageSrc?.includes("e-bgremove") ||
      imageSrc?.includes("e-removedotbg") ||
      imageSrc?.includes("e-changebg")
    );
  };

  const calculateAutoExtensionAmount = () => {
    const image = getMainImage();
    if (!image) return 0;

    const currentWidth = image.width * (image.scaleX || 1);
    const currentHeight = image.height * (image.scaleY || 1);

    // Calculate how much we need to extend to reach project dimensions
    const widthDiff = Math.max(0, project.width - currentWidth);
    const heightDiff = Math.max(0, project.height - currentHeight);

    // Return the larger difference to ensure we fill the canvas
    return Math.max(widthDiff, heightDiff);
  };

  const calculateDimensions = () => {
    const image = getMainImage();
    if (!image) return { width: 0, height: 0 };

    const currentWidth = image.width * (image.scaleX || 1);
    const currentHeight = image.height * (image.scaleY || 1);

    if (extensionMode === "auto") {
      // Auto-extend to project dimensions
      return {
        width: project.width,
        height: project.height,
      };
    } else {
      // Extend in selected direction only
      if (!selectedDirection) return { width: 0, height: 0 };

      const isHorizontal = ["left", "right"].includes(selectedDirection);
      const isVertical = ["top", "bottom"].includes(selectedDirection);

      return {
        width: Math.round(currentWidth + (isHorizontal ? extensionAmount : 0)),
        height: Math.round(currentHeight + (isVertical ? extensionAmount : 0)),
      };
    }
  };

  const buildExtensionUrl = (imageUrl) => {
    if (!imageUrl) return imageUrl;

    // Always use the base URL without existing transformations to avoid duplicates
    const baseUrl = imageUrl.split("?")[0];
    const { width, height } = calculateDimensions();

    const transformations = [
      "bg-genfill",
      `w-${width}`,
      `h-${height}`,
      "cm-pad_resize",
    ];

    // Add focus positioning only for direction mode
    if (extensionMode === "direction" && selectedDirection) {
      const focus = FOCUS_MAP[selectedDirection];
      if (focus) transformations.push(focus);
    }

    return `${baseUrl}?tr=${transformations.join(",")}`;
  };

  const selectDirection = (direction) => {
    // Toggle selection - if same direction is clicked, deselect it
    setSelectedDirection((prev) => (prev === direction ? null : direction));
  };

  const applyExtension = async () => {
    const mainImage = getMainImage();
    if (!mainImage) return;

    // Check if direction is required but not selected
    if (extensionMode === "direction" && !selectedDirection) return;

    setProcessingMessage("Extending image with AI...");

    try {
      const currentImageUrl = getImageSrc(mainImage);
      const extendedUrl = buildExtensionUrl(currentImageUrl);

      const extendedImage = await FabricImage.fromURL(extendedUrl, {
        crossOrigin: "anonymous",
      });

      // For auto mode, scale to exactly fit the canvas
      if (extensionMode === "auto") {
        extendedImage.set({
          left: project.width / 2,
          top: project.height / 2,
          originX: "center",
          originY: "center",
          scaleX: 1,
          scaleY: 1,
          selectable: true,
          evented: true,
        });
      } else {
        // Scale to fit canvas (original logic)
        const scale = Math.min(
          project.width / extendedImage.width,
          project.height / extendedImage.height,
          1
        );

        extendedImage.set({
          left: project.width / 2,
          top: project.height / 2,
          originX: "center",
          originY: "center",
          scaleX: scale,
          scaleY: scale,
          selectable: true,
          evented: true,
        });
      }

      // Replace image
      canvasEditor.remove(mainImage);
      canvasEditor.add(extendedImage);
      canvasEditor.setActiveObject(extendedImage);
      canvasEditor.requestRenderAll();

      // Save to database
      await updateProject({
        projectId: project._id,
        currentImageUrl: extendedUrl,
        canvasState: canvasEditor.toJSON(),
      });

      setSelectedDirection(null);
    } catch (error) {
      console.error("Error applying extension:", error);
      alert("Failed to extend image. Please try again.");
    } finally {
      setProcessingMessage(null);
    }
  };

  // Early returns for error states
  if (!canvasEditor) {
    return <div className="p-4 text-white/70 text-sm">Canvas not ready</div>;
  }

  const mainImage = getMainImage();
  if (!mainImage) {
    return (
      <div className="p-4 text-white/70 text-sm">Please add an image first</div>
    );
  }

  if (hasBackgroundRemoval()) {
    return (
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
        <h3 className="text-amber-400 font-medium mb-2">
          Extension Not Available
        </h3>
        <p className="text-amber-300/80 text-sm">
          AI Extension cannot be used on images with removed backgrounds. Use
          extension first, then remove background.
        </p>
      </div>
    );
  }

  const { width: newWidth, height: newHeight } = calculateDimensions();
  const currentImage = getMainImage();
  const autoExtensionAmount = calculateAutoExtensionAmount();
  const canApply = (extensionMode === "auto" && autoExtensionAmount > 0) || (extensionMode === "direction" && selectedDirection);

  return (
    <div className="space-y-6">
      {/* Extension Mode Selection */}
      <div>
        <h3 className="text-sm font-medium text-white mb-3">
          Extension Mode
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => {
              setExtensionMode("auto");
              setSelectedDirection(null);
            }}
            variant={extensionMode === "auto" ? "default" : "outline"}
            className={`flex items-center gap-2 ${
              extensionMode === "auto" ? "bg-cyan-500 hover:bg-cyan-600" : ""
            }`}
          >
            <Maximize2 className="h-4 w-4" />
            Auto Extend
          </Button>
          <Button
            onClick={() => setExtensionMode("direction")}
            variant={extensionMode === "direction" ? "default" : "outline"}
            className={`flex items-center gap-2 ${
              extensionMode === "direction" ? "bg-cyan-500 hover:bg-cyan-600" : ""
            }`}
          >
            <ArrowUp className="h-4 w-4" />
            One Direction
          </Button>
        </div>
      </div>

      {/* Direction Selection (only for direction mode) */}
      {extensionMode === "direction" && (
        <div>
          <h3 className="text-sm font-medium text-white mb-3">
            Select Extension Direction
          </h3>
          <p className="text-xs text-white/70 mb-3">
            Choose one direction to extend your image
          </p>
          <div className="grid grid-cols-2 gap-3">
            {DIRECTIONS.map(({ key, label, icon: Icon }) => (
              <Button
                key={key}
                onClick={() => selectDirection(key)}
                variant={selectedDirection === key ? "default" : "outline"}
                className={`flex items-center gap-2 ${
                  selectedDirection === key ? "bg-cyan-500 hover:bg-cyan-600" : ""
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Extension Amount (only for direction mode) */}
      {extensionMode === "direction" && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm text-white">Extension Amount</label>
            <span className="text-xs text-white/70">{extensionAmount}px</span>
          </div>
          <Slider
            value={[extensionAmount]}
            onValueChange={([value]) => setExtensionAmount(value)}
            min={50}
            max={500}
            step={25}
            className="w-full"
            disabled={!selectedDirection}
          />
        </div>
      )}

      {/* Auto Extension Info */}
      {extensionMode === "auto" && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
          <h4 className="text-sm font-medium text-blue-400 mb-2">
            Auto Extension Info
          </h4>
          <div className="text-xs text-blue-300/80 space-y-1">
            <div>
              Target size: {project.width} × {project.height}px
            </div>
            <div>
              Required extension: {autoExtensionAmount}px
            </div>
            {autoExtensionAmount === 0 ? (
              <div className="text-amber-400">
                No extension needed - image is already at or larger than canvas size
              </div>
            ) : (
              <div>
                This will extend your image to exactly fit the canvas dimensions
              </div>
            )}
          </div>
        </div>
      )}

      {/* Dimensions Preview */}
      <div className="bg-slate-700/30 rounded-lg p-3">
        <h4 className="text-sm font-medium text-white mb-2">
          Extension Preview
        </h4>
        <div className="text-xs text-white/70 space-y-1">
          <div>
            Current:{" "}
            {Math.round(currentImage.width * (currentImage.scaleX || 1))} ×{" "}
            {Math.round(currentImage.height * (currentImage.scaleY || 1))}px
          </div>
          <div className="text-cyan-400">
            Extended: {newWidth} × {newHeight}px
          </div>
          <div className="text-white/50">
            Canvas: {project.width} × {project.height}px
            {extensionMode === "auto" && " (target size)"}
          </div>
          <div className="text-cyan-300">
            {extensionMode === "auto" ? (
              <>Auto-extending to canvas size</>
            ) : (
              <>
                Direction:{" "}
                {selectedDirection ? DIRECTIONS.find((d) => d.key === selectedDirection)?.label : "Not selected"}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Apply Button */}
      <Button
        onClick={applyExtension}
        disabled={!canApply}
        className="w-full"
        variant="primary"
      >
        <Wand2 className="h-4 w-4 mr-2" />
        Apply AI Extension
      </Button>

      {/* Instructions */}
      <div className="bg-slate-700/30 rounded-lg p-3">
        <p className="text-xs text-white/70">
          <strong>How it works:</strong>{" "}
          {extensionMode === "auto" 
            ? "Automatically extends your image to exactly fit the canvas dimensions using AI-generated content."
            : "Select one direction → Set amount → Apply extension. AI will intelligently fill the new area in that direction."
          }
        </p>
      </div>
    </div>
  );
}