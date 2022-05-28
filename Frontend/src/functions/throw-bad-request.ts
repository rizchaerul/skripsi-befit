import { ApiException } from "../clients/ApiClient";

export function throwBadRequest() {
    throw new ApiException("Bad Request", 400, "", {}, null);
}
