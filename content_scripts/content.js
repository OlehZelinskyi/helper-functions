console.log("Content JS Script");

import dayjs from "dayjs";

import axios from "axios";

const formatDigits = (amount) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
  }).format(amount);
};

const capitalizeFirstLetter = (string = "") => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const createAxios = (
  options = {
    baseURL: "https://example.com",
  }
) => {
  const instance = new axios.Axios(options);

  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");

      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error?.response?.status === 401) {
        localStorage.removeItem("token");

        window.location.href = "/login";
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

const formatMsToTime = (
  ms,
  options = { hours: true, minutes: true, seconds: true }
) => {
  let fallback = [];

  if (options.hours) fallback.push("00");
  if (options.minutes) fallback.push("00");
  if (options.seconds) fallback.push("00");

  if (!ms) return fallback.join(":");

  let seconds = Math.floor(ms / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);

  seconds = seconds % 60;
  minutes = minutes % 60;

  // Format to ensure two digits
  let formattedHours = String(hours).padStart(2, "0");
  let formattedMinutes = String(minutes).padStart(2, "0");
  let formattedSeconds = String(seconds).padStart(2, "0");

  const result = [];

  if (options.hours) result.push(formattedHours);
  if (options.minutes) result.push(formattedMinutes);
  if (options.seconds) result.push(formattedSeconds);

  return result.join(":");
};

const getRandomCode = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  let code = "";

  for (let i = 0; i < 16; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }

  return code;
};

const isDateOlderThanOneDay = (date) => {
  const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000; // Number of milliseconds in one day

  return dayjs().diff(dayjs(date)) > ONE_DAY_IN_MS;
};

const createSVGImageElement = (svgString) => {
  const encodedSvg = "data:image/svg+xml;base64," + window.btoa(svgString);

  const img = document.createElement("img");
  img.src = encodedSvg;

  return img;
};

const copyToClipboard = (text, { onSuccess, onFailure } = {}) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(onSuccess, onFailure);
  } else {
    console.warn("navigator clipboard API is not available");
  }
};

const scrollToRef = (ref, options = { behavior: "smooth" }) => {
  setTimeout(() => {
    window.scrollTo({
      top: ref.current?.offsetTop,
      ...options,
    });
  }, 0);
};

const scrollToTop = (options = { behavior: "smooth" }) => {
  if (typeof window !== "undefined") {
    window.scrollTo({
      top: 0,
      ...options,
    });
  }
};

const parseJWT = (token) => {
  const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode the token payload

  const iat = new Date(decodedToken.iat * 1000); // Convert seconds to milliseconds
  const exp = new Date(decodedToken.exp * 1000); // Convert seconds to milliseconds
  const now = new Date();

  return {
    issuedAt: iat.toLocaleString(),
    expirationTime: exp.toLocaleString(),
    expirationTimeInSeconds: Math.round(decodedToken.exp / 1000),
    now: now.toLocaleString(),
    isExpired: exp.getTime() < now.getTime(),
  };
};

class EventBus {
  constructor() {
    this.events = {};
  }

  subscribe(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  unsubscribe(event, callback) {
    if (!this.events[event]) return;

    this.events[event] = this.events[event].filter((cb) => cb !== callback);
  }

  publish(event, data) {
    if (!this.events[event]) return;

    this.events[event].forEach((callback) => callback(data));
  }
}

// libs
window.dayjs = dayjs;
window.axios = axios;

// utils
window.utils = {
  formatDigits,
  createAxios,
  capitalizeFirstLetter,
  formatMsToTime,
  getRandomCode,
  isDateOlderThanOneDay,
  createSVGImageElement,
  copyToClipboard,
  scrollToRef,
  scrollToTop,
  parseJWT,
};

// classes
window.classes = { EventBus };
