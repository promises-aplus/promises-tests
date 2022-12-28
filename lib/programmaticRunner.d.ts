export = PromisesAPlusTests;
/** @type { PromisesAPlusTests.Export } */
declare function PromisesAPlusTests(adapter: PromisesAPlusTests.Adapter<any>, mocha_options_or_callback: any | PromisesAPlusTests.Callback, callback_or_omitted: PromisesAPlusTests.Callback | void): void;
declare namespace PromisesAPlusTests {
    function mocha(implementation: Adapter<any>): void;
    type Adapter<T> = {
        resolved?: (value: T) => Promise<T>;
        rejected?: (reason: any) => Promise<never>;
        deferred: <U = T>() => PromisesAPlusTests.Deferred<U>;
    };
    type Callback = (error?: PromisesAPlusTests.TestError) => void;
    type Deferred<T> = {
        promise: Promise<T>;
        resolve: (value: T) => void;
        reject: (reason: any) => void;
    };
    type Export = (PromisesAPlusTests.TesterWithOptions | PromisesAPlusTests.TesterWithoutOptions) & PromisesAPlusTests.MochaTester;
    type MaybeFailureCount = {
        failure_count?: number;
    };
    type MochaTester = {
        mocha: PromisesAPlusTests.MochaTestMethod;
    };
    type MochaTestMethod = (implementation: PromisesAPlusTests.Adapter<any>) => void;
    type Tester = PromisesAPlusTests.TesterWithOptions & PromisesAPlusTests.TesterWithoutOptions;
    type TestError = Error & PromisesAPlusTests.MaybeFailureCount;
    type TesterWithOptions = (implementation: PromisesAPlusTests.Adapter<any>, mochaOptions: any, callback?: PromisesAPlusTests.Callback) => void;
    type TesterWithoutOptions = (implementation: PromisesAPlusTests.Adapter<any>, callback?: PromisesAPlusTests.Callback) => void;
}
