export const fulfilled: {
    "a synchronously-fulfilled custom thenable": (value: any) => {
        then: (onFulfilled: any) => void;
    };
    "an asynchronously-fulfilled custom thenable": (value: any) => {
        then: (onFulfilled: any) => void;
    };
    "a synchronously-fulfilled one-time thenable": (value: any) => any;
    "a thenable that tries to fulfill twice": (value: any) => {
        then: (onFulfilled: any) => void;
    };
    "a thenable that fulfills but then throws": (value: any) => {
        then: (onFulfilled: any) => never;
    };
    "an already-fulfilled promise": (value: any) => any;
    "an eventually-fulfilled promise": (value: any) => any;
};
export const rejected: {
    "a synchronously-rejected custom thenable": (reason: any) => {
        then: (_onFulfilled: any, onRejected: any) => void;
    };
    "an asynchronously-rejected custom thenable": (reason: any) => {
        then: (_onFulfilled: any, onRejected: any) => void;
    };
    "a synchronously-rejected one-time thenable": (reason: any) => any;
    "a thenable that immediately throws in `then`": (reason: any) => {
        then: () => never;
    };
    "an object with a throwing `then` accessor": (reason: any) => any;
    "an already-rejected promise": (reason: any) => any;
    "an eventually-rejected promise": (reason: any) => any;
};
