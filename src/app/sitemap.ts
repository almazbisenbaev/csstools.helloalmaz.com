 import type { MetadataRoute } from "next"
 
 const base =
   process.env.NEXT_PUBLIC_SITE_URL ||
   (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
 
 export default function sitemap(): MetadataRoute.Sitemap {
   const lastModified = new Date()
   return [
     {
       url: base,
       lastModified,
       changeFrequency: "monthly",
       priority: 1,
     },
     {
       url: `${base}/filters`,
       lastModified,
       changeFrequency: "monthly",
       priority: 0.9,
     },
     {
       url: `${base}/backdrop`,
       lastModified,
       changeFrequency: "monthly",
       priority: 0.8,
     },
     {
       url: `${base}/shadows`,
       lastModified,
       changeFrequency: "monthly",
       priority: 0.8,
     },
   ]
 }
