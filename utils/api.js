// services/api.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// ایجاد instance از axios
const apiClient = axios.create();

// تابع برای گرفتن baseUrl از AsyncStorage
const getBaseUrl = async () => {
  try {
    const config = await AsyncStorage.getItem('version');
    if (!config || config.baseUrl) {
      throw new Error('آدرس سرور تنظیم نشده است');
    }
    return JSON.parse(config).baseUrl;
  } catch (error) {
    console.error('Error getting baseUrl:', error);
    throw error;
  }
};

// تابع اصلی برای ارسال درخواست
export const sendRequest = async (operation, additionalParams = {}) => {
  try {
    const baseUrl = "https://shahid-moqavemat.ir/modules.php";

    // -----------------------
    // پارامترهای ثابت GET
    // -----------------------
    const params = {
      newdb: "ss",
      name: "Icms",
      file: "json",
      UID: "DEMO",
      op: operation,
      ...additionalParams
    };

    console.log("Sending GET request:", baseUrl);
    console.log("Query params:", params);

    const response = await apiClient.get(baseUrl, {
      params,
      // headers: {
      //   "Accept": "application/json",
      //   "Accept-Charset": "utf8",
      // },
      timeout: 15000,
      responseType: "arraybuffer",
    });


    const text = new TextDecoder("utf-8").decode(new Uint8Array(response.data));
    const json = JSON.parse(text);
    return json;
    // return response.data;

  } catch (error) {
    console.error("Request failed:", error);

    if (error.response) {
      throw new Error(`خطای سرور: ${error.response.status}`);
    } else if (error.request) {
      throw new Error("عدم اتصال به سرور");
    } else {
      throw new Error(error.message || "خطای ناشناخته");
    }
  }
};


// هوک برای استفاده در کامپوننت‌ها
export const useApi = () => {
  return {
    sendRequest
  };
};

// توابع آماده برای عملیات رایج
export const api = {
  // گرفتن نسخه
  getVersion: () => sendRequest('m_version'),

  getBanner: (idp) => sendRequest('m_banner', idp?{idp}: {}),

  getPost: (q) => sendRequest('m_search', {q}),
  getPostDetail: (id) => sendRequest('m_details', {id}),

  getRaudio: () => sendRequest('m_raudio'),

  getBlog: () => sendRequest('m_blog'),

  // لاگین
  login: (username, mob) => sendRequest('m_login', {
    username,
    mob
  }),

  // لاگین
  verify: (finger, code) => sendRequest('m_verify', {
    finger,
    code
  }),
  
  // گرفتن اطلاعات کاربر
  getUserInfo: (userId) => sendRequest('m_profile', {
    user_id: userId
  }),
  
  // ارسال موقعیت
//   sendLocation: (latitude, longitude, userId, timestamp) => sendRequest('m_location', {
//     lat: latitude,
//     lng: longitude,
//     user_id: userId,
//     time: timestamp
//   }),
  
  // دریافت پیام
  getMessage: (fingerData, time) => sendRequest('m_message', {
    finger: fingerData,
    time
  }),

  // دریافت فرم
  forms: (fingerData, time) => sendRequest('m_forms', {
    finger: fingerData,
    time
  }),

  // دریافت فرم
  news: (fingerData, time) => sendRequest('m_news', {
    finger: fingerData,
    time
  })
};