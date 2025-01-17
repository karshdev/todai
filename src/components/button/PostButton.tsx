// import authorImage from '@/assets/img/avatar-dummy.jpeg'
// import { getProfileData1 } from '@/lib/axios/api'
// import { useQuery } from '@tanstack/react-query'
// import { useState } from 'react'
// import { TodaiImage } from '../TodaiImage'
// import TodaiInput from '../TodaiInput'
// import TodaiAvatar from '../avatar/TodaiAvatar'
// import TodaiDialog from '../dialog/TodaiDialog'
// import LinkedInSocialIcon from '../linkedIn-peview/components/LinkedInSocialIcon'
// import { TodaiAnimatedButton } from './TodaiAnimatedButton'

// type PostButtonProps = {
//     postText: string,
//     image: any,
//     setPostText: any
// }

// function PostButton({ postText, image, setPostText }: PostButtonProps) {
//     const [showPreview, setPreView] = useState(false)
//     const handlePostClick = () => {
//         setPreView((prev) => !prev)
//     }
//     return (
//         <div>
//             <TodaiAnimatedButton className="px-8 py-2 rounded-3xl text-white bg-brand-primary border border-brand-primary hover:bg-white hover:text-brand-primary" onClick={handlePostClick}>
//                 Post
//             </TodaiAnimatedButton>
//             <TodaiDialog
//                 open={showPreview}
//                 setOpen={setPreView}
//                 dialogTitle='LinkedIn Preview'
//                 content={<PostComponent postText={postText} image={image} setPostText={setPostText} />}
//                 dialogWidth='!w-[98%]'
//                 extraClass='!p-4 min-h-96 !w-96'
//                 footerContent={<div className='float-end flex gap-3'>
//                     <TodaiAnimatedButton
//                         // onClick={}
//                         type="button"
//                         variant='primary'
//                         className="p-3 !w-40 self-stretch border text-sm border-brand-primary hover:text-white rounded-r-full hover:!ring-brand-primary"
//                     >
//                         Post
//                     </TodaiAnimatedButton>
//                 </div>}
//             />
//         </div>
//     )
// }

// export default PostButton

// const PostComponent = ({ postText, image, setPostText }: PostButtonProps) => {
//     const [isExpanded, setIsExpanded] = useState(false);
//     const { data: profileInfo } = useQuery(
//         {
//             queryKey: ['profileInfo'],
//             queryFn: getProfileData1,
//             select: (data: any) => data.data.data
//         })

//     const toggleExpansion = () => {
//         setIsExpanded(!isExpanded);
//     };
//     const maxCharacterLimit = 3000;

//     const handleInputChange = (e: any) => {
//         if (e.target.value.length <= maxCharacterLimit) {
//             setPostText(e.target.value);
//         }
//         else {
//             alert(`You have reached the maximum character limit of ${maxCharacterLimit}.`);
//         }
//     };

//     const characterCount = postText.length;
//     return (
//         <div className="flex flex-col lg:flex-row h-full gap-10 p-10 overflow-y-auto">
//             {/* Left Section - Text Input */}
//             <div className="flex-1 flex flex-col max-h-full">
//                 <TodaiInput type="textarea" rows={22} inputClass="border w-full flex-grow rounded-2xl"
//                     value={postText}
//                     onChange={handleInputChange}
//                     maxLength={maxCharacterLimit}
//                 />
//                 <p className='text-xs text-slate-500 ml-3 pt-1'> Character count: {characterCount} / {maxCharacterLimit}</p>
//             </div>

//             {/* Vertical Divider */}
//             <div className="border-l border-gray-300 md:block hidden"></div>

//             {/* Right Section - Post Content */}
//             <div className="flex-1 max-w-xl h-fit  bg-white border border-gray-300 rounded-2xl shadow-xl ">
//                 {/* Profile and Summary Section */}
//                 <div className="flex items-center px-4 py-4">
//                     <TodaiAvatar authorImage={authorImage} />
//                     <div className="ml-4">
//                         <div className="text-sm font-semibold">{profileInfo?.first_name} {profileInfo?.last_name}</div>
//                         {/* <div className="text-xs text-gray-500">
//                             Marketing Specialist @BrandBoost | Crafting strategies that drive growth...
//                         </div> */}
//                         <div className="text-xs text-gray-500">2 d •</div>
//                     </div>
//                 </div>

//                 {/* Summary Text with See More / See Less */}
//                 <div className="mb-4 text-sm px-4 relative">
//                     <div className={isExpanded ? 'line-clamp-none whitespace-pre-wrap break-words text-black' : 'whitespace-pre-wrap break-words line-clamp-3 text-black'}>
//                         {postText}
//                     </div>
//                     <div
//                         className="bg-white text-gray-400 cursor-pointer text-xs float-end -mt-4 absolute bottom-0 right-4 pl-1"
//                         onClick={toggleExpansion}
//                     >
//                         {isExpanded ? 'See less' : '...See more'}
//                     </div>
//                 </div>

//                 {/* Image with Overlay Text */}
//                 {image && <div className="relative">
//                     <TodaiImage
//                         src={image}
//                         alt="Post Image"
//                         width={800}
//                         height={400}
//                         className="w-full !h-80 object-cover"
//                     />
//                 </div>}

//                 {/* Social Section */}
//                 <div className="flex items-center justify-between mt-4 text-xs text-gray-500 px-4 pb-4">
//                     <LinkedInSocialIcon />
//                     <div>
//                         <span>18 comments</span> • <span>5 share</span>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };