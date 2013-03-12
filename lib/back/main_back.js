pcv = pcv || {};
pcv.contextViewer = pcv.contextViewer || {};
pcv.contextViewer.localTabContextStorage = pcv.contextViewer.StorageHelper(localStorage, "pcv-tab-context-");
pcv.contextViewer.localContextHistoryStorage = pcv.contextViewer.StorageHelper(localStorage, "pcv-context-history-");
pcv.contextViewer.localSettingsStorage = pcv.contextViewer.StorageHelper(localStorage, "pcv-settings-");
new pcv.contextViewer.BackController();
