import { Configuration, Compiler } from 'webpack';
export interface NextOptions {
    buildId: string;
    config: any;
    dev: boolean;
    dir: string;
    isServer: boolean;
    defaultLoaders: {
        babel: {
            loader: string;
            options: {
                isServer: boolean;
                distDir: string;
                pagesDir: string;
                cwd: string;
                cache: boolean;
                babelPresetPlugins: any[];
                hasModern: boolean;
                development: boolean;
            };
        };
        hotSelfAccept: {
            loader: string;
        };
    };
    totalPages: number;
    webpack: (options: Configuration) => Compiler;
}
