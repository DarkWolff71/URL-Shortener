import axios from "axios";
import { cn } from "../utils/cn";
import { Button } from "./ui/button";
import { useEffect, useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { urlValidator } from "@/validators/formValidators";
import { BACKEND_BASE_URL, FRONTEND_BASE_URL } from "@/lib/helpers";

type DbUrl = {
  originalUrl: string;
  shortenedUrl: string;
  expiresAt: Date;
};

export function MyUrls() {
  let [urls, setUrls] = useState<DbUrl[]>([]);
  let [shortUrl, setShortUrl] = useState<string>();
  let inputUrlRef = useRef<HTMLInputElement>(null);
  let [isValidInputUrl, setIsValidInputUrl] = useState<boolean>(true);
  let [inputUrlErrorMessage, setInputUrlErrorMessage] = useState<string>();

  useEffect(() => {
    async function getUrls() {
      try {
        const response = await axios.get(`${BACKEND_BASE_URL}/url/get-urls`, {
          withCredentials: true,
        });
        setUrls(response.data.urls);
      } catch (error) {
        console.error("Failed to fetch URLs:", error);
      }
    }
    getUrls();
  }, []);

  async function handleShortenUrl(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    e.preventDefault();

    let parsedUrlResult = urlValidator.safeParse(inputUrlRef.current?.value);
    if (!parsedUrlResult.success) {
      setIsValidInputUrl(false);
      setInputUrlErrorMessage(parsedUrlResult.error.issues[0].message);
    } else {
      setIsValidInputUrl(true);
    }
    try {
      let response = await axios.post(
        `${BACKEND_BASE_URL}/url/short-url`,
        {
          url: inputUrlRef.current?.value,
        },
        { withCredentials: true }
      );
      setShortUrl(response.data.shortenedUrl);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className="min-h-screen w-full dark:bg-black ">
      <h3 className="pt-5 px-10 dark:text-white text-center text-2xl font-bold	 ">
        Generate Short URL
      </h3>
      <div className="px-10 pt-10">
        {!isValidInputUrl ? (
          <p className="text-red-700 ml-2 text-sm">{inputUrlErrorMessage}</p>
        ) : null}
        <div className="flex items-center justify-center gap-4">
          <input
            ref={inputUrlRef}
            type={"text"}
            placeholder="Your URL goes here..."
            className={cn(
              `flex h-10 w-full border-none bg-gray-50 dark:bg-zinc-800 text-black dark:text-white shadow-input rounded-md px-3 py-2 text-sm  file:border-0 file:bg-transparent 
          file:text-sm file:font-medium placeholder:text-neutral-400 dark:placeholder-text-neutral-600 
          focus-visible:outline-none focus-visible:ring-[2px]  focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600
           disabled:cursor-not-allowed disabled:opacity-50
           dark:shadow-[0px_0px_1px_1px_var(--neutral-700)]
           group-hover:shadow-none transition duration-400
           `
            )}
          />
          <Button className="text-lg" onClick={handleShortenUrl}>
            Shorten URL
          </Button>
        </div>
        {shortUrl ? (
          <div className="text-center dark:text-white text-xl font-semibold px-10 pt-4 flex items-center justify-center">
            <p className="p-2 border-2 border-zinc-600 rounded-sm">
              {`${FRONTEND_BASE_URL}/${shortUrl}`}
            </p>
          </div>
        ) : null}
      </div>
      <h3 className="mt-10 px-10 dark:text-white text-center text-2xl font-bold	 ">
        Your URLs
      </h3>

      <div className="mt-10 px-10 dark:text-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-wrap">Short URL</TableHead>
              <TableHead>Original URL</TableHead>
              <TableHead className="w-36">Expires At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {urls.length > 0 &&
              urls.map((url) => {
                return (
                  <TableRow key={url.shortenedUrl}>
                    <TableCell>{`${FRONTEND_BASE_URL}/${url.shortenedUrl}`}</TableCell>
                    <TableCell>{url.originalUrl}</TableCell>
                    <TableCell>
                      {new Date(url.expiresAt).toUTCString()}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
