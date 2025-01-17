import axios from 'axios';
import { getFileBlob } from '../helper';
import { bravoApi, deleteDataWithToken, getDataArgToken, getDataWithToken, patchDataWithToken, postDataWithToken, putDataWithToken } from './axios';
import { getSession } from 'next-auth/react';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
console.log("BASE_URL",BASE_URL);

const SIGNUP_URL = '/auth/users/'
const SIGNIN_URL = '/auth/jwt/create/'
const SOCIAL_AUTH_GOOGLE = '/auth/google/'
const DEFAUT_INTEREST_URL = '/v1/api/core/interests/'
const POST_INTEREST_URL = '/v1/api/core/interests/user/'
export const GET_PROFILE_DATA_URL = '/auth/profile/'
const GET_LINKEDIN_POST_URL = '/v1/api/core/linkedin-posts/'
const CONNECT_WITH_LINKEDIN_URL = '/auth/linkedin-connect/'
const GET_AI_CONTENT_URL = '/v1/api/core/articles/'
const WORLD_NEWS_URL = '/v1/api/core/news/'
const GET_USER_INTEREST_URL = '/v1/api/core/interests/user/'
const GET_QUOTES_URL = '/v1/api/core/quotes/get/'
const GET_QUOTES_STOCK_IMAGE_URL = '/v1/api/core/quotes/img/'
const GET_QUOTES_AI_IMAGE_URL = '/v1/api/core/quotes/ai-img/'
const CREATE_VIDEO_URL = '/v1/api/core/video/'
const GET_VIDEO_DETAILS_URL = '/v1/api/core/video'
const GET_CLIP_META_DATA_URL = '/v1/api/core/video/clip/meta/get'
const GET_HASHTAGS_URL = '/v1/api/core/hashtags/'
const GET_POST_IMAGE_URL = '/v1/api/core/img-gen/'
const GET_REWRITE_WITH_AI = '/v1/api/core/rewrite/'
const GET_ALL_SLOTS_IN_QUEUE_API = '/v1/api/core/queue/'
const GET_ALL_FREE_SLOTS_API = '/v1/api/core/queue/free/'
const UPLOAD_RESOURCES_API = '/v1/api/core/upload/'
const SCHEDULE_POST_API = '/v1/api/core/queue/schedule/'
const POST_NOW_API = '/v1/api/core/post-now/'
const TIME_SLOT_API = '/v1/api/core/schedule/'
const GET_DAY_OF_WEEK_VALUES_API = '/v1/api/core/schedule/days/'
const GET_POST_DETAILS_BY_ID_API = '/v1/api/core/posts/'
const CHANGE_PASSWORD_API = '/auth/change-password/'
const TOP_VOICE_API = '/v1/api/core/top-voice/'
const MY_VIEW_API = '/v1/api/core/my-view/'
const GET_CAROUSEL_QUOTES = '/v1/api/core/quotes/carousel/'
const LINKEDIN_STATUS_CHECK = '/auth/linkedin-status/'
const UPLOAD_VIDEO = '/v1/api/core/video/'
const GET_AI_CAPTION = '/v1/api/core/ai-caption/'
const BOOKS_API = '/v1/api/core/books/'
const BOOK_SUMMARY_API = '/v1/api/core/book-summary/'
const SUBSCRIPTION_API = '/v1/api/core/subscriptions/user/'
const MANAGE_SUBSCRIPTION_API = '/v1/api/core/subscriptions/manage/'
const LINKEDIN_REWORK_API = '/v1/api/core/linkedin-rework/'
const GET_SUBTITLE_API = '/v1/api/core/video/clip/subtitles/'
const UPDATE_SUBTITLE_API = '/v1/api/core/video/subtitles/'
const EDIT_CLIP_API = '/v1/api/core/video/clip/edit/'
// const DELETE_SCHEDULED_POST_API = '/v1/api/core/posts'


export const signUpUser = async (formData: FormData) => {
    try {
        const response = await axios.post(`${BASE_URL}${SIGNUP_URL}`, formData);
        return response;
    } catch (error) {
        throw error;
    }
};

type SignInProp = {
    email: string;
    password: string;
}
export const signInUser = async (credentials: SignInProp) => {
    try {
        const response = await axios.post(`${BASE_URL}${SIGNIN_URL}`, credentials);
        return response;
    } catch (error) {
        throw error;
    }
};


type SocialAuthProp = { auth_token: string }
export const socialAuthGoogle = async (token: SocialAuthProp) => {
    try {
        const response = await axios.post(`${BASE_URL}${SOCIAL_AUTH_GOOGLE}`, token);
        return response;
    } catch (error) {
        throw error;
    }
};
export const getAllDefaultInterests = async () => {
    try {
        const response = await axios.get(`${BASE_URL}${DEFAUT_INTEREST_URL}`);
        return response;
    } catch (error) {
        throw error;
    }
};

export const postInterest = async (data: any) => {
    try {
        const url = `${BASE_URL}${POST_INTEREST_URL}`
        const response = await postDataWithToken(url, data);
        return response;
    } catch (error) {
        throw error;
    }
};

export const updateInterest = async (data: any) => {
    try {
        const user: any = await getProfileData1();
        const url = `${BASE_URL}${POST_INTEREST_URL}${user?.data?.data?.email}`
        const response = await putDataWithToken(url, data);
        return response;
    } catch (error) {
        throw error;
    }
};
export const getProfileData = async (token: string) => {
    try {
        const url = `${BASE_URL}${GET_PROFILE_DATA_URL}`
        const response = await getDataArgToken(url, token);
        return response;
    } catch (error) {
        throw error;
    }
};


export const getProfileData1 = async () => { //not passing token 
    try {
        const url = `${BASE_URL}${GET_PROFILE_DATA_URL}`
        const response = await getDataWithToken(url);
        return response;
    } catch (error) {
        throw error;
    }
};

export const getInterestOfUser = async () => {
    try {
        const url = `${BASE_URL}${GET_USER_INTEREST_URL}`
        const response = await getDataWithToken(url);
        return response;
    } catch (error) {
        throw error;
    }
};



export const getLinkedInPosts = async () => {
    try {
        const url = `${BASE_URL}${GET_LINKEDIN_POST_URL}`;
        const interestResponse = await getInterestOfUser();
        if (interestResponse.status !== 200) {
            throw new Error('Failed to fetch user interests');
        }
        const interestIds = interestResponse?.data?.data?.interests.map((item: any) => item.id).join(',');
        if (interestIds == undefined) {
            return { status: 400, message: 'User has no interests' };
        }
        const fullUrl = `${url}?interest=${interestIds}`
        const response = await getDataWithToken(fullUrl);
        if (response.status !== 200) {
            throw new Error('Failed to linkedIn posts');
        }
        return response;
    } catch (error) {
        console.error('Error fetching linkedIn posts:', error);
        throw error; // Rethrow the error for the caller to handle
    }
};

type PropConnectWithLinkedIn = {
    auth_code: string
}

export const connectWithLinkedIn = async (data: PropConnectWithLinkedIn) => {
    try {
        const url = `${BASE_URL}${CONNECT_WITH_LINKEDIN_URL}`
        const response = await postDataWithToken(url, data);
        return response;
    } catch (error) {
        //return error
        throw error;
    }
};

export const getAIContent = async () => {
    try {
        const url = `${BASE_URL}${GET_AI_CONTENT_URL}`
        const response = await getDataWithToken(url);
        return response;
    } catch (error) {
        throw error;
    }
};


export const fetchWorldNews = async () => {
    try {
        const url = `${BASE_URL}${WORLD_NEWS_URL}`;
        const interestResponse = await getInterestOfUser();

        if (interestResponse.status !== 200) {
            throw new Error('Failed to fetch user interests');
        }

        const interestIds: number[] = interestResponse?.data?.data?.interests.map((item: any) => item.id);

        if (interestIds.length === 0) {
            return { status: 400, message: 'User has no interests' };
        }

        const data = { "interest": interestIds };
        const response = await postDataWithToken(url, { "interest": interestIds });

        if (response.status !== 200) {
            throw new Error('Failed to fetch world news');
        }

        return response;
    } catch (error) {
        console.error('Error fetching world news:', error);
        throw error; // Rethrow the error for the caller to handle
    }
};

export const fetchQuotes = async () => {
    try {
        const url = `${BASE_URL}${GET_QUOTES_URL}`;
        const interestResponse = await getInterestOfUser();

        if (interestResponse.status !== 200) {
            throw new Error('Failed to fetch user interests');
        }

        const interestIds: number[] = interestResponse?.data?.data?.interests.map((item: any) => item.id);

        if (interestIds.length === 0) {
            return { status: 400, message: 'User has no interests' };
        }

        const data = { "interest": interestIds };
        const response = await postDataWithToken(url, { "interest": interestIds });

        if (response.status !== 200) {
            throw new Error('Failed to fetch world news');
        }
        const dataz = response.data.data.flatMap((item: any) => item.quotes);
        return dataz
    } catch (error) {
        console.error('Error fetching world news:', error);
        throw error; // Rethrow the error for the caller to handle
    }
};

export const fetchStockImage = async (query: string) => {
    try {
        // const url = `${BASE_URL}${GET_QUOTES_STOCK_IMAGE_URL}`;
        const url = `${BASE_URL}${GET_QUOTES_STOCK_IMAGE_URL}?search=${query}`;
        // const interestResponse = await getInterestOfUser();

        // if (interestResponse.status !== 200) {
        //     throw new Error('Failed to fetch user interests');
        // }

        // const interestIds: number[] = interestResponse?.data?.data?.interests.map((item: any) => item.id);

        // if (interestIds.length === 0) {
        //     return { status: 400, message: 'User has no interests' };
        // }

        // const data = { "interest": interestIds };
        const response = await getDataWithToken(url);

        if (response.status !== 200) {
            throw new Error('Failed to fetch stock images');
        }
        return response.data.data
    } catch (error) {
        console.error('Error fetching fetch stock images:', error);
        throw error; // Rethrow the error for the caller to handle
    }
};

export const fetchAIImage = async (quote: string) => {
    try {
        const url = `${BASE_URL}${GET_QUOTES_AI_IMAGE_URL}`;
        const response = await postDataWithToken(url, { "quote": quote });
        if (response.status !== 200) {
            throw new Error('Failed to fetch Ai images');
        }
        return response;
    } catch (error) {
        console.error('Error fetching Ai images:', error);
        throw error; // Rethrow the error for the caller to handle
    }
};



export const createVideo = async (data: any) => {
    try {
        const url = `${BASE_URL}${CREATE_VIDEO_URL}`
        const response = await postDataWithToken(url, data);
        return response;
    } catch (error) {
        throw error;
    }
};

export const fetchVideoDetails = async (videoId: number) => {
    try {
        const url = `${BASE_URL}${GET_VIDEO_DETAILS_URL}/${videoId}/`;
        const response = await getDataWithToken(url);
        if (response.status !== 200) {
            throw new Error('Failed to fetch video details');
        }
        return response;
    } catch (error) {
        console.error('Error fetching Ai images:', error);
        throw error; // Rethrow the error for the caller to handle
    }
};

export const fetchClipMetaData = async (videoId: number) => {
    try {
        const url = `${BASE_URL}${GET_CLIP_META_DATA_URL}/${videoId}`;
        const response = await getDataWithToken(url);
        if (response.status !== 200) {
            throw new Error('Failed to Fetch Clip Meta Data');
        }
        return response;
    } catch (error) {
        console.error('Error Fetch Clip Meta Data:', error);
        throw error; // Rethrow the error for the caller to handle
    }
};


export const generateHashtags = async (content: string) => {
    try {
        const data = { content: content }
        const url = `${BASE_URL}${GET_HASHTAGS_URL}`;
        const response = await postDataWithToken(url, data);
        if (response.status !== 200) {
            throw new Error('Failed to Generate Hashtags');
        }
        return response;
    } catch (error) {
        console.error('Error Generate Hashtags:', error);
        throw error; // Rethrow the error for the caller to handle
    }
};
export const generatePostImage = async (content: string) => {
    try {
        const data = { content: content }
        const url = `${BASE_URL}${GET_POST_IMAGE_URL}`;
        const response = await postDataWithToken(url, data);
        if (response.status !== 200) {
            throw new Error('Failed to Generate Post Image');
        }
        return response;
    } catch (error) {
        console.error('Error Generate Post Image:', error);
        throw error; // Rethrow the error for the caller to handle
    }
};

export const rewriteWithAI = async (content: string) => {
    try {
        const data = { content: content }
        const url = `${BASE_URL}${GET_REWRITE_WITH_AI}`;
        const response = await postDataWithToken(url, data);
        if (response.status !== 200) {
            throw new Error('Failed to Rewrite With AI');
        }
        return response;
    } catch (error) {
        console.error('Error Rewrite With AI:', error);
        throw error; // Rethrow the error for the caller to handle
    }
};


export const fetchAllSlotsInQueue = async () => {
    try {
        const url = `${BASE_URL}${GET_ALL_SLOTS_IN_QUEUE_API}`;
        const response = await getDataWithToken(url);
        if (response.status !== 200) {
            throw new Error('Failed to fetch slot in queue');
        }
        return response;
    } catch (error) {
        console.error('Error fetch slot in queue:', error);
        throw error; // Rethrow the error for the caller to handle
    }
};

export const fetchAllFreeSlots = async () => {
    try {
        const url = `${BASE_URL}${GET_ALL_FREE_SLOTS_API}`;
        const response = await getDataWithToken(url);
        if (response.status !== 200) {
            throw new Error('Failed to fetch free slots');
        }
        return response;
    } catch (error) {
        console.error('Error fetch fetch free slots:', error);
        throw error; // Rethrow the error for the caller to handle
    }
};

export const uploadResources = async (fileInput: File | string) => {
    try {
        const fileBlob = await getFileBlob(fileInput);
        console.log("🚀 ~ uploadResources ~ fileBlob:", fileBlob)
        const formData = new FormData();
        formData.append('asset', fileBlob);
        const url = `${BASE_URL}${UPLOAD_RESOURCES_API}`;
        const response = await postDataWithToken(url, formData, true);
        if (response.status !== 200) {
            throw new Error('Failed to Upload Resource');
        }
        return response;
    } catch (error) {
        console.error('Error Rewrite Upload Resource', error);
        throw error; // Rethrow the error for the caller to handle
    }
};

type postData = {
    type?: string,
    content: string,
    interest?: number,
    assets?: number[] | [],
    slot_id?: number | undefined
}

export const schedulePost = async (postData: postData) => {
    try {
        const url = `${BASE_URL}${SCHEDULE_POST_API}`;
        // const interestResponse = await getInterestOfUser();

        // if (interestResponse.status !== 200) {
        //     throw new Error('Failed to fetch user interests');
        // }

        // const interestIds: number[] = interestResponse?.data?.data.map((item: any) => item.id);

        // if (interestIds.length === 0) {
        //     return { status: 400, message: 'User has no interests' };
        // }

        // const data = { type, content, interest, assets };

        const response = await postDataWithToken(url, postData);

        if (response.status !== 200) {
            throw new Error('Failed to shedule post');
        }

        return response;
    } catch (error) {
        console.error('Error scheduling post:', error);
        throw error; // Rethrow the error for the caller to handle
    }
};

export const postNow = async (postData: postData) => {
    try {
        const url = `${BASE_URL}${POST_NOW_API}`;
        // const interestResponse = await getInterestOfUser();

        // if (interestResponse.status !== 200) {
        //     throw new Error('Failed to fetch user interests');
        // }

        // const interestIds: number[] = interestResponse?.data?.data.map((item: any) => item.id);

        // if (interestIds.length === 0) {
        //     return { status: 400, message: 'User has no interests' };
        // }

        // const data = { type, content, interest, assets };

        const response = await postDataWithToken(url, postData);

        if (response.status !== 200) {
            throw new Error('Failed to shedule post');
        }

        return response;
    } catch (error) {
        console.error('Error scheduling post:', error);
        throw error; // Rethrow the error for the caller to handle
    }
};


export const fetchAllTimeSlots = async () => {
    try {
        const url = `${BASE_URL}${TIME_SLOT_API}`;
        const response = await getDataWithToken(url);
        if (response.status !== 200) {
            throw new Error('Failed to fetch slot');
        }
        return response;
    } catch (error) {
        console.error('Error fetch slot:', error);
        throw error; // Rethrow the error for the caller to handle
    }
};


type Slot = {
    time: string;
    days: number[];
}

type SlotsData = {
    slots: Slot[];
}
export const AddNewTimeSlot = async (postData: SlotsData) => {
    try {
        const url = `${BASE_URL}${TIME_SLOT_API}`;
        const response = await postDataWithToken(url, postData);
        if (response.status !== 200) {
            throw new Error('Failed to fetch slot');
        }
        return response;
    } catch (error) {
        console.error('Error fetch slot:', error);
        throw error; // Rethrow the error for the caller to handle
    }
};

export const fetchDayOfWeekValues = async () => {
    try {
        const url = `${BASE_URL}${GET_DAY_OF_WEEK_VALUES_API}`;
        const response = await getDataWithToken(url);
        if (response.status !== 200) {
            throw new Error('Failed to fetch slot');
        }
        return response;
    } catch (error) {
        console.error('Error fetch slot:', error);
        throw error; // Rethrow the error for the caller to handle
    }
};


export const updateimeSlot = async (postData: SlotsData) => {
    try {
        // /v1/api/core/schedule/update/
        const url = `${BASE_URL}${TIME_SLOT_API}update/`;
        const response = await patchDataWithToken(url, postData);
        if (response.status !== 200) {
            throw new Error('Failed to fetch slot');
        }
        return response;
    } catch (error) {
        console.error('Error fetch slot:', error);
        throw error; // Rethrow the error for the caller to handle
    }
};

type ProfileInfo = { first_name: string, last_name: string }
export const updateProfileInfo = async (data: ProfileInfo) => {
    try {
        const url = `${BASE_URL}${GET_PROFILE_DATA_URL}`;
        const response = await patchDataWithToken(url, data);
        if (response.status !== 200) {
            throw new Error('Failed to Update profile: ' + response.status);
        }
        return response;
    } catch (error) {
        console.error('Error Update Profile:', error);
        throw error; // Rethrow the error for the caller to handle
    }
};

export const fetchPostDetailsById = async (id: number) => {
    try {
        const url = `${BASE_URL}${GET_POST_DETAILS_BY_ID_API}${id}`;
        const response = await getDataWithToken(url);
        console.log("🚀 ~ fetchPostDetailsById ~ response:", response)
        if (response.status !== 200) {
            throw new Error('Failed to fetch post details');
        }
        return response;
    } catch (error) {
        console.error('Error fetch post details:', error);
        throw error; // Rethrow the error for the caller to handle
    }
};

type PropPostData = { old_password: string, new_password: string }

export const changePassword = async (postData: PropPostData) => {
    try {
        const url = `${BASE_URL}${CHANGE_PASSWORD_API}`;
        const response = await postDataWithToken(url, postData);
        if (response.status !== 200 && response?.status !== 400) {
            throw new Error('Failed to change password');
        }
        return response;
    } catch (error) {
        console.error('Error change password:', error);
        return error;
        throw error; // Rethrow the error for the caller to handle
    }
};

type PropTopVoices = { content: string }
export const postTopVoices = async (postData: PropTopVoices) => {
    try {
        const url = `${BASE_URL}${TOP_VOICE_API}`;
        const response = await postDataWithToken(url, postData);
        if (response.status !== 200 && response?.status !== 400) {
            throw new Error('Failed to get top voices response');
        }
        return response;
    } catch (error) {
        console.error('Error getting top voices:', error);
        return error;
        throw error; // Rethrow the error for the caller to handle
    }
};


type PropCarouselQuotes = { content: string }
export const fetchCarouselQuotes = async (postData: PropCarouselQuotes) => {
    try {
        const url = `${BASE_URL}${GET_CAROUSEL_QUOTES}`;
        const response = await postDataWithToken(url, postData);
        if (response.status !== 200 && response?.status !== 400) {
            throw new Error('Failed to get carousel quotes response');
        }
        // return response.data.data.flatMap((item: any) => item.quotes);
        return response;
    } catch (error) {
        console.error('Error getting carousel quotes:', error);
        return error;
        throw error; // Rethrow the error for the caller to handle
    }
};

type PropLinkedInStatus = { content: string }
export const fetchLinkedInStatus = async (postData: PropLinkedInStatus) => {
    try {
        const url = `${BASE_URL}${LINKEDIN_STATUS_CHECK}`;
        const response = await postDataWithToken(url, postData);
        if (response.status !== 200 && response?.status !== 400) {
            throw new Error('Failed to get linkedin status response');
        }
        return response.data.data
    } catch (error) {
        console.error('Error getting linkedin status:', error);
        return error;
        throw error; // Rethrow the error for the caller to handle
    }
};
export const deleteShcheduledPost = async (postId: number) => {
    try {
        const url = `${BASE_URL}${GET_POST_DETAILS_BY_ID_API}${postId}/`;
        const response = await deleteDataWithToken(url);
        if (response.status !== 200 && response?.status !== 400) {
            throw new Error('Failed to delete post');
        }
        return response.data
    } catch (error) {
        console.error('Error delete post:', error);
        return error;
        throw error; // Rethrow the error for the caller to handle
    }
};


type PropAttributes = {
    FIRSTNAME: string,
    LASTNAME: string,
    MESSAGE: string
}
export type PropBravoPostData = {

    email: string,
    attributes: PropAttributes
    listIds: number[]

}
export const contactUsPostMessage = async (data: PropBravoPostData) => {
    try {
        const response = await bravoApi.post('/contacts', data)
        return response.data
    } catch (error) {
        console.error('Error contactus send message:', error);
        throw error;
    }
}

export const searchUnsplashImages = async (query: string) => {
    try {
        const url = `${BASE_URL}${GET_QUOTES_STOCK_IMAGE_URL}?search=${query}`;
        const response = await getDataWithToken(url);
        if (response.status !== 200) {
            throw new Error('Failed to search for images');
        }
        return response;
    } catch (error) {
        console.error('Error unsplash search image:', error);
        throw error; // Rethrow the error for the caller to handle
    }
};


type PropMyView = { content: string }
export const postMyView = async (postData: PropMyView) => {
    try {
        const url = `${BASE_URL}${MY_VIEW_API}`;
        const response = await postDataWithToken(url, postData);
        if (response.status !== 200 && response?.status !== 400) {
            throw new Error('Failed to get top voices response');
        }
        return response;
    } catch (error) {
        console.error('Error getting top voices:', error);
        return error;
        throw error; // Rethrow the error for the caller to handle
    }
};


export const uploadVideo = async (fileInput: File | string) => {
    try {
        // const fileBlob = await getFileBlob(fileInput);
        // console.log("🚀 ~ uploadResources ~ fileBlob:", fileBlob)
        const formData = new FormData();
        formData.append('video_file', fileInput);
        const url = `${BASE_URL}${UPLOAD_VIDEO}`;
        const response = await postDataWithToken(url, formData, true);
        if (response.status !== 200) {
            throw new Error('Failed to Upload Resource');
        }
        return response;
    } catch (error) {
        console.error('Error Rewrite Upload Resource', error);
        return error;
        throw error; // Rethrow the error for the caller to handle
    }
};

export const uploadVideoProgress = async (
    fileInput: File | string,
    onProgress?: (progress: number) => void,
    createClips?: boolean
) => {
    try {
        const session: any = await getSession();
        const token = session?.access_token;

        const formData = new FormData();
        formData.append('video_file', fileInput);
        !createClips && formData.append('create_clips', 'false');

        const config = {
            onUploadProgress: (progressEvent: any) => {
                const percentCompleted = Math.round(
                    (progressEvent.loaded * 100) / (progressEvent.total ?? 100)
                );
                onProgress?.(percentCompleted);
            },
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        };

        const response = await axios.post(
            `${BASE_URL}${UPLOAD_VIDEO}`,
            formData,
            config
        );

        if (response.status !== 200) {
            throw new Error('Failed to Upload Resource');
        }

        return response;
    } catch (error) {
        console.error('Error Upload Resource:', error);
        throw error;
    }
};


export const getSubtitles = async (videoId: number) => {
    try {
        const url = `${BASE_URL}${GET_SUBTITLE_API}${videoId}`;
        const response = await getDataWithToken(url);
        if (response.status !== 200) {
            throw new Error('Failed to search for images');
        }
        return response;
    } catch (error) {
        console.error('Error unsplash search image:', error);
        throw error; // Rethrow the error for the caller to handle
    }
};

type updateProps = {
    videoId: number,
    subtitles: any[any]
}
export const updateSubtitles = async (data: updateProps) => {
    try {
        const url = `${BASE_URL}${UPDATE_SUBTITLE_API}${data.videoId}`
        const response = await putDataWithToken(url, { subtitles: data.subtitles });
        return response;
    } catch (error) {
        throw error;
    }
};
type editProps = {
    videoId: number,
}
export const editClip = async (data: editProps) => {
    try {
        const url = `${BASE_URL}${EDIT_CLIP_API}${data.videoId}`
        const response = await putDataWithToken(url,{});
        return response;
    } catch (error) {
        throw error;
    }
};

type PropAiCaption = { content: string | [string], type: string }
export const fetchAiCaption = async (postData: PropAiCaption) => {
    try {
        const url = `${BASE_URL}${GET_AI_CAPTION}`;
        const response = await postDataWithToken(url, postData);
        if (response.status !== 200 && response?.status !== 400) {
            throw new Error('Failed to get top voices response');
        }
        return response;
    } catch (error) {
        console.error('Error getting top voices:', error);
        return error;

        throw error; // Rethrow the error for the caller to handle
    }
};


type PropBooks = { content: string }
export const postBooks = async (postData: PropBooks) => {
    try {
        const url = `${BASE_URL}${BOOKS_API}`;
        const response = await postDataWithToken(url, postData);
        if (response.status !== 200 && response?.status !== 400) {
            throw new Error('Failed to get books response');
        }
        return response;
    } catch (error) {
        console.error('Error getting books:', error);
        return error;
        throw error; // Rethrow the error for the caller to handle
    }
};

type PropBookSummary = { content: string }
export const postBookSummary = async (postData: PropBookSummary) => {
    try {
        const url = `${BASE_URL}${BOOK_SUMMARY_API}`;
        const response = await postDataWithToken(url, postData);
        if (response.status !== 200 && response?.status !== 400) {
            throw new Error('Failed to get book summary response');
        }
        return response;
    } catch (error) {
        console.error('Error getting book summary:', error);
        return error;
        throw error; // Rethrow the error for the caller to handle
    }
};
type PropSubscription = { subscription_id?: number }
export const subscription = async (data: PropSubscription) => {
    try {
        const url = `${BASE_URL}${SUBSCRIPTION_API}`;
        const response = await postDataWithToken(url, data);
        if (response.status !== 200 && response?.status !== 400) {
            throw new Error('Failed to subscribe response');
        }
        return response;
    } catch (error) {
        console.error('Error getting subscribe:', error);
        return error;
        throw error; // Rethrow the error for the caller to handle
    }
};

type PropManageSubscription = {
    subscription_id?: number,
    cancel?: boolean
}
export const manageSubscription = async (data: PropManageSubscription) => {
    try {
        const url = `${BASE_URL}${MANAGE_SUBSCRIPTION_API}`
        const response = await putDataWithToken(url, data);
        return response;
    } catch (error) {
        throw error;
    }
};

type PropLinkedinRework = { url: string }
export const postLinkedinRework = async (postData: PropLinkedinRework) => {
    try {
        const url = `${BASE_URL}${LINKEDIN_REWORK_API}`;
        const response = await postDataWithToken(url, postData);
        if (response.status !== 200 && response?.status !== 400) {
            throw new Error('Failed to get linkedin rework response');
        }
        return response;
    } catch (error) {
        console.error('Error getting linkedin rework:', error);
        return error;
        throw error; // Rethrow the error for the caller to handle
    }
};