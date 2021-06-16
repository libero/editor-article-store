type Primitives = number | string | boolean | null | undefined;

export type JSONObject = {
    [k: string]: Primitives | JSONObject | Array<Primitives | JSONObject>;
};
