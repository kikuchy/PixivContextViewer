pcv = pcv || {};
pcv.contextViewer = pcv.contextViewer || {};
pcv.contextViewer.localContextStorage = pcv.contextViewer.LocalStorageHelper("pcv-tab-context-history-");
pcv.contextViewer.localSettingsStorage = pcv.contextViewer.LocalStorageHelper("pcv-settings-");
new pcv.contextViewer.BackController();
