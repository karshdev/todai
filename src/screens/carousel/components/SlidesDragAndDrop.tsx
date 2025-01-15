import TodaiTooltip from "@/components/tooltip";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { IconPlus, IconTrashFilled } from "@tabler/icons-react";
import Image from "next/image";
import React from "react";

type Slide = {
  id: string;
  content: string;
};

type ProfileInfo = {
  image?: string;
  first_name: string;
  last_name: string;
};

type Colors = {
  background: string;
  primary: string;
};

type Font = {
  fontFamily: string;
};

const SortableSlideItem = ({
  slide,
  index,
  profileInfo,
  colors,
  selectedFont,
  activeIndex,
  handleThumbnailClick,
  handleDeleteSlide,
}: {
  slide: Slide;
  index: number;
  profileInfo?: ProfileInfo;
  colors: Colors;
  selectedFont: Font;
  activeIndex: number;
  handleThumbnailClick: (index: number) => void;
  handleDeleteSlide: (index: number) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: slide.id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: "none",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`mx-1 cursor-hand flex-shrink-0 border-1 border-primary relative ${
        index === activeIndex
          ? "ring-2 ring-blue-300 rounded-lg "
          : "opacity-65"
      }`}
      onClick={() => handleThumbnailClick(index)}>
      <div
        className="rounded-lg border bg-card text-card-foreground shadow-sm w-16 h-16 overflow-hidden flex flex-col justify-center items-start px-1"
        style={{ backgroundColor: colors.background }}>
        <div className="flex items-center -mt-3">
          <Image
            width={8}
            height={8}
            src={profileInfo?.image || "/default-avatar.png"}
            alt="Profile"
            className="mr-1 rounded-full"
          />
          <div>
            <p
              className="text-[2px]"
              style={{
                color: colors.primary,
                fontFamily: selectedFont.fontFamily,
              }}>
              {profileInfo?.first_name} {profileInfo?.last_name}
            </p>
            <p
              className="text-[2px]"
              style={{
                color: colors.primary,
                fontFamily: selectedFont.fontFamily,
              }}>
              @{profileInfo?.first_name}-{profileInfo?.last_name}
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-between py-1">
          <h4
            className="text-[2px] font-bold leading-tight"
            style={{ color: colors.primary }}>
            {slide.content}
          </h4>
        </div>
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleDeleteSlide(index);
        }}
        className="text-gray-400 absolute top-1 right-1 w-3 h-3 hover:text-red-500 rounded-md z-10">
        <IconTrashFilled className="w-3 h-3" />
      </button>
    </div>
  );
};

const SlidesDragAndDrop: React.FC<{
  containerRef: React.RefObject<HTMLDivElement>;
  slides: Slide[];
  activeIndex: number;
  profileInfo?: ProfileInfo;
  colors: Colors;
  selectedFont: Font;
  handleThumbnailClick: (index: number) => void;
  handleDeleteSlide: (index: number) => void;
  handleAddSlide: () => void;
  onReorderSlides?: (slides: Slide[]) => void;
}> = ({
  containerRef,
  slides,
  activeIndex,
  profileInfo,
  colors,
  selectedFont,
  handleThumbnailClick,
  handleDeleteSlide,
  handleAddSlide,
  onReorderSlides,
}) => {
  // Configure sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    // Only reorder if the item is dragged to a different position
    if (active.id !== over?.id) {
      const oldIndex = slides.findIndex((slide) => slide.id === active.id);
      const newIndex = slides.findIndex((slide) => slide.id === over?.id);

      const reorderedSlides = arrayMove(slides, oldIndex, newIndex);
      // Call the parent component's method to update slides if provided
      if (onReorderSlides) {
        onReorderSlides(reorderedSlides);
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}>
      <SortableContext
        items={slides.map((slide) => slide.id)}
        strategy={rectSortingStrategy}>
        <div
          className="max-w-full pt-2 flex overflow-x-auto pb-2 scroll-smooth items-center relative"
          ref={containerRef}>
          {slides.map((slide, index) => (
            <SortableSlideItem
              key={slide.id}
              slide={slide}
              index={index}
              profileInfo={profileInfo}
              colors={colors}
              selectedFont={selectedFont}
              activeIndex={activeIndex}
              handleThumbnailClick={handleThumbnailClick}
              handleDeleteSlide={handleDeleteSlide}
            />
          ))}
          <TodaiTooltip
            triggerContent={
              <div
                className="cursor-pointer flex-shrink-0 border-1 border-dashed sticky right-0 bg-white pl-1 py-0.5 z-40"
                onClick={handleAddSlide}>
                <div className="rounded-lg border border-dashed border-gray-400 border-spacing-2 bg-card shadow-sm w-16 h-16 flex justify-center items-center">
                  <IconPlus className="text-gray-400" />
                </div>
              </div>
            }
            tooltipContent="Add New Slide"
          />
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default SlidesDragAndDrop;
