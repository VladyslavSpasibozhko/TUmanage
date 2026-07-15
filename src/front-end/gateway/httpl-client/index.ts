import { createClient } from "@/src/front-end/shared/http";
import { config } from "@/src/config";

const instance = createClient({
  config: {
    baseUrl: config.apiUrl,
  },
});

export default instance.request;
