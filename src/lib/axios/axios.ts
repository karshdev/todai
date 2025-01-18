import axios, { AxiosError } from "axios";
import { getSession, signOut } from "next-auth/react";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

// let controller: AbortController | null = null;

const handleUnauthorized = async () => {
  await signOut({ redirect: true });
};

const createRequestWithAuth = async (
  method: "get" | "post" | "patch" | "put" | "delete",
  url: string,
  data?: any,
  isFormData = false
) => {
  // if (controller) {
  //     controller.abort();
  // }
  // controller = new AbortController();

  const session: any = await getSession();
  const token = session?.access_token;
  console.log(token, "tokenn");

  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  try {
    const config = {
      headers: {
        ...(isFormData && { "Content-Type": "multipart/form-data" }),
      },
      // ...(controller && { signal: controller.signal })
    };

    // const response = method === 'get'
    //     // ? await api.get(url, config)
    //     ? await api.get(url)
    //     // : await api.post(url, data, config);
    //     : await api.post(url, data, config);
    let response;
    switch (method) {
      case "get":
        response = await api.get(url, config);
        break;
      case "post":
        response = await api.post(url, data, config);
        break;
      case "patch":
        response = await api.patch(url, data, config);
        break;
      case "put":
        response = await api.put(url, data, config);
        break;
      case "delete":
        response = await api.delete(url);
        break;
      default:
        throw new Error(`Unsupported method: ${method}`);
    }
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        await handleUnauthorized();
      }
    }
    console.error(`Error ${method}ing data:`, error);
    throw error;
  } finally {
    // controller = null;
  }
};

export const getDataWithToken = (url: string) =>
  createRequestWithAuth("get", url);

export const postDataWithToken = (url: string, data: any, isFormData = false) =>
  createRequestWithAuth("post", url, data, isFormData);

export const patchDataWithToken = (
  url: string,
  data: any,
  isFormData = false
) => createRequestWithAuth("patch", url, data, isFormData);

export const putDataWithToken = (url: string, data: any, isFormData = false) =>
  createRequestWithAuth("put", url, data, isFormData);

export const deleteDataWithToken = (url: string) =>
  createRequestWithAuth("delete", url);

export const getDataArgToken = async (url: string, token: string) => {
  // if (controller) {
  //     controller.abort();
  // }
  // controller = new AbortController();

  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  try {
    // const config = {
    //     ...(controller && { signal: controller.signal })
    // };
    // const response = await api.get(url, config);
    const response = await api.get(url);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        await handleUnauthorized();
      }
    }
    console.error("Error fetching data:", error);
    throw error;
  } finally {
    // controller = null;
  }
};

export const bravoApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BRAVO_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "api-key": process.env.NEXT_PUBLIC_BRAVO_API_KEY,
  },
});

//commented on 10/09/2024
// import axios, { AxiosError } from "axios";
// import { getSession, signOut } from "next-auth/react";

// const api = axios.create({
//     baseURL: process.env.NEXT_PUBLIC_BASE_URL,
// });

// // let controller: AbortController | null = null;

// const handleUnauthorized = async () => {
//     await signOut({ redirect: true });
// };

// const createRequestWithAuth = async (method: 'get' | 'post', url: string, data?: any) => {
//     // if (controller) {
//     //     controller.abort();
//     // }
//     // controller = new AbortController();

//     const session: any = await getSession();
//     const token = session?.access_token;

//     if (token) {
//         api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//     }

//     try {
//         // const config = {
//         //     ...(controller && { signal: controller.signal })
//         // };
//         const response = method === 'get'
//             // ? await api.get(url, config)
//             ? await api.get(url)
//             // : await api.post(url, data, config);
//             : await api.post(url, data);
//         return response;
//     } catch (error) {
//         if (axios.isAxiosError(error)) {
//             if (error.response?.status === 401) {
//                 await handleUnauthorized();
//             }
//         }
//         console.error(`Error ${method}ing data:`, error);
//         throw error;
//     } finally {
//         // controller = null;
//     }
// };

// export const getDataWithToken = (url: string) => createRequestWithAuth('get', url);

// export const postDataWithToken = (url: string, data: any) => createRequestWithAuth('post', url, data);

// export const getDataArgToken = async (url: string, token: string) => {
//     // if (controller) {
//     //     controller.abort();
//     // }
//     // controller = new AbortController();

//     if (token) {
//         api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//     }

//     try {
//         // const config = {
//         //     ...(controller && { signal: controller.signal })
//         // };
//         // const response = await api.get(url, config);
//         const response = await api.get(url);
//         return response;
//     } catch (error) {
//         if (axios.isAxiosError(error)) {
//             if (error.response?.status === 401) {
//                 await handleUnauthorized();
//             }
//         }
//         console.error('Error fetching data:', error);
//         throw error;
//     } finally {
//         // controller = null;
//     }
// };

// import axios from "axios";
// import { getSession } from "next-auth/react";
// import  Router  from "next/navigation";

// const api = axios.create({
//     baseURL: process.env.BASE_URL,
// });

// export const getDataWithToken = async (url: string) => {
//     const session: any = await getSession();
//     const token = session?.access_token;

//     if (token) {
//         api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//     }

//     try {
//         const response = await api.get(url);
//         return response;
//     } catch (error) {
//         console.error('Error fetching data:', error);
//         throw error;
//     }
// };

// export const postDataWithToken = async (url: string, data: any) => {

//     const session: any = await getSession();
//     const token = session?.access_token;
//     if (token) {
//         api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//     }
//     try {
//         const response = await api.post(url, data);
//         return response;
//     } catch (error) {
//         console.error('Error posting data:', error);
//         throw error;
//     }
// };

// export const getDataArgToken = async (url: string, token: string) => {
//     if (token) {
//         api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//     }
//     try {
//         const response = await api.get(url);
//         return response;
//     } catch (error) {
//         console.error('Error fetching data:', error);
//         throw error;
//     }
// };
