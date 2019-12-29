dist/: ifyouplay.css ifyouplay.js index.html
	rm -rf dist/
	mkdir -p dist/
	cp *.css dist/
	cp *.js dist/
	cp index.html dist/

publish: dist/
	cd dist/ && aws s3 sync . s3://naitian.holiday/iysp/ --delete
