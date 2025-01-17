// thanks to oliver: https://www.youtube.com/@olivierlarose1
"use client";
import { ReactLenis } from "lenis/react";
import { useTransform, motion, useScroll, MotionValue } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import aiContentImg from "@/assets/img/todaiAiContentFeatureImg.jpg";
import newsImg from "@/assets/img/todaiNewsFeatureImg.jpg";
import qoutesImg from "@/assets/img/todaiQuotesFeatureImg.jpg";
import videoImg from "@/assets/img/todaiVideoFeatureImg.jpg";
import viralContentImg from "@/assets/img/todaiViralContentImg.jpg";
import ContactForm from "../ContactUs";
const projects = [
  {
    title: "Viral Content (LinkedIn)",
    description: `Based on your profile settings, we will gather a list of content that we believe would be beneficial to your profile, which you can then pick from, edit and schedule.
         <br/><br/>
        We provide an editing function that allows you to rewrite yourself, or let AI do the hard work and re-write for you.
        <br/><br/>
        You can also add your own image, GIF, or generate an image with AI, and your content is ready to be scheduled or posted straight away.`,
    src: "viral.jpg",
    link: viralContentImg,
    color: "#f8fafc",
  },
  {
    title: "AI Content",
    description: `If none of the viral content is to your liking, give the AI content feature a try.
                  <br/><br/>
                  Based on your profile settings, AI will create an original article for you that is relevant to your personal brand and is ready to post.
                  <br/><br/>
                  You can also generate images and hashtags.
                  <br/><br/>
                  A quick & easy option when you are pressed for time!`,
    src: "aicontent.jpg",
    link: aiContentImg,
    color: "#f8fafc",
  },
  {
    title: "Right here, right now",
    description: `Need to stay on top of your industry trends? The right here, right now feature will fetch recent articles based on your profile preferences, and present them to you in a ready to post format, so you will never run out of relevant things to post.
            <br/><br/>
            We are always looking for more sites to add to our collection of recent news providers, so please feel free to submit sites you think are relevant via the submission box on the page, so we can start to monitor and use these sites in the future.`,
    src: "news.jpg",
    link: newsImg,
    color: "#f8fafc",
  },
  {
    title: "Quotes",
    description: `Research shows that inspirational and motivational quotes are the some of the best performing content pieces across all social media platforms.
                  <br/><br/>
                  Now with the quotes feature, you can choose from quotes relevant to your profile, pick an image, generate a caption and post to your profile. Another quick way todai helps you to build your personal brand!`,
    src: "house.jpg",
    link: qoutesImg,
    color: "#f8fafc",
  },
  {
    title: "Magic Video",
    description: `We've simplified making video content like never before!
                <br/><br/>
                With todai’s magic video tool, you can paste a video from youtube or vimeo that is relevant to your profile, and then todai will cut the video into shorter content pieces that are the most viral, add subtitles and give you a caption and hashtags, so all you need to do is post!*
                <br/><br/>
                *you are able to edit some things yourself, like the length of videos and orientation to fit multiple channels.`,
    src: "videoImg",
    link: videoImg,
    color: "#f8fafc",
  },
];
export default function FeaturesStackingCard(): JSX.Element {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });
  return (
    <ReactLenis root>
      <main className="" ref={container}>
        <>
          <section className="text-slate-700  h-[90vh]  w-full  grid place-content-center ">
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

            <h1 className="xl:text-7xl lg:text-5xl text-4xl px-8 mt-20 2xl:mt-0 font-semibold text-center tracking-tight leading-[120%]">
              {/* Stacking Cards Using <br /> Framer-Motion. Scroll down! 👇 We’re */}
              Glad to have you here, now,
              <br /> let’s get your personal brand turbo 🚀 charged!
            </h1>
            <div className="mt-10">
              <p className="!text-xl mt-4 text-center font-semibold">
                There are already a lot of brands with good content, so how do
                we stand out?
              </p>
              {/* <header className="text-center py-8">
              <h1 className="text-3xl font-bold">
                We’re glad to have you here, now, let’s get your personal brand
                turbo charged!
              </h1>
              <p className="text-lg mt-4">
                There are already a lot of brands with good content, so how do
                we stand out?
              </p>
            </header> */}

              {/* Video Section */}
              <div className="flex justify-center py-2">
                <video className="w-full max-w-4xl rounded-md" controls>
                  <source src="/video/sample.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </section>
        </>

        <section className="text-slate-700   w-full  mt-52 2xl:mt-0">
          {projects.map((project, i) => {
            const targetScale = 1 - (projects.length - i) * 0.05;
            return (
              <Card
                key={`p_${i}`}
                i={i}
                url={project?.link.src}
                src={project?.src}
                title={project?.title}
                color={project?.color}
                description={project?.description}
                progress={scrollYProgress}
                range={[i * 0.25, 1]}
                targetScale={targetScale}
              />
            );
          })}
        </section>
        <footer className="text-center py-8">
          <ContactForm />
        </footer>
        {/* <footer className="group">
          <h1 className="text-[10vw] animate-pulse  leading-[100%] tracking-tighter font-semibold text-center bg-gradient-to-r from-gray-200 to-gray-300 bg-clip-text text-transparent transition-all ease-linear">
            todai
          </h1>
          <div className="bg-black h-40 relative z-10 grid place-content-center text-xl rounded-tr-full rounded-tl-full"></div>
        </footer> */}
      </main>
    </ReactLenis>
  );
}
interface CardProps {
  i: number;
  title: string;
  description: string;
  src: string;
  url: string;
  color: string;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
}
export const Card: React.FC<CardProps> = ({
  i,
  title,
  description,
  src,
  url,
  color,
  progress,
  range,
  targetScale,
}) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "start start"],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1]);
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div
      ref={container}
      className="h-screen flex items-center justify-center sticky top-10 ">
      <motion.div
        style={{
          backgroundColor: color,
          scale,
          top: `calc(-5vh + ${i * 25}px)`,
        }}
        className={`flex flex-col relative -top-[25%] h-[650px] w-full md:w-[70%] rounded-md p-10 origin-top shadow-lg bg-gradient-to-r from-gray-50 to-gray-200`}>
        <h2 className="text-xl text-center font-semibold">{title}</h2>
        <div className={`flex flex-col xl:flex-row justify-center items-center h-full mt-5 gap-2 xl:gap-10`}>
          <div className={`w-full xl:w-[40%] relative  mb-4 xl:mb-0 text-sm`}>
            {/* <p className="text-base">{description}</p> */}
            <p
              className="p-2 text-sm xl:text-lg text-center"
              dangerouslySetInnerHTML={{ __html: description }}
            />
            {/* <span className="flex items-center gap-2 pt-2">
              <a
                href={"#"}
                target="_blank"
                className="underline cursor-pointer">
                See more
              </a>
              <svg
                width="22"
                height="12"
                viewBox="0 0 22 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M21.5303 6.53033C21.8232 6.23744 21.8232 5.76256 21.5303 5.46967L16.7574 0.696699C16.4645 0.403806 15.9896 0.403806 15.6967 0.696699C15.4038 0.989592 15.4038 1.46447 15.6967 1.75736L19.9393 6L15.6967 10.2426C15.4038 10.5355 15.4038 11.0104 15.6967 11.3033C15.9896 11.5962 16.4645 11.5962 16.7574 11.3033L21.5303 6.53033ZM0 6.75L21 6.75V5.25L0 5.25L0 6.75Z"
                  fill="black"
                />
              </svg>
            </span> */}
          </div>

          <div
            className={`relative w-full xl:w-[60%] h-full min-h-44 rounded-lg overflow-hidden `}>
            <motion.div
              className={`w-full h-full`}
              style={{ scale: imageScale }}>
              <Image fill src={url} alt="image" className="object-cover" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
