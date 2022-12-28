export type MaybeThenableConstructor = {
    prototype: any & {
        then?: Function;
    };
};
