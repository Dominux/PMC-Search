deploy:
	-git branch -D gh-pages &&\
	git checkout -b gh-pages &&\
	npm i &&\
	npm run build &&\
	mv public/* ./ &&\
	rm -Rf .editorconfig .gitattributes .prettierrc \
		package-lock.json package.json README.md Makefile\
		rollup.config.js tsconfig.json src public node_modules\
	sed -i "s/href='\//href='/g" index.html &&\
	sed -i "s/src='\//src='/g" index.html &&\
	git add -A &&\
	git commit -m "deploy" &&\
	git push -u origin gh-pages -f
