import { PassThrough } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";
import { RemixServer } from "@remix-run/react";
import { isbot } from "isbot";

const streamTimeout = 5000;

function createReadableStreamFromReadable(readable) {
  return new ReadableStream({
    start(controller) {
      readable.on("data", (chunk) => {
        controller.enqueue(chunk);
      });
      readable.on("end", () => {
        controller.close();
      });
      readable.on("error", (error) => {
        controller.error(error);
      });
    },
  });
}

function addDocumentResponseHeaders(request, responseHeaders) {
  const url = new URL(request.url);
  if (url.pathname.startsWith("/resources/")) {
    responseHeaders.set("Cache-Control", "public, max-age=31536000, immutable");
  }
}

export default async function handleRequest(
  request,
  responseStatusCode,
  responseHeaders,
  remixContext,
) {
  try {
    addDocumentResponseHeaders(request, responseHeaders);
    const userAgent = request.headers.get("user-agent");
    const callbackName = isbot(userAgent ?? "") ? "onAllReady" : "onShellReady";

    // Log the request for debugging
    console.log(
      `[${new Date().toISOString()}] ${request.method} ${request.url}`,
    );

    return new Promise((resolve, reject) => {
      const { pipe, abort } = renderToPipeableStream(
        <RemixServer context={remixContext} url={request.url} />,
        {
          [callbackName]: () => {
            const body = new PassThrough();
            const stream = createReadableStreamFromReadable(body);

            responseHeaders.set("Content-Type", "text/html");
            resolve(
              new Response(stream, {
                headers: responseHeaders,
                status: responseStatusCode,
              }),
            );
            pipe(body);
          },
          onShellError(error) {
            console.error("Shell error:", error);
            reject(error);
          },
          onError(error) {
            responseStatusCode = 500;
            console.error("Render error:", error);
          },
        },
      );

      // Automatically timeout the React renderer after 6 seconds
      setTimeout(abort, streamTimeout + 1000);
    });
  } catch (error) {
    console.error("Request handling error:", error);
    throw error;
  }
}
