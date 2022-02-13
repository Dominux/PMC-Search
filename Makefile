deploy:
	git checkout -b gh-pages &&\
	npm ci &&\
	npm run build &&\
	mv public/* ./ &&\
	rm -f .editorconfig .gitattributes .prettierrc \
		package-lock.json package.json README.md Makefile\
		rollup.config.js tsconfig.json &&\
	rm -rf src public node_modules &&\
	sed -i "s/href='\//href='/g" ./index.html &&\
	sed -i "s/src='\//src='/g" ./index.html &&\
	git add -A &&\
	git commit -m "deploy" &&\
	git push -u origin gh-pages -f &&\
	git checkout main
