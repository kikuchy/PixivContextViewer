Manifest.set{|mf|
  mf.name "pixiv Context Viewer"
  mf.description "pixivのイラストを便利に見られたりするかも"
  mf.version "0.0.2"
  mf.manifest_version 2
  mf.background {|ep|
    ep.persistent true
    ep.scripts ["jquery.min.js", "handlebars.js", "PageCollection.js", "RankingContext.js", "SearchContext.js", "PixivContextViewerController.js", "main_back.js"].map!{|x|
      "lib/" + x
    }
  }
  mf.content_scripts {|cs|
    cs.matches ["http://www.pixiv.net/*"]
    cs.css ["css/cv.css"]
    cs.js ["jquery.min.js", "handlebars.js", "viewer.template.js", "page.template.js", "PixivContextViewerView.js", "main_front.js"].map!{|x|
      "lib/" + x
    }
    cs.run_at ManifestContentScripts::DOCUMENT_END
  }
  mf.permissions ["http://*.pixiv.net/"]
}
