/**
 * @file settingsLoader.js
 * @author Caio Carvalho <caaiosin@gmail.com>
 * @desc Settings Loader of API, responsible for loading settings file
 * @module be-api/settings/settingsLoader
 */

/**
 * @desc Settings Loader Exports
 */
module.exports = loadSettings();

/**
 * @function module:be-api/settings/settingsLoader.loadSettings
 * @description {Load settings function}
 */
function loadSettings()
{
    let settings = null;
    let fileName = process.env.FILE_NAME || null;
    let port = process.env.PORT || null;

    try {
        if (fileName != null)
        {
            if (!endsWith(fileName.toLowerCase(), ".json"))
            {
                fileName = fileName + ".json";
            }
            try
            {
                settings = require("./" + fileName);
            }
            catch (e)
            {
                console.log(e.stack);
                console.log("[be-api] Erro ao carregar arquivo de configurações " + fileName);
            }
        }
    
        if (settings == null)
        {
            console.log("[be-api] Arquivo de configuração inválido");
            return;
        }
        if (port)
        {
            settings.port = parseInt(port);
        }
    
        return settings;
    } catch (error) {
        return error;
    }

}

/**
 * @function module:be-api/settings/settingsLoader.endsWith
 * @description {Ends With function}
 * @param  {string} subjectString   {subject string}
 * @param  {string} searchString    {search string}
 */
function endsWith(subjectString, searchString)
{
    let position = subjectString.length - searchString.length;
    let lastIndex = subjectString.indexOf(searchString, position);
    return lastIndex !== -1 && lastIndex === position;
}