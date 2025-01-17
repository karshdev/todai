'use client'
import { TodaiAnimatedButton } from '@/components/button/TodaiAnimatedButton';
import TodaiCircularLoader from '@/components/loader/TodaiCircularLoader';
import TodaiInput from '@/components/TodaiInput';
import { useToast } from '@/components/ui/use-toast';
import { postTopVoices } from '@/lib/axios/api';
import { useMutation } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CopyIcon } from 'lucide-react';
import { IconRefresh } from '@tabler/icons-react';
import TodaiIcon from '@/components/icon/TodaiIcon';

function TopVoices() {
    const [text, setText] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const { toast } = useToast();
    const [loading, setLoading] = useState<boolean>(false);
    const [displayedText, setDisplayedText] = useState('');
    const [index, setIndex] = useState(0);
    const [copied, setCopied] = useState<boolean>(false);

    useEffect(() => {
        if (index < content.length) {
            const timeout = setTimeout(() => {
                setDisplayedText((prev) => prev + content.charAt(index));
                setIndex(index + 1);
            }, 10); // Adjust typing speed here
            return () => clearTimeout(timeout);
        }
    }, [index, content]);

    const { mutate } = useMutation({
        mutationFn: () => postTopVoices({ content: text }),
        onSuccess: (response: any) => {
            const topVoice = response?.data?.data;
            setContent(topVoice);
            setIndex(0);
            setDisplayedText('');
            setLoading(false);
        },
        onError: () => {
            setLoading(false);
            toast({
                variant: "destructive",
                title: "Something went wrong!",
                description: "Please try again",
            });
        },
    });

    const handleSubmitTopVoices = (e: any) => {
        e.preventDefault();
        if (text === '') {
            toast({
                variant: "destructive",
                title: "The input text is not valid.",
                description: "Please provide content.",
            });
            return;
        }
        setIndex(0);
        setDisplayedText('');
        setLoading(true);
        mutate();
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleRefresh = () => {
        setLoading(true);
        setIndex(0);
        setDisplayedText('');
        mutate();
    };

    return (
        <div className='w-full'>
            <form className="flex w-full justify-center" onSubmit={handleSubmitTopVoices}>
                <div className='flex w-full lg:w-2/3 items-center justify-center rounded-full shadow-lg'>
                    <TodaiInput
                        value={text}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setText(e.target.value)}
                        type="text"
                        placeholder="Eg: What are one to three books that have greatly influenced your life?"
                        extra='w-full'
                        inputClass="flex-grow w-full !border-r-0 !p-4 border border-brand-primary !rounded-l-full !rounded-r-none !outline-none focus-visible:!ring-brand-primary"
                    />
                    <TodaiAnimatedButton
                        onClick={handleSubmitTopVoices}
                        type="button"
                        variant='primary'
                        className="p-3 !w-40 self-stretch border border-brand-primary !rounded-l-none border-l-0 hover:text-white rounded-r-full hover:!ring-brand-primary"
                    >
                        Submit
                    </TodaiAnimatedButton>
                </div>
            </form>
            <div className='container mt-8 text-base '>
                {(!loading && content) && (
                    <motion.p
                        className="mb-3 text-gray-500 dark:text-gray-400"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        {displayedText}
                    </motion.p>
                )}
                {content && index >= content.length && (
                    <div className='flex gap-2 transition-opacity duration-300 delay-300 animate-fade-in items-center'>
                        <TodaiIcon>
                            <IconRefresh className='cursor-pointer hover:bg-slate-200 rounded-md p-1' onClick={handleRefresh} />
                        </TodaiIcon>
                        {copied ? (
                            <motion.p
                                className="text-green-600 text-xs"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                 Copied!
                            </motion.p>
                        ) : <TodaiIcon >
                            <CopyIcon className='cursor-pointer hover:bg-slate-200 rounded-md p-1' onClick={handleCopy} />
                        </TodaiIcon>}
                    </div>
                )}
                {loading && <TodaiCircularLoader />}
            </div>
        </div>
    );
}

export default TopVoices;
