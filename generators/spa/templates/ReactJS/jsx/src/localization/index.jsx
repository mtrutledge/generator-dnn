import util from "utils";

const Localization = {
    get(key) {
        let moduleName = "<%= moduleName %>";
        return util.getResx(moduleName, key);
    }
};
export default Localization;