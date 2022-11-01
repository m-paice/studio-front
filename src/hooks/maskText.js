import { mask, unMask } from "remask";

export const maskTextCellPhone = (value) => {
    return mask(unMask(value), ["(99) 99999-9999"]);
};
