import aiContentImg from "@/assets/img/todaiAiContentFeatureImg.jpg";
import todaiCarousel from "@/assets/img/todaiCarousel.jpg";
import myView from "@/assets/img/todaiMyView.jpg";
import myVoice from "@/assets/img/todaiMyVoice.jpg";
import newsImg from "@/assets/img/todaiNewsFeatureImg.jpg";
import qoutesImg from "@/assets/img/todaiQuotesFeatureImg.jpg";
import videoImg from "@/assets/img/todaiVideoFeatureImg.jpg";
import viralContentImg from "@/assets/img/todaiViralContentImg.jpg";
import { TodaiImage } from "@/components/TodaiImage";
import ContactForm from "./ContactUs";

const Features = () => {
  return (
    <div className="container mx-auto p-4">
      {/* Header Section */}
      <header className="text-center flex flex-col gap-5">
        <h1 className="text-3xl font-bold">
          We’re glad to have you here, now, let’s get your personal brand turbo
          charged!
        </h1>
        <p className="text-lg mt-4">
          Please watch the video below to help you understand the features and
          how they can help you straight away!
        </p>
      </header>

      {/* Video Section */}
      <div className="flex justify-center py-8">
        <video className="w-full max-w-4xl rounded-md" controls>
          <source src="/video/todai_quick_start.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Features Section */}
      <section className="flex flex-col gap-10 rounded-lg p-5">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`flex flex-col md:flex-row gap-1 md:gap-5 rounded-lg min-h-72 lg:h-96 border shadow-lg ${
              feature.text == "first" && "md:flex-row-reverse"
            }`}>
            <TodaiImage
              src={feature.imageSrc}
              alt={feature.title}
              width={1000}
              height={1000}
              className={`w-full md:w-1/2   flex-1 object-cover ${
                feature.text == "first"
                  ? "rounded-t-lg md:rounded-tl-none md:rounded-r-lg"
                  : "rounded-t-lg md:rounded-tr-none md:rounded-l-lg"
              }`}
            />
            <div className="flex-1 p-3">
              <h2 className="text-xl font-bold my-4 text-center">
                {feature.title}
              </h2>
              {/* <p className="mt-2" >{feature.description}</p> */}
              <p
                className="p-2 text-sm md:text-base text-center"
                dangerouslySetInnerHTML={{ __html: feature.description }}
              />
            </div>
          </div>
        ))}
      </section>

      {/* Contact Us Section */}
      <footer className="text-center py-8">
        <ContactForm />
      </footer>
    </div>
  );
};

const features = [
  {
    imageSrc: viralContentImg,
    title: "Inspiration From Linkedin",
    description: `Based on your profile settings, we will gather a list of content that we believe would be beneficial to your profile, which you can then pick from, edit and schedule.
         <br/><br/>
        We provide an editing function that allows you to rewrite yourself, or let AI do the hard work and re-write for you.
        <br/><br/>
        You can also add your own image, GIF, or generate an image with AI, and your content is ready to be scheduled or posted straight away.`,
  },
  {
    imageSrc: aiContentImg,
    title: "AI Content",
    description: `If none of the viral content is to your liking, give the AI content feature a try.
                  <br/><br/>
                  Based on your profile settings, AI will create an original article for you that is relevant to your personal brand and is ready to post.
                  <br/><br/>
                  You can also generate images and hashtags.
                  <br/><br/>
                  A quick & easy option when you are pressed for time!`,
    text: "first",
  },
  {
    imageSrc: newsImg,
    title: "Recent News",
    description: `Need to stay on top of your industry trends? The right here, right now feature will fetch recent articles based on your profile preferences, and present them to you in a ready to post format, so you will never run out of relevant things to post.
            <br/><br/>
            We are always looking for more sites to add to our collection of recent news providers, so please feel free to submit sites you think are relevant via the submission box on the page, so we can start to monitor and use these sites in the future.`,
  },
  {
    imageSrc: qoutesImg,
    title: "Quotes",
    description: `Research shows that inspirational and motivational quotes are the some of the best performing content pieces across all social media platforms.
                  <br/><br/>
                  Now with the quotes feature, you can choose from quotes relevant to your profile, pick an image, generate a caption and post to your profile. Another quick way todai helps you to build your personal brand!`,
    text: "first",
  },
  {
    imageSrc: videoImg,
    title: "Magic Video",
    description: `We've simplified making video content like never before!
                <br/><br/>
                With today’s magic video tool, you can upload any video that is relevant to your profile, and then todai will cut the video into shorter content pieces that are the most viral, add subtitles and give you a caption and hashtags, so all you need to do is post!*
                <br/><br/>
                *you are able to edit some things yourself, like the length of videos and orientation to fit multiple channels.`,
  },
  {
    imageSrc: todaiCarousel,
    title: "Carousel",
    description: `Easily generate a carousel post for yourself.
                <br/><br/>
                Simply input the subject matter and todai will create a 5 page carousel – you are then free to customise, add pages, change colours and format the post as you like, before scheduling or posting instantly!`,
    text: "first",
  },
  {
    imageSrc: myView,
    title: "My View",
    description: `Interested in something that is happening right now but can't find the words to get your point across?
               <br/><br/>
               No worries, just input the subject matter into todai, we will give you a starting point based on your profile and interests to make your view relevant to your profile. Then just edit as you want and schedule! Simple.`,
  },
  {
    imageSrc: myVoice,
    title: "Top Voices",
    description: `Want a top voice badge on your profile? You need to contribute to articles regularly to get one. With todai, we have made it easy. Just paste the article questions from LinkedIn into the box and we will give you an answer you can simply paste - all based on your profile, tone and style. Easy.`,
    text: "first",
  },
];

export default Features;
