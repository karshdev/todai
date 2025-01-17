import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TodaiInput from "../TodaiInput";
import { TipTapEditor } from "../tiptap/TipTapEditor";

type TodaiTabProps = {
  quote: string;
  profileInfo?: any;
  activeIndex: number;
  setSlides?: any;
  setProfileInfo?: any;
  handleContentChange:any;
};
function TodaiTabs({
  quote,
  profileInfo,
  activeIndex,
  setSlides,
  setProfileInfo,
  handleContentChange
}: TodaiTabProps) {
  const onQuoteChange = (e: any) => {
    const newContent = e.target.value;
    setSlides((prevSlides: any) =>
      prevSlides.map((slide: any, index: any) =>
        index === activeIndex ? { ...slide, content: newContent } : slide
      )
    );
  };
  const onAuthorChange = (e: any) => {
    const newName = e.target.value;
    setProfileInfo((prev: any) => ({ ...prev, [e.target.name]: newName }));
  };
  return (
    <Tabs defaultValue="quote" className="w-full min-h-52 mb-5">
      <TabsList className="w-full">
        <TabsTrigger value="quote">Text</TabsTrigger>
        <TabsTrigger value="author">Author</TabsTrigger>
      </TabsList>
      <TabsContent value="quote">
        {/* <div>
          <TodaiInput
            label="Text"
            type="textarea"
            className="flex min-h-[80px] w-full rounded-md border"
            id="quote"
            placeholder="Slide Text"
            rows={4}
            onChange={onQuoteChange}
            value={quote}
          />
        </div> */}
        <TipTapEditor
          content={quote}
          onChange={handleContentChange}
        />
      </TabsContent>
      <TabsContent value="author">
        <div className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
          <div className="space-y-4">
            <div>
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="authorName">
                Author Name
              </label>
              {/* <input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                id="authorName"
                placeholder="Author Name"
                defaultValue="John Doe"
              /> */}
              <TodaiInput
                type="text"
                className="flex min-h-[80px] w-full rounded-md border"
                id="authorName"
                name="authorName"
                placeholder="Author Name"
                onChange={onAuthorChange}
                value={profileInfo?.authorName}
              />
            </div>

            <div>
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="linkedinHandle">
                LinkedIn Handle
              </label>
              {/* <input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                id="linkedinHandle"
                placeholder="LinkedIn Handle"
                defaultValue="@john-doe"
              /> */}
              <TodaiInput
                type="text"
                className="flex min-h-[80px] w-full rounded-md border"
                id="linkedinHandle"
                name="linkedInHandle"
                placeholder="LinkedIn Handle"
                onChange={onAuthorChange}
                value={profileInfo?.linkedInHandle}
              />
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}

export default TodaiTabs;
