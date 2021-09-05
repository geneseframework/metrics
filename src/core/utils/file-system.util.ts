import * as fs from 'fs-extra';
import { OS } from '../enum/os.enum';
import { Options, WINDOWS } from '../models/options.model';

/**
 * ----------   Tools about files or folders   ---------------
 */

export function fileExists(path: string): boolean {
    return fs.pathExistsSync(path);
}

/**
 * Returns the name of the file at a given path
 * @param pathFile      // The path of the file
 */
export function getFilename(pathFile = ''): string {
    const splittedPath = pathFile.split('/');
    return splittedPath[splittedPath.length - 1];
}

/**
 * Returns the array of files included in a given folder and its subfolders
 * The files are returned as strings
 * @param dirPath           // The path of the folder
 * @param arrayOfFiles      // Recursion parameter
 */
export function getAllFiles(dirPath: string, arrayOfFiles?: string[]): string[] {
    const files = fs.readdirSync(dirPath)
    arrayOfFiles = arrayOfFiles || [];
    files.forEach(function(file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            arrayOfFiles.push(`${dirPath}/${file}`);
        }
    });
    return arrayOfFiles;
}

/**
 * Returns an array of paths with a ./ at the beginning
 * @param paths         // The array of paths
 */
export function getArrayOfPathsWithDotSlash(paths: string[]): string[] {
    if (!Array.isArray(paths)) {
        return undefined;
    }
    const pathsWithDotSlash: string[] = [];
    for (const path of paths) {
        pathsWithDotSlash.push(getPathWithDotSlash(path));
    }
    return pathsWithDotSlash;
}

/**
 * Returns a path with a ./ at the beginning
 * @param path      // The path to analyse
 */
export function getPathWithDotSlash(path: string): string {
    let pathWithDotSlash = path;
    if (path?.slice(0, 1) === '/') {
        pathWithDotSlash = `.${pathWithDotSlash}`;
    } else if (path?.slice(0, 2) !== './') {
        pathWithDotSlash = `./${path}`;
    }
    return pathWithDotSlash;
}

/**
 * Returns a path with a ./ at the beginning
 * @param path      // The path to analyse
 */
export function getPathWithSlash(path: string): string {
    return path?.slice(-1) !== '/' ? `${path}/` : path;
}

/**
 * Returns the extension of a file
 * @param filename      // The name of the file
 */
export function getFileExtension(filename: string): string {
    return filename ? filename.split('.').pop() : '';
}

/**
 * Returns the filename without its extension
 * @param path      // The path of the file
 */
export function removeExtension(path: string): string {
    if (!path) {
        return '';
    }
    const filename = path.substring(path.lastIndexOf('/') + 1);

    const extensionLength = getFileExtension(filename).length;
    return filename.slice(0, -(extensionLength + 1));
}

/**
 * Creates the outDir folder
 */
export function createOutDir(): void {
    if (fs.existsSync(Options.pathOutDir)) {
        fs.emptyDirSync(Options.pathOutDir);
    } else {
        fs.mkdirsSync(Options.pathOutDir);
    }
}

/**
 * Copy a file from a path to another one
 * @param path
 * @param content
 */
export function createFile(path: string, content: string): void {
    fs.writeFileSync(path, content, { encoding: "utf-8" });
}

export function ensureDirAndCopy(source: string, target: string): void {
    fs.ensureDirSync(target);
    fs.copySync(source, target);
}

// ------------------------------------------------------------------------------------------------------------
// ----------------------------------   Paths management depending of the OS   --------------------------------
// ------------------------------------------------------------------------------------------------------------

/**
 * Get the current OS
 * @returns {OS}
 */
export function getOS(): OS {
    let platform = process.platform;

    let macosPlatforms = ["MACINTOSH", "MACINTEL", "MACPPC", "MAC68K"];
    let windowsPlatforms = ["WIN32", "WIN64", "WINDOWS", "WINCE"];
    let os = null;

    if (macosPlatforms.indexOf(platform.toUpperCase()) !== -1) {
        os = OS.MACOS;
    } else if (windowsPlatforms.indexOf(platform.toUpperCase()) !== -1) {
        os = OS.WINDOWS;
    } else if (!os && /Linux/.test(platform)) {
        os = OS.LINUX;
    }

    return os;
}

export function platformPath(path: string): string {
    const modifiedPath = path.split('/').filter(e => e !== '.').join('/');
    return WINDOWS ? windowsPath(modifiedPath) : modifiedPath;
}

export function windowsPath(path: string): string {
    return path.replace(/\//g, '\\').replace(/\\/g, '\\\\')
}
