"use client";

import { useQuery } from "@tanstack/react-query";
import { TodaiAnimatedButton } from "@/components/button/TodaiAnimatedButton";
import TodaiCircularLoader from "@/components/loader/TodaiCircularLoader";
import { fetchQuotes } from "@/lib/axios/api";
import { MousePointerClick } from "lucide-react";
import { useState } from "react";
import EditQuotes from "./EditQuotes";
import TodaiTooltip from "@/components/tooltip";
import { IconReload } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

function Quotes() {
  const [selectedQuote, setSelectedQuote] = useState("");

  const {
    data: quotes,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["quotes"],
    queryFn: fetchQuotes,
    select: (data: any) => data,
    // staleTime: 5 * 60 * 1000,
    retry: 1,
  });
  const handleGetImageDetails: any = (quote: string) => {
    setSelectedQuote(quote);
  };

  // if (isLoading) {
  //     return <TodaiCircularLoader />
  // }

  if (isError) {
    return <div>Error fetching quotes</div>;
  }

  //AIzaSyAdgLjbW4tyJQTr9_eigD7Hw-I9L2GFJFc
  return (
    <div className="mx-auto w-full">
      <div className="flex justify-end items-center my-1 w-full">
        <div className="flex items-end justify-end flex-col flex-1">
          <div className="flex items-center flex-col">
            <p className="text-xs text-slate-500">Create</p>
            <h1 className="text-3xl font-bold">Quotes</h1>
          </div>
        </div>
        <div className="flex  justify-end items-center flex-1">
          {!selectedQuote && quotes?.length > 0 && (
            <TodaiTooltip
              triggerContent={
                <div className="bg-transparent pr-5">
                  <div
                    className="border-slate-200 hover:bg-slate-200 !text-brand-primary rounded-md p-1 cursor-pointer"
                    onClick={() => !isRefetching && refetch()}>
                    <IconReload
                      className={cn(isRefetching && "animate-spin opacity-50")}
                    />
                  </div>
                </div>
              }
              tooltipContent="Refresh"
              dataSide="left"
            />
          )}
        </div>
      </div>
      {selectedQuote && (
        <EditQuotes
          selectedQuote={selectedQuote}
          setselectedQuote={setSelectedQuote}
        />
      )}
      <div className="mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {quotes &&
            !selectedQuote &&
            quotes.map((quote: string, index: number) => (
              <div
                key={index}
                className="mb- p-4 rounded-xl justify-between shadow-xl flex flex-col relative min-h-60 overflow-clip">
                <p className="text-gray-700 m-3 font-medium text-pretty">
                  {quote}
                </p>
                <div className="w-full flex gap-3 z-10 justify-center">
                  <TodaiAnimatedButton
                    onClick={() => handleGetImageDetails(quote)}
                    type="button"
                    variant="primary"
                    className="!rounded-3xl !text-brand-primary border bg-transparent hover:!text-white">
                    <div className="flex gap-2 text-center text-xs items-center justify-center">
                      Edit & Post
                      <MousePointerClick className="opacity-35 w-4 h-4" />
                    </div>
                  </TodaiAnimatedButton>
                </div>
              </div>
            ))}
        </div>
      </div>
      {isLoading && <TodaiCircularLoader />}
    </div>
  );
}

export default Quotes;
