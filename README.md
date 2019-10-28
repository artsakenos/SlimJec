
SlimJEC, a Slim Javascript Elasticsearch Client
===============================================
Pure Javascript Client for really basic access to ES instances.
No fancy framework, No Node.js, No Python. Just your browser.

SlimJec includes
* A Javascript (SlimJEC.js, optionally SlimJEC_Config.js to set up the credentials): the code to make the client work
* An HTML page (SlimJEC.html, SlimJEC.css): A static HTML wrapper for the client

It lets you
* perform a fulltext search in match mode or fuzzy mode.
* perform a match key:value search on the field you want.
* post documents to your index

You can make a *static page become a blog*, combining SlimJEC with a ElasticSearch instance.
See for example https://artsakenos.github.io/SlimJEC/SlimJEC.html


SHORTCOMINGS
============
Right now you can use only elasticsearch with credentials, per non incorrere in CORS

You can not call http elasticsearch instances from https servers, not to incorrere in ...

So you just use https stuff.

ISSUES
======
* This was a quick experiment, I didn't perform any extensive tests, feel free to open issues or pull requests.
* Trailing / should be automatically removed
* If you want to perform Cross-origin resource sharing you have to set up your browser
* Same if you want to be served by an http ES instance on a HTTP website

