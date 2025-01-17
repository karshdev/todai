export type LinkedInPostButtonProps = {
    postText?: string;
    imgRef?: React.RefObject<any>;
    imgUrl?: string,
    videoUrl?: string
    setPostText?: React.Dispatch<React.SetStateAction<string>>;
    fileInput?: File | any,
    handleCloseSheet?: () => void
    editText?: boolean | string
    postButton?: boolean,
    assetLink?: string
};
