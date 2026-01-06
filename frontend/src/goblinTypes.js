/**
 * @typedef {Object} TypeConfigString
 * @property {'string'} type
 */
/**
 * @typedef {Object} TypeConfigNumber
 * @property {'number'} type
 */
/**
 * @typedef {Object} TypeConfigBool
 * @property {'bool'} type
 */
/** 
 * @template {{[id: String]: *}} T
 * @typedef {Object} TypeConfigSwitch
 * @property {'switch'} type
 * @property {Array<keyof T>} values
 */

/**
 * @template {{[id: String]: *}} T
 * @typedef {keyof T} GoblinTypeSwitch
 */

/**
 * @template {{[id: String]: *}} T
 * @typedef {Object} TypeConfigArrayOfKeys
 * @property {'arrayOfKeys'} type
 * @property {Array<keyof T>} values
 */

/** 
 * @template {{[id: String]: *}} T
 * @typedef {Object} TypeConfigs
 * @property {TypeConfigString} string
 * @property {TypeConfigNumber} number
 * @property {TypeConfigBool} bool
 * @property {TypeConfigSwitch<T>} switch
 * @property {TypeConfigArrayOfKeys<T>} arrayOfKeys
 */

/**
 * @template {{[id: String]: *}} T
 * @typedef {Object} TypeConfisReturnTypes
 * @property {String} string
 * @property {Number} number
 * @property {GoblinTypeSwitch<T>} switch
 * @property {Array<GoblinTypeSwitch<T>>} arrayOfKeys
 */

class TypeGoblin {

    /**
     * @template T
     * @param {TypeConfigSwitch<T>} config
     * @param {keyof T|null} [defaultValue]
     * @returns {keyof T}
     */
    static switch = (config, defaultValue = null) => {
        if(defaultValue) {
            if(config.values.includes(defaultValue)) {
                return defaultValue;
            } else {
                throw new Error('TypeGoblin - invalid default value');
            }
        }
        return null;
    }

    /**
     * @template T
     * @param {TypeConfigArrayOfKeys<T>} config
     * @param {Array<keyof T>|null} [defaultValue]
     * @returns {Array<keyof T>}
     */
    static arrayOfKeys = (config, defaultValue = null) => {
        if(defaultValue) {
            if(Array.isArray(defaultValue)) {
                for(let val of defaultValue) {
                    if(!config.values.includes(val)) {
                        throw new Error('TypeGoblin - invalid default value');
                        return null;
                        break;
                    }
                }
                return defaultValue;
            } else {
                throw new Error('TypeGoblin - invalid default value');
            }
        }
        return null;
    }

    /**
     * @template {{[id: String]: *}} T
     * @param {T} T
     * @returns {{[key in keyof T]: T[key]}}
     */
    static stealHisLook = (T) => {
        //@ts-ignore
        return {};
    }

    /**
     * @typedef {{[id: String]: (TypeConfigString & {values?: undefined})|(TypeConfigNumber & {values?: undefined})|(TypeConfigBool & {values?: undefined})|TypeConfigSwitch<{[id: String]: String}>|TypeConfigArrayOfKeys<{[id: String]: String}>}} TYPE_CONFIGS
     */

    /**
     * @typedef {{[id: String]: (TYPE_CONFIGS & {props?: undefined})|{'props': TYPE_CONFIGS_LOOP}}} TYPE_CONFIGS_LOOP
     */

    /**
     * @template {{[id: String]: {[id: String]: *}}} T_VALUES
     * @template {{[key in keyof T_VALUES]: (TypeConfigString & {values?: undefined})|(TypeConfigNumber & {values?: undefined})|(TypeConfigBool & {values?: undefined})|TypeConfigSwitch<T_VALUES[key]>|TypeConfigArrayOfKeys<T_VALUES[key]>}} T
     * @param {T} config
     * @returns {{[key in keyof T]: {'string': String, 'number': Number, 'bool': Boolean, 'switch': T[key]['values'][Number], 'arrayOfKeys': T[key]['values'] }[T[key]['type']]}}
     */
    static object = (config) => {
        return '';
    }


    constructor() {

    }
}

export { TypeGoblin };