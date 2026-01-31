import { PrayerTimings } from "../types";
import { format } from "date-fns";

const DEFAULT_TIMINGS: PrayerTimings = {
  Fajr: "05:00",
  Sunrise: "06:30",
  Dhuhr: "12:30",
  Asr: "15:45",
  Maghrib: "18:15",
  Isha: "19:45"
};

export const getPrayerTimes = async (lat: number, lng: number): Promise<PrayerTimings> => {
  try {
    const date = format(new Date(), "dd-MM-yyyy");
    const response = await fetch(
      `https://api.aladhan.com/v1/timings/${date}?latitude=${lat}&longitude=${lng}&method=4`
    );
    
    if (!response.ok) {
        throw new Error("API Error");
    }

    const data = await response.json();
    return data.data.timings;
  } catch (error) {
    console.error("Failed to fetch prayer times:", error);
    return DEFAULT_TIMINGS;
  }
};

export const getNextPrayer = (timings: PrayerTimings): { name: string; time: string; diffMs: number } => {
  const now = new Date();
  const prayerNames = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
  
  let nextPrayerName = "Fajr";
  let nextPrayerTimeStr = timings["Fajr"];
  let minDiff = Infinity;
  
  for (const name of prayerNames) {
    const timeStr = timings[name];
    if (!timeStr) continue;

    const [hours, minutes] = timeStr.split(':').map(Number);
    const prayerDate = new Date();
    prayerDate.setHours(hours, minutes, 0, 0);

    let diff = prayerDate.getTime() - now.getTime();
    
    if (diff < 0) continue;

    if (diff < minDiff) {
        minDiff = diff;
        nextPrayerName = name;
        nextPrayerTimeStr = timeStr;
    }
  }

  if (minDiff === Infinity) {
     const [fHours, fMinutes] = timings["Fajr"].split(':').map(Number);
     const fajrTomorrow = new Date();
     fajrTomorrow.setDate(fajrTomorrow.getDate() + 1);
     fajrTomorrow.setHours(fHours, fMinutes, 0, 0);
     minDiff = fajrTomorrow.getTime() - now.getTime();
     nextPrayerName = "Fajr";
     nextPrayerTimeStr = timings["Fajr"];
  }

  return { name: nextPrayerName, time: nextPrayerTimeStr, diffMs: minDiff };
};
