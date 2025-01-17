import TodaiDialog from "@/components/dialog/TodaiDialog";
import TodaiIcon from "@/components/icon/TodaiIcon";
import LiPreview from "@/components/linkedIn-peview/components/LiPreview";
import TodaiCircularLoader from "@/components/loader/TodaiCircularLoader";
import { TodaiButton } from "@/components/TodaiButton";
import { useToast } from "@/components/ui/use-toast";
import { deleteShcheduledPost } from "@/lib/axios/api";
import { IconTrash } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";

type PropViewPost = {
  postId: number;
  postText: string;
  assetLink: string;
  showPost: boolean;
  setShowPost: any;
  deletePostFromList: any;
};
function ViewPost({
  postText,
  assetLink,
  showPost,
  setShowPost,
  postId,
  deletePostFromList,
}: PropViewPost) {
  const { toast } = useToast();
  const {
    mutate,
    data: postData,
    isPending,
    isError: postLoadError,
  } = useMutation({
    mutationFn: (postId: number) => deleteShcheduledPost(postId),
    onSuccess: (data: any) => {
      deletePostFromList(postId);
      setShowPost(false);
      toast({
        title: data.status,
        description: data.message,
      });
    },
    onError: (error) => {
      console.error("Mutation failed:", error);
    },
  });

  //   const handleDeletePost = () => {
  //     mutate(postId);
  //   };

  return (
    <>
      {showPost && (
        <TodaiDialog
          open={showPost}
          setOpen={setShowPost}
          dialogTitle="Scheduled Post"
          content={
            postText ? (
              <div className="p-4 mt-5 flex justify-center overflow-y-auto h-[100%] min-w-full">
                <LiPreview
                  postText={postText}
                  imgUrl={assetLink}
                  //   setPostText={setPostText}
                  //   editText={editText}
                />
              </div>
            ) : (
              <TodaiCircularLoader />
            )
          }
          dialogWidth={`min-w-[80%] lg:min-w-[50%] xl:min-w-[35%]`}
          extraClass="min-h-96 !w-96 !p-4 "
          footerContent={
            postText ? (
              <div className="float-end h-10 flex gap-3 mr-5">
                <TodaiButton
                  onClick={() => mutate(postId)}
                  variant="primary-outline"
                  className="border-red-500 text-red-400 flex items-center hover:bg-red-200 text-xs !px-3 !py-1">
                  <TodaiIcon>
                    <IconTrash className="text-red-300 w-5 h-5" />
                  </TodaiIcon>
                  Delete
                </TodaiButton>
                {/* <TodaiButton
                  variant="primary"
                  className="flex items-center text-white text-xs !px-3 !py-1">
                  <TodaiIcon>
                    <IconCalendarStats className="w-5 h-5" />
                  </TodaiIcon>
                  Reschedule
                </TodaiButton> */}
              </div>
            ) : null
          }
        />
      )}
    </>
  );
}

export default ViewPost;
