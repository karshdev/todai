import React, { useRef, useState, useCallback, useEffect } from "react";
import SearchImages from "./SearchImages";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchStockImage } from "@/lib/axios/api";
import { TodaiImage } from "@/components/TodaiImage";
import TodaiCircularLoader from "@/components/loader/TodaiCircularLoader";
import { Loader } from "lucide-react";

interface StockImageListProps {
  onImageSelect: (image: any) => void;
}

function StockImageList({ onImageSelect }: StockImageListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const isSearching = useRef(false);
  const [imageList, setImageList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Mutation for loading images
  const { mutate } = useMutation({
    mutationFn: async () => {
      return await fetchStockImage(searchTerm);
    },
    onSuccess: (newImages) => {
      if (newImages.length === 0) {
        setHasMore(false);
        setIsLoading(false);
        return;
      }

      if (isSearching.current) {
        setImageList(newImages);
        isSearching.current = false;
        return;
      }
      // Add new images to the existing list
      setImageList((prevList) => {
        const uniqueNewImages = newImages.filter(
          (newImage: any) =>
            !prevList.some((existingImage: any) => existingImage === newImage)
        );
        return [...prevList, ...uniqueNewImages];
      });
      setIsLoading(false);
    },
    onError: (error) => {
      console.error("Error loading images:", error);
      setIsLoading(false);
    },
  });

  // Initial load
  useEffect(() => {
    setIsLoading(true);
    setImageList([]);
    setHasMore(true);
    mutate();
  }, []);

  // Intersection Observer callback
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasMore && !isLoading) {
        setIsLoading(true);
        mutate();
      }
    },
    [mutate, hasMore, isLoading]
  );

  // Set up the intersection observer
  useEffect(() => {
    const element = observerTarget.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
      rootMargin: "50px",
    });

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [handleObserver]);

  // Reset images when search term changes
  const handleSearch = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
    queryClient.invalidateQueries({ queryKey: ["stockImages"] });
  };

  return (
    <div className="mt-3 bg-white rounded-md">
      <div className="flex justify-between w-full items-center overflow-x-clip">
        <div className="px-4 py-2">
          <h2 className="text-sm font-bold text-gray-800">Stock Images</h2>
        </div>
        <SearchImages
          searchTerm={searchTerm}
          setSearchTerm={handleSearch}
          stockImages={imageList}
          isLoading={isLoading}
          mutate={mutate}
          isSearching={isSearching}
        />
      </div>

      <div className="min-h-[250px] overflow-y-auto relative flex flex-col">
        <div className="p-1 h-full flex-1">
          <div className="grid grid-cols-3 gap-2 h-full">
            {imageList.length > 0 ? (
              imageList.map((item: any, index: number) => (
                <div key={index} className="relative">
                  <TodaiImage
                    height={500}
                    width={700}
                    src={item}
                    alt={`Image ${index}`}
                    className="w-full h-20 object-cover rounded-md cursor-pointer"
                    onClick={() => onImageSelect(item)}
                  />
                </div>
              ))
            ) : isLoading ? (
              <div className="col-span-3">
                <TodaiCircularLoader height="h-full" />
              </div>
            ) : (
              <div className="col-span-3 text-center text-gray-500">
                No images found
              </div>
            )}
          </div>
        </div>
        {/* Intersection Observer target */}
        <div
          ref={observerTarget}
          className="h-10 flex items-center justify-center">
          {isLoading && hasMore && imageList.length > 0 && (
            <div className=" flex items-center justify-center">
              <Loader className="animate-spin" />
              Loading more...
            </div>
          )}
          {!hasMore && imageList.length > 0 && (
            <div className="text-sm text-gray-500">No more images to load</div>
          )}
        </div>
      </div>

      {/* {!isLoading && imageList.length === 0 && (
        <div className="text-center text-gray-500 p-4">
          No images found for "{searchTerm}"
        </div>
      )} */}
    </div>
  );
}

export default StockImageList;
