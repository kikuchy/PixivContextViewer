LESS_FILES= css/cv.less
CSS_FILES= $(LESS_FILES:.less=.css)
LESSC= lessc
MANIFEST_SRC= ext_manifest.rb
MANIFEST_DIST= manifest.json
TEMPLATE_SRC= template/viewer.html.mustache template/page.html.mustache 
TEMPLATE_DIST= $(TEMPLATE_SRC:.mastache=.js)

manifest: $(MANIFEST_DIST)

$(MANIFEST_DIST): $(MANIFEST_SRC)
	ruby misc/generator.rb $(MANIFEST_SRC)

less: $(CSS_FILES)

%.css: %.less
	$(LESSC) $< > $@

template: $(TEMPLATE_DIST)

%.js: %.mastache 
	ruby misc/template_to_js.rb $< $@
