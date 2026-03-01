/**
 * Funkcje do manipulacji typami
 * @namespace TG
 */

// strzałka '=>' jest potrzebna w typach zeby intelisense pokazywało całą definicję typu zamiast TYP<TEMPLATE>

/**
 * Kopiuje typ innego obiektu
 * @template {{[id: String]: *}} T
 * @typedef {{'=>': {[key in keyof T]: T[key]}}} TG.StealHisLook
 * @memberof TG
 */
/**
 * Kopiuje typ innego obiektu ale jego props są opcjonalne
 * @template {{[id: String]: *}} T
 * @typedef {{'=>': {[key in keyof T]?: T[key]}}} TG.StealHisLookOptional
 * @memberof TG
 */
/**
 * Potrzebne są dwa obiekty z takimi samymi nazwami propsów, daje typ z wartościami z obiektu defaults
 * @template {{object: {[id: String]: *}, defaults: {[id: String]: *}}} T
 * @typedef {{'=>': {[key in keyof T['defaults']]: ({[_key in keyof T['object']]: T['object'][_key]} & {[id: String]: T['defaults'][key]})[key]}}} TG.GetDefaults
 * @memberof TG
 */
/**
 * Potrzebne są dwa obiekty z takimi samymi nazwami propsów, daje typ z wartościami z obiektu defaults ale props będą opcjonalne
 * @template {{object: {[id: String]: *}, defaults: {[id: String]: *}}} T
 * @typedef {{'=>': {[key in keyof T['defaults']]?: ({[_key in keyof T['object']]: T['object'][_key]} & {[id: String]: T['defaults'][key]})[key]}}} TG.GetDefaultsOptional
 * @memberof TG
 */

/** 
 * Potrzebny był obiekt który w nieskończoność odwołuje się sam do siebie by uzywać go jako template
 * @typedef {{[id: String]: TG.Yggdrasil}} TG.Yggdrasil
 * @memberof TG
 */

/**
 * Nie pamiętam po co to było potrzebne
 * @typedef {Array<TG.YggdrasilArr>} TG.YggdrasilArr
 * @memberof TG
 */

/**
 * Nie pamiętam po co to było potrzebne
 * @typedef {Array<TG.YggdrasilArr|String>} TG.YggdrasilArrStr
 * @memberof TG
 */

/**
 * Zwraca typ tylko z właściwoścami występującymi w obu obiektach
 * @template {{[id: String]: *}} T0
 * @template {{[id: String]: *}} T1
 * @typedef {{'=>': {[key in (keyof T0) & (keyof T1)]: T0[key]}}} TG.VibesOn
 * @memberof TG
 */

/**
 * Zwraca true/false w zaleności od tego czy wartość w T0 jest jedną z wartości w T1
 * @template {*} T0
 * @template {Array<Boolean | String | Number | BigInt | undefined>} T1
 * @typedef {{'=>': (
 * {[K in T1[number] as `${K}`]: true} & //@ts-ignore
 * {[id: String]: false})[`${T0}`]}} TG.IsGiving
 * @memberof TG
 * ts-ignore było potrzebne bo dawało error przy konwersji T0 na stringa (nie moze byc symbol)
 */

/**
 * Zwraca true/false w zaleności od tego czy wartość w T jest undefined
 * @template {*} T
 * @typedef {{'=>': (
 * {undefined: true} & //@ts-ignore
 * {[id: String]: false})[`${T}`]}} TG.IsGivingUndefined
 * @memberof TG
 * ts-ignore było potrzebne bo dawało error przy konwersji T na stringa (nie moze byc symbol)
 */

/**
 * Zamienia tablicę stringów w obiekt którego kluczami są wartości z tablicy
 * @template {Array<String>} T
 * @typedef {{'=>': {[K in T[number]]: *}}} TG.ArrayHitsDifferent
 * @memberof TG
 */

/**
 * Zamienia tablicę tablic (0 = klucz, 1 = wartość) w obiekt
 * @template {Array<[String, *]>} T
 * @typedef {{'=>': {[K in T[number] as K[0]]: K[1]}}} TG.ArrayLooksmax
 * @memberof TG
 */

/**
 * dosłownie robi to samo co Object.keys, zwraca tablicę z kluczami
 * @template {{[id: String]: *}} T
 * @typedef {{'=>': Array<T[keyof T]>}} TG.ObjectHitsDiffirent
 * @memberof TG
 */

/**
 * Potrzebne do typu vibesoff, sprawdza czy klucz istnieje w T1 ale nie istnieje w T0
 * @template {{[id: String]: *}} T0
 * @template {{[id: String]: *}} T1
 * @typedef {{'=>': {[K in keyof T0]: ({[key in keyof T1]: undefined} & {[id: String]: T0[K]})[K & String]}}} TG.BoolIntermediary
 * @memberof TG
 */

/**
 * Tworzy obiekt tylko z kluczami występującymi w T0 ale nie występującymi w T1
 * @template {{[id: String]: *}} T0
 * @template {{[id: String]: *}} T1
 * @typedef {{'=>': {[K in keyof TG.BoolIntermediary<T0, T1>['=>'] as TG.BoolIntermediary<T0, T1>['=>'][K] extends undefined ? never : K]: T0[K]}}} TG.VibesOff
 * @memberof TG
 */

/**
 * Zwraca obiekt z kluczami występującymi w T0 oraz dodaje do niego klucze występujące w T1 jako opcjonalne
 * @template {{[id: String]: *}} T0
 * @template {{[id: String]: *}} T1
 * @typedef {{'=>': TG.StealHisLook<{[key in keyof T0]: T0[key]} & TG.StealHisLookOptional<TG.VibesOff<T1, {[key in keyof T0]: *}>['=>']>['=>']>['=>']}} TG.SimpLowkey
 * @memberof TG
 */

/**
 * Dodaje do obiektu T0 klucze występujące w T1 (ale nie występujące w T0)
 * @template {{[id: String]: *}} T0
 * @template {{[id: String]: *}} T1
 * @typedef {{'=>': TG.StealHisLook<{[key in keyof T0]: T0[key]} & TG.StealHisLook<TG.VibesOff<T1, {[key in keyof T0]: *}>['=>']>['=>']>['=>']}} TG.Simp
 * @memberof TG
 */

/**
 * Łączy dwa obiekty, właściwości występujące w obu mogą być typu T0[key] albo T1[key]
 * @template {{[id: String]: *}} T0
 * @template {{[id: String]: *}} T1
 * @typedef {{'=>': TG.StealHisLook<({[key in (keyof T0) & (keyof T1)]: T0[key]|T1[key]} & TG.VibesOff<T0, T1>['=>'] & TG.VibesOff<T1, T0>['=>'])>['=>']}} TG.Situationship
 * @memberof TG
 */

/**
 * Usuwa z obiektu klucze podane w tablicy
 * @template {{[id: String]: *}} T0
 * @template {Array<String & keyof T0>} T1
 * @typedef {{'=>': TG.VibesOff<T0, TG.ArrayHitsDifferent<T1>['=>']>['=>']}} TG.FanumTax
 * @memberof TG
 */

/**
 * Zachowuje w obiekcie tylko klucze podane w tablicy
 * @template {{[id: String]: *}} T0
 * @template {Array<String & keyof T0>} T1
 * @typedef {{'=>': {[key in (keyof T0) & (keyof TG.ArrayHitsDifferent<T1>['=>'])]: T0[key]}}} TG.LockIn
 * @memberof TG
 */

/**
 * typ do funkcji TypeGoblin.massDefineProperty
 * @template PROPERTY_TYPE
 * @typedef {Object} TG.DefinePropertyConfig
 * @property {() => PROPERTY_TYPE} get
 * @property {(v?: PROPERTY_TYPE) => void} [set]
 * @memberof TG
 */

/**
 * Typy do configów podczas tworzenia obiektu poprzez TypeGoblin.createObject
 * @namespace TGObjectProperty
 */

/**
 * @typedef {Object} TGObjectProperty.String
 * @property {'string'} type
 * @property {String} [startValue]
 * @memberof TGObjectProperty
 */

/**
 * @typedef {Object} TGObjectProperty.Number
 * @property {'number'} type
 * @property {Number} [startValue]
 * @memberof TGObjectProperty
 */

/**
 * @typedef {Object} TGObjectProperty.Bool
 * @property {'bool'} type
 * @property {Boolean} [startValue]
 * @memberof TGObjectProperty
 */

/**
 * Tutaj jeszcze do poprawy bo nie ma odpowiedniego typechecka jak sie wybiera startValue mozna wpisac dowolny string
 * @template {Array<String>} T
 * @typedef {Object} TGObjectProperty.Switch
 * @property {'switch'} type
 * @property {T} options
 * @property {String & keyof TG.ArrayHitsDifferent<T>['=>']} [startValue]
 * @memberof TGObjectProperty
 */

/**
 * @template {TG.Yggdrasil} T
 * @typedef {Object} TGObjectProperty.Object
 * @property {'object'} type
 * @property {{[K in keyof T]: TGObjectProperty.Any<T[K]>}} props
 * @memberof TGObjectProperty
 */

/**
 * Tu do poprawy jeszcze miałem problem z startValue bo robiła się selfreferencja ale działało gdy się dało ts-ignore
 * @template {TG.Yggdrasil} T
 * @typedef {Object} TGObjectProperty.Array
 * @property {'array'} type
 * @property {TGObjectProperty.Any<T>} of
 * @memberof TGObjectProperty
 */

/**
 * @typedef {Object} TGObjectProperty.AnyType
 * @property {'any'|'*'} type
 * @memberof TGObjectProperty
 */

/**
 * @template {TG.Yggdrasil} T
 * @typedef {TGObjectProperty.String|TGObjectProperty.Number|TGObjectProperty.Bool|TGObjectProperty.Switch<Array<(keyof T) & String>>|TGObjectProperty.Object<T>|TGObjectProperty.Array<T>|TGObjectProperty.AnyType} TGObjectProperty.Any
 * @memberof TGObjectProperty
 */

/**
 * @template {TG.Yggdrasil} T
 * @typedef {TGObjectProperty.String|TGObjectProperty.Number|TGObjectProperty.Bool|TGObjectProperty.Switch<Array<(keyof T) & String>>|TGObjectProperty.Array<T>|TGObjectProperty.AnyType} TGObjectProperty.AnyNoObject
 * @memberof TGObjectProperty
 */

/**
 * Typ pośredniczący potrzebny do tworzenia tablic
 * @template {TG.SimpLowkey<TGObjectProperty.Any<TG.Yggdrasil>, TG_OBJECT_PROPERTY_ALL_EXTRA_KEYS>['=>']} T
 * @typedef {{'=>': Array<TG_CREATE_OBJECT_RETURNS<T['of']>['=>']>}} TG_CREATE_ARR_RETURNS
 */

/**
 * Typ pośredniczący potrzebny do tworzenia obiektów
 * @template {TG.SimpLowkey<TGObjectProperty.Any<TG.Yggdrasil>, TG_OBJECT_PROPERTY_ALL_EXTRA_KEYS>['=>']} T
 * @typedef {{'=>': {
 * string: String,
 * number: Number,
 * bool: Boolean,
 * switch: keyof TG.ArrayHitsDifferent<T['options']>['=>'],
 * object: {[K in keyof T['props']]: TG_CREATE_OBJECT_RETURNS<T['props'][K]>['=>']},
 * array: TG_CREATE_ARR_RETURNS<T>['=>'],
 * '*': *,
 * 'any': *
 * }[T['type']]}} TG_CREATE_OBJECT_RETURNS
 */

/**
 * Typ pośredniczący potrzebny do validacji obiektów
 * @template {TG.SimpLowkey<TGObjectProperty.Any<TG.Yggdrasil>|TGObjectProperty.AnyType, TG_OBJECT_PROPERTY_ALL_EXTRA_KEYS>['=>']} T
 * @typedef {{'=>': {
 * string: boolean,
 * number: boolean,
 * bool: boolean,
 * switch: boolean,
 * object: {[K in keyof T['props']]: TG_VALIDATE_OBJECT_RETURNS<T['props'][K]>['=>']},
 * array: boolean,
 * '*': true,
 * 'any': true
 * }[T['type']]}} TG_VALIDATE_OBJECT_RETURNS
 */
// <Array<(keyof T) & String>

/**
 * @template {TG.SimpLowkey<TGObjectProperty.Any<TG.Yggdrasil>, TG_OBJECT_PROPERTY_ALL_EXTRA_KEYS>['=>']} T
 * @typedef {{'=>': {type: 'array', of: TG_CREATE_MAP_RETURNS<T['of']>['=>']}}} TG_CREATE_MAP_ARR_RETURNS
 */

/**
 * @template {TG.SimpLowkey<TGObjectProperty.Any<TG.Yggdrasil>, TG_OBJECT_PROPERTY_ALL_EXTRA_KEYS>['=>']} T
 * @typedef {{'=>': {
 * string: TG.SimpLowkey<TGObjectProperty.String, TG_OBJECT_PROPERTY_ALL_EXTRA_KEYS_UNDEFINED>['=>'],
 * number: TG.SimpLowkey<TGObjectProperty.Number, TG_OBJECT_PROPERTY_ALL_EXTRA_KEYS_UNDEFINED>['=>'],
 * bool: TG.SimpLowkey<TGObjectProperty.Bool, TG_OBJECT_PROPERTY_ALL_EXTRA_KEYS_UNDEFINED>['=>'],
 * switch: TG.SimpLowkey<TGObjectProperty.Switch<T['options']>, TG_OBJECT_PROPERTY_ALL_EXTRA_KEYS_UNDEFINED>['=>'],
 * object: TG.SimpLowkey<{type: 'object', props: {[K in keyof T['props']]: TG_CREATE_MAP_RETURNS<T['props'][K]>['=>']}}, TG_OBJECT_PROPERTY_ALL_EXTRA_KEYS_UNDEFINED>['=>'],
 * array: TG.SimpLowkey<TG_CREATE_MAP_ARR_RETURNS<T>['=>'], TG_OBJECT_PROPERTY_ALL_EXTRA_KEYS_UNDEFINED>['=>'],
 * '*': *,
 * 'any': *
 * }[T['type']]}} TG_CREATE_MAP_RETURNS
 */

/**
 * Wsztstkie klucze które mogą występować w kazdym z configów, uzywane do typów pośredniczących, modyfikuje podane typy tak by nie zwracało errora (intelisense nie wie jaki typ podaje gdy jest to TGObjectProperty.Any więc musze dodać te klucze by nie zwracało błędu gdy odnoszę się do jakichś wartości nie występujacych w tym configu)
 * @typedef {Object} TG_OBJECT_PROPERTY_ALL_EXTRA_KEYS
 * @property {Array<String>} options
 * @property {{[id: String]: TGObjectProperty.Any<TG.Yggdrasil>}} props
 * @property {TGObjectProperty.Any<TG.Yggdrasil>} of
 * @property {*} startValue
 */

/**
 * Wsztstkie klucze które mogą występować w kazdym z configów, uzywane do typów pośredniczących, modyfikuje podane typy tak by nie zwracało errora (intelisense nie wie jaki typ podaje gdy jest to TGObjectProperty.Any więc musze dodać te klucze by nie zwracało błędu gdy odnoszę się do jakichś wartości nie występujacych w tym configu)
 * @typedef {Object} TG_OBJECT_PROPERTY_ALL_EXTRA_KEYS_UNDEFINED
 * @property {undefined} options
 * @property {undefined} props
 * @property {undefined} of
 * @property {undefined} startValue
 */

//start
class TypeGoblin {
    /**
     * Zawsze mnie denerwowało ze przy dodawaniu właściwości przez Object.defineProperty nie wchodzi intelisense, tutaj po prostu dodaje właściwości przez Object.defineProperty i zwraca obiekt z tymi propsami
     * @template {{[id: String]: *}} SAVED_TYPES
     * @template {Object} START_OBJECT
     * @param {{[K in keyof SAVED_TYPES]: TG.DefinePropertyConfig<SAVED_TYPES[K]>}} properties
     * @param {START_OBJECT} [obj = {}]
     * @returns {TG.StealHisLook<TG.VibesOff<START_OBJECT, {[K in keyof SAVED_TYPES]: SAVED_TYPES[K]}>['=>'] & {[K in keyof SAVED_TYPES]: SAVED_TYPES[K]}>['=>']}
     */ //@ts-ignore
    static massDefineProperty = (properties, obj = {}) => {
        Object.keys(properties).forEach((name) => {
            let savedName = `${name}`;
            if(Object.keys(obj).includes(savedName)) {
                delete obj[savedName];
            }
            if(properties[savedName].set) {
                Object.defineProperty(obj, `${savedName}`, {
                    get: () => {
                        return properties[`${savedName}`].get();
                    },
                    set: (v) => {
                        properties[`${savedName}`].set(v);
                    },
                    enumerable: true
                });
            } else {
                Object.defineProperty(obj, `${savedName}`, {
                    get: () => {
                        return properties[`${savedName}`].get();
                    },
                    set: () => { },
                    enumerable: true
                });
            }
        });
        //@ts-ignore
        return obj;
    }
    /**
     * Akurat to nie powinno się tu znaleźć, gdzieś potrzebowałem czegoś w stylu Promise.all(), tylko zeby promise wypełniały się po kolei, zwraca od razu poprawną tablicę z resultami
     * @template {{[id: String]: *}} T
     * @param {Array<Promise<T[keyof T]>>} promiseArr
     * @returns {Promise<Array<T[keyof T]>>}
     */
    static sequentialPromise = (promiseArr) => {
        return new Promise(async (res) => {
            let fulfilled = [];
            for(let prom of promiseArr) {
                let result = await prom;
                fulfilled.push(result);
            }
            res(fulfilled);
        });
    }

    /**
     * Tworzy obiekt z poprawną definicją według configów
     * do zrobienia jeszcze opcjonalne props (z tym było najwięcej problemów)
     * @template {TG.Yggdrasil} PROP_KEYS
     * @template {{[K in keyof PROP_KEYS]: TGObjectProperty.Any<PROP_KEYS[K]>}} PROPERTIES
     * @param {TG.ObjectMap<PROP_KEYS, PROPERTIES>} map
     * @returns {{[K in keyof PROPERTIES]: TG_CREATE_MAP_RETURNS<PROPERTIES[K]>['=>']}}
     */
    static createMap = (map) => {
        return map;
    }

    /**
     * Tworzy obiekt z poprawną definicją według configów
     * do zrobienia jeszcze opcjonalne props (z tym było najwięcej problemów)
     * @template {TG.Yggdrasil} PROP_KEYS
     * @template {{[K in keyof PROP_KEYS]: TGObjectProperty.Any<PROP_KEYS[K]>}} PROPERTIES
     * @param {TG.ObjectMap<PROP_KEYS, PROPERTIES>} map
     * @returns {{[K in keyof PROPERTIES]: TG_CREATE_OBJECT_RETURNS<PROPERTIES[K]>['=>']}}
     */
    static createObject = (map) => {
        /**
         * @param {TG.ObjectMap<PROP_KEYS, PROPERTIES>} _map 
         * @param {*} srcObj
         */
        const _createObject = (_map, srcObj = {}) => {
            /**
             * @param {TGObjectProperty.Any<*>} propConfig
             * @returns {*}
             */
            const getStartValue = (propConfig) => {
                switch(propConfig.type) {
                    case "string": {
                        if(typeof propConfig.startValue == 'string') {
                            return propConfig.startValue;
                        }
                        break;
                    }
                    case "number": {
                        if(typeof propConfig.startValue == 'number') {
                            return propConfig.startValue;
                        }
                        break;
                    }
                    case "bool": {
                        if(typeof propConfig.startValue == 'boolean') {
                            return propConfig.startValue;
                        }
                        break;
                    }
                    case "switch": {
                        if(typeof propConfig.startValue == 'string') {
                            return propConfig.startValue;
                        }
                        break;
                    }
                    case "array": {
                        return [];
                        break;
                    }
                }
                return undefined;
            }

            Object.keys(_map).forEach((key) => {
                switch(_map[key].type) {
                    case "object": {
                        srcObj[key] = {}; //@ts-ignore
                        _createObject(_map[key].props, srcObj[key]);
                        break;
                    }
                    default: {
                        srcObj[key] = getStartValue(_map[key]);
                        break;
                    }
                }
            });
        }

        let retObj = {};
        _createObject(map, retObj);
        //@ts-ignore
        return retObj;
    };

    /**
     * @template {TG.Yggdrasil} PROP_KEYS
     * @template {{[K in keyof PROP_KEYS]: TGObjectProperty.Any<PROP_KEYS[K]>|TGObjectProperty.AnyType}} PROPERTIES
     * @param {TG.ObjectMap<PROP_KEYS, PROPERTIES>} map
     * @param {*} obj
     * @param {{allowUndefined?: Boolean, omitExtraKeys?: Boolean}} [options]
     * @returns {{valid: Boolean, validityObject: {[K in keyof PROPERTIES]: TG_VALIDATE_OBJECT_RETURNS<PROPERTIES[K]>['=>']}, extraKeys: Array<String>}}
     */
    static validateObjectMap = (map, obj, options = {}) => {
        /**
         * @template {TG.Yggdrasil} _PROP_KEYS
         * @template {{[K in keyof _PROP_KEYS]: TGObjectProperty.Any<_PROP_KEYS[K]>|TGObjectProperty.AnyType}} _PROPERTIES
         * @param {TG.ObjectMap<_PROP_KEYS, _PROPERTIES>} mapLvl
         * @returns {{[K in keyof PROPERTIES]: TG_VALIDATE_OBJECT_RETURNS<PROPERTIES[K]>['=>']}}
         */
        const _createValidityObj = (mapLvl) => {
            /** @type {*} */
            let validityObj = {};
            Object.keys(mapLvl).forEach((key) => {
                switch(mapLvl[key].type) {
                    case "object": {
                        validityObj[key] = _createValidityObj(mapLvl[key].props);
                        break;
                    }
                    default: {
                        validityObj[key] = false;
                        break;
                    }
                }
            });
            return validityObj;
        }
        /**
         * @template {TG.Yggdrasil} _PROP_KEYS
         * @template {{[K in keyof _PROP_KEYS]: TGObjectProperty.Any<_PROP_KEYS[K]>|TGObjectProperty.AnyType}} _PROPERTIES
         * @param {TG.ObjectMap<_PROP_KEYS, _PROPERTIES>} mapLvl
         * @param {*} objLvl
         * @param {{[K in keyof _PROPERTIES]: TG_VALIDATE_OBJECT_RETURNS<_PROPERTIES[K]>['=>']}} validityObjLvl
         * @param {Array<String>} [extraKeys]
         * @param {String} [extraKeyPrefix]
         * @returns {{validity: {[K in keyof _PROPERTIES]: TG_VALIDATE_OBJECT_RETURNS<_PROPERTIES[K]>['=>']}, errored: Boolean, extraKeys: Array<String>}}
         */
        const _validate = (mapLvl, objLvl, validityObjLvl, extraKeys = [], extraKeyPrefix = '') => {
            let errored = false;
            /**
             * @param {TGObjectProperty.AnyNoObject<TG.Yggdrasil>} propertyConfig
             * @param {*} value
             * @param {String} key
             * @returns {Boolean}
             */
            const checkType = (propertyConfig, value, key) => {
                switch(propertyConfig.type) {
                    case "string": {
                        if(((typeof value == 'string' || typeof value == 'undefined') && (options.allowUndefined !== false)) || ((typeof value == 'string') && (options.allowUndefined === false))) {
                            return true;
                        }
                        break;
                    }
                    case "number": {
                        if(((typeof value == 'number' || typeof value == 'undefined') && (options.allowUndefined !== false)) || ((typeof value == 'number') && (options.allowUndefined === false))) {
                            return true;
                        }
                        break;
                    }
                    case "bool": {
                        if(((typeof value == 'boolean' || typeof value == 'undefined') && (options.allowUndefined !== false)) || ((typeof value == 'boolean') && (options.allowUndefined === false))) {
                            return true;
                        }
                        break;
                    }
                    case "switch": {
                        if(typeof value == 'string') {
                            if(propertyConfig.options.includes(value)) {
                                return true;
                            }
                        } else if(typeof value == 'undefined' && options.allowUndefined !== false) {
                            return true;
                        }
                        break;
                    }
                    case "array": {
                        if(typeof value == 'undefined' && options.allowUndefined !== false) {
                            return true;
                        } else if(Array.isArray(value)) {
                            switch(propertyConfig.of.type) {
                                case 'object': {
                                    let _validityObj = _createValidityObj({ 'arr': propertyConfig.of });
                                    for(let _value of value) {
                                        if(typeof _value == 'object') { //@ts-ignore
                                            let valid = _validate({ 'arr': propertyConfig.of }, _value, _validityObj);
                                            if(!valid.errored) {
                                                return false;
                                                break;
                                            }
                                        } else {
                                            return false;
                                            break;
                                        }
                                    }
                                    return true;
                                    break;
                                }
                                case 'any':
                                case '*': {
                                    return true;
                                    break;
                                }
                                default: {
                                    for(let _value of value) {
                                        if(!checkType(propertyConfig.of, _value, key)) {
                                            return false;
                                            break;
                                        }
                                    }
                                    return true;
                                    break;
                                }
                            }
                        }
                        break;
                    }
                    case '*':
                    case 'any': {
                        if(options.allowUndefined === false) {
                            if(typeof value == 'undefined') {
                                return false;
                            }
                        }
                        return true;
                        break;
                    }
                }
                return false;
            }

            Object.keys(mapLvl).forEach((key) => {
                if(Object.keys(objLvl).includes(key)) {
                    if(mapLvl[key].type == 'object') { //@ts-ignore
                        let isValid = _validate(mapLvl[key].props, objLvl[key], validityObjLvl[key], extraKeys, `${extraKeyPrefix}${key}.`);
                        if(isValid.errored) {
                            errored = true;
                        }
                    } else {
                        if(checkType(mapLvl[key], objLvl[key], key)) { //@ts-ignore
                            validityObjLvl[key] = true;
                        } else {
                            errored = true;
                        }
                    }
                } else {
                    errored = true;
                }
            });

            if(typeof objLvl == 'object' && options.omitExtraKeys) {
                Object.keys(objLvl).forEach((key) => {
                    if(!Object.keys(mapLvl).includes(key) && !extraKeys.includes(`${extraKeyPrefix}${key}`)) {
                        extraKeys.push(`${extraKeyPrefix}${key}`);
                    }
                });
            }

            return { validity: validityObjLvl, errored: errored, extraKeys: extraKeys };
        }

        let validated = _validate(map, obj, _createValidityObj(map));
        return {
            valid: !validated.errored,
            validityObject: validated.validity,
            extraKeys: validated.extraKeys
        };
    }

    /**
     * @template T
     * @param {T} obj 
     * @returns {Array<keyof T>}
     */
    static mappedObjectKeys = (obj) => { //@ts-ignore
        return Object.keys(obj);
    }

    constructor() {

    }
}
//end

/**
 * @template {TG.Yggdrasil} PROP_KEYS
 * @template {{[K in keyof PROP_KEYS]: TGObjectProperty.Any<PROP_KEYS[K]>}} PROPERTIES
 * @typedef {PROPERTIES & {[id: String]: TGObjectProperty.Any<TG.Yggdrasil>}} TG.ObjectMap
 * @memberof TG
 */


// to jest potrzebne by dało się wyeksportować namespace bez pliku d.ts, działa ale na razie niestety trzeba dodać ts-ignore do importu
const TG = {
};

// to jest potrzebne by dało się wyeksportować namespace bez pliku d.ts, działa ale na razie niestety trzeba dodać ts-ignore do importu
const TGObjectProperty = {
}

const src0 = {
    'a': 'undefined',
    'b': '',
    'c': '',
    'd': '',
    'e': ''
}

const src1 = {
    'a': '',
    'b': '',
}

//tylko współdzielone klucze
/** @type {TG.VibesOn<typeof src0, typeof src1>['=>']} */
const test0 = {
    a: '',
    b: ''
};

//tylko niewspółdzielone klucze
/** @type {TG.VibesOff<typeof src0, typeof src1>['=>']} */
const test1 = {
    c: '',
    d: '',
    e: '',
};

//usuwa klucze podane w tablicy
/** @type {TG.FanumTax<typeof src0, ['a', 'b']>['=>']} */
const test2 = {
    c: '',
    d: '',
    e: '',
};

const test3Map = TypeGoblin.createMap({
    aaa: { type: 'number' },
    bbb: { type: 'string' },
    ccc: { type: 'switch', options: ['option0', 'option1'] },
    ddd: {
        type: 'array',
        of: { type: 'string' },
    },
    eee: {
        type: 'array',
        of: {
            type: 'array',
            of: {
                type: 'object',
                props: {
                    fff: { type: 'number' },
                    ggg: {
                        type: 'object',
                        props: {
                            hhh: { type: 'string' },
                            iii: { type: 'array', of: { type: 'bool' } }
                        }
                    }
                }
            }
        }
    },
    jjj: {
        type: 'object',
        props: {
            kkk: { type: 'number' },
            lll: { type: 'string' }
        }
    }
});

//obiekt ma od razu poprawny typ, coś w stylu z.create z zoda, mozna w nieskonczonosc zapentlac obiekt w obiekcie w tablicy itd
const test3 = TypeGoblin.createObject(test3Map);

const test4 = TypeGoblin.validateObjectMap(test3Map, {});

/** @type {TG.ArrayLooksmax<[['aaa', 'sd'], ['bbb', 'sdfsf']]>['=>']} */
let test5;

export { TypeGoblin, TG, TGObjectProperty };