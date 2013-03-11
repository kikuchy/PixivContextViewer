pcv = pcv || {};
pcv.contextViewer = pcv.contextViewer || {};
pcv.contextViewer.localTabContextStorage = pcv.contextViewer.LocalStorageHelper("pcv-tab-context-");
pcv.contextViewer.localContextHistoryStorage = pcv.contextViewer.LocalStorageHelper("pcv-context-history-");
pcv.contextViewer.localSettingsStorage = pcv.contextViewer.LocalStorageHelper("pcv-settings-");
new pcv.contextViewer.BackController();
