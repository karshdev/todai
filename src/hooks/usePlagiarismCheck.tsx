"use client"
import { useEffect, useState } from "react";
import { useDebounce } from 'react-use';
import { postPlagiarism } from "@/lib/axios/api";
import { useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";


type PropPlagiarism = {
    original: string;
    modified: string;
  };
  

export const usePlagiarismCheck = (previousContent: string, currentContent: string) => {
    const [debouncedContent, setDebouncedContent] =useState(currentContent);
    const[score,setScore]=useState(0)
    useDebounce(
      () => {
        setDebouncedContent(currentContent);
      },
      1000,
      [currentContent]
    );
  
    const {
      mutate,
      data,
      isPending,
      isError
    } = useMutation({
      mutationFn: (data: PropPlagiarism) => postPlagiarism(data),
      onSuccess: (data:any) => {
        setScore(data?.data?.data?.score)
      },
      onError: (error) => {
        console.error("Plagiarism check failed:", error);
      },
    });
  
   useEffect(() => {
      if (debouncedContent !== previousContent) {
        mutate({
          original: previousContent,
          modified: debouncedContent
        });
      }
    }, [debouncedContent, previousContent, mutate]);
  
    return {
      score,
      isLoading: isPending,
      isError
    };
  };