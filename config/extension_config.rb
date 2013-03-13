require "find"

CMN_JS = ["createnamespace.js", "StorageHelper.js", "jquery.min.js", "ContextBase.js", "RankingContext.js", "SearchContext.js", "ContextBuilder.js"].map{|x| "common/" + x}
FNT_JS = ["handlebars.js", "viewer.template.js", "page.template.js", "LoadingPanel.js", "View.js", "FrontController.js", "main_front.js"].map{|x| "front/" + x}
BCK_JS = ["BackController.js", "main_back.js"].map{|x| "back/" + x}

Manifest.set{|mf|
  mf.name "pixiv Context Viewer"
  mf.description "pixivのイラストを便利に見られたりするかも"
  mf.version "0.0.4"
  mf.manifest_version 2
  mf.background {|ep|
    ep.persistent true
    #ep.scripts ["jquery.min.js", "handlebars.js", "LocalStorageHelper.js", "PageCollection.js", "RankingContext.js", "SearchContext.js", "PixivContextViewerController.js", "main_back.js"].map!{|x|
    #  "lib/" + x
    #}
    js = (CMN_JS + BCK_JS).map!{|x|
	"lib/" + x
    }
    ep.scripts js
  }
  mf.content_scripts {|cs|
    cs.matches ["http://www.pixiv.net/*"]
    cs.css ["css/cv.css"]
    #cs.js ["jquery.min.js", "handlebars.js", "viewer.template.js", "page.template.js", "PixivContextViewerView.js", "main_front.js"].map!{|x|
    #  "lib/" + x
    #}
    js = (CMN_JS + FNT_JS).map!{|x|
	"lib/" + x
    }
    cs.js js
    cs.run_at ManifestContentScripts::DOCUMENT_END
  }
  mf.permissions ["http://*.pixiv.net/"]
}
