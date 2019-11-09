import { useEffect } from "react";
const isServer = typeof window === "undefined";

type JsonpParams<Data> = {
  /** The URL for the external source that runs the jsonp callback  */
  url: string;
  /** a unique id that sets a unique callback and script tag  */
  id: string;
  /** The callback that gets invoked when the external script executes */
  callback: (data: Data) => any;
  /** ID for the callback parameter */
  callbackParam?: string;
};

declare const window: { [key: string]: any } & Window;

/** A hook that allows for data to be sent using the jsonp method which makes a request from an embedded script tag
 * rather than an xmlHttprequest object - this can be used as a method of getting around issues with CORS when
 * making requests to resources from an external origin. See more info here:
 * https://en.wikipedia.org/wiki/JSONP
 */
const useJsonP = <Data>({
  url,
  id,
  callback,
  callbackParam
}: JsonpParams<Data>) => {
  const scriptEl = !isServer ? document.querySelector(`#${id}`) : "";
  const callbackId = `callback_${id}`;
  const param = callbackParam || "c";

  useEffect(() => {
    // When the component where the hook is called mounts, this adds a unique callback to the window that is invoked
    // when we append the jsonp script to the page
    window[callbackId] = (data: Data) => {
      callback(data);
    };

    return () => {
      // ensures we remove the jsonp callback and script tag on unmount
      window[callbackId] = undefined;
      scriptEl && scriptEl.remove();
    };
  }, []);

  // appends the script tag - which is equivalant to making a request
  const send = () => {
    if (!isServer && !scriptEl) {
      const script = window.document.createElement("script");
      script.src = `${url}&${param}=${callbackId}`;
      document.head.appendChild(script);
    }
  };

  return send;
};

export default useJsonP;
