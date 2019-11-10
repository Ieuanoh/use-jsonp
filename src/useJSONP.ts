import { useEffect, useRef } from "react";
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

const useJsonP = <Data>({
  url,
  id,
  callback,
  callbackParam
}: JsonpParams<Data>) => {
  const scriptEl = useRef<HTMLScriptElement | null>();
  const callbackId = `callback_${id}`;
  const param = callbackParam || "callback";

  const removeScript = () => {
    if (scriptEl.current) {
      document.head.removeChild(scriptEl.current);
      scriptEl.current = null;
    }
  };

  useEffect(() => {
    // set the unique callback to the window that is invoked when we append the jsonp script to the page
    window[callbackId] = (data: Data) => {
      callback(data);
      removeScript();
    };

    return () => {
      // ensures the jsonp callback and script tag are cleared on unmount
      window[callbackId] = undefined;
      removeScript();
    };
  }, []);

  // appends the script tag - which is equivalant to making a request
  const send = () => {
    if (!isServer && !scriptEl.current) {
      const script = window.document.createElement("script");
      script.src = `${url}&${param}=${callbackId}`;
      script.id = id;
      document.head.appendChild(script);
      // Set the script tag to the ref object
      scriptEl.current = script;
    }
  };

  return send;
};

export default useJsonP;
