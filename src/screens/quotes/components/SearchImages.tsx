import TodaiInput from "@/components/TodaiInput";
import { IconLoader, IconSearch } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";

type PropSerchImage = {
  searchTerm: any;
  setSearchTerm: any;
  stockImages: any;
  isLoading: boolean;
  mutate: any;
  isSearching: any;
};
function SearchImages({
  searchTerm,
  setSearchTerm,
  stockImages,
  isLoading,
  mutate,
  isSearching,
}: PropSerchImage) {
  const [searchImage, setSearchImage] = useState(false);
  const queryClient = useQueryClient();
  // const [isSearching, setIsSearching] = useState(false);

  const handleSearchClick = (event: any) => {
    event.preventDefault();
    setSearchImage(!searchImage);
  };

  // useEffect(() => {
  //   setIsSearching(!isSearching);
  // }, [stockImages]);

  const handleSearchImage = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      if (searchTerm != "" && searchTerm.length >= 3) {
        //setIsSearching(true);
        // queryClient.invalidateQueries({ queryKey: ["stockImages"] });
        isSearching.current = true;
        mutate();
      }
    }
  };

  return (
    <div className="px-4 py-2 flex items-center overflow-hidden">
      <AnimatePresence>
        {searchImage && (
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ duration: 0.3 }}>
            <div className="relative">
              <TodaiInput
                disabled={isLoading}
                inputClass="!py-1"
                placeholder="Search Image"
                value={searchTerm}
                onChange={(e: any) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearchImage}
              />
              {isLoading && (
                <IconLoader className="w-5 h-5 absolute right-1 top-[6px] animate-spin" />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {!searchImage && (
        <IconSearch className="cursor-pointer" onClick={handleSearchClick} />
      )}
    </div>
  );
}

export default SearchImages;
