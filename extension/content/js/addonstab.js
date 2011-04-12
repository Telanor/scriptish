(function($, tools) {
var Cu = Components.utils;
Cu.import("resource://scriptish/constants.js", tools);
Cu.import("resource://scriptish/prefmanager.js");
Cu.import("resource://scriptish/logging.js");
Cu.import("resource://scriptish/scriptish.js");
Cu.import("resource://scriptish/utils/Scriptish_stringBundle.js");
Cu.import("resource://scriptish/utils/Scriptish_ExtendedStringBundle.js");
Cu.import("resource://scriptish/utils/Scriptish_openInEditor.js");
Cu.import("resource://scriptish/third-party/Scriptish_openFolder.js");

var Scriptish_bundle = new Scriptish_ExtendedStringBundle(gStrings.ext);
Scriptish_bundle.strings["header-userscript"] = Scriptish_stringBundle("userscripts");
gStrings.ext = Scriptish_bundle;

let NetUtil = tools.NetUtil;
let Services = tools.Services;

window.addEventListener("load", function() {
  function addonIsInstalledScript(aAddon) {
    if (!aAddon || "userscript" != aAddon.type || aAddon.needsUninstall)
      return false;
    return true;
  }

  gViewController.commands.cmd_scriptish_userscript_edit = {
    isEnabled: addonIsInstalledScript,
    doCommand: function(aAddon) { Scriptish_openInEditor(aAddon, window); }
  };
  gViewController.commands.cmd_scriptish_userscript_show = {
    isEnabled: addonIsInstalledScript,
    doCommand: function(aAddon) Scriptish_openFolder(aAddon._file)
  };
  gViewController.commands.cmd_scriptish_userscript_dl_link = {
    isEnabled: function(aAddon) {
      if (!(addonIsInstalledScript(aAddon)
              && Scriptish_prefRoot.getValue("enableCopyDownloadURL")
              && aAddon.urlToDownload))
        return false;
      try {NetUtil.newURI(aAddon.urlToDownload)} catch (e) {return false;}
      return true;
    },
    doCommand: function(aAddon) Services.cb.copyString(aAddon.urlToDownload)
  };

  function hideUSMenuitem(aEvt) {
    aEvt.target.setAttribute("disabled",
        !("addons://list/userscript" == gViewController.currentViewId));
  }

  (function() {
    let items = {'edit': 'edit',
                 'show': 'openFolder',
                 'dl_link': 'copyDownloadURL'};
    for (let key in items) {
      let string = items[key];
      $("br_scriptish_userscript_" + key).setAttribute("label", Scriptish_stringBundle(string));
      let cmd = $("cmd_scriptish_userscript_" + key);
      cmd.setAttribute("accesskey", Scriptish_stringBundle(string + ".ak"));
      cmd.addEventListener("popupshowing", hideUSMenuitem, false);
    }
  })();

  $("category-userscripts").setAttribute(
      "name", Scriptish_stringBundle("userscripts"));

  $("scriptish-get-scripts-btn").addEventListener("command", function() {
    var gBrowser = Services.wm.getMostRecentWindow("navigator:browser").gBrowser;
    gBrowser.selectedTab = gBrowser.addTab("http://userscripts.org");
  }, false)

  function onViewChanged() {
    let de = document.documentElement;
    if ("addons://list/userscript" == gViewController.currentViewId) {
      de.className += ' scriptish';
      $("scriptish-list-empty").collapsed = !!Scriptish.config.scripts.length;
    } else {
      de.className = de.className.replace(/ scriptish/g, '');
      $("scriptish-list-empty").collapsed = true;
    }
  }
  window.addEventListener('ViewChanged', onViewChanged, false);
  onViewChanged(); // initialize on load as well as when it changes later
}, false);

window.addEventListener(
    "unload", Scriptish.config.uninstallScripts.bind(Scriptish.config), false);

})(function(aID) document.getElementById(aID), {});
