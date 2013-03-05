LESS_FILES= css/cv.less
CSS_FILES= $(LESS_FILES:.less=.css)
LESSC= lessc

less: $(CSS_FILES)

%.css: %.less
	$(LESSC) $< > $@
