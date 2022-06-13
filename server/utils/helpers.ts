import forge from "node-forge";
import { NodeForgeAESModes } from "./enums";

// these will need to be constant hard-coded strings in the future
const key = AESCBCKeyFetcher();
const iv = AESCBCIvFetcher();

// encryption -----------------------------------------------------------------
function AESCBCKeyFetcher(precision: number = 16) {
    return forge.random.getBytesSync(precision);
}

function AESCBCIvFetcher(precision: number = 16) {
    return forge.random.getBytesSync(precision);
}

const cipher = forge.cipher.createCipher(NodeForgeAESModes.CBC, key);
export function nfEncrypt(toEncrypt: string): {
    encryptedString: string;
    encryptorKey: forge.util.ByteStringBuffer;
} {
    /**
     * @encryptedString is the encrypted string
     * @encryptorKey is the key that is used to decrypt the string
     * It will be passed to the decryptor
     */

    cipher.start({ iv: iv });
    cipher.update(forge.util.createBuffer(toEncrypt));
    cipher.finish();

    const encryptorKey = cipher.output;
    const encryptedString = cipher.output.toHex();

    return { encryptedString, encryptorKey };
}

const decipher = forge.cipher.createDecipher("AES-CBC", key);
export function nfDencrypt(encryptorKey: forge.util.ByteStringBuffer): string {
    decipher.start({ iv: iv });
    decipher.update(encryptorKey);
    decipher.finish();

    return decipher.output.data;
}

// hashing --------------------------------------------------------------------
export function hashSHA256(string: string, encoding?: forge.Encoding): string {
    const hashSource = forge.md.sha256.create();
    hashSource.update(string, encoding);
    return hashSource.digest().toHex();
}

export function jumpBackDirectory(
    path: string,
    depth: number,
    endingFile?: string
): string {
    const directories = path.split("\\");

    return `${directories
        .slice(0, directories.length - depth)
        .join("\\")}\\${endingFile}`;
}

export function getParsedJSONObject(
    stringified: string
): Record<string, any> | null {
    /**
     * Checks if the string is a valid JSON object. If it is, it will return the object.
     * Otherwise, it will return a falsy value.
     *
     * This function will return `null` for any valid json primitive.
     * EG, 'true' -> null
     *     '123' -> null
     *     'null' -> null
     *     '"I'm a string"' -> null
     */

    try {
        const parsed = JSON.parse(stringified);

        // Handle non-exception-throwing cases:
        // Neither JSON.parse(null) or JSON.parse(1234) throw errors, hence the type-checking,
        // but JSON.parse(null) returns null, and typeof null === "object",
        // so we must check for that, too. However, null is falsy, so this suffices
        return (
            parsed &&
            typeof parsed === "object" &&
            !Array.isArray(parsed) &&
            // return the parsed object if all checks pass
            parsed
        );
    } catch (e) {}

    // returned outside catch block to make type checker happy
    return null;
}
