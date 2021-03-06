var EXPORTED_SYMBOLS = ["Scriptish_configDownloader"];
Components.utils.import("resource://scriptish/constants.js");
lazyImport(this, "resource://scriptish/script/scriptdownloader.js", ["ScriptDownloader"]);

var Scriptish_configDownloader = {
  startInstall: function(aURI, aPrivate) {
    new ScriptDownloader(aURI, aPrivate).startInstall();
  },
  startViewScript: function(aURI) {
    new ScriptDownloader(aURI).startViewScript();
  },
  startUpdateScript: function(aURL, aScriptInstaller)
    new ScriptDownloader(NetUtil.newURI(aURL)).startUpdateScript(aScriptInstaller),
  refetchDependencies: function(aScript) {
    var sd = new ScriptDownloader();
    sd.script = aScript;
    sd.updateScript = true;
    sd.fetchDependencies();
  }
}
